import { CurriculumLectureLIstActive } from './curriculum/CurriculumLectureLIstActive';
import { CurriculumLectureLIstDeactive } from './curriculum/CurriculumLectureLIstDeactive';

export const CurriculumLecture = () => {
  // 받은 값이 ture, false에 따라 출력되는 컴포넌트가 다름
  const selectListComponents = (boolean) => {
    if (boolean === false) {
      return <CurriculumLectureLIstDeactive />;
    } else {
      return <CurriculumLectureLIstActive />;
    }
  };
  // 테스트를 위한 배열 생성
  const test = [false, true, true];

  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">커리큘럼</h1>
        <div className="mt-[10px] flex flex-col gap-[30px]">
          <CurriculumLectureLIstDeactive />
          <CurriculumLectureLIstActive />
        </div>
      </div>
    </>
  );
};
