// 뱃지 레벨 상수
export const BADGE_LEVELS = {
  BEGINNER: { name: '초급', minSubscribers: 3 },
  INTERMEDIATE: { name: '중급', minSubscribers: 10 },
  ADVANCED: { name: '고급', minSubscribers: 100 },
};

/**
 * 구독자 수에 따른 뱃지 레벨 계산
 * @param {number} subscriberCount - 구독자 수
 * @returns {{ level: string, name: string }} 뱃지 레벨 정보
 */
export const calculateBadgeLevel = (subscriberCount) => {
  if (subscriberCount >= BADGE_LEVELS.ADVANCED.minSubscribers) {
    return { level: 'ADVANCED', name: BADGE_LEVELS.ADVANCED.name };
  }
  if (subscriberCount >= BADGE_LEVELS.INTERMEDIATE.minSubscribers) {
    return { level: 'INTERMEDIATE', name: BADGE_LEVELS.INTERMEDIATE.name };
  }
  if (subscriberCount >= BADGE_LEVELS.BEGINNER.minSubscribers) {
    return { level: 'BEGINNER', name: BADGE_LEVELS.BEGINNER.name };
  }
  return { level: 'NONE', name: '없음' };
};

/**
 * 다음 레벨까지 필요한 구독자 수 계산
 * @param {number} currentSubscribers - 현재 구독자 수
 * @returns {{ nextLevel: string, remainingSubscribers: number } | null} 다음 레벨 정보
 */
export const calculateNextLevel = (currentSubscribers) => {
  if (currentSubscribers >= BADGE_LEVELS.ADVANCED.minSubscribers) {
    return {
      nextLevel: '최고 레벨',
      remainingSubscribers: 0,
    };
  }

  if (currentSubscribers >= BADGE_LEVELS.INTERMEDIATE.minSubscribers) {
    return {
      nextLevel: BADGE_LEVELS.ADVANCED.name,
      remainingSubscribers: BADGE_LEVELS.ADVANCED.minSubscribers - currentSubscribers,
    };
  }

  if (currentSubscribers >= BADGE_LEVELS.BEGINNER.minSubscribers) {
    return {
      nextLevel: BADGE_LEVELS.INTERMEDIATE.name,
      remainingSubscribers: BADGE_LEVELS.INTERMEDIATE.minSubscribers - currentSubscribers,
    };
  }

  return {
    nextLevel: BADGE_LEVELS.BEGINNER.name,
    remainingSubscribers: BADGE_LEVELS.BEGINNER.minSubscribers - currentSubscribers,
  };
};
