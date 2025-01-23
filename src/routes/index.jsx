import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { DemoPage } from '@/routes/pages/DemoPage';
import { MyPage } from '@/routes/pages/MyPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/demo',
        element: <DemoPage />,
      },
      {
        path: '/mypage',
        element: <MyPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
