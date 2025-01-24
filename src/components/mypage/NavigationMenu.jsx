// 마이페이지의 네비게이션 메뉴를 담당하는 컴포넌트
export const NavigationMenu = ({ selectedMenu, onMenuSelect }) => {
  // 네비게이션 메뉴 아이템 목록
  const menuItems = ['유저소개', '대시보드', '마이 페이지', '내가 쓴 글', '구독, 즐겨찾기'];

  return (
    <div className="flex flex-col items-baseline gap-3 text-xl">
      {/* 메뉴 아이템들을 매핑하여 버튼으로 렌더링 */}
      {menuItems.map((item) => (
        <button
          key={item}
          onClick={() => onMenuSelect(item)}
          className={`hover:font-semibold ${selectedMenu === item ? 'font-bold' : ''}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};
