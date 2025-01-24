import { useState } from 'react';
import { SubscriptionCard } from '@/components/mypage/SubscriptionCard';

export const SubscriptionFavoriteSection = () => {
  // 현재 선택된 탭을 관리하는 상태 (기본값: '구독')
  const [selectedTab, setSelectedTab] = useState('구독');

  // 구독 목록 데이터 (임시 데이터)
  const subscriptionList = [
    { nickname: '김싸피', memberTagContent: ['열정 있는', '배우기 쉬운'] },
    { nickname: '이싸피', memberTagContent: ['열정 있는', '배우기 쉬운'] },
    { nickname: '박싸피', memberTagContent: ['열정 있는', '배우기 쉬운'] },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* 탭 버튼 영역 */}
      <div className="flex gap-3">
        {/* 구독 탭 버튼 */}
        <button
          onClick={() => setSelectedTab('구독')}
          className={`group rounded px-3 py-1 
            ${
              selectedTab === '구독'
                ? 'bg-primary-color text-white' // 활성화된 탭 스타일
                : 'bg-bg-gray-color text-gray-700 hover:bg-primary-color hover:text-white' // 비활성화된 탭 스타일
            }`}
        >
          구독
        </button>
        {/* 즐겨찾기 탭 버튼 */}
        <button
          onClick={() => setSelectedTab('즐겨찾기')}
          className={`group rounded px-3 py-1 
            ${
              selectedTab === '즐겨찾기'
                ? 'bg-primary-color text-white' // 활성화된 탭 스타일
                : 'bg-bg-gray-color text-gray-700 hover:bg-primary-color hover:text-white' // 비활성화된 탭 스타일
            }`}
        >
          즐겨찾기
        </button>
      </div>

      {/* 선택된 탭에 따른 컨텐츠 렌더링 */}
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
      {/* 즐겨찾기 컨텐츠 */}
      {selectedTab === '즐겨찾기' && <div>즐겨찾기</div>}
    </div>
  );
};
