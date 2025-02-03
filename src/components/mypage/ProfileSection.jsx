import { DefaultBadgeIcon, InstructorIcon, StudentIcon } from '@/components/common/icons';
import { NavigationMenu } from '@/components/mypage/NavigationMenu';
// nonImage 가져오기
import nonImage from '@/assets/nonProfileImg.png';

// 마이페이지의 프로필 섹션을 담당하는 컴포넌트
export const ProfileSection = ({
  selectedMenu, // 현재 선택된 네비게이션 메뉴
  selectedProfileMenu, // 현재 선택된 프로필 메뉴 (수강생/강사)
  setSelectedMenu, // 네비게이션 메뉴 선택 핸들러
  setSelectedProfileMenu, // 프로필 메뉴 선택 핸들러
}) => {
  const handleProfileMenuClick = (menu) => {
    setSelectedMenu('유저소개');
    setSelectedProfileMenu(menu);
  };

  return (
    <div className="mt-10 flex flex-col items-start">
      {/* 프로필 정보 영역 */}
      <div className="flex flex-col items-center gap-1">
        {/* 프로필 이미지 */}
        <img
          className="h-40 w-40 rounded-full bg-gray-600"
          src="https://picsum.photos/200"
          alt="profile"
        />
        {/* 사용자 이름과 뱃지 */}
        <div className="flex items-center gap-1">
          <DefaultBadgeIcon className="" width={20} height={20} />
          <span className="text-2xl font-bold">Woojungyu</span>
        </div>
        {/* 수강생/강사 전환 버튼 */}
        <div className="mt-2 flex gap-3 text-lg font-semibold">
          {/* 수강생 버튼 */}
          <button
            onClick={() => handleProfileMenuClick('수강생')}
            className={`group flex items-center gap-1 rounded-lg border px-3 py-1 
              ${
                selectedProfileMenu === '수강생'
                  ? 'bg-primary-color text-white'
                  : 'bg-bg-gray-color text-black hover:bg-primary-color hover:text-white'
              }`}
          >
            <StudentIcon
              className={`${
                selectedProfileMenu === '수강생'
                  ? 'fill-white'
                  : 'fill-black group-hover:fill-white'
              }`}
              width={20}
              height={20}
            />
            수강생
          </button>
          {/* 강사 버튼 */}
          <button
            onClick={() => handleProfileMenuClick('강사')}
            className={`group flex items-center gap-1 rounded-lg border px-3 py-1 
              ${
                selectedProfileMenu === '강사'
                  ? 'bg-primary-color text-white'
                  : 'bg-bg-gray-color text-black hover:bg-primary-color hover:text-white'
              }`}
          >
            <InstructorIcon
              className={`${
                selectedProfileMenu === '강사' ? 'fill-white' : 'fill-black group-hover:fill-white'
              }`}
              width={20}
              height={20}
            />
            강사
          </button>
        </div>
      </div>
      {/* 네비게이션 메뉴 컴포넌트 */}
      <NavigationMenu
        selectedMenu={selectedMenu}
        selectedProfileMenu={selectedProfileMenu}
        setSelectedMenu={setSelectedMenu}
      />
    </div>
  );
};
