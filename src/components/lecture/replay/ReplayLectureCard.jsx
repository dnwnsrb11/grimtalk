// 강의 다시보기 버튼
// 이미지 유사도 확인 버튼
import { CheckImageSimilarityButton } from '@/components/lecture/replay/CheckImageSimilarityButton';
import { ReplayLecturePlayButton } from '@/components/lecture/replay/ReplayLecturePlayButton';
import { formatDateWithTime } from '@/utils/dateFormatter';

export const ReplayLectureCard = ({ replay, checkInstructor }) => {
  return (
    <>
      <div className="mb-[15px] flex w-full rounded-2xl border border-gray-border-color bg-bg-gray-color p-[20px]">
        <div className="w-[80%]">
          {/* 왼쪽 */}
          <div>
            <div>
              <h1 className="text-[22px] font-semibold text-text-gray-color">{replay.subject}</h1>
              <p className="mt-[15px] line-clamp-2 text-text-gray-color">{replay.content}</p>
            </div>
            <div className="mt-[15px] flex gap-3">
              {/* 하단 정보 */}
              <div className="rounded-full bg-black px-[10px] py-[5px] ">
                <p className="text-[14px] font-semibold text-white">수업완료</p>
              </div>
              <div className="rounded-full bg-black px-[10px] py-[5px] ">
                {/* common에 있는 formatDate 함수를 사용하여 출력하기 */}
                <p className="text-[14px] font-semibold text-white">
                  {formatDateWithTime(replay.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-[25px] w-[20%] border-l border-gray-border-color">
          {/* 오른쪽 */}
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-[40px]">
            <div className="w-full">
              <ReplayLecturePlayButton isActive={true} />
            </div>
            {/* 강사가 true 일때 비랜더링 */}
            {!checkInstructor && <CheckImageSimilarityButton />}
          </div>
        </div>
      </div>
    </>
  );
};
