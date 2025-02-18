import '@/styles/live.css';

import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
import { LiveKitRoom } from '@livekit/components-react';
import { Client } from '@stomp/stompjs';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  InstructorExportImage,
  InstructorLeaveLive,
  joinLive,
  leaveLive,
  liveApi,
  useAddStrokeMutation,
  useLiveCount,
} from '@/api/live';
import { useNotificationStore } from '@/api/notification';
import { LeftArrowIcon, OpacityIcon } from '@/components/common/icons';
import { AudioComponent } from '@/components/live/AudioComponent';
import { CustomChat } from '@/components/live/CustomChat';
import { LoadingScreen } from '@/components/live/LoadingScreen';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  const { id, nickname } = useAuthStore((state) => state.userData);
  const { state } = useLocation();
  const curriculumId = state?.curriculumId;
  const { data: liveCount } = useLiveCount(curriculumId);
  const lastNotification = useNotificationStore((state) => state.lastNotification);

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
  const [isChatVisible, setIsChatVisible] = useState(true);

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
  const [completeRecording, setCompleteRecording] = useState(false);
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
    setCompleteRecording(true);
    // 타이머도 정지
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  }, []);

  // timeHistory 업데이트
  useEffect(() => {
    if (lastElement !== null) {
      if (elapsedTime !== 0) {
        //null이 아니면 업데이트 시작
        setTimeHistory((prevHistory) => [
          ...prevHistory, // 기존 배열에 새 요소 추가
          {
            time: elapsedTime,
            element: lastElement, // lastElement만 추가
          },
        ]);
      }
    }
  }, [lastElement]); // elapsedTime과 lastElement만 의존성으로 설정

  // 전달기능
  const sendDataButton = () => {
    setSendData(timeHistory);
    console.log(timeHistory);
  };

  const { mutate: addStroke } = useAddStrokeMutation(curriculumId);
  useEffect(() => {
    if (sendData) {
      addStroke(sendData); // strokeData는 여기서 전달
    }
  }, [sendData]);

  // 요소를 하나씩 추가하거나 최신화하는 함수(출력)
  const updateOrAddElementToArray = (newElement) => {
    console.log('🔄 updateOrAddElementToArray 실행. 새로운 요소:', newElement);
    // console.log('현재 화이트보드 요소들:', receivedElementsRef.current);

    // 삭제된 요소 처리
    if (newElement.type === 'deleted') {
      // console.log('❌ 삭제 요소 처리 중:', newElement);
      // 삭제할 요소의 인덱스 찾기
      const deleteIndex = receivedElementsRef.current.findIndex(
        (element) => element.id === newElement.id,
      );

      if (deleteIndex !== -1) {
        // 해당 요소 제거
        receivedElementsRef.current = receivedElementsRef.current.filter(
          (_, index) => index !== deleteIndex,
        );
        // console.log('삭제 후 화이트보드 요소들:', receivedElementsRef.current);
      }
      return; // 삭제 처리 후 함수 종료
    }

    // 복원된 요소 처리
    if (newElement.type === 'restored') {
      // console.log('🔄 복원 요소 처리 중:', newElement);
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
        // console.log('복원 후 화이트보드 요소들:', receivedElementsRef.current);
      }
      return;
    }

    // 기존 로직: 일반 요소 추가/업데이트
    const existingIndex = receivedElementsRef.current.findIndex(
      (element) => element.id === newElement.id,
    );

    if (existingIndex !== -1) {
      // 기존 요소가 있으면 최신화
      // console.log('🔄 기존 요소 업데이트:', newElement);
      receivedElementsRef.current[existingIndex] = newElement;
    } else {
      // 없으면 새로 추가
      // console.log('➕ 새 요소 추가:', newElement);
      receivedElementsRef.current = [...receivedElementsRef.current, newElement];
    }
    // console.log('최종 화이트보드 요소들:', receivedElementsRef.current);
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
              // console.log('🎨 화이트보드에 적용할 요소들:', data.message.elements);
              // 메시지의 모든 요소를 순회하며 업데이트 처리
              data.message.elements.forEach((el) => {
                updateOrAddElementToArray(el);
              });
              // console.log('🔄 화이트보드 업데이트 전 현재 요소들:', receivedElementsRef.current);
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

      // console.log('📤 전송하는 메시지:', message);

      stompService.client.publish({
        destination: `/sub/send/${curriculumSubject}`,
        body: JSON.stringify(message),
      });
    },
    [isStompReady, nickname, curriculumSubject, stompService],
  );
  // const [roomCreatorExcalidrawAPI, setRoomCreatorExcalidrawAPI] = useState(null);
  // const [participantExcalidrawAPI, setParticipantExcalidrawAPI] = useState(null);

  const [isOverlayMode, setIsOverlayMode] = useState(true);

  // 방 나가기 확인 상태
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let stepInterval;
    if (isLoading) {
      stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev === 3) {
            clearInterval(stepInterval);
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(stepInterval);
  }, [isLoading]);

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

  // 토큰 발급 함수
  const getTokens = async (isCreator = false) => {
    const tokenFunction = isCreator ? liveApi.getInstructorToken : liveApi.getStudentToken;

    const [rtcToken, chatToken] = await Promise.all([
      tokenFunction(
        curriculumId,
        curriculumSubject,
        id,
        participantUtils.getTokenParticipantName(nickname, TOKEN_TYPES.RTC),
      ),
      tokenFunction(
        curriculumId,
        curriculumSubject,
        id,
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
    setIsLoading(true);
    try {
      // 1. STOMP 연결
      // stompService.connect();
      await joinLive(curriculumId, id);

      // 강사 닉네임을 localStorage와 liveStore에 저장
      const { state } = location;
      if (state?.instructorNickname) {
        localStorage.setItem('roomCreator', state.instructorNickname);
        liveStore.setRoomCreator(state.instructorNickname);
      } else {
        // localStorage에서 roomCreator를 가져와서 liveStore에도 저장
        const storedRoomCreator = localStorage.getItem('roomCreator');
        if (storedRoomCreator) {
          liveStore.setRoomCreator(storedRoomCreator);
        }
      }

      // 2. 토큰 발급
      const isCreator = participantUtils.isCreator(nickname);
      const { rtcToken, chatToken } = await getTokens(isCreator);

      liveStore.setTokens(rtcToken, chatToken);
      setChatToken(chatToken);

      // 3. LiveKit 방 연결
      const newRoom = await liveKitService.connect(rtcToken);
      setRoom(newRoom);
      liveStore.setRoom(newRoom);

      // 4. 방장일 경우 미디어 활성화
      if (isCreator) {
        const track = await liveKitService.enableMedia();
        setLocalTrack(track);
        liveStore.setLocalTrack(track);
      }

      setIsConnected(true);
    } catch (error) {
      console.error('방 연결 중 오류 발생:', error);
      alert('방 연결에 실패했습니다.');
      navigate(-1);
    }
  };

  // 컴포넌트 마운트 시 방 연결
  useEffect(() => {
    connectToRoom();
    // <<<<<<< HEAD
    //   return () => {
    //     if (room) {
    //       room.disconnect();
    //     }
    //     if (stompService.client?.active) {
    //       stompService.client.deactivate();
    //     }
    //   };
    // }, []);

    // // 방 나가기 함수
    // const leaveRoom = async () => {
    //   if (room) {
    //     room.disconnect();
    //   }
    //   if (stompService.client?.active) {
    //     stompService.client.deactivate();
    //   }
    //   localStorage.removeItem('roomCreator');
    //   liveStore.reset();
    //   navigate('/create-live-test');
    // };

    // return (
    //   <div id="room">
    //     <div id="room-header">
    //       <h2 id="room-title">{curriculumSubject}</h2>
    //       {participantUtils.isCreator(nickname) && (
    //         <button className="btn btn-large btn-danger" onClick={leaveRoom}>
    //           Leave Room
    //         </button>
    //       )}
    //     </div>

    //     <div id="layout-container">
    //       {participantUtils.isCreator(nickname) && localTrack && (
    //         <VideoComponent track={localTrack} participantIdentity={nickname} local={true} />
    //       )}
    //       {!participantUtils.isCreator(nickname) && remoteTracks.length > 0 && (
    //         <div>
    //           {remoteTracks
    //             .filter(
    //               (track) =>
    //                 track.participantIdentity ===
    //                 participantUtils.getTokenParticipantName(liveStore.roomCreator, TOKEN_TYPES.RTC),
    //             )
    //             .map((remoteTrack) =>
    //               remoteTrack.trackPublication.kind === 'video' ? (
    //                 <VideoComponent
    //                   key={remoteTrack.trackPublication.trackSid}
    //                   track={remoteTrack.trackPublication.videoTrack}
    //                   participantIdentity={participantUtils.removeTokenPrefix(
    //                     remoteTrack.participantIdentity,
    //                   )}
    //                 />
    //               ) : (
    //                 <AudioComponent
    //                   key={remoteTrack.trackPublication.trackSid}
    //                   track={remoteTrack.trackPublication.audioTrack}
    //                 />
    //               ),
    //             )}
    //         </div>
    //       )}
    //     </div>

    //     <LiveKitRoom serverUrl={LIVEKIT_URL} token={chatToken} connect={true}>
    //       <CustomChat />
    //     </LiveKitRoom>

    // {participantUtils.isCreator(nickname) ? (
    //   <div className="excalidraw-wrapper">
    //     <div>
    //       <div className="flex gap-2">
    //         <button className="rounded-2xl border p-5" onClick={startRecording}>
    //           녹화
    //         </button>
    //         <button className="rounded-2xl border p-5" onClick={stopRecording}>
    //           정지
    //         </button>
    //         <button className="rounded-2xl border p-5" onClick={sendDataButton}>
    //           전송
    //         </button>
    //       </div>
    //       <p>{elapsedTime}</p>
    //     </div>
    //     <Excalidraw
    //       onChange={(elements) => {
    //         console.log('🎨 Excalidraw onChange 이벤트 발생. 전체 요소:', elements);

    //         // 이전 상태와 비교하여 삭제된 요소 찾기
    //         const deletedElements = elements.filter((currentEl) => {
    //           const prevEl = roomCreatorElements.find((el) => el.id === currentEl.id);
    //           return prevEl && !prevEl.isDeleted && currentEl.isDeleted;
    //         });
    //         console.log('🗑️ 감지된 삭제된 요소들:', deletedElements);

    //         // 이전 상태와 비교하여 복원된(undo) 요소 찾기
    //         const restoredElements = elements.filter((currentEl) => {
    //           const prevEl = roomCreatorElements.find((el) => el.id === currentEl.id);
    //           return prevEl && prevEl.isDeleted && !currentEl.isDeleted;
    //         });
    //         console.log('🔄 감지된 복원된 요소들:', restoredElements);

    //         // 복원된 요소가 있을 경우, 모든 복원된 요소를 한 번에 전송
    //         if (restoredElements.length > 0) {
    //           console.log('🔄 복원된 요소들 전송:', restoredElements);
    //           const allRestoredElements = restoredElements.map((el) => ({
    //             ...el,
    //             type: 'restored',
    //             elementType: el.type,
    //           }));
    //           handleInstructorDrawingChange(allRestoredElements);
    //         }
    //         // 삭제 이벤트가 있을 경우, 모든 삭제된 요소를 한 번에 전송
    //         else if (deletedElements.length > 0) {
    //           console.log('🗑️ 삭제된 요소들 전송:', deletedElements);
    //           const allDeletedElements = deletedElements.map((el) => ({
    //             ...el,
    //             type: 'deleted',
    //           }));
    //           handleInstructorDrawingChange(allDeletedElements);
    //         }
    //         // 새로 추가/변경된 요소가 있을 경우
    //         else {
    //           const validElements = elements.filter((element) => !element.isDeleted);
    //           if (validElements.length > 0) {
    //             const latestElement = validElements[validElements.length - 1];
    //             console.log('✏️ 새로 추가 또는 업데이트된 요소 전송:', latestElement);
    //             handleInstructorDrawingChange([latestElement]);
    //           }
    //         }

    //         setRoomCreatorElements(elements);
    //         console.log('💾 최종 roomCreatorElements 상태:', elements);
    //       }}
    //       excalidrawAPI={(api) => {
    //         roomCreatorAPIRef.current = api;
    //       }}
    //       viewModeEnabled={false}
    //       initialData={{
    //         elements: roomCreatorElements,
    //         appState: {
    //           viewBackgroundColor: '#ffffff',
    //           currentItemStrokeColor: '#000000',
    //           currentItemBackgroundColor: '#ffffff',
    //         },
    //       }}
    //     />
    //   </div>
    //   ) : (
    //     <div className="whiteboard-container" style={{ display: 'flex', gap: '20px' }}>
    //       <div className="excalidraw-wrapper" style={{ flex: 1 }}>
    //         <h3>방장 화이트보드</h3>
    //         <Excalidraw
    //           excalidrawAPI={(api) => {
    //             roomCreatorAPIRef.current = api;
    //           }}
    //           elements={roomCreatorElements}
    //           viewModeEnabled={true}
    //           initialData={{
    //             elements: roomCreatorElements,
    //             appState: {
    //               viewBackgroundColor: '#ffffff',
    //               currentItemStrokeColor: '#000000',
    //               currentItemBackgroundColor: '#ffffff',
    //               viewModeEnabled: true,
    //               theme: 'light',
    //             },
    //           }}
    //         />
    //       </div>
    //       <div className="excalidraw-wrapper" style={{ flex: 1 }}>
    //         <h3>내 화이트보드</h3>
    //         <Excalidraw
    //           onChange={(elements) => {
    //             setParticipantElements(elements);
    //           }}
    //           excalidrawAPI={(api) => {
    //             participantAPIRef.current = api;
    //           }}
    //           elements={participantElements}
    //           viewModeEnabled={false}
    //           initialData={{
    //             elements: participantElements,
    //             appState: {
    //               viewBackgroundColor: '#ffffff',
    //               currentItemStrokeColor: '#000000',
    //               currentItemBackgroundColor: '#ffffff',
    //             },
    //           }}
    //         />
    //       </div>
    //     </div>
    //   )}
    // </div>

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (room) {
        room.disconnect();
        stompService.disconnect();
        setIsConnected(false);
      }
    };
  }, [curriculumSubject]);

  // 화이트보드 업데이트 함수
  const updateBoard = useCallback(
    (elements, boardType) => {
      if (stompService?.active && isConnected) {
        stompService.publish({
          destination: `/sub/receive/${curriculumSubject}`,
          body: JSON.stringify({
            type: 'excalidraw',
            boardType,
            elements,
            sender: nickname,
          }),
        });
      }
    },
    [stompService, isConnected, nickname, curriculumSubject],
  );

  // 강사 이미지 추출 함수
  const handleInstructorExportImage = async () => {
    if (!roomCreatorAPIRef.current) return;

    try {
      const elements = roomCreatorAPIRef.current.getSceneElements();
      const appState = roomCreatorAPIRef.current.getAppState();

      const blob = await exportToBlob({
        elements,
        appState,
        mimeType: 'image/png',
        exportPadding: 10,
        // quality 속성 제거 (PNG에서는 무시됨)
      });

      // Blob을 File 객체로 변환
      const file = new File([blob], 'whiteboard.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('curriculumId', curriculumId);
      formData.append('image', file);

      const base64Image = await InstructorExportImage(formData);
      console.log('이미지 추출 성공', base64Image);
    } catch (error) {
      console.log('이미지 추출 실패', error);
    }
  };

  // 방 나가기 함수
  const leaveRoom = useCallback(async () => {
    if (participantUtils.isCreator(nickname)) {
      await InstructorLeaveLive(curriculumId, id);
      handleInstructorExportImage();
    } else {
      await leaveLive(curriculumId, id);
    }
    room?.disconnect();
    localStorage.removeItem('roomCreator');
    liveStore.reset();
    navigate(-1);
  }, [nickname, curriculumId, id, room, liveStore, navigate]);

  // 방 나가기 시도 함수
  const handleLeaveAttempt = useCallback(() => {
    setIsLeaveDialogOpen(true);
  }, []);

  // 브라우저 창 닫기, 새로고침, 뒤로가기 이벤트 처리
  useEffect(() => {
    // 강사가 아닌 경우에만 이벤트 리스너 등록
    if (!participantUtils.isCreator(nickname)) {
      const handleBeforeUnload = async (e) => {
        e.preventDefault();
        e.returnValue = '';
        await leaveRoom();
      };

      const handlePopState = async (e) => {
        e.preventDefault();
        if (participantUtils.isCreator(nickname)) {
          await InstructorLeaveLive(curriculumId, id);
        } else {
          await leaveLive(curriculumId, id);
        }
        room?.disconnect();
        localStorage.removeItem('roomCreator');
        liveStore.reset();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [curriculumId, id, nickname, room, leaveRoom]);

  // 이전 opacity 값을 저장할 state 추가
  const [savedOpacity, setSavedOpacity] = useState(100);
  const [rangeProgress, setRangeProgress] = useState(100);
  const opacityInputRef = useRef(null);
  const instructorBoardRef = useRef(null);

  // isOverlayMode 상태가 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    if (!isOverlayMode) {
      // 오버레이 모드 해제 시 현재 opacity 값 저장
      setSavedOpacity(rangeProgress);

      // 투명도 100%로 설정
      if (instructorBoardRef.current) {
        instructorBoardRef.current.style.opacity = 1;
      }
      if (opacityInputRef.current) {
        opacityInputRef.current.value = 100;
      }
      setRangeProgress(100);
    } else {
      // 오버레이 모드로 돌아올 때 저장된 값 복원
      if (instructorBoardRef.current) {
        instructorBoardRef.current.style.opacity = savedOpacity / 100;
      }
      if (opacityInputRef.current) {
        opacityInputRef.current.value = savedOpacity;
      }
      setRangeProgress(savedOpacity);
    }
  }, [isOverlayMode]);

  // 투명도 변경 함수
  const changeOpacity = () => {
    if (instructorBoardRef.current && opacityInputRef.current && isOverlayMode) {
      const value = opacityInputRef.current.value;
      instructorBoardRef.current.style.opacity = value / 100;
      setRangeProgress(value);
    }
  };

  const handleParticipantExportImage = async () => {
    if (!participantAPIRef.current) return;

    const elements = participantAPIRef.current.getSceneElements();
    const appState = participantAPIRef.current.getAppState();

    const blob = await exportToBlob({
      elements,
      appState,
      mimeType: 'image/png',
      quality: 1,
      exportPadding: 10,
    });
    console.log('이미지 추출 성공', blob);

    // 직렬화를 통해 전송 가능한 상태로 변경하자
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      // 먼저 값을 받아서 변환한다.
      reader.readAsDataURL(blob);
      // 성공하면 성공 내용을 반환
      reader.onloadend = () => resolve(reader.result);
      // 실패하면 실패를 반환
      reader.onerror = reject;
    });

    // 네비게이션으로 ai 페이지로 이동
    navigate('/aicompare', {
      state: { curriculumId: curriculumId, ImageData: base64Image },
    });
  };

  const goReplayPage = () => {
    navigate(`/replay/${curriculumId}`);
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen loadingStep={loadingStep} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          id="room"
          className="p-6"
        >
          {/* 비디오 레이아웃 */}

          {/* 채팅 컴포넌트 */}
          <LiveKitRoom serverUrl={LIVEKIT_URL} token={chatToken} connect={true}>
            {/* 방장의 오디오 트랙 렌더링 */}
            {!participantUtils.isCreator(nickname) &&
              remoteTracks.length > 0 &&
              remoteTracks
                .filter(
                  (track) =>
                    track.participantIdentity ===
                      participantUtils.getTokenParticipantName(
                        liveStore.roomCreator,
                        TOKEN_TYPES.RTC,
                      ) && track.trackPublication.kind === 'audio',
                )
                .map((remoteTrack) => (
                  <AudioComponent
                    key={remoteTrack.trackPublication.trackSid}
                    track={remoteTrack.trackPublication.audioTrack}
                  />
                ))}

            <CustomChat
              onLeave={handleLeaveAttempt}
              isCreator={participantUtils.isCreator(nickname)}
              isVisible={isChatVisible}
              setIsVisible={setIsChatVisible}
              curriculumSubject={curriculumSubject}
              // 녹화 기능 props로 전달
              stopRecording={stopRecording}
              startRecording={startRecording}
              sendDataButton={sendDataButton}
              elapsedTime={elapsedTime}
              isRecording={isRecording}
              completeRecording={completeRecording}
              track={
                participantUtils.isCreator(nickname)
                  ? localTrack
                  : remoteTracks.find(
                      (track) =>
                        track.trackPublication?.kind === 'video' &&
                        track.participantIdentity ===
                          participantUtils.getTokenParticipantName(
                            liveStore.roomCreator,
                            TOKEN_TYPES.RTC,
                          ),
                    )?.trackPublication?.videoTrack
              }
              participantIdentity={
                participantUtils.isCreator(nickname) ? nickname : liveStore.roomCreator || ''
              }
              local={participantUtils.isCreator(nickname)}
              liveCount={liveCount}
              isLeaveDialogOpen={isLeaveDialogOpen}
              sendData={sendData}
            />
          </LiveKitRoom>

          {/* 퇴장 확인 다이얼로그 */}
          <AlertDialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
            <AlertDialogContent className="border-gray-border-color">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold">
                  ⚠️
                  {participantUtils.isCreator(nickname) ? (
                    <>
                      <span className="text-primary-color">라이브</span> 종료
                    </>
                  ) : (
                    <>
                      <span className="text-primary-color">라이브</span> 퇴장
                    </>
                  )}
                </AlertDialogTitle>
                <AlertDialogDescription className="break-keep text-base">
                  {participantUtils.isCreator(nickname) ? (
                    <>
                      <h2 className="mb-3 text-xl font-bold text-primary-color">
                        라이브 종료 전 확인
                      </h2>
                      <p className="mb-2">
                        라이브 방송을 종료하기 전,{' '}
                        <strong className="text-primary-color">화면 녹화 저장 버튼</strong>을 눌러
                        녹화 파일이 저장되었는지 확인해 주세요.
                      </p>
                      <p className="mb-2">
                        종료 후,{' '}
                        <span className="font-semibold text-primary-color">최종 완성 이미지</span>가
                        다시보기 페이지에 업로드되어 수강생들이 확인할 수 있습니다. (
                        <span className="font-semibold text-primary-color">이미지</span>는 종료 시{' '}
                        <span className="font-semibold text-primary-color">자동으로 업로드</span>
                        됩니다.)
                      </p>
                      <p className="text-right font-semibold text-primary-color">
                        정말로 종료하시겠습니까?
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="mb-3 text-xl font-bold text-primary-color">
                        라이브 퇴장 전 확인
                      </h2>
                      {lastNotification?.type === 'LIVE_END' ? (
                        <>
                          <p className="mb-2">
                            라이브를 퇴장하기 전,{' '}
                            <strong className="text-primary-color">AI 비교 버튼</strong>을 누르면
                            본인의 현재 이미지가 AI 비교 페이지에 업로드되어 강사의 그림과{' '}
                            <span className="font-semibold text-primary-color">
                              얼마나 유사한지{' '}
                            </span>
                            비교를 받아보실 수 있습니다.
                          </p>
                          <p className="mb-2">
                            종료 후,{' '}
                            <span className="font-semibold text-primary-color">
                              강사의 최종 완성 이미지
                            </span>
                            가{' '}
                            <span className="font-semibold text-primary-color">
                              다시보기 페이지
                            </span>
                            에 업로드되니 다시{' '}
                            <span className="font-semibold text-primary-color">강사의 그림</span>을
                            따라 그려보고 싶다면, 꼭 이용해주세요!
                          </p>
                        </>
                      ) : (
                        <p className="mb-2">현재 진행 중인 라이브 방송에서 퇴장하시겠습니까?</p>
                      )}
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex gap-2">
                    {!participantUtils.isCreator(nickname) &&
                      lastNotification?.type === 'LIVE_END' && (
                        <>
                          <AlertDialogAction
                            className="bg-primary-color hover:bg-primary-color hover:opacity-90"
                            onClick={handleParticipantExportImage}
                          >
                            AI 비교
                          </AlertDialogAction>

                          <AlertDialogAction
                            className="bg-primary-color hover:bg-primary-color hover:opacity-90"
                            onClick={goReplayPage}
                          >
                            다시보기
                          </AlertDialogAction>
                        </>
                      )}
                  </div>
                  <div className="flex gap-2">
                    <AlertDialogCancel className="border-gray-border-color hover:bg-bg-gray-color">
                      취소
                    </AlertDialogCancel>

                    <AlertDialogAction
                      className="bg-primary-color hover:bg-primary-color hover:opacity-90"
                      onClick={leaveRoom}
                    >
                      {participantUtils.isCreator(nickname) ? '종료' : '퇴장'}
                    </AlertDialogAction>
                  </div>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* 채팅 토글 버튼 */}
          {!isChatVisible && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="fixed right-0 top-6 z-[1000] p-2"
            >
              <button
                className="toggle-chat-btn rounded-l-lg bg-white p-2 shadow-md hover:bg-gray-50"
                onClick={() => setIsChatVisible(true)}
              >
                <LeftArrowIcon />
              </button>
            </motion.div>
          )}

          {/* Excalidraw 컴포넌트 */}
          {participantUtils.isCreator(nickname) ? (
            <div className="excalidraw-wrapper rounded-xl border border-gray-border-color bg-white p-4">
              <Excalidraw
                onChange={(elements) => {
                  // console.log('🎨 Excalidraw onChange 이벤트 발생. 전체 요소:', elements);

                  // 이전 상태와 비교하여 삭제된 요소 찾기
                  const deletedElements = elements.filter((currentEl) => {
                    const prevEl = roomCreatorElements.find((el) => el.id === currentEl.id);
                    return prevEl && !prevEl.isDeleted && currentEl.isDeleted;
                  });
                  // console.log('🗑️ 감지된 삭제된 요소들:', deletedElements);

                  // 이전 상태와 비교하여 복원된(undo) 요소 찾기
                  const restoredElements = elements.filter((currentEl) => {
                    const prevEl = roomCreatorElements.find((el) => el.id === currentEl.id);
                    return prevEl && prevEl.isDeleted && !currentEl.isDeleted;
                  });
                  // console.log('🔄 감지된 복원된 요소들:', restoredElements);

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
                  // console.log('💾 최종 roomCreatorElements 상태:', elements);

                  // 녹화 기능
                  const newLastElement = elements[elements.length - 1];
                  if (lastElement !== newLastElement) {
                    // 녹화 업데이트
                    setLastElement(newLastElement);
                  }
                }}
                excalidrawAPI={(api) => {
                  roomCreatorAPIRef.current = api;
                }}
                viewModeEnabled={false}
                initialData={{
                  elements: roomCreatorElements,
                  appState: {
                    viewBackgroundColor: 'transparent',
                    currentItemStrokeColor: '#000000',
                    currentItemBackgroundColor: '#ffffff',
                  },
                }}
              />
            </div>
          ) : (
            <div className="flex h-[calc(100vh-50px)] flex-col">
              {/* 겹치기 토글 버튼 */}
              <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
                <button
                  onClick={() => setIsOverlayMode(!isOverlayMode)}
                  className="rounded-lg bg-primary-color px-4 py-2 text-white transition-all hover:border-none hover:opacity-90"
                >
                  {isOverlayMode ? '겹치기 해제' : '겹치기'}
                </button>
              </div>

              <div className={`relative flex-1 ${isOverlayMode ? '' : 'flex gap-2'}`}>
                {/* 내 화이트보드 */}
                <div
                  className={`
                    ${isOverlayMode ? 'absolute inset-0 z-20' : 'flex-1'}
                    ${isOverlayMode ? 'bg-transparent' : 'bg-white'} order-2
                  `}
                >
                  <div
                    className={`h-full rounded-xl border border-gray-border-color ${isOverlayMode ? 'bg-transparent' : 'bg-white'} p-4`}
                  >
                    <h3 className="mb-4 text-xl font-bold">
                      <span className="text-primary-color">내 </span>화이트보드
                    </h3>
                    <div className="h-[calc(100%-40px)]">
                      <Excalidraw
                        excalidrawAPI={(api) => {
                          participantAPIRef.current = api;
                        }}
                        initialData={{
                          appState: {
                            viewBackgroundColor: 'transparent',
                            theme: 'light',
                            scrollX: 0, // 초기 X 좌표 (스크롤 위치)
                            scrollY: 0, // 초기 Y 좌표 (스크롤 위치)
                          },
                        }}
                        UIOptions={{
                          canvasActions: {
                            changeViewBackgroundColor: false,
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 방장 화이트보드 */}
                <div
                  ref={instructorBoardRef}
                  className={`
                    ${isOverlayMode ? 'absolute inset-0 z-10' : 'flex-1'}
                    order-1 bg-transparent
                  `}
                >
                  <div className="h-full rounded-xl border border-gray-border-color bg-white p-4">
                    <h3 className={`mb-4 text-xl font-bold ${isOverlayMode ? 'invisible' : ''}`}>
                      <span className="text-primary-color">방장 </span>화이트보드
                    </h3>
                    <div className="h-[calc(100%-40px)]">
                      <Excalidraw
                        excalidrawAPI={(api) => {
                          roomCreatorAPIRef.current = api;
                        }}
                        elements={roomCreatorElements}
                        viewModeEnabled={true}
                        initialData={{
                          elements: roomCreatorElements,
                          appState: {
                            viewBackgroundColor: 'transparent',
                            currentItemStrokeColor: '#000000',
                            viewModeEnabled: true,
                            theme: 'light',
                            scrollX: 0, // 초기 X 좌표 (스크롤 위치)
                            scrollY: 0, // 초기 Y 좌표 (스크롤 위치)
                          },
                        }}
                        UIOptions={{
                          canvasActions: {
                            changeViewBackgroundColor: false,
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 투명도 조절 UI - 오버레이 모드에서만 표시 */}
                {isOverlayMode && (
                  <div className="absolute left-1/2 top-3 z-30 flex h-[50px] w-[200px] -translate-x-1/2 items-center gap-2 rounded-xl border border-gray-border-color bg-white p-4">
                    <div className="group relative flex w-full items-center justify-center rounded-xl border">
                      <div className="absolute left-3 z-10 flex items-center gap-2">
                        <OpacityIcon
                          width={22}
                          height={22}
                          fill={'#494949'}
                          className="pointer-events-none"
                        />
                      </div>
                      <input
                        type="range"
                        ref={opacityInputRef}
                        defaultValue={100}
                        min={0}
                        max={100}
                        step={1}
                        className={`
                          [&::-webkit-slider-thumb]:scale-120
                          relative m-0 h-10 w-full
                          cursor-pointer appearance-none rounded-xl p-0
                          after:absolute after:left-0 after:top-[50%]
                          after:h-10 after:w-[var(--range-progress)]
                          after:-translate-y-1/2 after:rounded-xl
                          after:bg-[#E7E7EF]
                          [&::-webkit-slider-runnable-track]:h-10
                          [&::-webkit-slider-runnable-track]:rounded-xl
                          [&::-webkit-slider-runnable-track]:bg-gradient-to-r
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:rounded-xl
                          [&::-webkit-slider-thumb]:bg-primary-color
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:hover:scale-150
                          [&::-webkit-slider-thumb]:hover:shadow-lg
                        `}
                        style={{
                          '--range-progress': `${rangeProgress}%`,
                          '--tw-gradient-from': '#E7E7EF var(--range-progress)',
                          '--tw-gradient-to': '#F4F4F4 var(--range-progress)',
                        }}
                        onChange={changeOpacity}
                      />
                      <p className="absolute right-3 z-10 text-text-gray-color opacity-0 transition-all duration-300 group-hover:opacity-100">
                        {rangeProgress}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
