export const QuestionLectureDetail = ({ setIsActive, testData }) => {
  const changeActive = () => {
    setIsActive(false);
  };
  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">공지사항 입니다!!</h1>
        <div className="mt-[10px]">hello</div>
      </div>
      <hr />
      <div className="mt-[60px]">
        <div>
          <h1 className="text-[32px] font-bold">답변</h1>
          <div>
            <p>답변완료</p>
          </div>
        </div>
        <div className="mt-[10px]">hello</div>
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
