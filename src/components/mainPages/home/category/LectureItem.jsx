import starSVG from '@/assets/banner/star.svg';
import testImg from '@/assets/banner/Test/TestImg.png';

export const LectureItem = ({ isMyPage = false }) => {
  // 추후 score 값을 받아와서 저장할 장소
  const score = 4.4;
  return (
    <>
      <div className="relative">
        <div className="min-h-[160px] overflow-hidden rounded-lg">
          <img src={testImg} alt="" className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="mt-2 text-lg leading-tight">
            이모티콘을 배오고 싶은 당신을 위한 재밌는 강의
          </h4>
          <div className="mt-2 flex justify-start gap-3 ">
            <div className="flex flex-wrap items-center gap-1">
              <h4 className="mr-2 text-base font-bold">김싸피</h4>
              <div className="inline-block rounded-full border bg-bg-gray-color px-3 py-1">
                <p className="text-text-gray-color">일러스트</p>
              </div>
              <div className="inline-block rounded-full border bg-bg-gray-color px-3 py-1">
                <p className="text-text-gray-color">캐릭터</p>
              </div>
              {/* 마이페이지가 아닐 때만 카테고리 섹션 표시 */}
              {!isMyPage && (
                <div className="inline-block rounded-full border bg-primary-color px-3 py-1 ">
                  <p className=" text-white">캐릭터</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 마이페이지일 때는 별점 대신 삭제 버튼 표시 */}
        {isMyPage ? (
          <button className="mt-2 rounded-[10px] bg-bg-gray-color px-3 py-2 text-[#343434] hover:bg-red-50">
            삭제하기
          </button>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <div>
              <img src={starSVG} alt="starIcon" />
            </div>
            <p className="text-text-gray-color">{score} / 5</p>
          </div>
        )}
      </div>
    </>
  );
};
