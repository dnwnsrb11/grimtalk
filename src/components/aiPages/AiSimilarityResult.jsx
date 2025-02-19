import { useEffect, useState } from 'react';

export const AiSimilarityResultPage = ({ imageSrc, similarity }) => {
  const [animatedSimilarity, setAnimatedSimilarity] = useState(0);
  useEffect(() => {
    let interval;
    if (animatedSimilarity < similarity) {
      interval = setInterval(() => {
        setAnimatedSimilarity((prev) => {
          const nextValue = prev + 1;
          return nextValue >= similarity ? similarity : nextValue;
        });
      });
    }
    return () => clearInterval(interval);
  }, [animatedSimilarity, similarity]);
  return (
    <div className="relative mt-[90px]">
      <div className="relative mb-[60px] flex flex-row">
        {/* 첫 번째 이미지 */}
        <img
          src={imageSrc}
          alt="Uploaded Preview"
          className="mr-[30px] h-[408px] w-[674px] rounded-lg border border-gray-300 object-contain shadow-lg"
        />

        {/* 중앙에 배치되는 "분석이 완료되었습니다" */}
        <div className="absolute left-1/2 top-1/2 flex h-[106px] w-[340px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-[1px] border-solid border-[#FF5C38] bg-white px-6 py-3 text-lg font-bold shadow-md">
          분석이 완료되었습니다.
        </div>

        {/* 두 번째 이미지 */}
        <img
          src={imageSrc}
          alt="Uploaded Preview"
          className="h-[408px] w-[674px] rounded-lg border border-gray-300 object-contain shadow-lg"
        />
      </div>
      <div className="mt-4">
        <div className="relative flex h-[83px] w-full overflow-hidden rounded-full bg-gray-200">
          {/* 진행 바 */}
          <div
            className={`absolute left-0 top-0 h-full rounded-full`}
            style={{
              width: `${animatedSimilarity}%`,
              transition: `width ${animatedSimilarity * 0.02}s ease-in-out`, // ✅ 속도 조절 (3%당 0.03초)
              background: `linear-gradient(to right, #FF5C38, #FFA38F)`,
            }}
          ></div>

          {/* % 텍스트 중앙 정렬 */}
          <div className="absolute inset-0 flex items-center justify-center font-bold">
            {animatedSimilarity}%
          </div>
        </div>
      </div>
    </div>
  );
};
