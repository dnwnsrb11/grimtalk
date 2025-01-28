import { DashBoardCard } from '@/components/mypage/DashBoardCard';
import { RecentLectureItem } from '@/components/mypage/RecentLectureItem';

export const DashBoardSection = () => {
  return (
    <div className="grid grid-rows-[2fr_1fr_2fr] gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-rows-2 gap-3">
          <DashBoardCard title="최근 학습 커리큘럼">
            <RecentLectureItem
              title="이모티콘을 배우고 싶은 당신을 위한 강의"
              hashTags={['일러스트', '신입환영']}
              image="https://picsum.photos/200/300" // demo image
            />
          </DashBoardCard>
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
