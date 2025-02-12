import '@/styles/live.css';

import { Excalidraw } from '@excalidraw/excalidraw';
import { LiveKitRoom } from '@livekit/components-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { joinLive, leaveLive, liveApi } from '@/api/live';
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
  const curriculumId = 1;

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
    room?.disconnect();
    localStorage.removeItem('roomCreator');
    liveStore.reset();
    navigate('/create-live-test');
    await leaveLive(curriculumId, id);
  };

  return (
    <div id="room">
      <div id="room-header">
        <h2 id="room-title">{curriculumSubject}</h2>
        <button className="btn btn-large btn-danger" onClick={leaveRoom}>
          Leave Room
        </button>
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
              excalidrawAPI={(api) => setRoomCreatorExcalidrawAPI(api)}
              viewModeEnabled={true}
            />
          </div>
          <div className="excalidraw-wrapper" style={{ flex: 1 }}>
            <h3>내 화이트보드</h3>
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
