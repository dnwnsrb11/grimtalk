import { useState } from 'react';

// 아이콘 가져오기
import { DefaultBadgeIcon, FavoriteIcon, SubscribeIcon } from '@/components/common/icons';
export const LectureProfile = ({ checkInstructor, lecture }) => {
  const [checkFavorite, setCheckFavorite] = useState(false);
  //   구독시 값에 따라 버튼 활성화, 비활성화 기능 구현
  const [checkSubscribe, setCheckSubscribe] = useState(false);
  return (
    <>
      <div>
        <div className="mb-[30px] mt-[60px]">
          <h2 className="text-[32px] font-bold">{lecture.subject}</h2>
        </div>
        {/* 강의 프로필 카드 구역 */}
        <div className="flex h-full gap-5">
          <div className="flex h-full w-[80%] items-center gap-[40px] rounded-3xl border border-gray-border-color px-[40px] py-[22px]">
            <div>
              {/* 프로필 이미지 */}
              <div className="relative h-[162px] w-[162px] rounded-full bg-[#565252]">
                <div className="absolute bottom-0 right-0 flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-disabled-font-color">
                  {/* 뱃지 svg로 초기화 */}
                  <DefaultBadgeIcon />
                </div>
              </div>
            </div>
            <div>
              {/* 강사 인포 */}
              <div>
                <h2 className="mb-[15px] text-[24px] font-bold">
                  {lecture.instructorInfo.nickname}
                </h2>
                {lecture.instructorInfo.intro === null ? (
                  <p className="font-medium text-text-gray-color">작성된 소개 메시지가 없습니다.</p>
                ) : (
                  <p> {lecture.instructorInfo.intro} </p>
                )}
              </div>
              <div className="mt-[15px] flex gap-3">
                {/* 버튼 */}
                <button className="rounded-xl border bg-bg-gray-color p-2 px-3 font-semibold transition-all duration-300 hover:bg-primary-color hover:text-white">
                  자세히 보기
                </button>
                {/* 강사 유무에 따라 아래 버튼을 랜더링 (false 일때 버튼을 보이게한다.) */}
                {!checkInstructor &&
                  (checkFavorite ? (
                    <button className="group flex items-center gap-2 rounded-xl border bg-primary-color p-2 px-3 font-semibold text-white transition-all duration-300 hover:bg-bg-gray-color hover:text-black">
                      <SubscribeIcon
                        className="stroke-white transition-colors duration-0 group-hover:stroke-black"
                        stroke="currentColor"
                      />
                      구독
                    </button>
                  ) : (
                    <button className="group flex items-center gap-2 rounded-xl border bg-bg-gray-color p-2 px-3 font-semibold transition-all duration-300 hover:bg-primary-color hover:text-white">
                      <SubscribeIcon
                        className="stroke-black transition-colors duration-0 group-hover:stroke-white"
                        stroke="currentColor"
                      />
                      구독
                    </button>
                  ))}
              </div>
            </div>
          </div>
          {/* 프로필 오른쪽 구역 */}
          <div className="flex w-[20%] flex-col gap-3">
            {/* 강사 유무에 따라 다른 컴포너트(버튼) 랜더링  */}
            {checkInstructor ? (
              <div className="group items-center justify-center rounded-xl border border-gray-border-color bg-primary-color py-[10px] transition-all duration-300 hover:bg-bg-gray-color">
                <button className="group flex w-[100%] items-center justify-center gap-2 text-white transition-all duration-0 group-hover:text-black">
                  <FavoriteIcon
                    className="stroke-white transition-colors duration-0 group-hover:stroke-black"
                    stroke="currentColor"
                  />
                  <p className="text-[18px] font-semibold transition-colors duration-0 group-hover:text-black">
                    강의 수정하기
                  </p>
                </button>
              </div>
            ) : // 강의 구독 여부에 따라 다른 버튼이 렌더링
            checkSubscribe ? (
              <div className="group items-center justify-center rounded-xl border border-gray-border-color bg-primary-color py-[10px] transition-all duration-300 hover:bg-bg-gray-color">
                <button className="group flex w-[100%] items-center justify-center gap-2 text-white transition-all duration-0 group-hover:text-black">
                  <FavoriteIcon
                    className="stroke-white transition-colors duration-0 group-hover:stroke-black"
                    stroke="currentColor"
                  />
                  <p className="text-[18px] font-semibold transition-colors duration-0 group-hover:text-black">
                    강의 즐겨찾기
                  </p>
                </button>
              </div>
            ) : (
              <div className="group items-center justify-center rounded-xl border border-gray-border-color bg-bg-gray-color py-[10px] transition-all duration-300 hover:bg-primary-color hover:text-white">
                <button className="flex w-[100%] items-center justify-center gap-2">
                  <FavoriteIcon
                    className="stroke-white transition-colors duration-0 group-hover:stroke-white"
                    stroke="currentColor"
                  />
                  <p className="text-[18px] font-semibold">강의 즐겨찾기</p>
                </button>
              </div>
            )}

            <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl border border-gray-border-color">
              {/* 라이브 카드 부분 */}
              <h3 className="text-[24px] font-medium text-[#565252]">2024.01.24</h3>
              <h2 className="text-[30px] font-bold">09:00</h2>
              {checkInstructor ? (
                lecture.liveId === null ? (
                  <div className="rounded-xl bg-bg-gray-color p-3 px-5 transition-all duration-200 hover:px-7">
                    <button className="font-semibold text-black">라이브 시작하기</button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-primary-color p-3 px-5 transition-all duration-200 hover:px-7">
                    <button className="font-semibold text-white">라이브 진행중</button>
                  </div>
                )
              ) : lecture.liveId === null ? (
                <div className="rounded-xl bg-bg-gray-color p-3 px-5">
                  <button className="font-semibold">라이브 시작 전 입니다.</button>
                </div>
              ) : (
                <div className="rounded-xl bg-primary-color p-3 px-5 transition-all duration-200 hover:px-7">
                  <button className="font-semibold text-white">라이브 시청하기.</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
