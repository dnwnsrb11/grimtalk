import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/layout/Navbar';

export const RootLayout = () => {
  return (
    <>
      <div className="mx-auto min-h-screen max-w-[1920px]">
        <div className="grid grid-cols-14 gap-4">
          <div className="col-span-2"></div>
          <div className="col-span-10">
            <header>
              <Navbar />
            </header>
          </div>
          <div className="col-span-2"></div>
        </div>
        <hr className="w-full border-gray-200" />
        <div className="grid grid-cols-14 gap-4">
          <div className="col-span-2"></div>
          <div className="col-span-10">
            <main>
              <Outlet />
            </main>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </>
  );
};
