import { ResponsiveBar } from '@nivo/bar';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import posterNoneImg from '@/assets/posterNoneImg.png';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { DashboardCard } from '@/components/mypage/DashboardCard';
import { DatedLectureCurriculumItem } from '@/components/mypage/DatedLectureCurriculumItem';
import { HashTagChip } from '@/components/mypage/HashTagChip';
import { HashTaggedLectureCurriculumItem } from '@/components/mypage/HashTaggedLectureCurriculumItem';
import { MyPage } from '@/routes/pages/MyPage';
export const StudentDashboardSection = ({ joinId, myid }) => {
  // 임시 데모 데이터
  const { data: data, isLoading: recentCurriculumLoading } = useQuery({
    queryKey: ['recentCurriculum'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get('/dashboard/common');
      return data.body.data;
    },
  });
  // 네비게이트 함수
  const navigate = useNavigate();

  // 로딩시 로딩페이지 출력
  if (recentCurriculumLoading) {
    return <LoadingComponents />;
  }
  // 최근 학습 커리큘럼
  const recentCurriculum = data?.recentCurriculum;

  // 예정 커리큘럼
  const expectedCurriculums = data?.expectedCurriculums;

  // 가장 높은 유사도
  const similarity = data?.similarity;

  // 최근 구독한 강사
  const recentSubscribedInstructor = data?.recentSubscribedInstructor;

  // 최근 구독한 강의
  const recentFavoriteLecture = data?.recentFavoriteLecture;

  // 월간 진척도
  const studentMonthlyProgress = data?.studentMonthlyProgress?.submissions ?? [];

  // 서버 응답을 기반으로 데이터 변환
  const monthlyProgressData = studentMonthlyProgress.map(({ yearMonth, submissionCount }) => {
    const [, month] = yearMonth.split('-'); // "2024-03" → "03"
    return {
      year: yearMonth.split('-')[0], // "2024-03" → "2024"
      month: `${parseInt(month)}월`, // "03" → "3월"
      count: submissionCount, // submissionCount 값 그대로 사용
    };
  });

  // 이미지 확장자 검사
  const isValidImage = (url) => {
    if (!url) return false;

    // 이미지 확장자 검사: jpg, jpeg, png, gif, webp, svg
    const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (!validExtensions.test(url)) return false;

    // 이미지 로딩 여부 확인 (비동기 처리 필요)
    const img = new Image();
    img.src = url;
    return img.complete && img.naturalHeight !== 0; // 이미지가 정상적으로 로드되었는지 확인
  };

  // 다른사람 아이디라면 유저소개 페이지로 랜더링 (대쉬보드창이 계속 남아있어서 수정)
  if (joinId !== myid) {
    setTimeout(() => {
      window.location.reload();
    }, 0); // 다음 이벤트 루프에서 실행되도록 함

    return <MyPage />;
  }

  return (
    <div className="grid grid-rows-[2fr_1fr_2fr] gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-rows-2 gap-3">
          <DashboardCard title="최근 학습 커리큘럼">
            {recentCurriculum ? (
              <HashTaggedLectureCurriculumItem
                title={recentCurriculum?.subject}
                hashTags={recentCurriculum?.hashtags}
                image={
                  recentCurriculum?.image && isValidImage(recentCurriculum?.image)
                    ? recentCurriculum?.image
                    : posterNoneImg
                }
                id={recentCurriculum?.lectureId}
              />
            ) : (
              <p className="mt-[85px] flex items-center justify-center text-[20px]">
                최근 학습한 커리큘럼이 없습니다.
              </p>
            )}
          </DashboardCard>

          <DashboardCard
            title="나의 가장 높은 유사도"
            subtitle={
              similarity?.curriculumSubject
                ? `수업: ${similarity?.curriculumSubject}`
                : '수업에 참여해보세요'
            }
          >
            <div className="flex items-end justify-end">
              <span className="text-7xl font-bold text-primary-color">
                {similarity?.imageSimilarityPercent !== undefined &&
                similarity?.imageSimilarityPercent !== null
                  ? similarity?.imageSimilarityPercent
                  : 'NO DATA'}
              </span>

              <span className="text-4xl font-bold text-black">%</span>
            </div>
          </DashboardCard>
        </div>
        <DashboardCard title="예정 커리큘럼">
          {expectedCurriculums && expectedCurriculums.length > 0 ? (
            expectedCurriculums.map((expectedCurriculum) => (
              <DatedLectureCurriculumItem
                key={expectedCurriculum?.subject}
                title={expectedCurriculum?.subject}
                image={expectedCurriculum?.image ?? null}
                createdAt={expectedCurriculum?.createdAt}
                expectedLiveTime={expectedCurriculum?.expectedLiveTime}
                id={expectedCurriculum?.lectureId}
              />
            ))
          ) : (
            <p className="mt-[200px] flex items-center justify-center text-[20px]">
              예정된 강의가 없습니다.
            </p>
          )}
        </DashboardCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DashboardCard title="최근 구독한 강사">
          {recentSubscribedInstructor ? (
            <button
              onClick={() =>
                navigate(`/mypage/${recentSubscribedInstructor.id}`, {
                  state: { joinId: recentSubscribedInstructor.id },
                })
              }
            >
              <div className="flex items-center gap-5">
                <img
                  src={
                    recentSubscribedInstructor.image &&
                    isValidImage(recentSubscribedInstructor.image)
                      ? recentSubscribedInstructor.image
                      : posterNoneImg
                  }
                  alt="recent-instructor"
                  className="h-[70px] w-[70px] rounded-full"
                />

                <div className="flex flex-col items-start">
                  <p className="text-lg font-bold text-common-font-color">
                    {recentSubscribedInstructor.nickname}
                  </p>
                  <div className="flex items-center gap-2">
                    {recentSubscribedInstructor.memberTags?.map((tag) => (
                      <HashTagChip key={tag} hashTag={tag} />
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <p className="mt-[85px] flex items-center justify-center text-[20px]">
              최근 구독한 강사가 없습니다.
            </p>
          )}
        </DashboardCard>
        <DashboardCard title="최근 구독한 강의">
          {recentFavoriteLecture ? (
            <HashTaggedLectureCurriculumItem
              title={recentFavoriteLecture.subject}
              hashTags={recentFavoriteLecture.hashtags}
              image={
                recentFavoriteLecture?.image && isValidImage(recentFavoriteLecture?.image)
                  ? recentFavoriteLecture?.image
                  : posterNoneImg
              }
              id={recentFavoriteLecture?.lectureId}
            />
          ) : (
            <p className="mt-[85px] flex items-center justify-center text-[20px]">
              최근 즐겨찾기한 강의가 없습니다.
            </p>
          )}
        </DashboardCard>
      </div>
      <DashboardCard title="월간 진척도" subtitle="그림 제출 기준입니다.">
        <div>{monthlyProgressData?.year}</div>
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
