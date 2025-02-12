import '@/styles/live.css';

import { Excalidraw } from '@excalidraw/excalidraw';
import { LiveKitRoom } from '@livekit/components-react';
import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [roomCreatorExcalidrawAPI, setRoomCreatorExcalidrawAPI] = useState(null);
  const [participantExcalidrawAPI, setParticipantExcalidrawAPI] = useState(null);

  const [receivedElements, setReceivedElements] = useState([]);
  const latestElementsRef = useRef([]);

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

  // STOMP 연결 및 구독 설정
  useEffect(() => {
    if (stompService && curriculumSubject) {
      // STOMP 클라이언트 설정
      stompService.client = new Client({
        brokerURL: STOMP_URL,
        reconnectDelay: 5000,
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
      });

      // STOMP 연결 성공 시 콜백
      stompService.client.onConnect = (frame) => {
        console.log('Connected:', frame);
        setIsConnected(true);

        // 학생인 경우에만 구독 설정
        if (!participantUtils.isCreator(nickname)) {
          stompService.client.subscribe(`/pub/receive/${curriculumSubject}`, (message) => {
            console.log('Received message:', message);
            try {
              const receivedData = JSON.parse(message.body);
              console.log('Parsed data:', receivedData);

              const excalidrawData = receivedData.message || receivedData;

              if (
                excalidrawData.type === 'excalidraw' &&
                excalidrawData.boardType === 'roomCreator'
              ) {
                console.log('Setting room creator elements:', excalidrawData.elements);

                // 상태와 참조 모두 업데이트
                setRoomCreatorElements(excalidrawData.elements);
                latestElementsRef.current = excalidrawData.elements;

                // 즉시 업데이트를 위한 수신 요소 설정
                setReceivedElements(excalidrawData.elements);
              }
            } catch (error) {
              console.error('Error parsing received message:', error);
            }
          });
          console.log(`Subscribed to /pub/receive/${curriculumSubject}`);
        }
      };

      // WebSocket 오류 처리
      stompService.client.onWebSocketError = (error) => {
        console.error('Error with WebSocket:', error);
        setIsConnected(false);
      };

      // STOMP 프로토콜 오류 처리
      stompService.client.onStompError = (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
        setIsConnected(false);
      };

      // STOMP 연결 시작
      stompService.client.activate();

      // 컴포넌트 언마운트 시 연결 해제
      return () => {
        if (stompService.client.active) {
          stompService.client.deactivate();
          setIsConnected(false);
        }
      };
    }
  }, [stompService, curriculumSubject, nickname]);

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
      // 토큰 발급
      const isCreator = participantUtils.isCreator(nickname);
      const { rtcToken, chatToken } = await getTokens(isCreator);

      liveStore.setTokens(rtcToken, chatToken);
      setChatToken(chatToken);

      // LiveKit 방 연결
      const newRoom = await liveKitService.connect(rtcToken);
      setRoom(newRoom);
      liveStore.setRoom(newRoom);

      // 방장일 경우 미디어 활성화
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

  // Excalidraw 씬 업데이트를 처리하는 useEffect 추가
  useEffect(() => {
    if (roomCreatorExcalidrawAPI && receivedElements.length > 0) {
      roomCreatorExcalidrawAPI.updateScene({
        elements: receivedElements,
        appState: { viewBackgroundColor: 'transparent' }
      });
    }
  }, [receivedElements, roomCreatorExcalidrawAPI]);

  // 컴포넌트 마운트 시 방 연결
  useEffect(() => {
    connectToRoom();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (room) {
        room.disconnect();
        stompService.disconnect();
        setIsConnected(false);
      }
    };
  }, [curriculumSubject]);

  // 화이트보드 업데이트 함수 (방장용)
  const updateBoard = useCallback(
    (elements, boardType) => {
      if (stompService?.client?.active && isConnected && participantUtils.isCreator(nickname)) {
        const message = {
          type: 'excalidraw',
          boardType,
          elements,
          sender: nickname,
        };

        console.log('Sending message:', message);
        stompService.client.publish({
          destination: `/sub/send/${curriculumSubject}`,
          body: JSON.stringify(message),
        });
      }
    },
    [stompService, isConnected, curriculumSubject, nickname],
  );

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

      {/* 비디오 레이아웃 */}
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

      {/* 채팅 컴포넌트 */}
      <LiveKitRoom serverUrl={LIVEKIT_URL} token={chatToken} connect={true}>
        <CustomChat />
      </LiveKitRoom>
      {participantUtils.isCreator(nickname)}
      {/* Excalidraw 컴포넌트 */}
      {participantUtils.isCreator(nickname) ? (
        <div className="excalidraw-wrapper">
          <h3>내 화이트보드</h3>
          <Excalidraw
            onChange={(elements) => {
              setRoomCreatorElements(elements);
              updateBoard(elements, 'roomCreator');
            }}
            elements={roomCreatorElements}
            excalidrawAPI={(api) => setRoomCreatorExcalidrawAPI(api)}
            viewModeEnabled={false}
          />
        </div>
      ) : (
        <div className="whiteboard-container" style={{ display: 'flex', gap: '20px' }}>
          <div className="excalidraw-wrapper" style={{ flex: 1 }}>
            <h3>방장 화이트보드</h3>
            <Excalidraw
              elements={roomCreatorElements}
              excalidrawAPI={(api) => {
                setRoomCreatorExcalidrawAPI(api);
                // API가 설정될 때 이미 있는 요소들 적용
                if (latestElementsRef.current.length > 0 && api) {
                  api.updateScene({ elements: latestElementsRef.current });
                }
              }}
              viewModeEnabled={true}
            />
          </div>
          <div className="excalidraw-wrapper" style={{ flex: 1 }}>
            <h3>내 화이트보드</h3>
            <Excalidraw
              onChange={(elements) => {
                setParticipantElements(elements);
                updateBoard(elements, 'participant');
              }}
              elements={participantElements}
              excalidrawAPI={(api) => setParticipantExcalidrawAPI(api)}
              viewModeEnabled={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
