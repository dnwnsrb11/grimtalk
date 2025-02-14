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

  // 기본 상태 관리
  const [room, setRoom] = useState(null);
  const [localTrack, setLocalTrack] = useState(null);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [chatToken, setChatToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isStompReady, setIsStompReady] = useState(false);

  // Excalidraw 관련 상태
  const [roomCreatorElements, setRoomCreatorElements] = useState([]);
  const [participantElements, setParticipantElements] = useState([]);
  const roomCreatorAPIRef = useRef(null);
  const participantAPIRef = useRef(null);
  // 배열에 쌓을 변수 (useRef로 상태 관리)
  const receivedElementsRef = useRef([]);

  // 요소를 하나씩 추가하거나 최신화하는 함수
  const updateOrAddElementToArray = (newElement) => {
    // 삭제된 요소 처리
    if (newElement.type === 'deleted') {
      // 삭제할 요소의 인덱스 찾기
      const deleteIndex = receivedElementsRef.current.findIndex(
        (element) => element.id === newElement.id,
      );

      if (deleteIndex !== -1) {
        // 해당 요소 제거
        receivedElementsRef.current = receivedElementsRef.current.filter(
          (_, index) => index !== deleteIndex,
        );
      }
      return; // 삭제 처리 후 함수 종료
    }

    // 기존 로직: 일반 요소 추가/업데이트
    const existingIndex = receivedElementsRef.current.findIndex(
      (element) => element.id === newElement.id,
    );

    if (existingIndex !== -1) {
      // 기존 요소가 있으면 최신화
      receivedElementsRef.current[existingIndex] = newElement;
    } else {
      // 없으면 새로 추가
      receivedElementsRef.current = [...receivedElementsRef.current, newElement];
    }
  };

  // STOMP 연결 관리
  const setupStompConnection = useCallback(() => {
    if (!stompService || !curriculumSubject) return;

    const client = new Client({
      brokerURL: STOMP_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('STOMP Connected');
      setIsStompReady(true);
      setIsConnected(true);

      // 수강생 측 구독 부분 (setupStompConnection 내부)
      if (!participantUtils.isCreator(nickname)) {
        client.subscribe(`/pub/receive/${curriculumSubject}`, (message) => {
          try {
            // console.log('📩 수신된 원본 메시지:', message.body);

            const data = JSON.parse(message.body);
            console.log('🎨 파싱된 드로잉 데이터:', data.message);

            if (data.message.type === 'drawing') {
              console.log('✏️ 화이트보드에 적용할 elements:', data.message.elements);
              // 하나씩 받은 요소를 배열에 추가하거나 최신화
              const latestElement = data.message.elements[data.message.elements.length - 1];
              updateOrAddElementToArray(latestElement);

              // 배열에 쌓인 전체 요소로 화면 업데이트
              roomCreatorAPIRef.current?.updateScene({
                elements: receivedElementsRef.current, // 최신화된 전체 요소 배열 전달
              });
            }
          } catch (error) {
            console.error('❌ 메시지 파싱 실패:', error);
          }
        });
      }
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
      setIsStompReady(false);
      setIsConnected(false);
    };

    stompService.client = client;
    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [stompService, curriculumSubject, nickname]);

  // 드로잉 변경 핸들러 (강사용)
  const handleInstructorDrawingChange = useCallback(
    (elements) => {
      if (!isStompReady || !participantUtils.isCreator(nickname)) return;

      console.log('🎨 강사가 그린 데이터:', elements);

      const message = {
        type: 'drawing',
        elements: elements,
        timestamp: Date.now(),
      };

      console.log('📤 전송하는 메시지:', message);

      stompService.client.publish({
        destination: `/sub/send/${curriculumSubject}`,
        body: JSON.stringify(message),
      });
    },
    [isStompReady, nickname, curriculumSubject, stompService],
  );

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

  // STOMP 연결 설정
  useEffect(() => {
    const cleanup = setupStompConnection();
    return () => {
      if (cleanup) cleanup();
    };
  }, [setupStompConnection]);

  // 토큰 발급 및 방 연결 함수
  const connectToRoom = async () => {
    try {
      const isCreator = participantUtils.isCreator(nickname);
      const rtcToken = await (isCreator
        ? liveApi.getInstructorToken(
            curriculumSubject,
            participantUtils.getTokenParticipantName(nickname, TOKEN_TYPES.RTC),
          )
        : liveApi.getStudentToken(
            curriculumSubject,
            participantUtils.getTokenParticipantName(nickname, TOKEN_TYPES.RTC),
          ));
      const chatToken = await (isCreator
        ? liveApi.getInstructorToken(
            curriculumSubject,
            participantUtils.getTokenParticipantName(nickname, TOKEN_TYPES.CHAT),
          )
        : liveApi.getStudentToken(
            curriculumSubject,
            participantUtils.getTokenParticipantName(nickname, TOKEN_TYPES.CHAT),
          ));

      if (!rtcToken || !chatToken) {
        throw new Error('Failed to get tokens');
      }

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
      console.error('Failed to connect to room:', error);
      alert('Failed to connect to room');
      navigate('/create-live-test');
    }
  };

  // 컴포넌트 마운트 시 방 연결
  useEffect(() => {
    connectToRoom();
    return () => {
      if (room) {
        room.disconnect();
      }
      if (stompService.client?.active) {
        stompService.client.deactivate();
      }
    };
  }, []);

  // 방 나가기 함수
  const leaveRoom = async () => {
    if (room) {
      room.disconnect();
    }
    if (stompService.client?.active) {
      stompService.client.deactivate();
    }
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
            onChange={(elements) => {
              // 1. 삭제된 요소 체크
              const deletedElement = elements.find((currentEl) => {
                const prevEl = roomCreatorElements.find((el) => el.id === currentEl.id);
                return prevEl && !prevEl.isDeleted && currentEl.isDeleted;
              });

              // 삭제된 요소가 있다면 처리
              if (deletedElement) {
                console.log('방금 삭제된 요소:', deletedElement);
                handleInstructorDrawingChange([
                  {
                    ...deletedElement,
                    type: 'deleted',
                  },
                ]);
              }

              // 2. 일반적인 그리기 요소 처리 (기존 로직)
              const validElements = elements.filter((element) => !element.isDeleted);
              if (validElements.length > 0) {
                const latestElement = validElements[validElements.length - 1];
                if (!deletedElement) {
                  // 삭제 동작이 아닐 때만 그리기 요소 전달
                  console.log('가장 최근에 추가된 요소:', latestElement);
                  handleInstructorDrawingChange([latestElement]);
                }
              }

              setRoomCreatorElements(elements);
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
