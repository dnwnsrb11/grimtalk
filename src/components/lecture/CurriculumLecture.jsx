import { CurriculumLectureLIstActive } from './curriculum/CurriculumLectureLIstActive';
import { CurriculumLectureLIstDeactive } from './curriculum/CurriculumLectureLIstDeactive';

export const CurriculumLecture = () => {
  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">커리큘럼</h1>
        <div className="mt-[10px]">
          <CurriculumLectureLIstDeactive />
          <CurriculumLectureLIstActive />
        </div>
      </div>
    </>
  );
};
