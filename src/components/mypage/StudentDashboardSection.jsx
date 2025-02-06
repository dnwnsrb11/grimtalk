import { ResponsiveBar } from '@nivo/bar';
import { useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { DashboardCard } from '@/components/mypage/DashboardCard';
import { DatedLectureCurriculumItem } from '@/components/mypage/DatedLectureCurriculumItem';
import { HashTagChip } from '@/components/mypage/HashTagChip';
import { HashTaggedLectureCurriculumItem } from '@/components/mypage/HashTaggedLectureCurriculumItem';
// import { LoadingComponents } from '@/components/common/LoadingComponents';
export const StudentDashboardSection = () => {
  // 임시 데모 데이터
  const { data: data, isLoading: recentCurriculumLoading } = useQuery({
    queryKey: ['recentCurriculum'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get('/dashboard/common');
      return data.body.data;
    },
  });

  if (recentCurriculumLoading) {
    return <LoadingComponents />;
  }
  // 최근 학습 커리큘럼
  const recentCurriculum = data?.recentCurriculum;
  // console.log(recentCurriculum.subject);

  // 예정 커리큘럼
  const expectedCurriculums = data?.expectedCurriculums;

  // 가장 높은 유사도
  const similarity = data?.similarity;

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

  // 월간 진척도 데모 데이터
  const monthlyProgressData = [
    { month: '1월', count: 13 },
    { month: '2월', count: 25 },
    { month: '3월', count: 18 },
    { month: '4월', count: 22 },
    { month: '5월', count: 30 },
    { month: '6월', count: 15 },
    { month: '7월', count: 20 },
    { month: '8월', count: 28 },
    { month: '9월', count: 19 },
    { month: '10월', count: 24 },
    { month: '11월', count: 17 },
    { month: '12월', count: 23 },
  ];

  return (
    <div className="grid grid-rows-[2fr_1fr_2fr] gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-rows-2 gap-3">
          <DashboardCard title="최근 학습 커리큘럼">
            {recentCurriculum && (
              <HashTaggedLectureCurriculumItem
                title={recentCurriculum?.subject}
                hashTags={recentCurriculum?.hashtags}
                image={recentCurriculum?.image}
              />
            )}
          </DashboardCard>
          <DashboardCard
            title="나의 가장 높은 유사도"
            subtitle={`수업: ${similarity.curriculumSubject}`}
          >
            <div className="flex items-end justify-end">
              <span className="text-7xl font-bold text-primary-color">
                {similarity.imageSimilarityPercent}
              </span>
              <span className="text-4xl font-bold text-black">%</span>
            </div>
          </DashboardCard>
        </div>
        <DashboardCard title="예정 커리큘럼">
          {expectedCurriculums.map((expectedCurriculum) => (
            <DatedLectureCurriculumItem
              key={expectedCurriculum.subject}
              title={expectedCurriculum.subject}
              image={expectedCurriculum.image}
              createdAt={expectedCurriculum.createdAt}
              expectedLiveTime={expectedCurriculum.expectedLiveTime}
            />
          ))}
        </DashboardCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DashboardCard title="최근 구독한 강사">
          <button>
            <div className="flex items-center gap-5">
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
        </DashboardCard>
        <DashboardCard title="최근 구독한 강의">
          <HashTaggedLectureCurriculumItem
            title={recentLecture.title}
            hashTags={recentLecture.hashTags}
            image={recentLecture.image}
          />
        </DashboardCard>
      </div>
      <DashboardCard title="월간 진척도" subtitle="그림 제출 기준입니다.">
        <div className="h-[250px]">
          <ResponsiveBar
            // 차트 데이터
            data={monthlyProgressData}
            // 데이터의 값을 나타내는 키
            keys={['count']}
            // x축 기준이 되는 데이터 키
            indexBy="month"
            // 차트 여백 설정
            margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
            // 막대 사이 간격
            padding={0.3}
            // y축 스케일 타입
            valueScale={{ type: 'linear' }}
            // 막대 색상
            colors="#FF5C38"
            // 막대 모서리 둥글기
            borderRadius={4}
            // x축(하단) 스타일링
            axisBottom={{
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
            }}
            // y축(좌측) 비활성화
            axisLeft={null}
            // y축 그리드 비활성화
            enableGridY={false}
            // 막대 위 라벨 비활성화
            enableLabel={false}
            // 접근성
            role="application"
            ariaLabel="월간 진척도"
            // 툴팁 커스터마이징
            tooltip={({ value, data }) => (
              <div
                style={{
                  padding: '8px',
                  background: 'white',
                  border: '1px solid #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ width: '12px', height: '12px', background: '#FF5C38' }} />
                <span>{`${data.month}: ${value}회 제출`}</span>
              </div>
            )}
            // 차트 테마 설정
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: 13,
                    fill: '#C6C6C6',
                  },
                },
              },
            }}
            layout={'vertical'}
          />
        </div>
      </DashboardCard>
    </div>
  );
};
