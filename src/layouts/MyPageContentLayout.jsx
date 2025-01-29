export const MyPageContentLayout = ({ navMenuTitle, children }) => {
  return (
    <>
      <div className="text-2xl font-bold">{navMenuTitle}</div>
      <hr className="w-full" />
      {children}
    </>
  );
};
