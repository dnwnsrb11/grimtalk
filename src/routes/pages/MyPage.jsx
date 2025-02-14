import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { CheckBoardSection } from '@/components/mypage/CheckBoardSection';
import { CreateLectureSection } from '@/components/mypage/CreateLectureSection';
import { InstructorDashboardSection } from '@/components/mypage/InstructorDashboardSection';
import { MemberIntroSection } from '@/components/mypage/MemberIntroSection';
import { MemberSettingsSection } from '@/components/mypage/MemberSettingsSection';
import { MyBoardSection } from '@/components/mypage/MyBoardSection';
import { MyLectureSection } from '@/components/mypage/MyLectureSection';
import { ProfileSection } from '@/components/mypage/ProfileSection';
import { StudentDashboardSection } from '@/components/mypage/StudentDashboardSection';
import { SubscriptionFavoriteSection } from '@/components/mypage/SubscriptionFavoriteSection';
import { MyPageContentLayout } from '@/layouts/MyPageContentLayout';
import { useAuthStore } from '@/store/useAuthStore';

export const MyPage = () => {
  const [selectedProfileMenu, setSelectedProfileMenu] = useState('수강생');
  const [selectedMenu, setSelectedMenu] = useState('유저소개');
  // 헤더 요청한 사람과로그인 한 살마 id가 같으면 강사로 설정
  const { userData } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { joinId } = location.state || userData.id;
  // joinId 감지
  // useEffect(() => {
  //   navigate(`/mypage/${joinId}`, { state: { joinId } });
  // }, []);
  const COMMON_MENU = {
    유저소개: <MemberIntroSection joinId={joinId} />,
    '마이 페이지': <MemberSettingsSection />,
  };

  const handleCreateLecture = () => {
    setSelectedMenu('내 강의 생성하기');
  };

  const handleLectureCreated = () => {
    setSelectedMenu('내 강의'); // 강의 생성 후 "내 강의"로 변경
  };
  const MENU_COMPONENTS = {
    공통메뉴: COMMON_MENU,
    수강생: {
      ...COMMON_MENU,
      '구독, 즐겨찾기': <SubscriptionFavoriteSection />,
      '내가 쓴 글': <MyBoardSection />,
      대시보드: <StudentDashboardSection joinId={joinId} myid={userData.id} isActive={true} />,
    },
    강사: {
      ...COMMON_MENU,
      대시보드: <InstructorDashboardSection nickname={userData.nickname} />,
      '질문 확인': <CheckBoardSection />,

      '내 강의': <MyLectureSection />,
      '내 강의 생성하기': (
        <CreateLectureSection userDataId={userData.id} onBack={handleLectureCreated} />
      ),
    },
    default: <div>준비 중입니다.</div>,
  };

  const selectedMenuContent = () => {
    return MENU_COMPONENTS[selectedProfileMenu][selectedMenu] || MENU_COMPONENTS.default;
  };

  return (
    <div className="grid w-full grid-cols-10">
      <div className="col-span-2 flex flex-col items-center border-r border-gray-200 pr-3">
        <ProfileSection
          selectedMenu={selectedMenu}
          selectedProfileMenu={selectedProfileMenu}
          setSelectedMenu={setSelectedMenu}
          setSelectedProfileMenu={setSelectedProfileMenu}
          myid={userData.id}
          targetid={joinId}
        />
      </div>

      <div className="col-span-8 flex flex-col gap-3 pl-6">
        <MyPageContentLayout
          navMenuTitle={selectedMenu}
          navMenuSubButton={
            selectedMenu === '내 강의' && (
              <button
                className="rounded-[10px] bg-primary-color px-3 py-1 text-white hover:bg-primary-color/80"
                onClick={handleCreateLecture}
              >
                생성하기
              </button>
            )
          }
        >
          {selectedMenuContent()}
        </MyPageContentLayout>
      </div>
    </div>
  );
};
