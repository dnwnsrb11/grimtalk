import { useQuery } from '@tanstack/react-query';

import { _axios } from '@/api/instance';
import { Banner } from '@/components/mainPages/home/Banner';
import { Lecture } from '@/components/mainPages/home/Lecture';
import { LiveList } from '@/components/mainPages/home/LiveList';
import { PopularInstructor } from '@/components/mainPages/home/PopularInstructor';

export const MainPage = () => {
  // const [LiveLists, setLiveLists] = useState([]);
  // const [count, setCount] = useState([1, 2, 3, 4]);
  const count = [1, 2, 3, 4];

  // 인기 강의 조회
  const { data: popularLectures, isLoading: isLecturesLoading } = useQuery({
    queryKey: ['popularLectures'],
    queryFn: async () => {
      const { data } = await _axios.get(`/home/popular-lecture`);

      return data.body.data.list;
    },
  });

  // 인기 강사 조회
  const { data: popularInstructors, isLoading: isInstructorLoading } = useQuery({
    queryKey: ['popularInstructors'],
    queryFn: async () => {
      const { data } = await _axios.get(`/home/popular-instructor`);
      // console.log(data.body.data.list);
      return data.body.data.list;
    },
  });

  return (
    <>
      <div className="mt-10">
        <div>
          <h2 className="text-2xl font-bold">
            인기 있는 <span className="text-primary-color">라이브</span>
          </h2>
          <div className="mt-3 flex gap-3">
            {count.map((c, index) => (
              <LiveList key={index} />
            ))}
          </div>
        </div>
        <div className="mt-[60px]">
          <Banner />
        </div>
        <div className="mb-[15px] mt-[60px] flex  gap-4">
          <div className="w-[50%] ">
            <h2 className="mb-[15px] text-2xl font-bold">
              <span className="text-primary-color">인기</span> 강사
            </h2>
            <div className="relative flex flex-col gap-4">
              {popularInstructors && popularInstructors.length > 0 ? (
                popularInstructors.map((instroductor, index) => (
                  <PopularInstructor key={index} instroductor={instroductor} />
                ))
              ) : (
                <div className="absolute ml-[25%] mt-[25%] flex items-center justify-center rounded-xl border border-gray-300 bg-gray-100 p-6 text-gray-600 shadow-md">
                  <div className="flex items-center gap-2">
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
            <div className="flex flex-col gap-4">
              <PopularInstructor />
              <PopularInstructor />
              <PopularInstructor />
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
