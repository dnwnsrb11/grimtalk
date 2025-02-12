import '@/styles/live.css';

import { Excalidraw } from '@excalidraw/excalidraw';
import { LiveKitRoom } from '@livekit/components-react';
import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { liveApi } from '@/api/live';
import { AudioComponent } from '@/components/live/AudioComponent';
import { CustomChat } from '@/components/live/CustomChat';
import { VideoComponent } from '@/components/live/VideoComponent';
import { LiveKitService } from '@/services/liveKitService';
import { StompService } from '@/services/stompService';
import { useAuthStore } from '@/store/useAuthStore';
import { useLiveStore } from '@/store/useLiveStore';
import { participantUtils, TOKEN_TYPES } from '@/utils/participantUtils';

const LIVEKIT_URL = 'wss://www.grimtalk.com:7443/';
const STOMP_URL = 'wss://www.grimtalk.com:28080/ws';

export const LivePage = () => {
  const navigate = useNavigate();
  const { curriculumSubject } = useParams();
  const liveStore = useLiveStore();
  const { nickname } = useAuthStore((state) => state.userData);

  // 서비스 초기화
  const [stompService] = useState(() => new StompService(STOMP_URL));
  const [liveKitService] = useState(() => new LiveKitService(LIVEKIT_URL));

  // 상태 관리
  const [room, setRoom] = useState(null);
  const [localTrack, setLocalTrack] = useState(null);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [chatToken, setChatToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Excalidraw 관련 상태
  const [roomCreatorElements, setRoomCreatorElements] = useState([]);
  const [participantElements, setParticipantElements] = useState([]);
  const roomCreatorAPIRef = useRef(null);
  const participantAPIRef = useRef(null);
  const updateTimeoutRef = useRef(null);

  // LiveKit 이벤트 리스너 설정
  useEffect(() => {
    if (liveKitService) {
      liveKitService.setupEventListeners({
        onTrackSubscribed: (track, publication, participant) => {
          setRemoteTracks((prev) => [
            ...prev,
            {
              trackPublication: publication,
              participantIdentity: participant.identity,
            },
          ]);
        },
        onTrackUnsubscribed: (_, publication) => {
          setRemoteTracks((prev) =>
            prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid),
          );
        },
      });
    }
  }, [liveKitService]);

  // STOMP 메시지 처리 함수
  const handleStompMessage = useCallback((message) => {
    try {
      const receivedData = JSON.parse(message.body);
      const excalidrawData = receivedData.message || receivedData;

      if (excalidrawData.type === 'excalidraw' && excalidrawData.boardType === 'roomCreator') {
        // 삭제된 요소 제외하고 현재 유효한 요소만 필터링
        const activeElements = excalidrawData.elements.filter((el) => !el.isDeleted);

        setRoomCreatorElements(activeElements);

        if (roomCreatorAPIRef.current) {
          roomCreatorAPIRef.current.updateScene({
            elements: activeElements,
            appState: {
              viewBackgroundColor: '#ffffff',
              currentItemStrokeColor: '#000000',
              currentItemBackgroundColor: '#ffffff',
              viewModeEnabled: true,
              theme: 'light',
            },
          });
        }
      }
    } catch (error) {
      console.error('Error handling STOMP message:', error);
    }
  }, []);

  // STOMP 연결 및 구독 설정
  useEffect(() => {
    if (stompService && curriculumSubject) {
      stompService.client = new Client({
        brokerURL: STOMP_URL,
        reconnectDelay: 5000,
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
      });

      stompService.client.onConnect = (frame) => {
        console.log('Connected:', frame);
        setIsConnected(true);

        if (!participantUtils.isCreator(nickname)) {
          stompService.client.subscribe(`/pub/receive/${curriculumSubject}`, handleStompMessage);
        }
      };

      stompService.client.onWebSocketError = (error) => {
        console.error('Error with WebSocket:', error);
        setIsConnected(false);
      };

      stompService.client.onStompError = (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
        setIsConnected(false);
      };

      stompService.client.activate();

      return () => {
        if (stompService.client.active) {
          stompService.client.deactivate();
          setIsConnected(false);
        }
      };
    }
  }, [stompService, curriculumSubject, nickname, handleStompMessage]);

  // 화이트보드 업데이트 함수 (방장용)
  const updateBoard = useCallback(
    (elements, appState, boardType) => {
      if (stompService?.client?.active && isConnected && participantUtils.isCreator(nickname)) {
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(() => {
          // 삭제된 요소를 제외한 실제 활성 요소만 전송
          const activeElements = elements.filter((el) => !el.isDeleted);

          const message = {
            type: 'excalidraw',
            boardType,
            elements: activeElements,
            appState: {
              ...appState,
              viewBackgroundColor: '#ffffff',
              currentItemStrokeColor: '#000000',
              currentItemBackgroundColor: '#ffffff',
            },
            sender: nickname,
            timestamp: Date.now(),
          };

          stompService.client.publish({
            destination: `/sub/send/${curriculumSubject}`,
            body: JSON.stringify(message),
          });
        }, 5);
      }
    },
    [stompService, isConnected, curriculumSubject, nickname],
  );

  // 토큰 발급 함수
  const getTokens = async (isCreator = false) => {
    const tokenFunction = isCreator ? liveApi.getInstructorToken : liveApi.getStudentToken;

    const [rtcToken, chatToken] = await Promise.all([
      tokenFunction(
        curriculumSubject,
        participantUtils.getTokenParticipantName(nickname, TOKEN_TYPES.RTC),
      ),
      tokenFunction(
        curriculumSubject,
        participantUtils.getTokenParticipantName(nickname, TOKEN_TYPES.CHAT),
      ),
    ]);

    if (!rtcToken || !chatToken) {
      throw new Error('토큰 발급에 실패했습니다.');
    }

    return { rtcToken, chatToken };
  };

  // 방 연결 함수
  const connectToRoom = async () => {
    try {
      const isCreator = participantUtils.isCreator(nickname);
      const { rtcToken, chatToken } = await getTokens(isCreator);

      liveStore.setTokens(rtcToken, chatToken);
      setChatToken(chatToken);

      const newRoom = await liveKitService.connect(rtcToken);
      setRoom(newRoom);
      liveStore.setRoom(newRoom);

      if (isCreator) {
        const track = await liveKitService.enableMedia();
        setLocalTrack(track);
        liveStore.setLocalTrack(track);
      }
    } catch (error) {
      console.error('방 연결 중 오류 발생:', error);
      alert('방 연결에 실패했습니다.');
      navigate('/create-live-test');
    }
  };

  // 컴포넌트 마운트 시 방 연결
  useEffect(() => {
    connectToRoom();

    return () => {
      if (room) {
        room.disconnect();
        stompService.disconnect();
        setIsConnected(false);
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [curriculumSubject]);

  // 방 나가기 함수
  const leaveRoom = async () => {
    room?.disconnect();
    localStorage.removeItem('roomCreator');
    liveStore.reset();
    navigate('/create-live-test');
  };

  return (
    <div id="room">
      <div id="room-header">
        <h2 id="room-title">{curriculumSubject}</h2>
        {participantUtils.isCreator(nickname) && (
          <button className="btn btn-large btn-danger" onClick={leaveRoom}>
            Leave Room
          </button>
        )}
      </div>

      <div id="layout-container">
        {participantUtils.isCreator(nickname) && localTrack && (
          <VideoComponent track={localTrack} participantIdentity={nickname} local={true} />
        )}
        {!participantUtils.isCreator(nickname) && remoteTracks.length > 0 && (
          <div>
            {remoteTracks
              .filter(
                (track) =>
                  track.participantIdentity ===
                  participantUtils.getTokenParticipantName(liveStore.roomCreator, TOKEN_TYPES.RTC),
              )
              .map((remoteTrack) =>
                remoteTrack.trackPublication.kind === 'video' ? (
                  <VideoComponent
                    key={remoteTrack.trackPublication.trackSid}
                    track={remoteTrack.trackPublication.videoTrack}
                    participantIdentity={participantUtils.removeTokenPrefix(
                      remoteTrack.participantIdentity,
                    )}
                  />
                ) : (
                  <AudioComponent
                    key={remoteTrack.trackPublication.trackSid}
                    track={remoteTrack.trackPublication.audioTrack}
                  />
                ),
              )}
          </div>
        )}
      </div>

      <LiveKitRoom serverUrl={LIVEKIT_URL} token={chatToken} connect={true}>
        <CustomChat />
      </LiveKitRoom>

      {participantUtils.isCreator(nickname) ? (
        <div className="excalidraw-wrapper">
          <h3>내 화이트보드</h3>
          <Excalidraw
            onChange={(elements, appState) => {
              setRoomCreatorElements(elements);
              updateBoard(elements, appState, 'roomCreator');
            }}
            excalidrawAPI={(api) => {
              roomCreatorAPIRef.current = api;
            }}
            viewModeEnabled={false}
            initialData={{
              elements: roomCreatorElements,
              appState: {
                viewBackgroundColor: '#ffffff',
                currentItemStrokeColor: '#000000',
                currentItemBackgroundColor: '#ffffff',
              },
            }}
          />
        </div>
      ) : (
        <div className="whiteboard-container" style={{ display: 'flex', gap: '20px' }}>
          <div className="excalidraw-wrapper" style={{ flex: 1 }}>
            <h3>방장 화이트보드</h3>
            <Excalidraw
              excalidrawAPI={(api) => {
                roomCreatorAPIRef.current = api;
              }}
              elements={roomCreatorElements}
              viewModeEnabled={true}
              initialData={{
                elements: roomCreatorElements,
                appState: {
                  viewBackgroundColor: '#ffffff',
                  currentItemStrokeColor: '#000000',
                  currentItemBackgroundColor: '#ffffff',
                  viewModeEnabled: true,
                  theme: 'light',
                },
              }}
            />
          </div>
          <div className="excalidraw-wrapper" style={{ flex: 1 }}>
            <h3>내 화이트보드</h3>
            <Excalidraw
              onChange={(elements) => {
                setParticipantElements(elements);
              }}
              excalidrawAPI={(api) => {
                participantAPIRef.current = api;
              }}
              elements={participantElements}
              viewModeEnabled={false}
              initialData={{
                elements: participantElements,
                appState: {
                  viewBackgroundColor: '#ffffff',
                  currentItemStrokeColor: '#000000',
                  currentItemBackgroundColor: '#ffffff',
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
