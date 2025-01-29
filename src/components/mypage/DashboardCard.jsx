export const DashboardCard = ({ title, subtitle, subInfo, children }) => {
  return (
    <div className="rounded-2xl border border-gray-border-color px-4 py-5">
      {title && (
        <div className={`flex items-center gap-2 ${!subtitle && 'mb-3'}`}>
          <p className="text-[22px] font-bold">{title}</p>
          {subInfo && (
            <p className="rounded-full bg-primary-color px-3 py-0 text-base text-white">
              {subInfo}
            </p>
          )}
        </div>
      )}
      {subtitle && (
        <p className="mb-3 truncate text-lg font-bold text-common-font-color opacity-70">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
};
