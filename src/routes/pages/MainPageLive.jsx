import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useFavoriteRoomList, useFavoriteRoomListTop4 } from '@/api/live';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { Banner } from '@/components/mainPages/home/Banner';
import { LiveList } from '@/components/mainPages/home/LiveList';
import { useAuthStore } from '@/store/useAuthStore';

export const MainPageLive = () => {
  const navigate = useNavigate();
  const id = useAuthStore((state) => state.userData.id);
  const isLogin = useAuthStore((state) => state.isLogin);

  const { data: availableLiveRooms, isLoading, error } = useFavoriteRoomList(id, isLogin);

  const { data: popularLiveRooms } = useFavoriteRoomListTop4(id, isLogin);

  const handleLiveClick = (liveRoom) => {
    if (isLogin && !liveRoom.favorite) {
      toast.error('즐겨찾기를 먼저 해주세요!');
      navigate(`/lecture/${liveRoom.lectureId}`);
      return;
    }
    // 라이브룸으로 이동하는 로직
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
                onClick={() => handleLiveClick(liveRoom)}
              >
                <LiveList LiveRoom={liveRoom} />
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
                  onClick={() => handleLiveClick(liveRoom)}
                >
                  <LiveList LiveRoom={liveRoom} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
