import { useNavigate } from 'react-router-dom';

import { useRoomList } from '@/api/live';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { Banner } from '@/components/mainPages/home/Banner';
import { LiveList } from '@/components/mainPages/home/LiveList';

export const MainPageLive = () => {
  const navigate = useNavigate();

  const { data: availableLiveRooms = {}, isLoading, error } = useRoomList();

  if (isLoading) return <LoadingComponents />;

  if (error) navigate('/notfound');

  // availableLiveRooms 객체에서 curriculumSubject와 userNickname을 나누어 새로운 배열 생성(추후 필드: 값으로 받아올 것임)
  const availableLiveRoomsArray = Object.entries(availableLiveRooms).map(
    ([curriculumSubject, participantInfo]) => {
      const userNickname = participantInfo.split(' ')[1]; // "chat", "rtc" 부분 추출
      return { curriculumSubject, userNickname };
    },
  );

  return (
    <div className="mt-10">
      <Banner />
      <div className="mt-[50px]">
        <h2 className="mb-[15px] text-2xl font-bold">
          인기 있는 <span className="text-primary-color">라이브</span>
        </h2>
        <div className="mb-[50px] flex gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <LiveList key={index} />
          ))}
        </div>
      </div>
      <hr className="border-[#ACACAC]" />
      <div>
        <div className="mt-[50px]">
          <h2 className="mb-[15px] text-2xl font-bold">
            전체 <span className="text-primary-color">라이브</span>
          </h2>
          <div className="mb-[50px] flex flex-wrap gap-3">
            {availableLiveRoomsArray.map((room, index) => (
              <div key={index} className="mb-[40px] w-[calc(25%_-_0.75rem)]">
                <LiveList
                  curriculumSubject={room.curriculumSubject}
                  instructor={room.userNickname}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
