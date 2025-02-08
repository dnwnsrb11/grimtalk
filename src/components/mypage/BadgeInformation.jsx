import { LeveloneBadge, LevelthirdBadge, LeveltwoBadge } from '@/components/common/icons';
import { calculateBadgeLevel, calculateNextLevel } from '@/utils/badgeCalculator';
export const BadgeInformation = ({
  nickname,
  subscribeNumber,
  badgeWidth,
  badgeHeight,
  textSize,
}) => {
  return (
    <div className="flex h-full w-full flex-row items-center gap-5">
      <div className="rounded-md bg-bg-gray-color p-3">
        {subscribeNumber <= 10 ? (
          <LeveloneBadge />
        ) : subscribeNumber <= 100 ? (
          <LevelthirdBadge />
        ) : (
          <LeveltwoBadge />
        )}
      </div>
      <div className="flex flex-col justify-center">
        <p className={`text-${textSize} text-[#6E6E6E]`}>
          {nickname} 님의 뱃지 레벨은{' '}
          <span className="font-semibold text-black">
            {calculateBadgeLevel(subscribeNumber).name}
          </span>{' '}
          입니다.
        </p>
        <p className={`text-${textSize} text-[#6E6E6E]`}>
          다음 뱃지까지 남은 구독자 수는{' '}
          <span className="font-semibold text-black">
            {calculateNextLevel(subscribeNumber).remainingSubscribers}명
          </span>{' '}
          입니다.
        </p>
      </div>
    </div>
  );
};
