export const NavigationMenu = ({ selectedMenu, onMenuSelect }) => {
  const menuItems = ['유저소개', '대시보드', '마이 페이지', '내가 쓴 글', '구독, 즐겨찾기'];

  return (
    <div className="flex flex-col items-baseline gap-3 text-xl">
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
