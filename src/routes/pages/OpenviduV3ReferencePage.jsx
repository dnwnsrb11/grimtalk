import '@/styles/live.css';

import { Excalidraw } from '@excalidraw/excalidraw';
import { LiveKitRoom } from '@livekit/components-react';
import { useCallback, useEffect, useState } from 'react';

import { liveApi, useRoomList } from '@/api/live';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { AudioComponent } from '@/components/live/AudioComponent';
import { CustomChat } from '@/components/live/CustomChat';
import { VideoComponent } from '@/components/live/VideoComponent';
import { LiveKitService } from '@/services/liveKitService';
import { StompService } from '@/services/stompService';
import { useLiveStore } from '@/store/useLiveStore';
import { participantUtils, TOKEN_TYPES } from '@/utils/participantUtils';
// 트랙 정보를 저장하기 위한 타입 정의
// trackPublication: 원격 트랙 정보를 담고 있는 객체
// participantIdentity: 참가자의 고유 식별자

// 서버 URL 설정
// LIVEKIT_URL: WebRTC 연결을 위한 LiveKit 서버 주소
// STOMP_URL: Excalidraw 기능을 위한 STOMP 서버 주소
const LIVEKIT_URL = 'wss://www.grimtalk.com:7443/';
const STOMP_URL = 'wss://www.grimtalk.com:28080/ws';

// 라이브 페이지의 주요 기능:
// 1. 방 생성/참여 기능
// 2. 실시간 화상 통화 기능
// 3. 실시간 채팅 기능
// 4. 화이트보드 공유 기능

