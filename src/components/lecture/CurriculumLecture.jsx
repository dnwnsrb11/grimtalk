import { CurriculumLectureCardActive } from '@/components/lecture/curriculum/CurriculumLectureCardActive';
import { CurriculumLectureCardDeActive } from '@/components/lecture/curriculum/CurriculumLectureCardDeActive';

export const CurriculumLecture = ({ checkInstructor, lecture }) => {
  // 받은 값이 ture, false에 따라 출력되는 컴포넌트가 다름
  //   index 추가
  const selectListComponent = (checkInstructor, index) => {
    if (checkInstructor === false) {
      return <CurriculumLectureCardDeActive key={index} />;
    } else {
      return <CurriculumLectureCardActive key={index} />;
    }
  };

  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">커리큘럼</h1>
        <div className="mt-[40px] flex flex-col gap-[30px]">
          {lecture.map((lecture, index) => selectListComponent(lecture, index))}
          {/* 전달 받은 값에 따라 다른 컴포넌트를 출력 */}
        </div>
      </div>
    </>
  );
};
