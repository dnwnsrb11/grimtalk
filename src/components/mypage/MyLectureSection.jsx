import { useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '@/api/instance';
import { Lecture } from '@/components/mainPages/home/Lecture';

export const MyLectureSection = () => {
  // 내 강의 목록 조회
  const { data: myLectures } = useQuery({
    queryKey: ['myLectures'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/mypage/lecture`);

      return data.body.data.list;
    },
  });
  return (
    <div className="grid grid-cols-3 gap-3">
      {myLectures && myLectures.length > 0 ? (
        myLectures.map((myLecture, index) => (
          <Lecture key={index} lecture={myLecture} showStar={false} showUpdate={true} />
        ))
      ) : (
        <p className="col-span-3 text-center text-gray-500">강의가 없습니다.</p>
      )}
    </div>
  );
};
