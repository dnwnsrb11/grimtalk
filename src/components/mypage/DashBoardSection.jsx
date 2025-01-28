import { useState } from 'react';
import { DashBoardCard } from '@/components/mypage/DashBoardCard';
import { RecentLectureItem } from '@/components/mypage/RecentLectureItem';
import { UpcomingLectureItem } from '@/components/mypage/UpcomingLectureItem';

export const DashBoardSection = () => {
  // 임시 데모 데이터
  const recentLecture = {
    title: '이모티콘을 배우고 싶은 당신을 위한 강의',
    image: 'https://picsum.photos/200/300', // demo image
    hashTags: ['일러스트', '신입환영'],
  };

  const upcomingLectureList = [
    {
      title: '이모티콘을 배우고 싶은 당신을 위한 강의',
      image: 'https://picsum.photos/200/300', // demo image
      date: '2025-02-01',
    },
    {
      title: '이모티콘을 배우고 싶은 당신을 위한 강의',
      image: 'https://picsum.photos/200/300', // demo image
      date: '2025-02-01',
    },
    {
      title: '이모티콘을 배우고 싶은 당신을 위한 강의',
      image: 'https://picsum.photos/200/300', // demo image
      date: '2025-02-01',
    },
  ];

  const myHighestSimilarity = 90;
  const myHighestSimilarityLectureTitle = '이모티콘을 배우고 싶은 당신을 위한 강의';

  return (
    <div className="grid grid-rows-[2fr_1fr_2fr] gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-rows-2 gap-3">
          <DashBoardCard title="최근 학습 커리큘럼">
            <RecentLectureItem
              title={recentLecture.title}
              hashTags={recentLecture.hashTags}
              image={recentLecture.image}
            />
          </DashBoardCard>
          <DashBoardCard
            title="나의 가장 높은 유사도"
            subtitle={`수업: ${myHighestSimilarityLectureTitle}`}
          >
            <div className="flex items-end justify-end">
              <span className="text-5xl font-bold text-primary-color">{myHighestSimilarity}</span>
              <span className="text-2xl font-bold text-black">%</span>
            </div>
          </DashBoardCard>
        </div>
        <DashBoardCard title="예정 커리큘럼">
          {upcomingLectureList.map((lecture) => (
            <UpcomingLectureItem
              key={lecture.title}
              title={lecture.title}
              image={lecture.image}
              date={lecture.date}
            />
          ))}
        </DashBoardCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DashBoardCard title="최근 구독한 강사"></DashBoardCard>
        <DashBoardCard title="최근 구독한 강의"></DashBoardCard>
      </div>
      <DashBoardCard title="월간 진척도"></DashBoardCard>
    </div>
  );
};
