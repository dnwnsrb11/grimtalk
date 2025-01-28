import { IntroductionLecture } from '@/components/lecture/IntroductionLecture';
import { LectureBanner } from '@/components/lecture/LectureBanner';
import { LectureCategory } from '@/components/lecture/LectureCategory';
import { LectureProfile } from '@/components/lecture/LectureProfile';
import { useEffect } from 'react';
import { useState } from 'react';

export const LecturePage = () => {
  const [catagory, setCatagory] = useState('강의소개');
  //   자식으로 부터 값을 받기 위한 함수
  const handleCatagory = (childData) => {
    setCatagory(childData);
  };
  // 여기에 해당하는 컴포넌트를 저장한다.
  // 자식 컴포넌트인 LectureCategory에서 값을 받아 catagory에 값을 넣어주면 값이 변경되어 아래에 다른 컴포넌트가 리랜더링 된다.
  const MENU_COMPONENTS = {
    강의소개: <IntroductionLecture />,
    default: <p>now Tesing</p>,
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
          <LectureCategory sendDatetoParent={handleCatagory} />
        </div>
        <div>{MENU_COMPONENTS[catagory]}</div>
      </div>
    </>
  );
};
