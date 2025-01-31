import { useEffect, useState } from 'react';

import { ReplayLectureCard } from '@/components/lecture/replay/ReplayLectureCard';
import { ReplayLectureDetail } from '@/components/lecture/replay/ReplayLectureDetail';

export const ReplayLecture = () => {
  // test
  const testList = ['one', 'two', 'three'];
  const [replayDate, setReplayDate] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      setIsActive(false);
    };
    if (isActive) {
      // popstate 이벤트 리스너 등록
      window.addEventListener('popstate', handlePopState);

      // 초기 상태로 히스토리를 추가하여 뒤로가기 기능을 막음
      // 이를 통해 뒤로가기 버튼을 클릭하면 isActive 값만 변경됨
      history.pushState(null, document.title);
    } else {
      // isActive가 false일 때는 popstate 이벤트 리스너 제거
      window.removeEventListener('popstate', handlePopState);
    }
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isActive]);
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
                  setReplayDate(test);
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
