export const MyPageContentLayout = ({ navMenuTitle, navMenuSubButton, children }) => {
  console.log(navMenuTitle);
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
