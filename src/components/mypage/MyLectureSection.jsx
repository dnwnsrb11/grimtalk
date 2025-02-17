import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { _axiosAuth } from '@/api/instance';
import { Lecture } from '@/components/mainPages/home/Lecture';
import { UpdateLectureSection } from '@/components/mypage/UpdateLectureSection';
import { MyPageContentLayout } from '@/layouts/MyPageContentLayout';

export const MyLectureSection = () => {
  // 강의 수정하기
  const [selectedLecture, setSelectedLecture] = useState(null);
  // 내 강의 목록 조회
  const { data: myLectures } = useQuery({
    queryKey: ['myLectures'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/mypage/lecture`);

      return data.body.data.list;
    },
    staleTime: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const handleUpdate = (lecture) => {
    setSelectedLecture(lecture);
    console.log(lecture);
    setIsEditing(true);
  };

  return (
    <>
      {!isEditing ? (
        <div className="grid grid-cols-3 gap-3">
          {myLectures && myLectures.length > 0 ? (
            myLectures.map((myLecture, index) => (
              <div
                key={index}
                className="group relative cursor-pointer rounded-lg border border-gray-200 p-3"
              >
                <Lecture lecture={myLecture} showStar={false} showUpdate={true} />
                <button onClick={() => handleUpdate(myLecture)}>수정</button>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">강의가 없습니다.</p>
          )}
        </div>
      ) : (
        <div className="w-full">
          {' '}
          {/* MyPageContentLayout을 감싸는 div에도 width: 100% 추가 */}
          <MyPageContentLayout
            navMenuTitle="강의 수정하기"
            children={
              <UpdateLectureSection
                onBack={() => setIsEditing(false)}
                updateLectureId={selectedLecture}
              />
            }
          />
        </div>
      )}
    </>
  );
};
