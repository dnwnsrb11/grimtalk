export const ReplayLectureDetail = ({ replayDate, setIsActive }) => {
  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">커리큘럼 1. 새로운 시작</h1>
        <p>{replayDate}</p>
        <div className="mt-[10px] flex items-center justify-center">
          <button className="rounded-2xl border bg-primary-color px-[120px] py-[20px] text-center">
            <p className="text-[18px] font-semibold text-white">다시보기</p>
          </button>
        </div>
      </div>
      <hr className="mt-[40px] border border-divider-color" />
      <div>
        <button
          className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={() => setIsActive(false)}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>
      </div>
    </>
  );
};
