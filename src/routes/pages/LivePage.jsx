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

// Constants for update timing
const ACTIVE_DRAWING_INTERVAL = 200; // Send updates every 100ms during active drawing
const COMPLETED_ACTION_DELAY = 500; // Wait 500ms after drawing stops before sending final update

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
  const [isStompReady, setIsStompReady] = useState(false);

  // Excalidraw 관련 상태
  const [roomCreatorElements, setRoomCreatorElements] = useState([]);
  const [participantElements, setParticipantElements] = useState([]);
  const roomCreatorAPIRef = useRef(null);
  const participantAPIRef = useRef(null);

  // Drawing state management
  const isDrawingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);
  const pendingUpdatesRef = useRef(null);
  const activeIntervalRef = useRef(null);
  const completedTimeoutRef = useRef(null);
  const connectionAttempts = useRef(0);
  const maxRetries = 3;
  const retryDelay = 2000;

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

  const handleStompMessage = useCallback((message) => {
    try {
      console.log('🟢 Received STOMP message:', message.body);

      const receivedData = JSON.parse(message.body);
      const excalidrawData = receivedData.message || receivedData;

      console.log('📩 Parsed STOMP message:', excalidrawData);

      if (excalidrawData.type === 'excalidraw' && excalidrawData.boardType === 'roomCreator') {
        // 새로운 요소 추출
        const newElement = excalidrawData.elements[0];

        if (!newElement) return;

        // 기존 요소들과 새로운 요소를 합치기
        setRoomCreatorElements((prevElements) => {
          // 같은 ID를 가진 요소가 있는지 확인
          const elementIndex = prevElements.findIndex((el) => el.id === newElement.id);

          if (elementIndex !== -1) {
            // 기존 요소 업데이트
            const updatedElements = [...prevElements];
            updatedElements[elementIndex] = newElement;
            return updatedElements;
          } else {
            // 새로운 요소 추가
            return [...prevElements, newElement];
          }
        });

        // 화면 업데이트
        if (roomCreatorAPIRef.current) {
          roomCreatorAPIRef.current.updateScene((prevScene) => ({
            ...prevScene,
            elements: roomCreatorElements,
            appState: {
              ...prevScene.appState,
              viewBackgroundColor: '#ffffff',
              currentItemStrokeColor: '#000000',
              currentItemBackgroundColor: '#ffffff',
              viewModeEnabled: true,
              theme: 'light',
            },
          }));
        }
      }
    } catch (error) {
      console.error('❌ Error handling STOMP message:', error);
    }
  }, []);

  // Send updates to other participants
  const sendUpdate = useCallback(
    (elements, appState, boardType) => {
      if (!stompService?.client?.active || !isStompReady || !participantUtils.isCreator(nickname)) {
        console.log('STOMP not ready, buffering update');
        return false;
      }

      try {
        // Get only the most recently added/modified element
        const activeElements = elements.filter((el) => !el.isDeleted);
        const latestElement = activeElements[activeElements.length - 1];

        if (!latestElement) return true; // No new elements to send

        const message = {
          type: 'excalidraw',
          boardType,
          elements: [latestElement], // Send only the latest element
          appState: {
            ...appState,
            viewBackgroundColor: '#ffffff',
            currentItemStrokeColor: '#000000',
            currentItemBackgroundColor: '#ffffff',
          },
          sender: nickname,
          timestamp: Date.now(),
        };

        console.log('🔵 Sending STOMP message:', message);

        stompService.client.publish({
          destination: `/sub/send/${curriculumSubject}`,
          body: JSON.stringify(message),
        });
        return true;
      } catch (error) {
        console.error('❌ Failed to send update:', error);
        return false;
      }
    },
    [stompService, isStompReady, curriculumSubject, nickname],
  );

  // Handle active drawing updates
  const startActiveUpdates = useCallback(() => {
    if (!activeIntervalRef.current) {
      activeIntervalRef.current = setInterval(() => {
        if (
          pendingUpdatesRef.current &&
          Date.now() - lastUpdateTimeRef.current >= ACTIVE_DRAWING_INTERVAL
        ) {
          const success = sendUpdate(
            pendingUpdatesRef.current.elements,
            pendingUpdatesRef.current.appState,
            pendingUpdatesRef.current.boardType,
          );

          if (success) {
            lastUpdateTimeRef.current = Date.now();
            pendingUpdatesRef.current = null;
          }
        }
      }, ACTIVE_DRAWING_INTERVAL);
    }
  }, [sendUpdate]);

  // Stop active updates
  const stopActiveUpdates = useCallback(() => {
    if (activeIntervalRef.current) {
      clearInterval(activeIntervalRef.current);
      activeIntervalRef.current = null;
    }
  }, []);

  // Handle changes in drawing
  const handleDrawingChange = useCallback(
    (elements, appState, boardType) => {
      pendingUpdatesRef.current = { elements, appState, boardType };

      if (!isDrawingRef.current) {
        isDrawingRef.current = true;
        startActiveUpdates();
      }

      if (completedTimeoutRef.current) {
        clearTimeout(completedTimeoutRef.current);
      }

      completedTimeoutRef.current = setTimeout(() => {
        if (pendingUpdatesRef.current) {
          const updateSuccess = sendUpdate(
            pendingUpdatesRef.current.elements,
            pendingUpdatesRef.current.appState,
            pendingUpdatesRef.current.boardType,
          );

          if (!updateSuccess && connectionAttempts.current < maxRetries) {
            setTimeout(() => {
              if (pendingUpdatesRef.current) {
                sendUpdate(
                  pendingUpdatesRef.current.elements,
                  pendingUpdatesRef.current.appState,
                  pendingUpdatesRef.current.boardType,
                );
              }
            }, retryDelay);
          }

          pendingUpdatesRef.current = null;
        }
        isDrawingRef.current = false;
        stopActiveUpdates();
      }, COMPLETED_ACTION_DELAY);
    },
    [startActiveUpdates, stopActiveUpdates, sendUpdate],
  );

  // STOMP 연결 및 구독 설정
  useEffect(() => {
    if (stompService && curriculumSubject) {
      const connectStomp = () => {
        stompService.client = new Client({
          brokerURL: STOMP_URL,
          reconnectDelay: retryDelay,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          debug: (str) => {
            console.log('STOMP Debug:', str);
          },
        });

        stompService.client.onConnect = (frame) => {
          console.log('STOMP Connected:', frame);
          setIsStompReady(true);
          setIsConnected(true);
          connectionAttempts.current = 0;

          if (!participantUtils.isCreator(nickname)) {
            stompService.client.subscribe(`/pub/receive/${curriculumSubject}`, handleStompMessage);
          }
        };

        stompService.client.onStompError = (frame) => {
          console.error('STOMP error:', frame.headers['message']);
          setIsStompReady(false);
          setIsConnected(false);

          if (connectionAttempts.current < maxRetries) {
            connectionAttempts.current += 1;
            setTimeout(connectStomp, retryDelay);
          }
        };

        stompService.client.onWebSocketClose = () => {
          console.log('WebSocket Connection Closed');
          setIsStompReady(false);
          setIsConnected(false);

          if (connectionAttempts.current < maxRetries) {
            connectionAttempts.current += 1;
            setTimeout(connectStomp, retryDelay);
          }
        };

        try {
          stompService.client.activate();
        } catch (error) {
          console.error('Failed to activate STOMP client:', error);
          if (connectionAttempts.current < maxRetries) {
            connectionAttempts.current += 1;
            setTimeout(connectStomp, retryDelay);
          }
        }
      };

      connectStomp();

      return () => {
        if (stompService.client?.active) {
          stompService.client.deactivate();
          setIsStompReady(false);
          setIsConnected(false);
        }
      };
    }
  }, [stompService, curriculumSubject, nickname, handleStompMessage]);

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

  // Cleanup function
  const cleanup = useCallback(() => {
    if (activeIntervalRef.current) {
      clearInterval(activeIntervalRef.current);
    }
    if (completedTimeoutRef.current) {
      clearTimeout(completedTimeoutRef.current);
    }
    if (room) {
      room.disconnect();
      if (stompService.client?.active) {
        stompService.client.deactivate();
      }
      setIsStompReady(false);
      setIsConnected(false);
    }
  }, [room, stompService]);

  // 컴포넌트 마운트 시 방 연결
  useEffect(() => {
    connectToRoom();
    return cleanup;
  }, [curriculumSubject, cleanup]);

  // 방 나가기 함수
  const leaveRoom = async () => {
    cleanup();
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
              handleDrawingChange(elements, appState, 'roomCreator');
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
