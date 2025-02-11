export const ReplayWorkList = ({ element }) => {
  return (
    <>
      <div className="flex items-center gap-2 rounded-2xl border px-[10px] py-[5px]">
        <p>{element.strokeColor}</p>
        <div className="h-1 w-1" style={{ background: element.strokeColor }} />
      </div>
    </>
  );
};
