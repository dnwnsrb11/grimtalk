import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { useFavoriteRoomListTop4 } from '@/api/live';
import { Banner } from '@/components/mainPages/home/Banner';
import { Lecture } from '@/components/mainPages/home/Lecture';
import { LiveList } from '@/components/mainPages/home/LiveList';
import { PopularInstructor } from '@/components/mainPages/home/PopularInstructor';
import { useAuthStore } from '@/store/useAuthStore';
import { useLiveStore } from '@/store/useLiveStore';
import { participantUtils } from '@/utils/participantUtils';

export const MainPage = () => {
  const navigate = useNavigate();
  const id = useAuthStore((state) => state.userData.id);
  const isLogin = useAuthStore((state) => state.isLogin);
  const { setRoomCreator } = useLiveStore();

  const {
    data: popularLiveRooms,
    isLoading,
    error,
    refetch: refetchLiveRooms,
  } = useFavoriteRoomListTop4(id, isLogin);

  // 페이지 진입시 데이터 갱신
  useEffect(() => {
    refetchLiveRooms();
  }, [refetchLiveRooms]);

  const handleJoinLive = async (liveRoom) => {
    // 라이브 입장 전에 최신 데이터 조회
    await refetchLiveRooms();
    const updatedRoom = popularLiveRooms?.find(
      (room) => room.curriculumId === liveRoom.curriculumId,
    );

    if (!isLogin) {
      navigate('/login');
      toast.error('로그인 후 이용해주세요.');
      return;
    }

    // 강사 본인의 라이브인 경우 바로 입장
    if (id === liveRoom.instructorId) {
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
        return;
      } catch (error) {
        toast.error('방 참여에 실패했습니다.');
        return;
      }
    }

    // 일반 사용자의 경우 기존 로직 유지
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

  // 인기 강의 조회
  const { data: popularLectures, isLoading: isLecturesLoading } = useQuery({
    queryKey: ['popularLectures'],
    queryFn: async () => {
      const { data } = await _axios.get(`/home/popular-lecture`);
      return data.body.data.list;
    },
  });

  // 인기 강사 조회
  const { data: popularInstructors, isLoading: isPopularInstructors } = useQuery({
    queryKey: ['popularInstructors'],
    queryFn: async () => {
      const { data } = await _axios.get(`/home/popular-instructor`);
      // console.log(data.body.data.list);
      return data.body.data.list;
    },
  });

  // 요즘 뜨는 강사 조회
  const { data: hotInstructors, isLoading: isHotInstructors } = useQuery({
    queryKey: ['hotInstructors'],
    queryFn: async () => {
      const { data } = await _axios.get(`/home/coming-instructor`);
      return data.body.data.list;
    },
  });

  return (
    <>
      <div className="mt-10">
        <div>
          <h2 className="mb-[15px] text-2xl font-bold">
            인기 있는 <span className="text-primary-color">라이브</span>
          </h2>
          <div className="flex gap-3">
            {!popularLiveRooms || popularLiveRooms.length === 0 ? (
              <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-50">
                <p className="text-lg font-medium text-gray-500">
                  현재 진행중인 인기 라이브가 없습니다.
                </p>
              </div>
            ) : (
              popularLiveRooms.map((liveRoom, index) => (
                <div key={index} className="mb-[40px] w-[calc(25%_-_0.75rem)]">
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
        <div className="mt-[30px]">
          <Banner />
        </div>
        <div className="mb-[15px] mt-[60px] flex gap-4">
          <div className="h-[50%] w-[50%]">
            <h2 className="mb-[15px] text-2xl font-bold">
              <span className="text-primary-color">인기</span> 강사
            </h2>
            <div className="flex h-[100%] flex-col gap-4">
              {popularInstructors && popularInstructors.length > 0 ? (
                popularInstructors.map((instroductor, index) => (
                  <PopularInstructor key={index} index={index} instroductor={instroductor} />
                ))
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border border-gray-300 bg-gray-100 p-6 text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z"
                      />
                    </svg>
                    <span className="text-lg font-medium">인기 강사가 없습니다. 😢</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-[50%] ">
            <h2 className="mb-[15px] text-2xl font-bold">
              요즘 <span className="text-primary-color">뜨는</span> 강사
            </h2>
            <div className="flex h-[100%] flex-col gap-4">
              {hotInstructors && hotInstructors.length > 0 ? (
                hotInstructors.map((instructor, index) => (
                  <PopularInstructor key={index} index={index} instroductor={instructor} />
                ))
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border border-gray-300 bg-gray-100 p-6 text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z"
                      />
                    </svg>
                    <span className="text-lg font-medium">요즘 뜨는 강사가 없습니다. 😢</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-[60px]">
          <h2 className="mb-[15px] text-2xl font-bold">
            <span className="text-primary-color">인기</span> 있는 강의
          </h2>
          <div className="mt-3 flex gap-3">
            {popularLectures?.map((popularLecture, index) => (
              <Lecture key={index} lecture={popularLecture} />
            ))}
            {/* {popularLecture.subject} */}
          </div>
        </div>
      </div>
    </>
  );
};
