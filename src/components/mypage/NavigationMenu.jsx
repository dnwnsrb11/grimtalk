// 마이페이지의 네비게이션 메뉴를 담당하는 컴포넌트
export const NavigationMenu = ({
  selectedMenu,
  selectedProfileMenu,
  setSelectedMenu,
  myid,
  targetid,
}) => {
  // 네비게이션 메뉴 아이템 목록
  const studentMenuItems = ['유저소개', '대시보드', '마이 페이지', '내가 쓴 글', '구독, 즐겨찾기'];
  const instructorMenuItems = ['유저소개', '대시보드', '마이 페이지', '내 강의', '질문 확인'];
  console.log(myid, targetid);
  return (
    <div className="mt-[40px] flex flex-col items-baseline gap-3 text-xl">
      {/* 메뉴 아이템들을 매핑하여 버튼으로 렌더링 */}
      {selectedProfileMenu === '수강생' &&
        // targetid가 빈 객체거나 targetid와 myid가 같을 경우 전체 studentMenuItems 렌더링
        (Object.keys(targetid || {}).length === 0 || targetid === myid ? (
          studentMenuItems.map((item) => (
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
        ) : (
          // targetid와 myid가 다르면 '유저소개'만 렌더링
          <button
            key="유저소개"
            onClick={() => setSelectedMenu('유저소개')}
            className={`hover:font-semibold ${
              selectedMenu === '유저소개'
                ? 'font-bold text-black'
                : 'text-[#C6C6C6] hover:text-black'
            }`}
          >
            유저소개
          </button>
        ))}

      {/* 강사 메뉴 아이템들 */}
      {selectedProfileMenu === '강사' &&
        instructorMenuItems.map((item) => (
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
