import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/layout/Navbar';

export const RootLayout = () => {
  return (
    <>
      <div className="mx-auto grid min-h-screen max-w-[1920px] grid-cols-14 gap-4">
        <div className="col-span-2"></div>
        <div className="col-span-10">
          <header className="border-b bg-white">
            <Navbar />
          </header>
          <main>
            <Outlet />
          </main>
        </div>
        <div className="col-span-2"></div>
      </div>
    </>
  );
};
