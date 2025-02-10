export const ReplayWorkList = ({ element }) => {
  return (
    <>
      <div className="border p-10">
        <p>{element.strokeColor}</p>
        <div className="h-1 w-1" style={{ background: element.strokeColor }} />
      </div>
    </>
  );
};
