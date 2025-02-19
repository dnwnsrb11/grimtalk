import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { _axiosAuth } from '@/api/instance';
import { Lecture } from '@/components/mainPages/home/Lecture';
import { UpdateLectureSection } from '@/components/mypage/UpdateLectureSection';
import { MyPageContentLayout } from '@/layouts/MyPageContentLayout';

export const MyLectureSection = ({ joinId, myid }) => {
  // 강의 수정하기
  const [selectedLecture, setSelectedLecture] = useState(null);
  // 내 강의 목록 조회
  const { data: myLectures } = useQuery({
    queryKey: ['myLectures', joinId], // 🔹 joinId를 key에 추가하여 변경 감지
    queryFn: async () => {
      const url = myid === joinId ? `/mypage/lecture` : `/user/lecture/${joinId}`;
      const { data } = await _axiosAuth.get(url);

      return data.body.data.list;
    },
    staleTime: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const handleUpdate = (lecture) => {
    setSelectedLecture(lecture);

    setIsEditing(true);
  };

  return (
    <>
      {!isEditing ? (
        <div className="grid grid-cols-3 gap-3">
          {myLectures && myLectures?.length > 0 ? (
            myLectures?.map((myLecture, index) => (
              <div
                key={index}
                className="group relative cursor-pointer rounded-lg border border-gray-200 p-3"
              >
                {/* Lecture 컴포넌트 */}
                <Lecture lecture={myLecture} showStar={false} showUpdate={myid === joinId} />

                {/* 수정 버튼 (마우스를 올렸을 때만 보임) */}
                {myid === joinId && (
                  <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={() => handleUpdate(myLecture)}
                      className="absolute right-2 top-12 h-[36px] w-[80px] rounded-lg border bg-black text-sm text-white  transition-all duration-300 hover:opacity-60 hover:shadow-md"
                    >
                      수정
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">강의가 없습니다.</p>
          )}
        </div>
      ) : (
        <div className="w-full">
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
