import { useState } from 'react';
import { ProfileSection } from '@/components/mypage/ProfileSection';
import { MyPageContentLayout } from '@/layouts/MyPageContentLayout';
import { SubscriptionFavoriteSection } from '@/components/mypage/SubscriptionFavoriteSection';
import { MemberIntroSection } from '@/components/mypage/MemberIntroSection';
import { MyBoardSection } from '@/components/mypage/MyBoardSection';
import { MemberSettingsSection } from '@/components/mypage/MemberSettingsSection';
import { StudentDashboardSection } from '@/components/mypage/StudentDashboardSection';

export const MyPage = () => {
  const [selectedProfileMenu, setSelectedProfileMenu] = useState('수강생');
  const [selectedMenu, setSelectedMenu] = useState('유저소개');

  const COMMON_MENU = {
    유저소개: <MemberIntroSection />,
    '마이 페이지': <MemberSettingsSection />,
  };

  const MENU_COMPONENTS = {
    공통메뉴: COMMON_MENU,
    수강생: {
      ...COMMON_MENU,
      '구독, 즐겨찾기': <SubscriptionFavoriteSection />,
      '내가 쓴 글': <MyBoardSection />,
      대시보드: <StudentDashboardSection />,
    },
    강사: {
      ...COMMON_MENU,
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
        />
      </div>

      <div className="col-span-8 flex flex-col gap-3 pl-6">
        <MyPageContentLayout navMenuTitle={selectedMenu}>
          {selectedMenuContent()}
        </MyPageContentLayout>
      </div>
    </div>
  );
};
