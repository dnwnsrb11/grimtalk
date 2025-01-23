import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <div className="mx-auto grid min-h-screen max-w-[1920px] grid-cols-14 gap-4 px-4">
      <aside className="col-span-2" aria-hidden="true"></aside>
      <main className="col-span-10">
        <Outlet />
      </main>
      <div className="col-span-2"></div>
    </div>
  );
};
