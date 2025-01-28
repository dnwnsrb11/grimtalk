export const DashBoardCard = ({ title, subtitle, children }) => {
  return (
    <div className="rounded-2xl border border-gray-border-color px-4 py-5">
      <p className={`text-[22px] font-bold ${!subtitle && 'mb-3'}`}>{title}</p>
      {subtitle && (
        <p className="mb-3 truncate text-lg font-bold text-common-font-color opacity-70">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
};
