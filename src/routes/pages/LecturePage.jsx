import { LectureBanner } from '@/components/lecture/LectureBanner';
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
        <div>{/* 탭 */}</div>
        <div>{/* 컴포넌트 구역 */}</div>
      </div>
    </>
  );
};
