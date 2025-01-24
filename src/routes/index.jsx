import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { DemoPage } from '@/routes/pages/DemoPage';
import { MainPage } from '@/routes/pages/MainPage';
import { LoginPage } from '@/routes/pages/LoginPage';
import { SignupPage } from '@/routes/pages/SignupPage';
import { SignupSuccessPage } from '@/routes/pages/SignupSuccessPage';
import { AiSimilarityPage } from '@/routes/pages/AiSimilarityPage';
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
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/signup-success',
        element: <SignupSuccessPage />,
      },
      {
        path: '/aisimilarity',
        element: <AiSimilarityPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
