import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LogoIcon, AlarmIcon, ReadingGlassesIcon } from '@/components/common/icons';

export const Navbar = () => {
  const [search, setSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogined, setIsLogined] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
    setIsModalOpen(!isModalOpen);
  };

  const getNavItemClasses = (path) => {
    const baseClasses = 'transition-colors duration-200';
    const isCurrentPath = location.pathname === path;

    const colorClasses = {
      '/': isCurrentPath ? 'text-[#FF5C38] font-bold' : 'text-gray-400',
      '/category': isCurrentPath ? 'text-[#FFCA11] font-bold' : 'text-gray-400',
      '/community': isCurrentPath ? 'text-[#23C4F7] font-bold' : 'text-gray-400',
      '/live': isCurrentPath ? 'text-[#8F00FF] font-bold' : 'text-gray-400',
    };

    return `${baseClasses} ${colorClasses[path] || 'text-gray-400'}`;
  };

  return (
    <div className="h-[105px] w-full max-w-[1920px] border-b bg-white">
      <div className="mx-auto grid grid-cols-14 gap-4 py-4">
        <div className="col-span-2"></div>
        <div className="col-span-10 flex items-center">
          {/* 로고 */}
          <button onClick={() => navigate('/')} className="focus:outline-none">
            <LogoIcon />
          </button>

          {/* 네비게이션 메뉴 */}
          <div className="ml-[50px] flex flex-row gap-[25px] text-[15px]">
            <button onClick={() => navigate('/')} className={getNavItemClasses('/')}>
              홈
            </button>
            <button
              onClick={() => navigate('/category')}
              className={getNavItemClasses('/category')}
            >
              카테고리
            </button>
            <button
              onClick={() => navigate('/community')}
              className={getNavItemClasses('/community')}
            >
              커뮤니티
            </button>
            <button onClick={() => navigate('/live')} className={getNavItemClasses('/live')}>
              라이브
            </button>
          </div>

          {/* 검색창 */}
          <div className="ml-[70px] flex h-[60px] w-[400px] items-center justify-between rounded-xl border border-solid bg-[#EFEFEF]">
            <input
              type="text"
              className="ml-[25px] h-full w-full bg-[#EFEFEF] outline-none"
              placeholder="관심 카테고리, 강의 찾기"
              value={search}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearchClick} className="focus:outline-none">
              <ReadingGlassesIcon />
            </button>
          </div>

          {/* 로그인 / 회원가입 / 마이페이지 버튼 */}
          <div className="ml-auto flex items-center text-[15px]">
            {!isLogined ? (
              <>
                <button onClick={() => navigate('/signup')} className="focus:outline-none">
                  회원가입
                </button>
                <div className="mx-5">|</div>
                <button
                  onClick={() => navigate('/login')}
                  className="h-[35px] w-[70px] rounded-xl bg-[#EFEFEF] focus:outline-none"
                >
                  로그인
                </button>
              </>
            ) : (
              <div className="flex flex-row items-center gap-5">
                <button
                  onClick={() => navigate('/mypage')}
                  className="h-[35px] w-[90px] rounded-xl bg-[#EFEFEF] focus:outline-none"
                >
                  마이페이지
                </button>
                <div>|</div>
                <button onClick={() => navigate('/logout')} className="focus:outline-none">
                  로그아웃
                </button>
              </div>
            )}

            {/* 알림 버튼 */}
            {isLogined && (
              <button
                onClick={toggleModal}
                className="relative ml-[15px] flex h-[41px] w-[41px] items-center justify-center rounded-xl bg-[#EFEFEF] focus:outline-none"
              >
                <AlarmIcon />
                {notificationCount > 0 && (
                  <div className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notificationCount}
                  </div>
                )}
              </button>
            )}

            {/* 알림 모달 */}
            {isModalOpen && (
              <div className="absolute z-10 mt-[240px] w-[350px] rounded-2xl border border-gray-200 bg-white shadow-lg">
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[18px]">알림</h3>
                    <button
                      onClick={() => navigate('/alarm')}
                      className="text-lg text-gray-600 focus:outline-none"
                    >
                      {'>'}
                    </button>
                  </div>
                  <hr className="border-solid border-[#D9D9D9]" />
                  <div className="max-h-[300px] overflow-y-auto">
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
        <div className="col-span-2"></div>
      </div>
    </div>
  );
};
