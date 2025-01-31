import { CurriculumLecture } from '@/components/lecture/CurriculumLecture';
import { IntroductionLecture } from '@/components/lecture/IntroductionLecture';
import { LectureBanner } from '@/components/lecture/LectureBanner';
import { LectureCategory } from '@/components/lecture/LectureCategory';
import { LectureNotice } from '@/components/lecture/LectureNotice';
import { LectureProfile } from '@/components/lecture/LectureProfile';
import { ReplayLecture } from '@/components/lecture/ReplayLecture';
import { LectureQuestions } from '@/components/lecture/LectureQuestions';
import { useEffect } from 'react';
import { useState } from 'react';

export const LecturePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('강의소개');
  //   자식으로 부터 값을 받기 위한 함수
  const handleCatagory = (childData) => {
    setSelectedCategory(childData);
  };
  // 여기에 해당하는 컴포넌트를 저장한다.
  // 자식 컴포넌트인 LectureCategory에서 값을 받아 catagory에 값을 넣어주면 값이 변경되어 아래에 다른 컴포넌트가 리랜더링 된다.
  const MENU_COMPONENTS = {
    강의소개: <IntroductionLecture />,
    다시보기: <ReplayLecture />,
    커리큘럼: <CurriculumLecture />,
    default: <p>now Tesing</p>,
    공지사항: <LectureNotice />,
    질문사항: <LectureQuestions />,
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
          <LectureCategory
            setSelectedCategory={handleCatagory}
            selectedCategory={selectedCategory}
          />
        </div>
        <div>{MENU_COMPONENTS[selectedCategory]}</div>
      </div>
    </>
  );
};
