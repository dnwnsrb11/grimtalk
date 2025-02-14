import '@/styles/live.css';

import { Excalidraw } from '@excalidraw/excalidraw';
import { LiveKitRoom } from '@livekit/components-react';
import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { liveApi, useAddStrokeMutation } from '@/api/live';
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

  // 녹화기능
  const [lastElement, setLastElement] = useState(null); // 마지막 추가된 요소를 저장하는 상태
  const [isRecording, setIsRecording] = useState(false); // 녹화 상태
  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간
  const [timeHistory, setTimeHistory] = useState([
    // 초기값을 배열로 설정
    {
      time: 0, // 초기값은 0
      element: null, // 최초에 추가된 요소는 없음
    },
  ]);
  const [sendData, setSendData] = useState(null);
  const timeRef = useRef(null);

  // 녹화 기능 콜백 함수
  const startRecording = useCallback(() => {
    setIsRecording(true);
    setElapsedTime(0);

    // 0.1초 마다 시간 업데이트
    timeRef.current = setInterval(() => {
      setElapsedTime((prevTime) => parseFloat((prevTime + 1).toFixed(1)));
    }, 100);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);

    // 타이머도 정지
    if (timeRef.current) {
      clearInterval(timeRef.current);
      setElapsedTime(0);
    }
  }, []);

  // timeHistory 업데이트
  useEffect(() => {
    if (lastElement !== null) {
      //null이 아니면 업데이트 시작
      setTimeHistory((prevHistory) => [
        ...prevHistory, // 기존 배열에 새 요소 추가
        {
          time: elapsedTime,
          element: lastElement, // lastElement만 추가
        },
      ]);
    }
  }, [lastElement]); // elapsedTime과 lastElement만 의존성으로 설정

  // 전달기능
  const sendDataButton = () => {
    setSendData(timeHistory);
  };

  const { mutate: addStroke } = useAddStrokeMutation(1);
  useEffect(() => {
    if (sendData) {
      console.log('전달 데이터:', sendData);
      addStroke(sendData); // strokeData는 여기서 전달
    }
  }, [sendData]);

  // 요소를 하나씩 추가하거나 최신화하는 함수(출력)
  const updateOrAddElementToArray = (newElement) => {
    console.log('🔄 updateOrAddElementToArray 실행. 새로운 요소:', newElement);
    console.log('현재 화이트보드 요소들:', receivedElementsRef.current);

    // 삭제된 요소 처리
    if (newElement.type === 'deleted') {
      console.log('❌ 삭제 요소 처리 중:', newElement);
      // 삭제할 요소의 인덱스 찾기
      const deleteIndex = receivedElementsRef.current.findIndex(
        (element) => element.id === newElement.id,
      );

      if (deleteIndex !== -1) {
        // 해당 요소 제거
        receivedElementsRef.current = receivedElementsRef.current.filter(
          (_, index) => index !== deleteIndex,
        );
        console.log('삭제 후 화이트보드 요소들:', receivedElementsRef.current);
      }
      return; // 삭제 처리 후 함수 종료
    }

    // 복원된 요소 처리
    if (newElement.type === 'restored') {
      console.log('🔄 복원 요소 처리 중:', newElement);
      const existingIndex = receivedElementsRef.current.findIndex(
        (element) => element.id === newElement.id,
      );

      if (existingIndex === -1) {
        // 복원된 요소 추가
        receivedElementsRef.current = [
          ...receivedElementsRef.current,
          {
            ...newElement,
            type: newElement.elementType, // 원래 타입으로 복원
            isDeleted: false,
          },
        ];
        console.log('복원 후 화이트보드 요소들:', receivedElementsRef.current);
      }
      return;
    }

    // 기존 로직: 일반 요소 추가/업데이트
    const existingIndex = receivedElementsRef.current.findIndex(
      (element) => element.id === newElement.id,
    );

    if (existingIndex !== -1) {
      // 기존 요소가 있으면 최신화
      console.log('🔄 기존 요소 업데이트:', newElement);
      receivedElementsRef.current[existingIndex] = newElement;
    } else {
      // 없으면 새로 추가
      console.log('➕ 새 요소 추가:', newElement);
      receivedElementsRef.current = [...receivedElementsRef.current, newElement];
    }
    console.log('최종 화이트보드 요소들:', receivedElementsRef.current);
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

      if (!participantUtils.isCreator(nickname)) {
        client.subscribe(`/pub/receive/${curriculumSubject}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            console.log('📥 수신된 드로잉 데이터:', data.message);

            if (data.message.type === 'drawing') {
              console.log('🎨 화이트보드에 적용할 요소들:', data.message.elements);
              // 메시지의 모든 요소를 순회하며 업데이트 처리
              data.message.elements.forEach((el) => {
                updateOrAddElementToArray(el);
              });
              console.log('🔄 화이트보드 업데이트 전 현재 요소들:', receivedElementsRef.current);
              roomCreatorAPIRef.current?.updateScene({
                elements: receivedElementsRef.current,
              });
              console.log('✅ 화이트보드 업데이트 완료');
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
          <div>
            <div className="flex gap-2">
              <button className="rounded-2xl border p-5" onClick={startRecording}>
                녹화
              </button>
              <button className="rounded-2xl border p-5" onClick={stopRecording}>
                정지
              </button>
              <button className="rounded-2xl border p-5" onClick={sendDataButton}>
                전송
              </button>
            </div>
            <p>{elapsedTime}</p>
          </div>
          <h3>내 화이트보드</h3>
          <Excalidraw
            onChange={(elements) => {
              console.log('🎨 Excalidraw onChange 이벤트 발생. 전체 요소:', elements);

              // 이전 상태와 비교하여 삭제된 요소 찾기
              const deletedElements = elements.filter((currentEl) => {
                const prevEl = roomCreatorElements.find((el) => el.id === currentEl.id);
                return prevEl && !prevEl.isDeleted && currentEl.isDeleted;
              });
              console.log('🗑️ 감지된 삭제된 요소들:', deletedElements);

              // 이전 상태와 비교하여 복원된(undo) 요소 찾기
              const restoredElements = elements.filter((currentEl) => {
                const prevEl = roomCreatorElements.find((el) => el.id === currentEl.id);
                return prevEl && prevEl.isDeleted && !currentEl.isDeleted;
              });
              console.log('🔄 감지된 복원된 요소들:', restoredElements);

              // 복원된 요소가 있을 경우, 모든 복원된 요소를 한 번에 전송
              if (restoredElements.length > 0) {
                console.log('🔄 복원된 요소들 전송:', restoredElements);
                const allRestoredElements = restoredElements.map((el) => ({
                  ...el,
                  type: 'restored',
                  elementType: el.type,
                }));
                handleInstructorDrawingChange(allRestoredElements);
              }
              // 삭제 이벤트가 있을 경우, 모든 삭제된 요소를 한 번에 전송
              else if (deletedElements.length > 0) {
                console.log('🗑️ 삭제된 요소들 전송:', deletedElements);
                const allDeletedElements = deletedElements.map((el) => ({
                  ...el,
                  type: 'deleted',
                }));
                handleInstructorDrawingChange(allDeletedElements);
              }
              // 새로 추가/변경된 요소가 있을 경우
              else {
                const validElements = elements.filter((element) => !element.isDeleted);
                if (validElements.length > 0) {
                  const latestElement = validElements[validElements.length - 1];
                  console.log('✏️ 새로 추가 또는 업데이트된 요소 전송:', latestElement);
                  handleInstructorDrawingChange([latestElement]);
                }
              }

              setRoomCreatorElements(elements);
              console.log('💾 최종 roomCreatorElements 상태:', elements);
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
