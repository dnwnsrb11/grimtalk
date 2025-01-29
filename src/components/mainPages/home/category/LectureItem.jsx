import PopularIMG1 from '@/assets/banner/PopularIMG_1.svg';
import testImg from '@/assets/banner/Test/TestImg.png';
import starSVG from '@/assets/banner/star.svg';
export const LectureItem = () => {
  // 추후 score 값을 받아와서 저장할 장소
  const score = 4.4;
  return (
    <>
      <div>
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
              {/* 카테고리 섹션 */}
              <div className="inline-block rounded-full border bg-primary-color px-3 py-1 ">
                <p className=" text-white">캐릭터</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div>
            <img src={starSVG} alt="starIcon" />
          </div>
          <p className="text-text-gray-color">{score} / 5</p>
        </div>
      </div>
    </>
  );
};
