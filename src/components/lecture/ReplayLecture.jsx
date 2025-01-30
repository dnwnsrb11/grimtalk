import { ReplayLectureCard } from '@/components/lecture/replay/ReplayLectureCard';
import { ReplayLectureDetail } from './replay/ReplayLectureDetail';
import { useState } from 'react';

export const ReplayLecture = () => {
  // test
  const testList = ['one', 'two', 'three'];
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      {!isActive ? (
        <div className="mt-[60px]">
          <h1 className="text-[32px] font-bold">다시보기</h1>
          <div className="mt-[10px]">
            {testList.map((test, index) => (
              <div onClick={() => setIsActive(!isActive)}>
                <ReplayLectureCard key={index} test={test} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ReplayLectureDetail />
      )}
    </>
  );
};
