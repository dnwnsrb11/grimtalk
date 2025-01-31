import { ResponsiveBar } from '@nivo/bar';

import { StatisticsIcon } from '@/components/common/icons';
import { BadgeInformation } from '@/components/mypage/BadgeInformation';
import { DashboardCard } from '@/components/mypage/DashboardCard';
import { DatedLectureCurriculumItem } from '@/components/mypage/DatedLectureCurriculumItem';
import { HashTaggedLectureCurriculumItem } from '@/components/mypage/HashTaggedLectureCurriculumItem';

export const InstructorDashboardSection = () => {
  // 임시 데모 데이터
  const recentLive = {
    title: '이모티콘을 배우고 싶은 당신을 위한 강의',
    image: 'https://picsum.photos/200/300', // demo image
    date: '2025-01-27',
  };

  const myLectureList = [
    {
      title: '이모티콘을 배우고 싶은 당신을 위한 강의',
      image: 'https://picsum.photos/200/300', // demo image
      hashTags: ['일러스트', '신입환영'],
    },
    {
      title: '이모티콘을 배우고 싶은 당신을 위한 강의',
      image: 'https://picsum.photos/200/300', // demo image
      hashTags: ['일러스트', '신입환영'],
    },
    {
      title: '이모티콘을 배우고 싶은 당신을 위한 강의',
      image: 'https://picsum.photos/200/300', // demo image
      hashTags: ['일러스트', '신입환영'],
    },
  ];

  const subscribeNumber = 2;

  const nickname = '우준규';

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

  const mostViewedLive = '이모티콘을 배우고 싶은 당신을 위한 강의';

  return (
    <div className="grid grid-rows-[2fr_1fr_2fr] gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-rows-2 gap-3">
          <DashboardCard title="최근 나의 라이브">
            <DatedLectureCurriculumItem
              title={recentLive.title}
              image={recentLive.image}
              date={recentLive.date}
            />
          </DashboardCard>
          <DashboardCard title="총 구독자 수" subtitle="강사님의 전체 구독자 수입니다.">
            <div className="flex items-baseline justify-end">
              <span className="text-7xl font-bold text-primary-color">{subscribeNumber}</span>
              <span className="text-4xl font-bold text-black">명</span>
            </div>
          </DashboardCard>
        </div>
        <DashboardCard title="나의 강의" subInfo={`전체 ${myLectureList.length}`}>
          <div className="flex flex-col gap-7">
            {myLectureList.map((lecture) => (
              <HashTaggedLectureCurriculumItem
                key={lecture.title}
                title={lecture.title}
                hashTags={lecture.hashTags}
                image={lecture.image}
              />
            ))}
          </div>
        </DashboardCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DashboardCard>
          <BadgeInformation
            nickname={nickname}
            subscribeNumber={subscribeNumber}
            badgeWidth={65}
            badgeHeight={65}
            textSize="xl"
          />
        </DashboardCard>
        <DashboardCard>
          <div className="flex h-full w-full flex-row items-center gap-5">
            <div className="rounded-md bg-bg-gray-color p-3">
              <StatisticsIcon />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xl text-[#6E6E6E]">가장 많은 라이브 시청수를 가진 방송은</p>
              <p className="text-xl text-[#6E6E6E]">
                <span className="font-semibold text-black">{mostViewedLive}</span> 입니다!
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
      <DashboardCard title="월간 진척도" subtitle="라이브 수업 기준입니다.">
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
