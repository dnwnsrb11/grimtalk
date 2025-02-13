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

// 드로잉 업데이트 관련 상수
const BATCH_INTERVAL = 500; // 배치 전송 간격 (ms)
const DRAW_END_DELAY = 1000; // 드로잉 종료 감지 시간 (ms)

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
  const elementBufferRef = useRef(new Map()); // 변경된 요소들을 저장할 버퍼
  const batchTimeoutRef = useRef(null); // 배치 전송 타이머
  const drawEndTimeoutRef = useRef(null); // 드로잉 종료 감지 타이머
  const isDrawingRef = useRef(false); // 현재 드로잉 중인지 여부
  const activeIntervalRef = useRef(null); // 활성 업데이트 인터벌
  const completedTimeoutRef = useRef(null); // 완료 타이머
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

  /**
   * STOMP 메시지 수신 핸들러
   * 수신된 드로잉 데이터를 화이트보드에 반영
   */
  const handleStompMessage = useCallback((message) => {
    try {
      console.log('📥 Received STOMP message:', message.body);
      const receivedData = JSON.parse(message.body);

      if (receivedData.type === 'excalidraw') {
        const newElements = receivedData.elements;
        console.log('🎨 Received elements:', newElements);

        if (!Array.isArray(newElements) || newElements.length === 0) {
          console.warn('❌ Invalid elements format or empty:', newElements);
          return;
        }

        setRoomCreatorElements((prevElements) => {
          console.log('🔄 Previous elements:', prevElements);
          const updatedElements = [...prevElements];

          // 배치로 받은 각 요소들을 처리
          newElements.forEach((newElement) => {
            const elementIndex = updatedElements.findIndex((el) => el.id === newElement.id);
            if (elementIndex !== -1) {
              updatedElements[elementIndex] = newElement;
            } else {
              updatedElements.push(newElement);
            }
          });

          console.log('✅ Updated elements:', updatedElements);
          return updatedElements;
        });

        // 화면 업데이트
        if (roomCreatorAPIRef.current) {
          roomCreatorAPIRef.current.updateScene((prevScene) => ({
            ...prevScene,
            elements: roomCreatorElements,
            appState: {
              ...prevScene.appState,
              viewModeEnabled: true,
            },
          }));
        }
      }
    } catch (error) {
      console.error('❌ Error handling STOMP message:', error);
    }
  }, []);

  /**
   * 드로잉 요소들을 서버로 전송하는 함수
   * @param {Array} elements - 전송할 드로잉 요소들
   * @returns {boolean} 전송 성공 여부
   */
  const sendUpdate = useCallback(
    (elements) => {
      if (!stompService?.client?.active || !isStompReady || !participantUtils.isCreator(nickname)) {
        console.log('STOMP not ready or not authorized');
        return false;
      }

      try {
        const message = {
          type: 'excalidraw',
          elements: elements,
          sender: nickname,
          timestamp: Date.now(),
        };

        console.log('🔵 Sending batch update:', message);

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

  /**
   * 배치 전송을 실행하는 함수
   * 버퍼에 있는 모든 요소를 전송하고 버퍼를 비움
   */
  const executeBatchUpdate = useCallback(() => {
    if (elementBufferRef.current.size > 0) {
      const elements = Array.from(elementBufferRef.current.values());
      const success = sendUpdate(elements);

      if (success) {
        elementBufferRef.current.clear();
      }
    }
  }, [sendUpdate]);

  /**
   * 드로잉 변경을 처리하는 함수
   * @param {Array} elements - 변경된 Excalidraw 요소들
   */
  const handleDrawingChange = useCallback(
    (elements) => {
      console.log('✏️ Drawing changed:', elements);
      const activeElements = elements.filter((el) => !el.isDeleted);
      const latestElement = activeElements[activeElements.length - 1];

      if (!latestElement) return;

      // 새로운 요소를 버퍼에 저장 (id를 키로 사용하여 중복 방지)
      elementBufferRef.current.set(latestElement.id, latestElement);

      // 이전 타이머들 초기화
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      if (drawEndTimeoutRef.current) {
        clearTimeout(drawEndTimeoutRef.current);
      }

      // 드로잉 시작 상태 갱신
      if (!isDrawingRef.current) {
        isDrawingRef.current = true;
      }

      // 배치 업데이트 예약
      batchTimeoutRef.current = setTimeout(() => {
        executeBatchUpdate();
      }, BATCH_INTERVAL);

      // 드로잉 종료 감지 타이머 설정
      drawEndTimeoutRef.current = setTimeout(() => {
        isDrawingRef.current = false;
        executeBatchUpdate(); // 드로잉 종료 시 마지막 업데이트 실행
      }, DRAW_END_DELAY);
    },
    [executeBatchUpdate],
  );

  // STOMP 연결 및 구독 설정
  useEffect(() => {
    if (stompService && curriculumSubject) {
      const connectStomp = () => {
        // 기존 연결 정리
        if (stompService.client?.active) {
          stompService.client.deactivate();
        }

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

  // 방 연결 함수 (연결관련)
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
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }
    if (drawEndTimeoutRef.current) {
      clearTimeout(drawEndTimeoutRef.current);
    }
    if (elementBufferRef.current) {
      elementBufferRef.current.clear();
    }
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
            onChange={(elements) => {
              setRoomCreatorElements(elements);
              handleDrawingChange(elements);
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
