import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { DemoPage } from '@/routes/pages/DemoPage';
import { LoginPage } from '@/routes/pages/LoginPage';
import { SignupPage } from '@/routes/pages/SignupPage';
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/demo',
        element: <DemoPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
