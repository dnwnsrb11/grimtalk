export const QuestionLectureCard = (isActive) => {
  return (
    <>
      <div className="rounded-2xl border border-gray-border-color px-[20px] py-[15px]">
        <div>
          {/* 왼쪽 */}
          <div>
            <h1 className="text-[22px] font-semibold ">질문이 있습니다.</h1>
          </div>
          <div>
            <div>
              <p>이모티콘으로 부자가 되는 법</p>
            </div>
            <div>
              <p>2025.05.21</p>
            </div>
            <div>
              <p>해결</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div>
              <p>크와와와왕</p>
            </div>
          </div>
          {/* 오른쪽 */}
        </div>
      </div>
    </>
  );
};
