import { SubscriptionCard } from '@/components/mypage/SubscriptionCard';

export const SubscriptionSection = () => {
  const subscriptionList = [
    { nickname: '김싸피', memberTagContent: ['열정 있는', '배우기 쉬운'] },
    { nickname: '이싸피', memberTagContent: ['열정 있는', '배우기 쉬운'] },
    { nickname: '박싸피', memberTagContent: ['열정 있는', '배우기 쉬운'] },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <button className="rounded bg-primary-color px-3 py-1 text-white">구독</button>
        <button className="rounded bg-bg-gray-color px-3 py-1 font-bold text-gray-700">
          즐겨찾기
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {subscriptionList.map((subscription) => (
          <SubscriptionCard
            key={subscription.nickname}
            nickname={subscription.nickname}
            memberTagContent={subscription.memberTagContent}
          />
        ))}
      </div>
    </div>
  );
};
