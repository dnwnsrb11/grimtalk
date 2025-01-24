import { useState } from 'react';
import { ProfileSection } from '@/components/mypage/ProfileSection';
import { MyPageContentLayout } from '@/layouts/MyPageContentLayout';
import { SubscriptionFavoriteSection } from '@/components/mypage/SubscriptionFavoriteSection';

export const MyPage = () => {
  const [selectedProfileMenu, setSelectedProfileMenu] = useState('수강생');
  const [selectedMenu, setSelectedMenu] = useState('유저소개');

  const MENU_COMPONENTS = {
    '구독, 즐겨찾기': <SubscriptionFavoriteSection />,
    default: <div>준비 중입니다.</div>,
  };

  const selectedMenuContent = () => {
    return MENU_COMPONENTS[selectedMenu] || MENU_COMPONENTS.default;
  };

  return (
    <div className="grid w-full grid-cols-10">
      <div className="col-span-2 flex flex-col items-center border-r border-gray-200 pr-3">
        <ProfileSection
          selectedMenu={selectedMenu}
          selectedProfileMenu={selectedProfileMenu}
          onMenuSelect={setSelectedMenu}
          onProfileMenuSelect={setSelectedProfileMenu}
        />
      </div>

      <div className="col-span-8 flex flex-col gap-3 pl-6">
        <MyPageContentLayout navMenuTitle={selectedMenu} navMenuContent={selectedMenuContent()} />
      </div>
    </div>
  );
};
