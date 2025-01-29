const QuestionActive = () => {
  return (
    <div className="rounded-full border border-gray-border-color bg-primary-color px-[15px] py-[5px]">
      <p className="text-[14px] font-semibold text-white">해결</p>
    </div>
  );
};

const QuestionDeActive = () => {
  return (
    <div className="rounded-full border border-gray-border-color bg-bg-gray-color px-[15px] py-[5px]">
      <p className="text-[14px] font-semibold text-[#AEAEAE]">미해결</p>
    </div>
  );
};

export const QuestionLectureCard = (isActive) => {
  return (
    <>
      <div className="cursor-pointer rounded-2xl border border-gray-border-color px-[20px] py-[15px]">
        <div>
          {/* 왼쪽 */}
          <div>
            <h1 className="text-[22px] font-semibold ">질문이 있습니다.</h1>
          </div>
          <div className="mt-[12px] flex justify-between">
            <div className="flex gap-2">
              <div className="rounded-full border border-gray-border-color bg-bg-gray-color px-[15px] py-[5px]">
                <p className="text-[14px] font-semibold">이모티콘으로 부자가 되는 법</p>
              </div>
              <div className="rounded-full border border-gray-border-color bg-bg-gray-color px-[15px] py-[5px]">
                <p className="text-[14px] font-semibold">2025.05.21</p>
              </div>
            </div>
            <div>
              <div>
                <div className="rounded-full border border-gray-border-color px-[15px] py-[5px]">
                  <p className="text-[14px] font-semibold">크와와와왕</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
