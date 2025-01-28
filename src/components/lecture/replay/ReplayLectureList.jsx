export const ReplayLectureList = () => {
  return (
    <>
      <div className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[20px]">
        <div>
          {/* 왼쪽 */}
          <div>
            <h1 className="text-[22px] font-semibold text-text-gray-color">
              커리큘럼 1. 진짜 시작
            </h1>
            <p className="mt-[15px] text-text-gray-color">커리큘럼 테스트 작성 구역</p>
          </div>
          <div>
            {/* 하단 정보 */}
            <div>
              <p>수업완료</p>
            </div>
            <div>
              <p>2025.03.01</p>
            </div>
          </div>
        </div>
        <div>
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
