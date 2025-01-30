import { ReplayLectureCard } from '@/components/lecture/replay/ReplayLectureCard';

export const ReplayLecture = () => {
  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">다시보기</h1>
        <div className="mt-[10px]">
          <ReplayLectureCard />
        </div>
      </div>
    </>
  );
};
