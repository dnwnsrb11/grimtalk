import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <div className="mx-auto grid max-w-[1920px] grid-cols-14 gap-4 px-4">
      <Outlet />
    </div>
  );
};
