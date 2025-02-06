export const CurriculumLectureCardDeActive = () => {
  return (
    <>
      <div className="cursor-pointer rounded-2xl border border-gray-border-color p-[20px]">
        <div>
          {/* 제목 및 내용 */}
          <h1 className="text-[22px] font-semibold">커리큘럼 1. 이제 시작입니다.</h1>
          <div className="mt-[15px] w-[100%]">
            <p className="w-[85%]">
              사회적 특수계급의 제도는 인정되지 아니하며, 어떠한 형태로도 이를 창설할 수 없다.
              대법원과 각급법원의 조직은 법률로 정한다. 누구든지 체포 또는 구속을 당한 때에는 즉시
              변호인의 조력을 받을 권리를 가진다. 다만, 형사피고인이 스스로 변호인을 구할 수 없을
              때에는 법률이 정하는 바에 의하여 국가가 변호인을 붙인다.
            </p>
          </div>
        </div>
        <div className="mt-[15px] flex gap-3">
          {/* 하단 정보  */}
          <div className="border-'gray-border-color' rounded-full border bg-bg-gray-color px-[10px] py-[5px]">
            <p className="text-[16px] font-semibold">수업예정</p>
          </div>
          <div className="rounded-full bg-primary-color px-[10px] py-[5px]">
            {/* common에 있는 formatDate 함수를 사용하여 출력하기 */}
            <p className="text-[16px] font-semibold text-white">2025.05.15 12:00</p>
          </div>
        </div>
      </div>
    </>
  );
};
