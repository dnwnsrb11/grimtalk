// 마이페이지의 네비게이션 메뉴를 담당하는 컴포넌트
export const NavigationMenu = ({ selectedMenu, selectedProfileMenu, setSelectedMenu }) => {
  // 네비게이션 메뉴 아이템 목록
  const studentMenuItems = ['유저소개', '대시보드', '마이 페이지', '내가 쓴 글', '구독, 즐겨찾기'];
  const instructorMenuItems = ['유저소개', '대시보드', '마이 페이지', '내 강의', '질문 확인'];

  return (
    <div className="mt-[40px] flex flex-col items-baseline gap-3 text-xl">
      {/* 메뉴 아이템들을 매핑하여 버튼으로 렌더링 */}
      {selectedProfileMenu === '수강생'
        ? studentMenuItems.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedMenu(item)}
              className={`hover:font-semibold ${
                selectedMenu === item ? 'font-bold text-black' : 'text-[#C6C6C6] hover:text-black'
              }`}
            >
              {item}
            </button>
          ))
        : instructorMenuItems.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedMenu(item)}
              className={`hover:font-semibold ${
                selectedMenu === item ? 'font-bold text-black' : 'text-[#C6C6C6] hover:text-black'
              }`}
            >
              {item}
            </button>
          ))}
    </div>
  );
};
