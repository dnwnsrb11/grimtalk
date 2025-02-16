export const MyPageContentLayout = ({ navMenuTitle, navMenuSubButton, children }) => {
  // navMenuTitle: 내 강의
  // navMenuSubButton: 생성하기 버튼 & 수정하기 버튼 안줘도됨
  // children: 컴포넌트띄울것
  return (
    <>
      <div className="mt-10 flex flex-row items-center gap-2">
        <div className="text-2xl font-bold">{navMenuTitle}</div>
        {navMenuSubButton && navMenuSubButton}
      </div>
      <hr className="w-full" />

      {children}
    </>
  );
};