export const OpenviduV3ReferencePage = () => {
  const liveStore = useLiveStore();
  const [stompService] = useState(() => new StompService(STOMP_URL));
  const [liveKitService] = useState(() => new LiveKitService(LIVEKIT_URL));

  const [room, setRoom] = useState(''); // 현재 접속한 방 정보
  const [localTrack, setLocalTrack] = useState('');

  const [remoteTracks, setRemoteTracks] = useState([]); // 원격 참가자들의 트랙 정보

  // 참가자 이름 - 랜덤 번호를 붙여서 생성(추후 userData.nickname 값으로 변경 예정)
  const [participantName, setParticipantName] = useState(
    'Participant' + Math.floor(Math.random() * 100),
  );

  // 추후 강의 이름 혹은 random 값으로 받아올 예정
  const [roomName, setRoomName] = useState('test'); // 현재 방 이름

  const { data: availableRooms = {}, isLoading, error } = useRoomList();

  // 방장 정보는 로컬 스토리지에서 관리
  const [roomCreator, setRoomCreator] = useState('');

  // 각각의 기능별 토큰 상태 관리
  const [rtcToken, setRtcToken] = useState(''); // 비디오/오디오 스트리밍용 토큰
  const [chatToken, setChatToken] = useState(''); // 채팅 기능용 토큰

  // Excalidraw 관련 상태 추가
  const [roomCreatorElements, setRoomCreatorElements] = useState([]);
  const [participantElements, setParticipantElements] = useState([]);
  const [roomCreatorExcalidrawAPI, setRoomCreatorExcalidrawAPI] = useState(null);
  const [participantExcalidrawAPI, setParticipantExcalidrawAPI] = useState(null);

  // STOMP 클라이언트 설정
  const [isConnected, setIsConnected] = useState(false);

  // LiveKitService 이벤트 리스너 설정
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
        onTrackUnsubscribed: (track, publication) => {
          setRemoteTracks((prev) =>
            prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid),
          );
        },
      });
    }
  }, [liveKitService]);

  // 화이트보드 업데이트 함수
  const updateBoard = useCallback(
    (elements, boardType) => {
      if (stompService?.active && isConnected) {
        try {
          stompService.publish({
            destination: `/sub/receive/${roomName}`,
            body: JSON.stringify({
              type: 'excalidraw',
              boardType: boardType,
              elements: elements,
              sender: participantName,
            }),
          });
        } catch (error) {
          // console.error('Failed to send Excalidraw data:', error);
          alert('에러발생');
        }
      }
    },
    [stompService, isConnected, participantName],
  );

  // STOMP 구독 설정
  useEffect(() => {
    if (stompService && isConnected) {
      const subscription = stompService.subscribe(`/pub/receive/${roomName}`, (message) => {
        const data = JSON.parse(message.body);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [roomName]);

  // 방 나가기 함수
  async function leaveRoom() {
    await room?.disconnect(); // 방 연결 해제
    localStorage.removeItem('roomCreator'); // 방장 정보 삭제
    setRoomCreator(null);
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]); // 모든 상태 초기화
  }

  // TODO: 라이브 종료 함수(백엔드에서 라이브 종료 요청 로직 추가 필요)
  async function endLive() {}

  // 방 생성 함수
  const createRoom = async (curriculumSubject, creator) => {
    try {
      // 1. STOMP 연결 (화이트보드용)
      stompService.connect();
      liveStore.setRoomName(curriculumSubject);

      // 2. 토큰 발급 (채팅용, 화상통화용)
      const [chatToken, rtcToken] = await Promise.all([
        liveApi.getInstructorToken(
          curriculumSubject,
          participantUtils.getTokenParticipantName(creator, TOKEN_TYPES.CHAT),
        ),
        liveApi.getInstructorToken(
          curriculumSubject,
          participantUtils.getTokenParticipantName(creator, TOKEN_TYPES.RTC),
        ),
      ]);

      // 3. LiveKit 방 연결
      const newRoom = await liveKitService.connect(rtcToken);
      liveStore.setRoom(newRoom);
      setRoom(newRoom);

      // 4. 미디어 활성화 (카메라/마이크)
      const localTrack = await liveKitService.enableMedia();
      liveStore.setLocalTrack(localTrack);
      setLocalTrack(localTrack); // 로컬 상태도 업데이트

      // 5. 방장 정보 저장
      localStorage.setItem('roomCreator', creator);
      liveStore.setRoomCreator(creator);
      setRoomCreator(creator);

      // 토큰 저장
      liveStore.setTokens(rtcToken, chatToken);
      setChatToken(chatToken);
      setRtcToken(rtcToken);
    } catch (error) {
      await leaveRoom();
    }
  };

  // 방 생성 핸들러
  const handleCreateRoom = async (selectedRoom, creator) => {
    try {
      // 방 이름 유효성 검사
      if (!selectedRoom || !creator) {
        alert('방 이름과 참가자 이름을 입력해주세요.');
        return;
      }

      // // 이미 존재하는 방인지 확인
      // if (Object.keys(availableRooms).includes(selectedRoom)) {
      //   alert('이미 존재하는 방 이름입니다.');
      //   return;
      // }

      await createRoom(selectedRoom, creator);

      // 방 생성 성공 메시지
    } catch (error) {
      alert('방 생성에 실패했습니다.');
    }
  };

  // 방 참여 함수
  async function joinRoom(curriculumSubject, creator) {
    try {
      // 1. STOMP 연결 (화이트보드용)
      stompService.connect();
      liveStore.setRoomName(curriculumSubject);
      setRoomName(curriculumSubject);

      // 2. 토큰 발급 (채팅용, 화상통화용)
      const [rtcToken, chatToken] = await Promise.all([
        liveApi.getStudentToken(
          curriculumSubject,
          participantUtils.getTokenParticipantName(participantName, TOKEN_TYPES.RTC),
        ),
        liveApi.getStudentToken(
          curriculumSubject,
          participantUtils.getTokenParticipantName(participantName, TOKEN_TYPES.CHAT),
        ),
      ]);

      // 3. LiveKit 방 연결
      const newRoom = await liveKitService.connect(rtcToken);
      liveStore.setRoom(newRoom);
      setRoom(newRoom);

      // 4. 방장 정보 저장
      const cleanCreator = participantUtils.removeTokenPrefix(creator);
      localStorage.setItem('roomCreator', cleanCreator);
      liveStore.setRoomCreator(cleanCreator);
      setRoomCreator(cleanCreator);

      // 토큰 저장
      liveStore.setTokens(rtcToken, chatToken);
      setRtcToken(rtcToken);
      setChatToken(chatToken);
    } catch (error) {
      await leaveRoom();
      throw error;
    }
  }

  // 방 참여 핸들러
  const handleJoinRoom = async (selectedRoom, creator) => {
    try {
      // 방 이름 유효성 검사
      if (!selectedRoom || !creator) {
        alert('방 정보가 올바르지 않습니다.');
        return;
      }

      // 방 참여 시도
      await joinRoom(selectedRoom, creator);

      // 방 참여 성공 메시지
    } catch (error) {
      alert('방 참여에 실패했습니다.');
    }
  };

  return (
    <>
      {!room ? (
        <div className="join-container">
          <div className="join-content">
            {/* 왼쪽 패널: 사용자 입력 섹션 */}
            <div className="left-panel">
              {/* 사용자 정보 섹션 */}
              <div className="section-container">
                <h2>사용자 정보</h2>
                <div className="input-group">
                  <label htmlFor="participant-name">참가자 이름</label>
                  <input
                    id="participant-name"
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 방 생성 섹션 */}
              <div className="section-container">
                <h2>방 생성하기</h2>
                <div className="input-group">
                  <label htmlFor="room-name">방 이름</label>
                  <input
                    id="room-name"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="create-button"
                  type="button"
                  disabled={!roomName || !participantName}
                  onClick={() => handleCreateRoom(roomName, participantName)}
                >
                  방 만들기
                </button>
              </div>
            </div>

            {/* 오른쪽 패널: 라이브 목록 섹션 */}
            <div className="live-list-panel">
              <h2>현재 진행중인 라이브</h2>
              <div className="live-list">
                {isLoading ? (
                  <LoadingComponents />
                ) : error ? (
                  <div>방 목록을 불러오는데 실패했습니다.</div>
                ) : Object.entries(availableRooms).length === 0 ? (
                  <div>현재 진행중인 라이브가 없습니다.</div>
                ) : (
                  Object.entries(availableRooms).map(([room, creator]) => (
                    <div key={room} className="live-card">
                      <div className="live-card-content">
                        <div className="live-info">
                          <span className="live-badge">LIVE</span>
                          <h3>{room}</h3>
                          <p>방장: {participantUtils.removeTokenPrefix(creator)}</p>
                        </div>
                        <button
                          type="button"
                          className="join-button"
                          onClick={() => handleJoinRoom(room, creator)}
                        >
                          참여하기
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="room">
          <div id="room-header">
            <h2 id="room-title">{roomName}</h2>
            {participantUtils.isCreator(participantName) && (
              <button className="btn btn-large btn-danger" onClick={leaveRoom}>
                Leave Room
              </button>
            )}
          </div>
          <div id="layout-container">
            {/* 방장일 때는 자신의 비디오만 표시 */}
            {participantUtils.isCreator(participantName) && localTrack && (
              <VideoComponent
                track={localTrack}
                participantIdentity={participantName}
                local={true}
              />
            )}
            {/* 참여자일 때는 방장의 비디오만 표시 */}
            {participantUtils.isCreator(participantName) === false && remoteTracks.length > 0 && (
              <div>
                {remoteTracks
                  .filter(
                    (track) =>
                      // rtc 토큰으로 방장 트랙 필터링
                      track.participantIdentity ===
                      participantUtils.getTokenParticipantName(roomCreator, TOKEN_TYPES.RTC),
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
          {/* Excalidraw 컴포넌트 */}
          {participantUtils.isCreator(participantName) ? (
            // 방장일 경우 단일 화이트보드
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
            // 참가자일 경우 두 개의 화이트보드
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
      )}
    </>
  );
};
