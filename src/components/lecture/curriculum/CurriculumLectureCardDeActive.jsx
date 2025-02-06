export const CurriculumLectureCardDeActive = ({ curriculum }) => {
  return (
    <>
      <div className="cursor-pointer rounded-2xl border border-gray-border-color p-[20px]">
        <div>
          {/* 제목 및 내용 */}
          <h1 className="text-[22px] font-semibold">{curriculum.subject}</h1>
          <div className="mt-[15px] w-[100%]">
            <p className="w-[85%]">{curriculum.subject}</p>
          </div>
        </div>
        <div className="mt-[15px] flex gap-3">
          {/* 하단 정보  */}
          <div className="border-'gray-border-color' rounded-full border bg-bg-gray-color px-[10px] py-[5px]">
            <p className="text-[16px] font-semibold">수업예정</p>
          </div>
          <div className="rounded-full bg-primary-color px-[10px] py-[5px]">
            <p className="text-[16px] font-semibold text-white">2025.05.15 12:00</p>
          </div>
        </div>
      </div>
    </>
  );
};
