import posterNoneImg from '@/assets/posterNoneImg.png';

// 구독/즐겨찾기 카드 컴포넌트
export const SubscriptionCard = ({
  nickname, // 사용자 닉네임
  memberTagContent, // 사용자 태그 목록
  image, // 사용자 프로필 이미지
}) => {
  const profileImage = image || posterNoneImg; // 이미지가 없으면 기본 이미지 사용

  return (
    <div className="flex flex-row items-center rounded-xl border border-gray-border-color p-4">
      {/* 프로필 이미지 */}
      <div className="h-24 w-24 overflow-hidden rounded-full bg-bg-gray-color">
        <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
      </div>

      {/* 사용자 정보 */}
      <div className="flex flex-col gap-1 p-4">
        {/* 닉네임 */}
        <p className="text-lg font-bold">{nickname}</p>
        {/* 태그 목록 */}
        <div className="flex flex-row gap-1">
          {memberTagContent &&
            memberTagContent.map((tag, index) => (
              <span
                key={index}
                className="rounded-3xl bg-bg-gray-color px-2 py-0.5 text-base text-detail-text-color"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};
