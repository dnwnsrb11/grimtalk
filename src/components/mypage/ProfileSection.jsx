import defaultBadge from '@/assets/defaultBadge.svg';
import instructorBadge from '@/assets/instructorBadge.svg';
import studentBadge from '@/assets/studentBadge.svg';
import { NavigationMenu } from '@/components/mypage/NavigationMenu';

export const ProfileSection = ({ selectedMenu, onMenuSelect }) => {
  return (
    <div className="flex flex-col items-start gap-5">
      <div className="flex flex-col items-center gap-1">
        <div className="h-24 w-24 rounded-full bg-gray-600"></div>
        <div className="flex items-center gap-1">
          <img src={defaultBadge} alt="defaultBadge" />
          <span className="text-2xl font-bold">Woojungyu</span>
        </div>
        <div className="mt-2 flex gap-3 text-lg font-semibold">
          <button className="flex items-center gap-1 rounded-lg border bg-bg-gray-color px-3 py-1">
            <img src={studentBadge} alt="studentBadge" />
            수강생
          </button>
          <button className="flex items-center gap-1 rounded-lg bg-primary-color px-3 py-1 text-white">
            <img src={instructorBadge} alt="instructorBadge" />
            강사
          </button>
        </div>
      </div>
      <NavigationMenu selectedMenu={selectedMenu} onMenuSelect={onMenuSelect} />
    </div>
  );
};
