import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '@/assets/navbar/logo.svg';
import readingGlasses from '@/assets/navbar/reading_glasses.svg';
import alarm from '@/assets/navbar/alarm.svg';

export const Navbar = () => {
  const [search, setSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(3); // 예시로 3개의 알림이 있다고 가정
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태 관리
  const [isLogined, setIsLogined] = useState(true); // 로그인 상태 (예시로 true로 설정)
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 경로 가져오기

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    try {
      if (search.trim()) {
        navigate(`/search/${search}`);
      }
    } catch (error) {
      console.log(error);
      navigate('/');
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // 모달 상태를 반전시켜서 열거나 닫기
  };

  const getButtonStyle = (path) => {
    switch (path) {
      case '/':
        return '#FF5C38'; // 홈 페이지는 빨간색
      case '/category':
        return '#FFCA11'; // 카테고리 페이지는 노란색
      case '/community':
        return '#23C4F7'; // 커뮤니티 페이지는 파란색
      case '/live':
        return '#8F00FF'; // 라이브 페이지는 보라색
      default:
        return '#000000'; // 기본 색상은 검은색
    }
  };

  const isActive = (path) => {
    return location.pathname === path
      ? { fontWeight: 'bold', color: getButtonStyle(path) }
      : { color: '#B0B0B0' }; // 비활성화된 경우 회색
  };

  return (
    <div className="h-[105px] w-full max-w-[1920px] border-b bg-white">
      <div className="mx-auto grid grid-cols-14 gap-4 py-4">
        <div className="col-span-2"></div>
        <div className="col-span-10 flex items-center">
          {/* 로고 */}
          <button onClick={() => navigate('/')}>
            <img src={logo} alt="로고" className="h-[72px] w-[66px]" />
          </button>

          {/* 네비게이션 메뉴 */}
          <div className="ml-[50px] flex flex-row gap-[25px] text-[15px]">
            <button onClick={() => navigate('/')} style={isActive('/')}>
              홈
            </button>
            <button onClick={() => navigate('/category')} style={isActive('/category')}>
              카테고리
            </button>
            <button onClick={() => navigate('/community')} style={isActive('/community')}>
              커뮤니티
            </button>
            <button onClick={() => navigate('/live')} style={isActive('/live')}>
              라이브
            </button>
          </div>

          {/* 검색창 */}
          <div className="ml-[70px] flex h-[60px] w-[400px] place-content-between items-center rounded-xl border-[1px] border-solid bg-[#EFEFEF]">
            <input
              type="text"
              className="ml-[25px] h-full w-full bg-[#EFEFEF] outline-none"
              placeholder="관심 카테고리, 강의 찾기"
              value={search}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearchClick}>
              <img src={readingGlasses} alt="돋보기" className="mr-[25px] h-[25px] w-[25px]" />
            </button>
          </div>

          {/* 로그인 / 회원가입 / 마이페이지 버튼 */}
          <div className="ml-auto flex items-center text-[15px]">
            {!isLogined ? (
              <>
                <button onClick={() => navigate('/signup')}>회원가입</button>
                <div className="ml-[20px]">|</div>
                <button
                  onClick={() => navigate('/login')}
                  className="ml-[20px] h-[35px] w-[70px] rounded-xl border-solid bg-bg-gray-color"
                >
                  로그인
                </button>
              </>
            ) : (
              <div className="flex flex-row items-center gap-[20px]">
                <button
                  onClick={() => navigate('/mypage')}
                  className="ml-[20px] h-[35px] w-[90px] rounded-xl border-solid bg-bg-gray-color"
                >
                  마이페이지
                </button>
                <div>|</div>
                <button onClick={() => navigate('/logout')}>로그아웃</button>
              </div>
            )}

            {/* 알림 버튼 */}
            {isLogined && (
              <button
                onClick={toggleModal}
                className="relative ml-[15px] flex h-[41px] w-[41px] items-center justify-center rounded-xl border-solid bg-bg-gray-color"
              >
                <img src={alarm} alt="알림" className="h-[25px] w-[25px]" />
                {notificationCount > 0 && (
                  <div className="absolute right-[-5px] top-[-5px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notificationCount}
                  </div>
                )}
              </button>
            )}

            {/* 알림 모달 */}
            {isModalOpen && (
              <div className="absolute z-10 mt-[240px] w-[350px] rounded-2xl border border-gray-border-color bg-white shadow-lg">
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[18px]">알림</h3>
                    <button onClick={() => navigate('/alarm')} className="text-lg text-gray-600">
                      {'>'}
                    </button>
                  </div>
                  <hr className="border-solid border-[#D9D9D9]" />
                  <div className="max-h-[300px] overflow-y-auto">
                    {/* 알림 목록 */}
                    <ul>
                      {[...Array(notificationCount)].map((_, index) => (
                        <li key={index} className="border-b py-2">
                          <span>알림 내용 {index + 1}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2"></div> {/* 우측 빈 공간 */}
      </div>
    </div>
  );
};
