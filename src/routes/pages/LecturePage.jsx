import { LectureBanner } from '@/components/lecture/LectureBanner';
import { LectureCategory } from '@/components/lecture/LectureCategory';
import { LectureProfile } from '@/components/lecture/LectureProfile';

export const LecturePage = () => {
  return (
    <>
      <div>
        <div>
          <LectureBanner />
        </div>
        <div>
          <LectureProfile />
        </div>
        <div>
          <LectureCategory />
        </div>
        <div>{/* 컴포넌트 구역 */}</div>
      </div>
    </>
  );
};
