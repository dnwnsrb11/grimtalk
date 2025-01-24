import { useState } from 'react';
import { SubscriptionCard } from '@/components/mypage/SubscriptionCard';

export const SubscriptionFavoriteSection = () => {
  const [selectedTab, setSelectedTab] = useState('구독');

  const subscriptionList = [
    { nickname: '김싸피', memberTagContent: ['열정 있는', '배우기 쉬운'] },
    { nickname: '이싸피', memberTagContent: ['열정 있는', '배우기 쉬운'] },
    { nickname: '박싸피', memberTagContent: ['열정 있는', '배우기 쉬운'] },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedTab('구독')}
          className={`group rounded px-3 py-1 
            ${
              selectedTab === '구독'
                ? 'bg-primary-color text-white'
                : 'bg-bg-gray-color text-gray-700 hover:bg-primary-color hover:text-white'
            }`}
        >
          구독
        </button>
        <button
          onClick={() => setSelectedTab('즐겨찾기')}
          className={`group rounded px-3 py-1 
            ${
              selectedTab === '즐겨찾기'
                ? 'bg-primary-color text-white'
                : 'bg-bg-gray-color text-gray-700 hover:bg-primary-color hover:text-white'
            }`}
        >
          즐겨찾기
        </button>
      </div>
      {selectedTab === '구독' && (
        <div className="flex flex-col gap-2">
          {subscriptionList.map((item) => (
            <SubscriptionCard
              key={item.nickname}
              nickname={item.nickname}
              memberTagContent={item.memberTagContent}
            />
          ))}
        </div>
      )}
      {selectedTab === '즐겨찾기' && <div>즐겨찾기</div>}
    </div>
  );
};
