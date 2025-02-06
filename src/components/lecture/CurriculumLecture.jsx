import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { CurriculumLectureCardActive } from '@/components/lecture/curriculum/CurriculumLectureCardActive';
import { CurriculumLectureCardDeActive } from '@/components/lecture/curriculum/CurriculumLectureCardDeActive';

export const CurriculumLecture = ({ checkInstructor, lecture }) => {
  const navigate = useNavigate();
  //커리큘럼 api
  const {
    data: curriculums,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['curriculums', lecture],
    queryFn: async () => {
      const { data } = await _axios.get(`/lecture/curriculum/${lecture.lectureId}`);
      return data.body.data.list;
    },
    onError: () => {
      navigate('/notfound');
    },
  });

  // 받은 값이 ture, false에 따라 출력되는 컴포넌트가 다름
  //   index 추가
  const selectListComponent = (curriculum, index) => {
    if (curriculum.status === false) {
      return <CurriculumLectureCardDeActive key={index} curriculum={curriculum} />;
    } else {
      return <CurriculumLectureCardActive key={index} curriculum={curriculum} />;
    }
  };

  if (isLoading) {
    return <LoadingComponents />;
  }

  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">커리큘럼</h1>
        <div className="mt-[40px] flex flex-col gap-[30px]">
          {curriculums.map((curriculum, index) => selectListComponent(curriculum, index))}
          {/* 전달 받은 값에 따라 다른 컴포넌트를 출력 */}
        </div>
      </div>
    </>
  );
};
