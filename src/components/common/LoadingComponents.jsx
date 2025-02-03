export const LoadingComponents = () => {
  return (
    <>
      <div className="flex items-center gap-3  w-full h-[calc(100vh-50px)] justify-center">
        <span className="w-12 h-12 border-4 border-gray-border-color rounded-full inline-block relative box-border motion-safe:animate-[spin_1.5s_linear_infinite] after:content-[''] after:absolute after:left-0 after:top-0 after:bg-red-500 after:w-4 after:h-4 after:rounded-full after:transform after:-translate-x-1/2 after:translate-y-1/2"></span>
        <h2 className="font-medium text-text-gray-color text-[20px]">
          현재 <span className="font-bold text-primary-color">로딩중</span> 입니다 . . .
        </h2>
      </div>
    </>
  );
};
