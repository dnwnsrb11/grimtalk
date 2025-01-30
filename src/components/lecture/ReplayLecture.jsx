import { ReplayLectureCard } from '@/components/lecture/replay/ReplayLectureCard';
import { ReplayLectureDetail } from './replay/ReplayLectureDetail';
import { useState } from 'react';
import { useEffect } from 'react';

export const ReplayLecture = () => {
  // test
  const testList = ['one', 'two', 'three'];
  const [replayDate, setreplayDate] = useState('');
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    console.log('값이 변경', replayDate);
  }, [isActive, replayDate]);
  return (
    <>
      {!isActive ? (
        <div className="mt-[60px]">
          <h1 className="text-[32px] font-bold">다시보기</h1>
          <div className="mt-[10px]">
            {testList.map((test, index) => (
              <div
                key={index}
                onClick={() => {
                  setIsActive(true);
                  setreplayDate(test);
                }}
              >
                <ReplayLectureCard test={test} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ReplayLectureDetail
          isActive={isActive}
          setIsActive={setIsActive}
          replayDate={replayDate}
        />
      )}
    </>
  );
};
