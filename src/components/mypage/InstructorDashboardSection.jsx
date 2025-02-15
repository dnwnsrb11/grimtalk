import { ResponsiveBar } from '@nivo/bar';
import { useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '@/api/instance';
import posterNoneImg from '@/assets/posterNoneImg.png';
import { StatisticsIcon } from '@/components/common/icons';
import { BadgeInformation } from '@/components/mypage/BadgeInformation';
import { DashboardCard } from '@/components/mypage/DashboardCard';
import { DatedLectureCurriculumItem } from '@/components/mypage/DatedLectureCurriculumItem';
import { HashTaggedLectureCurriculumItem } from '@/components/mypage/HashTaggedLectureCurriculumItem';

export const InstructorDashboardSection = ({ nickname }) => {
  // 조회 요청
  const { data: instructorDashboard } = useQuery({
    queryKey: ['recentLive'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/dashboard/instructor`);
      return data.body.data;
    },
    onError: () => {
      alert('에러');
    },
  });

  // 나의 최근 라이브 변수
  const myRecentLive = instructorDashboard?.myRecentLive || null;

  // 총 구독자 수 변수
  const subscribeNumber = instructorDashboard?.subscribeNumber || null;

  // 나의 강의 리스트 변수
  const myLectures = instructorDashboard?.myLectures || [];

  // 시청자가 가장 많이 본 라이브 변수
  const totalLectureElement = instructorDashboard?.totalLectureElement || null;

  // 진척도 변수
  const monthlyProgress = instructorDashboard?.monthlyProgress?.liveCounts || [];

  return (
    <div className="grid grid-rows-[2fr_1fr_2fr] gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-rows-2 gap-3">
          <DashboardCard title="최근 나의 라이브">
            {myRecentLive ? (
              <DatedLectureCurriculumItem
                title={myRecentLive}
                image={myRecentLive?.image || posterNoneImg}
                date={myRecentLive}
              />
            ) : (
              <div className="py-4 pt-[6%] text-center text-gray-500">최근 라이브가 없습니다.</div>
            )}
          </DashboardCard>

          <DashboardCard title="총 구독자 수" subtitle="강사님의 전체 구독자 수입니다.">
            {subscribeNumber ? (
              <div className="flex items-baseline justify-end">
                <span className="text-7xl font-bold text-primary-color">{subscribeNumber}</span>
                <span className="text-4xl font-bold text-black"> 명</span>
              </div>
            ) : (
              <div className="py-4 pt-[4%] text-center text-gray-500">구독자가 없습니다.</div>
            )}
          </DashboardCard>
        </div>
        <DashboardCard title="나의 강의" subInfo={`전체 ${myLectures?.length || 0}`}>
          {myLectures?.length > 0 ? (
            <div className="flex flex-col gap-7">
              {myLectures.map((lecture) => (
                <HashTaggedLectureCurriculumItem
                  key={lecture.subject}
                  title={lecture.subject}
                  hashTags={lecture.hashtags}
                  image={lecture.image}
                  id={lecture.lectureId}
                />
              ))}
            </div>
          ) : (
            <div className="py-4 pt-[25%] text-center text-gray-500">등록된 강의가 없습니다.</div>
          )}
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
              {totalLectureElement ? (
                <>
                  <p className="text-xl text-[#6E6E6E]">가장 많은 라이브 시청수를 가진 방송은</p>
                  <p className="text-xl text-[#6E6E6E]">
                    <span className="font-semibold text-black">{totalLectureElement}</span> 명
                    입니다!
                  </p>
                </>
              ) : (
                <p className="text-xl text-gray-500">라이브 시청 기록이 없습니다.</p>
              )}
            </div>
          </div>
        </DashboardCard>
      </div>
      <DashboardCard title="월간 진척도" subtitle="라이브 수업 기준입니다.">
        {monthlyProgress?.length > 0 ? (
          <div className="h-[250px]">
            <ResponsiveBar
              // 차트 데이터 (변환된 형식)
              data={monthlyProgress.map(({ yearMonth, liveCount }) => ({
                month: yearMonth,
                count: liveCount,
              }))}
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
        ) : (
          <div className="py-4 text-center text-gray-500">월간 진척도 데이터가 없습니다.</div>
        )}
      </DashboardCard>
    </div>
  );
};
