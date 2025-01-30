import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '@/assets/navbar/logo.svg';
import readingGlasses from '@/assets/navbar/reading_glasses.svg';
import alarm from '@/assets/navbar/alarm.svg';

export const Navbar = () => {
  const [search, setSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(5); // 예시로 5개의 알림이 있다고 가정하자
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

  // 경로별 색상 지정 (색상 코드 값으로 반환)
  const getButtonStyle = (path) => {
    switch (path) {
      case '/':
        return '#FF5C38';
      case '/category':
        return '#FFCA11';
      case '/community':
        return '#23C4F7';
      case '/live':
        return '#8F00FF';
      default:
        return '#000000';
    }
  };

  // 경로가 맞으면 스타일 적용 (활성화된 상태)
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
          {/* 아직 검색한 결과 페이지가 없어서 오류납니다 */}
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

          {/* 로그인 버튼 */}
          <div className="ml-auto flex items-center text-[15px]">
            <button onClick={() => navigate('/signup')}>회원가입</button>
            <div className="ml-[20px]">|</div>
            <button
              onClick={() => navigate('/login')}
              className="ml-[20px] h-[35px] w-[70px] rounded-xl border-solid bg-bg-gray-color"
            >
              로그인
            </button>
            {/* 알림 버튼 */}
            <button
              onClick={() => navigate('/alarm')}
              className="relative ml-[15px] flex h-[41px] w-[41px] items-center justify-center rounded-xl border-solid bg-bg-gray-color"
            >
              <img src={alarm} alt="알림" className="h-[25px] w-[25px]" />
              {notificationCount > 0 && (
                <div className="absolute right-[-5px] top-[-5px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {notificationCount}
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="col-span-2"></div> {/* 우측 빈 공간 */}
      </div>
    </div>
  );
};
