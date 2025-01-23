import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { DemoPage } from '@/routes/pages/DemoPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
