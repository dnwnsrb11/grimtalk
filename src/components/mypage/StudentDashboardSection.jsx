import { ResponsiveBar } from '@nivo/bar';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import posterNoneImg from '@/assets/posterNoneImg.png';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { DashboardCard } from '@/components/mypage/DashboardCard';
import { DatedLectureCurriculumItem } from '@/components/mypage/DatedLectureCurriculumItem';
import { HashTagChip } from '@/components/mypage/HashTagChip';
import { HashTaggedLectureCurriculumItem } from '@/components/mypage/HashTaggedLectureCurriculumItem';
export const StudentDashboardSection = ({ isActive }) => {
  const [isVisible, setIsVisible] = useState(isActive);
  // 임시 데모 데이터
  const { data: data, isLoading: recentCurriculumLoading } = useQuery({
    queryKey: ['recentCurriculum'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get('/dashboard/common');
      return data.body.data;
    },
    staleTime: 0,
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

  // 실험용
  // 실험용
  // 실험용
  const show = true;

  return (
    <div className="grid grid-rows-[2fr_1fr_2fr] gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-rows-2 gap-3">
          <AnimatePresence mode="wait">
            {recentCurriculum ? (
              <motion.div
                key="dashboard-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <DashboardCard title="최근 학습 커리큘럼">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="curriculum"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
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
                    </motion.div>
                  </AnimatePresence>
                </DashboardCard>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard-card-empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <DashboardCard title="최근 학습 커리큘럼">
                  <motion.p
                    key="no-curriculum"
                    className="flex items-center justify-center p-[10%] text-[20px]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    최근 학습한 커리큘럼이 없습니다.
                  </motion.p>
                </DashboardCard>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {similarity ? (
              <motion.div
                key="similarity-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.2 }} // 🚀 0.3초 딜레이 추가
              >
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
              </motion.div>
            ) : (
              <motion.div
                key="similarity-card-empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.2 }} // 🚀 동일한 딜레이 적용
              >
                <DashboardCard
                  title="나의 가장 높은 유사도"
                  subtitle="수업에 참여해서 유사도를 확인해보세요."
                >
                  <div className="flex items-end justify-end">
                    <span className="text-7xl font-bold text-primary-color">0</span>
                    <span className="text-4xl font-bold text-black">%</span>
                  </div>
                </DashboardCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-full w-full">
          <AnimatePresence mode="wait">
            {expectedCurriculums && expectedCurriculums.length > 0 ? (
              <motion.div
                key="expected-curriculum-list"
                className="flex h-full flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 1.0 }} // 🚀 1.0초 딜레이 적용
              >
                <DashboardCard title="예정 커리큘럼" className="flex h-full flex-col">
                  {expectedCurriculums.map((expectedCurriculum) => (
                    <DatedLectureCurriculumItem
                      key={expectedCurriculum?.subject}
                      title={expectedCurriculum?.subject}
                      image={expectedCurriculum?.image ?? null}
                      createdAt={expectedCurriculum?.createdAt}
                      expectedLiveTime={expectedCurriculum?.expectedLiveTime}
                      id={expectedCurriculum?.lectureId}
                    />
                  ))}
                </DashboardCard>
              </motion.div>
            ) : (
              <motion.div
                key="expected-curriculum-empty"
                className="flex h-full flex-col justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 1.0 }} // 🚀 동일한 딜레이 적용
              >
                <DashboardCard
                  title="예정 커리큘럼"
                  className="flex h-full flex-col justify-center"
                >
                  <p className="flex items-center justify-center p-[30%] text-[20px]">
                    예정된 강의가 없습니다.
                  </p>
                </DashboardCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <div className="grid h-[10px] grid-cols-2 gap-3">
          {/* 최근 구독한 강사 (0.6초 딜레이) */}
          <motion.div
            key="recent-instructor"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.4 }} // ✅ 0.6초 딜레이 적용
          >
            <DashboardCard title="최근 구독한 강사">
              {recentSubscribedInstructor ? (
                <button
                  className="hover:scale-95"
                  onClick={() =>
                    navigate(`/mypage/${recentSubscribedInstructor.id}`, {
                      state: {
                        joinId: recentSubscribedInstructor.id,
                        selectedMenu: '유저소개',
                        selectedProfileMenu: '강사',
                      },
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
                <motion.div
                  key="expected-curriculum-empty"
                  className="flex h-full flex-col justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 1.0 }} // 🚀 동일한 딜레이 적용
                >
                  <DashboardCard
                    title="최근 구독한 강사"
                    className="flex h-full flex-col justify-center"
                  >
                    <p className="flex items-center justify-center p-[10%] text-[20px]">
                      최근 구독한 강사가 없습니다.
                    </p>
                  </DashboardCard>
                </motion.div>
              )}
            </DashboardCard>
          </motion.div>

          {/* 최근 구독한 강의 (0.9초 딜레이) */}
          <motion.div
            key="recent-lecture"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.8 }} // ✅ 0.9초 딜레이 적용
          >
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
                <p className="flex items-center justify-center p-[10%] text-[20px]">
                  최근 즐겨찾기한 강의가 없습니다.
                </p>
              )}
            </DashboardCard>
          </motion.div>
        </div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key="monthly-progress"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, delay: 0.6 }} // 🚀 1.2초 딜레이 추가
        >
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
