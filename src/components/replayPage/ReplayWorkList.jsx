export const ReplayWorkList = ({ data }) => {
  return (
    <>
      <div className="flex items-center gap-2 rounded-2xl border border-gray-border-color px-[10px] py-[5px]">
        <div className="h-2 w-2 rounded-full" style={{ background: data.element.strokeColor }} />
        <p>{data.element.strokeColor}</p>
        <span className="text-gray-border-color">|</span>
        <p className="text-text-gray-color">{data.time / 10} 초</p>
      </div>
    </>
  );
};
