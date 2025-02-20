import {
  LeveloneBadgeIcon,
  LevelthirdBadgeIcon,
  LeveltwoBadgeIcon,
} from '@/components/common/icons';
import { calculateBadgeLevel, calculateNextLevel } from '@/utils/badgeCalculator';
export const BadgeInformation = ({
  nickname,
  subscribeNumber,
  badgeWidth,
  badgeHeight,
  textSize,
}) => {
  console.log(calculateNextLevel(subscribeNumber).remainingSubscribers);
  return (
    <div className="flex h-full w-full flex-row items-center gap-5">
      <div className="flex min-h-[65px] min-w-[65px] items-center justify-center rounded-md bg-bg-gray-color p-3">
        {subscribeNumber >= 101 ? (
          <LevelthirdBadgeIcon />
        ) : subscribeNumber >= 10 ? (
          <LeveltwoBadgeIcon />
        ) : subscribeNumber >= 3 ? (
          <LeveloneBadgeIcon />
        ) : (
          <span className="text-2xl">😭</span>
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
          {calculateNextLevel(subscribeNumber).remainingSubscribers === 0 ? (
            <span className="font-semibold text-black">최고 레벨에 도달하셨군요!</span>
          ) : (
            <>
              다음 뱃지까지 남은 구독자 수는{' '}
              <span className="font-semibold text-black">
                {calculateNextLevel(subscribeNumber).remainingSubscribers}명
              </span>{' '}
              입니다.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
