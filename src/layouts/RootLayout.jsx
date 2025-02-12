import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export const RootLayout = () => {
  return (
    <>
      <div className="mx-auto min-h-screen max-w-[1920px]">
        <div className="sticky top-0 z-50 bg-white bg-opacity-70 backdrop-blur-sm">
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
        </div>
        <div className="grid grid-cols-14 gap-4">
          <div className="col-span-2"></div>
          <div className="col-span-10">
            <main>
              <Outlet />
            </main>
          </div>
          <div className="col-span-2"></div>
        </div>
        <footer className="mt-[100px]">
          <Footer />
        </footer>
      </div>
    </>
  );
};
