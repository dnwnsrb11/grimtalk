export const DashBoardCard = ({ title, children }) => {
  return (
    <div className="rounded-2xl border border-gray-border-color px-4 py-5">
      <p className="mb-3 text-[22px] font-bold">{title}</p>
      {children}
    </div>
  );
};
