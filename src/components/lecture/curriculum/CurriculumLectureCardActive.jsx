export const CurriculumLectureCardActive = ({ curriculum }) => {
  return (
    <>
      <div className="cursor-pointer rounded-2xl border border-gray-border-color bg-bg-gray-color p-[20px]">
        <div>
          {/* 제목 및 내용 */}
          <h1 className="text-[22px] font-semibold text-replay-disable-btn-font-color">
            {curriculum.subject}
          </h1>
          <div className="mt-[15px] w-[100%]">
            <p className="w-[85%] text-replay-disable-btn-font-color">{curriculum.content}</p>
          </div>
        </div>
        <div className="mt-[15px] flex gap-3">
          {/* 하단 정보  */}
          <div className="border-'gray-border-color' rounded-full border bg-black px-[10px] py-[5px]">
            <p className="text-[16px] font-semibold text-white">수업완료</p>
          </div>
        </div>
      </div>
    </>
  );
};
