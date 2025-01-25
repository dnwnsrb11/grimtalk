// 마이페이지 컨텐츠의 레이아웃을 담당하는 컴포넌트
export const MyPageContentLayout = ({
  navMenuTitle, // 현재 선택된 네비게이션 메뉴 제목
  navMenuContent, // 선택된 메뉴에 해당하는 컨텐츠
}) => {
  // 유저 소개일 때 메뉴 타이틀에 출력될 컴포넌트
  const memberInfoMenuTitleSection = (
    <div className="flex flex-row gap-3">
      <div className="text-2xl font-bold">{navMenuTitle}</div>
      <button className="rounded-lg bg-bg-gray-color px-2 py-1 text-lg">수정하기</button>
    </div>
  );

  return (
    <>
      {/* 메뉴 제목 */}
      {navMenuTitle === '유저소개' ? (
        memberInfoMenuTitleSection
      ) : (
        <div className="text-2xl font-bold">{navMenuTitle}</div>
      )}

      {/* 구분선 */}
      <hr className="w-full" />
      {/* 메뉴 컨텐츠 */}
      {navMenuContent}
    </>
  );
};
