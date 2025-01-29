export const ReplayLectuecheckImageSimilarityButton = ({
  isActive,
  imageScore = '그림 비교하기',
}) => {
  if (isActive) {
    return (
      <div className="w-full rounded-2xl border bg-primary-color py-[10px] text-center">
        <p className="text-[18px] font-semibold text-white">{imageScore}</p>
      </div>
    );
  } else {
    return (
      <div className="w-full rounded-2xl border bg-primary-color py-[10px] text-center">
        <p className="text-[18px] font-semibold text-white">{imageScore}</p>
      </div>
    );
  }
};
