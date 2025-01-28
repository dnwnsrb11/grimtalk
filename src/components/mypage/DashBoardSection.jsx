import { DashBoardCard } from '@/components/mypage/DashBoardCard';

export const DashBoardSection = () => {
  return (
    <div className="grid grid-rows-[2fr_1fr_2fr] gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-rows-2 gap-3">
          <DashBoardCard title="최근 학습 커리큘럼"></DashBoardCard>
          <DashBoardCard title="나의 가장 높은 유사도"></DashBoardCard>
        </div>
        <DashBoardCard title="예정 커리큘럼"></DashBoardCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DashBoardCard title="최근 구독한 강사"></DashBoardCard>
        <DashBoardCard title="최근 구독한 강의"></DashBoardCard>
      </div>
      <DashBoardCard title="월간 진척도"></DashBoardCard>
    </div>
  );
};
