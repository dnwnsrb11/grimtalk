export const MyPageContentLayout = ({ navMenuTitle, navMenuContent }) => {
  return (
    <>
      <div className="text-2xl font-bold">{navMenuTitle}</div>
      <hr className="w-full" />
      {navMenuContent}
    </>
  );
};
