import '@/styles/live.css';

import { Excalidraw } from '@excalidraw/excalidraw';
import { LiveKitRoom } from '@livekit/components-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { InstructorLeaveLive, joinLive, leaveLive, liveApi } from '@/api/live';
import { LeftArrowIcon } from '@/components/common/icons';
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
  const { id, nickname } = useAuthStore((state) => state.userData);
  const { state } = useLocation();
  const curriculumId = state?.curriculumId;

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
      navigate('/create-live-test');
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
  const leaveRoom = async () => {
    if (participantUtils.isCreator(nickname)) {
      await InstructorLeaveLive(curriculumId, id);
    } else {
      await leaveLive(curriculumId, id);
    }
    room?.disconnect();
    localStorage.removeItem('roomCreator');
    liveStore.reset();
    navigate('/create-live-test');
  };

  return (
    <div id="room" className="p-6">
      {/* 비디오 레이아웃 */}
      <div
        id="layout-container"
        className="mb-6 rounded-xl border border-gray-border-color bg-white p-4"
      >
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
        <CustomChat
          onLeave={leaveRoom}
          isCreator={participantUtils.isCreator(nickname)}
          isVisible={isChatVisible}
          setIsVisible={setIsChatVisible}
          curriculumSubject={curriculumSubject}
        />
      </LiveKitRoom>

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
              setRoomCreatorElements(elements);
              updateBoard(elements, 'roomCreator');
            }}
            elements={roomCreatorElements}
            excalidrawAPI={(api) => setRoomCreatorExcalidrawAPI(api)}
            viewModeEnabled={false}
          />
        </div>
      ) : (
        <div className="whiteboard-container flex gap-6">
          <div className="excalidraw-wrapper flex-1 rounded-xl border border-gray-border-color bg-white p-4">
            <h3 className="mb-4 text-xl font-bold">
              방장 <span className="text-primary-color">화이트보드</span>
            </h3>
            <Excalidraw
              elements={roomCreatorElements}
              excalidrawAPI={(api) => setRoomCreatorExcalidrawAPI(api)}
              viewModeEnabled={true}
            />
          </div>
          <div className="excalidraw-wrapper flex-1 rounded-xl border border-gray-border-color bg-white p-4">
            <h3 className="mb-4 text-xl font-bold">
              내 <span className="text-primary-color">화이트보드</span>
            </h3>
            <Excalidraw
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
