export const ReplayLectureList = () => {
  return (
    <>
      <div className="flex w-full rounded-2xl border border-gray-border-color bg-bg-gray-color p-[20px]">
        <div className="w-[80%]">
          {/* 왼쪽 */}
          <div>
            <div>
              <h1 className="text-[22px] font-semibold text-text-gray-color">
                커리큘럼 1. 진짜 시작
              </h1>
              <p className="mt-[15px] text-text-gray-color">커리큘럼 테스트 작성 구역</p>
            </div>
            <div className="mt-[15px] flex gap-3">
              {/* 하단 정보 */}
              <div className="rounded-full bg-black px-[10px] py-[5px] ">
                <p className="text-[14px] font-semibold text-white">수업완료</p>
              </div>
              <div className="rounded-full bg-black px-[10px] py-[5px] ">
                <p className="text-[14px] font-semibold text-white">2025.03.01</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[20%] border-l border-gray-border-color">
          {/* 오른쪽 */}
          <div>
            <div>
              <p>강의 다시보기</p>
            </div>
            <div>
              <p>65%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
