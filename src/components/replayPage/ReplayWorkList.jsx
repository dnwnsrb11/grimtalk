export const ReplayWorkList = ({ data }) => {
  return (
    <>
      <div className="flex items-center gap-2 rounded-xl border border-gray-border-color bg-white/30 px-[10px] py-[5px] backdrop-blur-sm">
        <div className="h-2 w-2 rounded-full" style={{ background: data.element.strokeColor }} />
        <p className="text-text-gray-color">{data.element.strokeColor}</p>
        <span className="text-gray-border-color">|</span>
        <p className="text-text-gray-color">{data.time / 10} 초</p>
      </div>
    </>
  );
};
