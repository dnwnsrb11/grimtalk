import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { RootLayout } from '@/layouts/RootLayout';
import { AiComparePage } from '@/routes/pages/AiComparePage';
import { AiSimilarityPage } from '@/routes/pages/AiSimilarityPage';
import { AlarmPage } from '@/routes/pages/AlarmPage';
import { CreateLiveTestPage } from '@/routes/pages/CreateLiveTestPage';
import { DemoPage } from '@/routes/pages/DemoPage';
import { FindPasswordPage } from '@/routes/pages/FindPasswordPage';
import { LecturePage } from '@/routes/pages/LecturePage';
import { LivePage } from '@/routes/pages/LivePage';
import { LoginPage } from '@/routes/pages/LoginPage';
import { MainPage } from '@/routes/pages/MainPage';
import { MainPageCategory } from '@/routes/pages/MainPageCategory';
import { MainPageCommunity } from '@/routes/pages/MainPageCommunity';
import { MainPageLive } from '@/routes/pages/MainPageLive';
import { MyPage } from '@/routes/pages/MyPage';
import { NotFoundPage } from '@/routes/pages/NotFoundPage';
import { ReplayPage } from '@/routes/pages/ReplayPage';
import { SignupPage } from '@/routes/pages/SignupPage';
import { SignupSuccessPage } from '@/routes/pages/SignupSuccessPage';
const router = createBrowserRouter([
  {
    path: '/create-live-test',
    element: <CreateLiveTestPage />,
  },
  {
    path: '/live/:curriculumSubject',
    element: <LivePage />,
  },
  {
    path: '/replay/:curriculumId',
    element: <ReplayPage />,
  },
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
        path: '/mypage/:userId',
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
        path: '/lecture/:lectureId',
        element: <LecturePage />,
      },
      {
        path: '/notfound',
        element: <NotFoundPage />,
      },
      {
        path: '/aicompare',
        element: <AiComparePage />,
      },
      {
        path: '/findpassword',
        element: <FindPasswordPage />,
      },
      {
        path: '*',
        element: <Navigate to="/notfound" replace />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
