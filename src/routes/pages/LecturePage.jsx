import { IntroductionLecture } from '@/components/lecture/IntroductionLecture';
import { LectureBanner } from '@/components/lecture/LectureBanner';
import { LectureCategory } from '@/components/lecture/LectureCategory';
import { LectureProfile } from '@/components/lecture/LectureProfile';
import { useState } from 'react';

export const LecturePage = () => {
  const [message, setMessage] = useState('');
  //   자식으로 부터 값을 받기 위한 함수
  const handleMessage = (childData) => {
    setMessage(childData);
    console.log(childData);
  };
  const MENU_COMPONENTS = {
    강의소개: <IntroductionLecture />,
  };
  return (
    <>
      <div>
        <div>
          <LectureBanner />
        </div>
        <div>
          <LectureProfile />
        </div>
        <div className="mt-[60px]">
          <LectureCategory sendDatetoParent={handleMessage} />
        </div>
        <div>{/* 컴포넌트 구역 */}</div>
      </div>
    </>
  );
};
