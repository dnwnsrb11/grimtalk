import { DefaultBadge, InstructorLogo, StudentLogo } from '@/components/common/icons';
import { NavigationMenu } from '@/components/mypage/NavigationMenu';

export const ProfileSection = ({
  selectedMenu,
  selectedProfileMenu,
  onMenuSelect,
  onProfileMenuSelect,
}) => {
  return (
    <div className="flex flex-col items-start gap-5">
      <div className="flex flex-col items-center gap-1">
        <div className="h-24 w-24 rounded-full bg-gray-600"></div>
        <div className="flex items-center gap-1">
          <DefaultBadge className="" width={20} height={20} />
          <span className="text-2xl font-bold">Woojungyu</span>
        </div>
        <div className="mt-2 flex gap-3 text-lg font-semibold">
          <button
            onClick={() => onProfileMenuSelect('수강생')}
            className={`group flex items-center gap-1 rounded-lg border px-3 py-1 
              ${
                selectedProfileMenu === '수강생'
                  ? 'bg-primary-color text-white'
                  : 'bg-bg-gray-color text-black hover:bg-primary-color hover:text-white'
              }`}
          >
            <StudentLogo
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
          <button
            onClick={() => onProfileMenuSelect('강사')}
            className={`group flex items-center gap-1 rounded-lg border px-3 py-1 
              ${
                selectedProfileMenu === '강사'
                  ? 'bg-primary-color text-white'
                  : 'bg-bg-gray-color text-black hover:bg-primary-color hover:text-white'
              }`}
          >
            <InstructorLogo
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
      <NavigationMenu selectedMenu={selectedMenu} onMenuSelect={onMenuSelect} />
    </div>
  );
};
