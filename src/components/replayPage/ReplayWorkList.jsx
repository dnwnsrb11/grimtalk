export const ReplayWorkList = ({ data }) => {
  return (
    <>
      <div className="flex items-center gap-2 rounded-2xl border px-[10px] py-[5px]">
        <p>{data.element.strokeColor}</p>
        <p>{data.time}</p>
        <div className="h-1 w-1" style={{ background: data.element.strokeColor }} />
      </div>
    </>
  );
};
