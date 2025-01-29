import { CurriculumLectureCardActive } from './curriculum/CurriculumLectureCardActive';
import { CurriculumLectureCardDeActive } from './curriculum/CurriculumLectureCardDeActive';

export const CurriculumLecture = () => {
  // 받은 값이 ture, false에 따라 출력되는 컴포넌트가 다름
  //   index 추가
  const selectListComponent = (isActive, index) => {
    if (isActive === false) {
      return <CurriculumLectureCardDeActive key={index} />;
    } else {
      return <CurriculumLectureCardActive key={index} />;
    }
  };
  // 테스트를 위한 배열 생성
  const test = [false, true, true];

  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">커리큘럼</h1>
        <div className="mt-[10px] flex flex-col gap-[30px]">
          {test.map((isActive, index) => selectListComponent(isActive, index))}
          {/* 전달 받은 값에 따라 다른 컴포넌트를 출력 */}
        </div>
      </div>
    </>
  );
};
