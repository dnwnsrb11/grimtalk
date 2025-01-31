// 강의 다시보기 비활성화시 경고창
const confirmRewatch = () => {
  alert('현재 다시보기가 활성화가 안되어 있습니다.');
};

export const ReplayLecturePlayButton = (isActive) => {
  if (isActive) {
    // 강의 버튼 활성화
    return (
      <button className="w-full rounded-2xl border bg-primary-color py-[10px] text-center">
        <p className="text-[18px] font-semibold text-white">강의 다시보기</p>
      </button>
    );
  } else {
    return (
      // 강의 버튼 비활성화
      <button
        className="w-full rounded-2xl border bg-[#C1C1C1] py-[10px] text-center"
        onClick={() => confirmRewatch()}
      >
        <p className="text-[18px] font-semibold text-[#969696]">강의 다시보기</p>
      </button>
    );
  }
};
