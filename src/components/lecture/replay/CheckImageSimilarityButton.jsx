export const CheckImageSimilarityButton = ({ similarityPercent = '그림 비교하기' }) => {
  return (
    <button className="w-full rounded-2xl border bg-primary-color py-[10px] text-center">
      <p className="text-[18px] font-semibold text-white">{similarityPercent}</p>
    </button>
  );
};
