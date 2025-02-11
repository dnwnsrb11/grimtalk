// 라이브 테스트 페이지(삭제 예정)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRoomList } from '@/api/live';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { LiveKitService } from '@/services/liveKitService';
import { StompService } from '@/services/stompService';
import { useAuthStore } from '@/store/useAuthStore';
import { useLiveStore } from '@/store/useLiveStore';
import { participantUtils } from '@/utils/participantUtils';

const LIVEKIT_URL = 'wss://www.grimtalk.com:7443/';
const STOMP_URL = 'wss://www.grimtalk.com:28080/ws';

export const CreateLiveTestPage = () => {
  const navigate = useNavigate();
  const liveStore = useLiveStore();
  const { nickname = '' } = useAuthStore((state) => state.userData ?? {});
  const [testNickname, setTestNickname] = useState('');
  const [stompService] = useState(() => new StompService(STOMP_URL));
  const [liveKitService] = useState(() => new LiveKitService(LIVEKIT_URL));
  const [roomName, setRoomName] = useState('');
  const { data: availableRooms = {}, isLoading, error } = useRoomList();

  useEffect(() => {
    if (nickname) {
      setTestNickname(nickname);
    }
  }, [nickname]);

  const createRoom = async (curriculumSubject, creator) => {
    try {
      console.log('방 생성 시도:', { curriculumSubject, creator });
      localStorage.setItem('roomCreator', creator);
      liveStore.setRoomCreator(creator);
      liveStore.setRoomName(curriculumSubject);
      navigate(`/live/${curriculumSubject}`);
    } catch (error) {
      console.error('방 생성 실패:', error);
      alert(error.message || '방 생성에 실패했습니다.');
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName || !testNickname) {
      alert('방 이름과 참가자 이름을 입력해주세요.');
      return;
    }
    await createRoom(roomName, testNickname);
  };

  const handleJoinRoom = async (selectedRoom, creator) => {
    try {
      if (!selectedRoom || !testNickname) {
        alert('참가자 이름을 입력해주세요.');
        return;
      }
      localStorage.setItem('roomCreator', creator);
      liveStore.setRoomCreator(creator);
      navigate(`/live/${selectedRoom}`);
    } catch (error) {
      console.error('방 참여 중 오류 발생:', error);
      alert('방 참여에 실패했습니다.');
    }
  };

  return (
    <div className="join-container">
      <div className="join-content">
        <div className="left-panel">
          <div className="section-container">
            <h2>사용자 정보</h2>
            <div className="input-group">
              <label htmlFor="participant-name">참가자 이름</label>
              <input
                id="participant-name"
                type="text"
                value={testNickname}
                onChange={(e) => setTestNickname(e.target.value)}
                required
              />
            </div>
          </div>
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
              disabled={!roomName}
              onClick={handleCreateRoom}
            >
              방 만들기
            </button>
          </div>
        </div>

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
                      <p>방장: {participantUtils.getDisplayName(creator)}</p>
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
  );
};
