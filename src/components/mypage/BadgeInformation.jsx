import { DefaultBadge } from '@/components/common/icons';
import { calculateBadgeLevel, calculateNextLevel } from '@/utils/badgeCalculator';

export const BadgeInformation = ({ memberName, memberSubscribeNumber }) => {
  return (
    <div className="flex flex-row gap-2">
      <div className="rounded-md bg-bg-gray-color p-3">
        <DefaultBadge width={40} height={40} />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm text-[#6E6E6E]">
          {memberName} 님의 뱃지 레벨은{' '}
          <span className="font-semibold text-black">
            {calculateBadgeLevel(memberSubscribeNumber).name}
          </span>{' '}
          입니다.
        </p>
        <p className="text-sm text-[#6E6E6E]">
          다음 뱃지 까지 남은 구독자 수는{' '}
          <span className="font-semibold text-black">
            {calculateNextLevel(memberSubscribeNumber).remainingSubscribers}명
          </span>{' '}
          입니다.
        </p>
      </div>
    </div>
  );
};
