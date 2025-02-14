import '@/styles/live.css';

import { Excalidraw } from '@excalidraw/excalidraw';
import { LiveKitRoom } from '@livekit/components-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { InstructorLeaveLive, joinLive, leaveLive, liveApi, useLiveCount } from '@/api/live';
import { LeftArrowIcon } from '@/components/common/icons';
import { CustomChat } from '@/components/live/CustomChat';
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

  // 서비스 초기화
  const [stompService] = useState(() => new StompService(STOMP_URL));
  const [liveKitService] = useState(() => new LiveKitService(LIVEKIT_URL));

  // 상태 관리
  const [room, setRoom] = useState(null);
  const [localTrack, setLocalTrack] = useState(null);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [chatToken, setChatToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);

  // Excalidraw 관련 상태
  const [roomCreatorElements, setRoomCreatorElements] = useState([]);
  const [participantElements, setParticipantElements] = useState([]);
  const [roomCreatorExcalidrawAPI, setRoomCreatorExcalidrawAPI] = useState(null);
  const [participantExcalidrawAPI, setParticipantExcalidrawAPI] = useState(null);

  const [isOverlayMode, setIsOverlayMode] = useState(false);

  // 방 나가기 확인 상태
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

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
    try {
      // 1. STOMP 연결
      stompService.connect();
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

  // 방 나가기 함수
  const leaveRoom = useCallback(async () => {
    if (participantUtils.isCreator(nickname)) {
      await InstructorLeaveLive(curriculumId, id);
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

      const handlePopState = async () => {
        await leaveRoom();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [curriculumId, id, nickname, room, leaveRoom]);

  return (
    <div id="room" className="p-6">
      {/* 비디오 레이아웃 */}

      {/* 채팅 컴포넌트 */}
      <LiveKitRoom serverUrl={LIVEKIT_URL} token={chatToken} connect={true}>
        <CustomChat
          onLeave={handleLeaveAttempt}
          isCreator={participantUtils.isCreator(nickname)}
          isVisible={isChatVisible}
          setIsVisible={setIsChatVisible}
          curriculumSubject={curriculumSubject}
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
            <AlertDialogDescription className="text-base">
              {participantUtils.isCreator(nickname) ? (
                <>
                  <span className="text-red-500">라이브를 종료</span>하시겠습니까? 모든 참가자가
                  <span className="text-red-500"> 퇴장</span>됩니다.
                </>
              ) : (
                <>
                  <span className="text-red-500">라이브를 퇴장</span>하시겠습니까?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-border-color hover:bg-bg-gray-color">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary-color hover:bg-primary-color hover:opacity-90"
              onClick={leaveRoom}
            >
              {participantUtils.isCreator(nickname) ? '종료' : '퇴장'}
            </AlertDialogAction>
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
        <div className="excalidraw-wrapper border-gray-border-color rounded-xl border bg-white p-4">
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
        <div className="flex h-[calc(100vh-50px)] flex-col">
          {/* 겹치기 토글 버튼 */}
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => setIsOverlayMode(!isOverlayMode)}
              className="bg-primary-color rounded-lg px-4 py-2 text-white transition-all hover:border-none hover:opacity-90"
            >
              {isOverlayMode ? '겹치기 해제' : '겹치기'}
            </button>
          </div>

          {isOverlayMode ? (
            // 겹치기 모드
            <div className="relative flex-1">
              {/* 방장 화이트보드 (아래 레이어) */}
              <div className="absolute inset-0 z-0">
                <div className="border-gray-border-color h-full rounded-xl border bg-white p-4">
                  <h3 className="mb-4 text-xl font-bold">
                    <span className="text-primary-color">방장 </span>화이트보드
                  </h3>
                  <div className="h-[calc(100%-40px)]">
                    <Excalidraw
                      elements={roomCreatorElements}
                      excalidrawAPI={(api) => setRoomCreatorExcalidrawAPI(api)}
                      viewModeEnabled={true}
                    />
                  </div>
                </div>
              </div>
              {/* 내 화이트보드 (위 레이어) */}
              <div className="absolute inset-0 z-10 bg-white bg-opacity-50">
                <div className="border-gray-border-color h-full rounded-xl border bg-white p-4">
                  <h3 className="mb-4 text-xl font-bold">
                    <span className="text-primary-color">내 </span>화이트보드
                  </h3>
                  <div className="h-[calc(100%-40px)]">
                    <Excalidraw
                      elements={participantElements}
                      excalidrawAPI={(api) => setParticipantExcalidrawAPI(api)}
                      viewModeEnabled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 기본 모드
            <div className="flex h-full gap-2">
              <div className="border-gray-border-color flex-1 rounded-xl border bg-white p-4">
                <h3 className="mb-4 text-xl font-bold">
                  <span className="text-primary-color">방장 </span>화이트보드
                </h3>
                <div className="h-[calc(100%-40px)]">
                  <Excalidraw
                    elements={roomCreatorElements}
                    excalidrawAPI={(api) => setRoomCreatorExcalidrawAPI(api)}
                    viewModeEnabled={true}
                  />
                </div>
              </div>
              <div className="border-gray-border-color flex-1 rounded-xl border bg-white p-4">
                <h3 className="mb-4 text-xl font-bold">
                  <span className="text-primary-color">내 </span>화이트보드
                </h3>
                <div className="h-[calc(100%-40px)]">
                  <Excalidraw
                    elements={participantElements}
                    excalidrawAPI={(api) => setParticipantExcalidrawAPI(api)}
                    viewModeEnabled={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
