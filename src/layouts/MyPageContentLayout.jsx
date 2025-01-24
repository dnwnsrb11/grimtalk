// 마이페이지 컨텐츠의 레이아웃을 담당하는 컴포넌트
export const MyPageContentLayout = ({
  navMenuTitle, // 현재 선택된 네비게이션 메뉴 제목
  navMenuContent, // 선택된 메뉴에 해당하는 컨텐츠
}) => {
  return (
    <>
      {/* 메뉴 제목 */}
      <div className="text-2xl font-bold">{navMenuTitle}</div>
      {/* 구분선 */}
      <hr className="w-full" />
      {/* 메뉴 컨텐츠 */}
      {navMenuContent}
    </>
  );
};
