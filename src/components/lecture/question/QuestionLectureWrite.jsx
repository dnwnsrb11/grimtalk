export const QuestionLectureWrite = ({ setIsActive }) => {
  const changeActive = () => {
    setIsActive('/');
  };
  return (
    <>
      <div>
        <div className="flex flex-col gap-[15px]">
          <input
            type="text"
            className="min-h-[60px] rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
            placeholder="질문 제목을 입려해주세요."
          />
          <textarea
            className="min-h-[300px] resize-none rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
            placeholder="질문 내용을 입력해주세요."
          ></textarea>
        </div>
        <hr className="mt-[20px] border-gray-border-color" />
        <div className="mt-[20px]">
          {/* 아래 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              className="rounded-2xl border border-gray-border-color bg-bg-gray-color px-[30px] py-[10px]"
              onClick={() => changeActive()}
            >
              <p className="text-[18px] font-semibold">뒤로가기</p>
            </button>
            <button className="rounded-2xl bg-primary-color px-[30px] py-[10px]">
              <p className="text-[18px] font-semibold text-white">수정하기</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
