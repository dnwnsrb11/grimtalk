export const LectureNoticeDetail = ({ noticeDate, setIsActive }) => {
  const changeActive = () => {
    setIsActive(false);
  };
  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">공지사항 제목목</h1>
        <div className="mt-[10px]">
          <p className="text-[18px]">ehllo</p>
        </div>
      </div>
      <hr />
      <hr className="mt-[40px] border border-divider-color" />
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
