import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useFavoriteRoomList, useFavoriteRoomListTop4 } from '@/api/live';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { Banner } from '@/components/mainPages/home/Banner';
import { LiveList } from '@/components/mainPages/home/LiveList';
import { useAuthStore } from '@/store/useAuthStore';
import { useLiveStore } from '@/store/useLiveStore';
import { participantUtils } from '@/utils/participantUtils';

export const MainPageLive = () => {
  const navigate = useNavigate();
  const id = useAuthStore((state) => state.userData.id);
  const isLogin = useAuthStore((state) => state.isLogin);
  const { setRoomCreator } = useLiveStore();

  const {
    data: availableLiveRooms,
    isLoading,
    error,
    refetch: refetchLiveRooms,
  } = useFavoriteRoomList(id, isLogin);

  const { data: popularLiveRooms, refetch: refetchPopularRooms } = useFavoriteRoomListTop4(
    id,
    isLogin,
  );

  // 페이지 진입시 데이터 갱신
  useEffect(() => {
    refetchLiveRooms();
    refetchPopularRooms();
  }, [refetchLiveRooms, refetchPopularRooms]);

  const handleJoinLive = async (liveRoom) => {
    // 라이브 입장 전에 최신 데이터 조회
    await Promise.all([refetchLiveRooms(), refetchPopularRooms()]);
    const updatedRoom = [...(availableLiveRooms || []), ...(popularLiveRooms || [])].find(
      (room) => room.curriculumId === liveRoom.curriculumId,
    );

    if (!isLogin) {
      navigate('/login');
      toast.error('로그인 후 이용해주세요.');
      return;
    }

    if (isLogin && !updatedRoom?.favorite) {
      toast('즐겨찾기 후 라이브에 참여할 수 있습니다.', {
        icon: '💡',
      });
      navigate(`/lecture/${liveRoom.lectureId}`);
      return;
    }

    try {
      localStorage.setItem(
        'roomCreator',
        participantUtils.removeTokenPrefix(liveRoom.instructorName),
      );
      setRoomCreator(participantUtils.removeTokenPrefix(liveRoom.instructorName));
      navigate(`/live/${liveRoom.curriculumName}`, {
        state: {
          curriculumId: liveRoom.curriculumId,
        },
      });
    } catch (error) {
      toast.error('방 참여에 실패했습니다.');
    }
  };

  const handleLectureClick = (lectureId) => {
    navigate(`/lecture/${lectureId}`);
  };

  useEffect(() => {
    if (error || (availableLiveRooms?.body?.code && availableLiveRooms.body.code !== 200)) {
      navigate('/notfound');
    }
  }, [error, availableLiveRooms, navigate]);

  if (isLoading) return <LoadingComponents />;

  return (
    <div className="mt-10">
      <Banner />
      <div className="mt-[50px]">
        <h2 className="mb-[15px] text-2xl font-bold">
          인기 있는 <span className="text-primary-color">라이브</span>
        </h2>
        <div className="mb-[50px] flex gap-3">
          {!popularLiveRooms || popularLiveRooms.length === 0 ? (
            <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-50">
              <p className="text-lg font-medium text-gray-500">
                현재 진행중인 인기 라이브가 없습니다.
              </p>
            </div>
          ) : (
            popularLiveRooms.map((liveRoom, index) => (
              <div
                key={index}
                className="mb-[40px] w-[calc(25%_-_0.75rem)]"
                onClick={() => handleJoinLive(liveRoom)}
              >
                <LiveList
                  LiveRoom={liveRoom}
                  onJoinClick={() => handleJoinLive(liveRoom)}
                  onLectureClick={handleLectureClick}
                />
              </div>
            ))
          )}
        </div>
      </div>
      <hr className="border-[#ACACAC]" />
      <div>
        <div className="mt-[50px]">
          <h2 className="mb-[15px] text-2xl font-bold">
            전체 <span className="text-primary-color">라이브</span>
          </h2>
          <div className="mb-[50px] flex flex-wrap gap-3">
            {!availableLiveRooms || availableLiveRooms.length === 0 ? (
              <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-50">
                <p className="text-lg font-medium text-gray-500">
                  현재 진행중인 라이브가 없습니다.
                </p>
              </div>
            ) : (
              availableLiveRooms.map((liveRoom, index) => (
                <div
                  key={index}
                  className="mb-[40px] w-[calc(25%_-_0.75rem)]"
                  onClick={() => handleJoinLive(liveRoom)}
                >
                  <LiveList
                    LiveRoom={liveRoom}
                    onJoinClick={() => handleJoinLive(liveRoom)}
                    onLectureClick={handleLectureClick}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
