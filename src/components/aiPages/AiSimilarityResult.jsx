import { useEffect, useState } from 'react';

export const AiSimilarityResultPage = ({ imageSrc, similarity }) => {
  console.log(imageSrc);

  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500 transition-all duration-500'; // 초록색 (높은 유사도)
    if (percentage >= 50) return 'bg-orange-500 transition-all duration-500'; // 주황색 (중간)
    return 'bg-red-500 transition-all duration-500'; // 빨간색 (낮은 유사도)
  };
  const barColor = getBarColor(similarity); // 유사도에 맞는 색상 결정

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
        <div className="relative flex h-[83px] w-full rounded-full bg-gray-200">
          <div
            className={`flex h-[83px] rounded-full ${barColor}`}
            style={{ width: `${animatedSimilarity}%` }} // 유사도에 맞게 바 길이 조정
          ></div>
          {/* % 텍스트를 중앙 정렬 */}
          <div className="absolute inset-0 flex items-center justify-center font-bold">
            {animatedSimilarity}%
          </div>
        </div>
      </div>
    </div>
  );
};
