import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <div className="mx-auto grid max-w-[1920px] grid-cols-14 gap-4 px-4">
      {/* 빈 요소로 2칸을 차지 */}
      <div className="col-span-2"></div>
      <main className="col-span-10">
        <Outlet />
      </main>
      {/* 빈 요소로 2칸을 차지 */}
      <div className="col-span-2"></div>
    </div>
  );
};
