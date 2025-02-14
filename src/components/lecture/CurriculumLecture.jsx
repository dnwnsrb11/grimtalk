import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { CurriculumLectureCard } from '@/components/lecture/curriculum/CurriculumLectureCard';

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

  if (isLoading) {
    return <LoadingComponents />;
  }

  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">커리큘럼</h1>
        <div className="mt-[40px] flex flex-col gap-[30px]">
          {curriculums.map((curriculum, index) => (
            <CurriculumLectureCard
              key={index}
              curriculum={curriculum}
              instructorId={lecture.instructorInfo.id}
              instructorNickname={lecture.instructorInfo.nickname}
            />
          ))}
        </div>
      </div>
    </>
  );
};
