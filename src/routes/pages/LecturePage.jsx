import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { CurriculumLecture } from '@/components/lecture/CurriculumLecture';
import { IntroductionLecture } from '@/components/lecture/IntroductionLecture';
import { LectureBanner } from '@/components/lecture/LectureBanner';
import { LectureCategory } from '@/components/lecture/LectureCategory';
import { LectureNotice } from '@/components/lecture/LectureNotice';
import { LectureProfile } from '@/components/lecture/LectureProfile';
import { LectureQuestions } from '@/components/lecture/LectureQuestions';
import { LectureReview } from '@/components/lecture/LectureReview';
import { ReplayLecture } from '@/components/lecture/ReplayLecture';
import { useAuthStore } from '@/store/useAuthStore';

export const LecturePage = () => {
  // api 기능(강의 정보)
  const navigate = useNavigate();
  const { lectuerId } = useParams();
  // 강사 여부 체크 - 기본 값을 false로
  const [checkInstructor, setCheckInstructor] = useState(false);

  //로그인 체크를 위한 데이터
  const { id } = useAuthStore((state) => state.userData);

  const {
    data: lecture,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['lecture', lectuerId],
    queryFn: async () => {
      const { data } = await _axios.get(`/lecture/intro/${lectuerId}`);
      return data.body.data;
    },
    onError: (error) => {
      navigate('/notfound');
    },
  });

  // useEffect로 체크
  useEffect(() => {
    if (lecture && id !== undefined) {
      // id가 undefined가 아닐 때만 체크
      setCheckInstructor(id === lecture.instructorInfo.id);
    }
  }, [lecture, id]); // lecture나 id가 변경될 때마다 체크

  const [selectedCategory, setSelectedCategory] = useState('강의소개');
  //   자식으로 부터 값을 받기 위한 함수
  const handleCatagory = (childData) => {
    setSelectedCategory(childData);
  };

  // 여기에 해당하는 컴포넌트를 저장한다.
  // 자식 컴포넌트인 LectureCategory에서 값을 받아 catagory에 값을 넣어주면 값이 변경되어 아래에 다른 컴포넌트가 리랜더링 된다.
  const MENU_COMPONENTS = {
    강의소개: <IntroductionLecture lecture={lecture} />,
    다시보기: <ReplayLecture checkInstructor={checkInstructor} lecture={lecture} />,
    커리큘럼: <CurriculumLecture checkInstructor={checkInstructor} lecture={lecture} />,
    default: <p>now Testing</p>,
    공지사항: <LectureNotice checkInstructor={checkInstructor} lecture={lecture} />,
    질문사항: <LectureQuestions checkInstructor={checkInstructor} lecture={lecture} />,
    리뷰하기: <LectureReview checkInstructor={checkInstructor} lecture={lecture} />,
  };

  if (isLoading) {
    return <LoadingComponents />;
  }

  return (
    <>
      <div>
        <div>
          <LectureBanner lecture={lecture} />
        </div>
        <div>
          <LectureProfile checkInstructor={checkInstructor} lecture={lecture} />
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
