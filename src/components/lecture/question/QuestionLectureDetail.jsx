export const QuestionLectureDetail = ({ setIsActive, testData }) => {
  const changeActive = () => {
    setIsActive(false);
  };
  return (
    <>
      <div className="mt-[60px] min-h-[200px]">
        <h1 className="text-[32px] font-bold">공지사항 입니다!!</h1>
        <div className="mt-[10px]">
          <p className="text-[18px]">hello</p>
        </div>
      </div>
      <hr />
      <div className="mt-[20px]">
        <div className="flex gap-3">
          <h1 className="text-[32px] font-bold">답변</h1>
          <div className="flex items-center justify-center rounded-full bg-primary-color px-[15px] py-0">
            <p className="font-semibold text-[14p] text-white">답변완료</p>
          </div>
        </div>
        <div className="mt-[10px] min-h-[100px]">
          <p className="text-[18px]">hello</p>
        </div>
      </div>
      <hr />
      <div className="mt-[20px] flex justify-end">
        <button
          className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={() => changeActive()}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>
      </div>
    </>
  );
};
