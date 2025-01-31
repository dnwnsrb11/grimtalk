import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RootLayout } from '@/layouts/RootLayout';
import { AiSimilarityPage } from '@/routes/pages/AiSimilarityPage';
import { AlarmPage } from '@/routes/pages/AlarmPage';
import { DemoPage } from '@/routes/pages/DemoPage';
import { LecturePage } from '@/routes/pages/LecturePage';
import { LoginPage } from '@/routes/pages/LoginPage';
import { MainPage } from '@/routes/pages/MainPage';
import { MainPageCategory } from '@/routes/pages/MainPageCategory';
import { MainPageCommunity } from '@/routes/pages/MainPageCommunity';
import { MainPageLive } from '@/routes/pages/MainPageLive';
import { MyPage } from '@/routes/pages/MyPage';
import { SignupPage } from '@/routes/pages/SignupPage';
import { SignupSuccessPage } from '@/routes/pages/SignupSuccessPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/category',
        element: <MainPageCategory />,
      },
      {
        path: '/community',
        element: <MainPageCommunity />,
      },
      {
        path: '/live',
        element: <MainPageLive />,
      },
      {
        path: '/demo',
        element: <DemoPage />,
      },
      {
        path: '/mypage',
        element: <MyPage />,
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
      {
        // path 후에 /:id를 붙이면 id라는 파라미터를 받을 수 있음 아직 미구현.
        path: '/alarm',
        element: <AlarmPage />,
      },
      {
        path: '/lecture',
        element: <LecturePage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
