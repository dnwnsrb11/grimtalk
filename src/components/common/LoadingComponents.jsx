export const LoadingComponents = () => {
  return (
    <>
      <div className="flex h-[calc(100vh-50px)] w-full  items-center justify-center gap-3">
        <span className="relative box-border inline-block h-12 w-12 rounded-full border-4 border-gray-border-color after:absolute after:left-0 after:top-0 after:h-4 after:w-4 after:-translate-x-1/2 after:translate-y-1/2 after:transform after:rounded-full after:bg-red-500 after:content-[''] motion-safe:animate-[spin_1.5s_linear_infinite]"></span>
        <h2 className="text-[20px] font-medium text-text-gray-color">
          현재 <span className="font-bold text-primary-color">로딩중</span> 입니다 . . .
        </h2>
      </div>
    </>
  );
};
