import { DashBoardCard } from '@/components/mypage/DashBoardCard';
import { RecentLectureCurriculumItem } from '@/components/mypage/RecentLectureCurriculumItem';
import { UpcomingLectureItem } from '@/components/mypage/UpcomingLectureItem';
import { HashTagChip } from '@/components/mypage/HashTagChip';

export const DashBoardSection = () => {
  // 임시 데모 데이터
  const recentCurriculum = {
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

  const recentInstructor = {
    image: 'https://picsum.photos/200/300', // demo image
    nickname: '김싸피',
    memberTag: ['일러스트', '신입환영'],
  };

  const recentLecture = {
    title: '이모티콘을 배우고 싶은 당신을 위한 강의',
    hashTags: ['일러스트', '신입환영'],
    image: 'https://picsum.photos/200/300', // demo image
  };

  return (
    <div className="grid grid-rows-[2fr_1fr_2fr] gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-rows-2 gap-3">
          <DashBoardCard title="최근 학습 커리큘럼">
            <RecentLectureCurriculumItem
              title={recentCurriculum.title}
              hashTags={recentCurriculum.hashTags}
              image={recentCurriculum.image}
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
        <DashBoardCard title="최근 구독한 강사">
          <button>
            <div className="flex items-center gap-2">
              <img
                src={recentInstructor.image}
                alt="recent-instructor"
                className="h-[70px] w-[70px] rounded-full"
              />
              <div className="flex flex-col items-start">
                <p className="text-lg font-bold text-common-font-color">
                  {recentInstructor.nickname}
                </p>
                <div className="flex items-center gap-2">
                  {recentInstructor.memberTag.map((tag) => (
                    <HashTagChip key={tag} hashTag={tag} />
                  ))}
                </div>
              </div>
            </div>
          </button>
        </DashBoardCard>
        <DashBoardCard title="최근 구독한 강의">
          <RecentLectureCurriculumItem
            title={recentLecture.title}
            hashTags={recentLecture.hashTags}
            image={recentLecture.image}
          />
        </DashBoardCard>
      </div>
      <DashBoardCard title="월간 진척도"></DashBoardCard>
    </div>
  );
};
