import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { DemoPage } from '@/routes/pages/DemoPage';
import { MainPage } from '@/routes/pages/MainPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/demo',
        element: <DemoPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
