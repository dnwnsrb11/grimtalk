import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLogout } from '@/api/auth';
import { AlarmIcon, LogoIcon, ReadingGlassesIcon } from '@/components/common/icons';
import { useAuthStore } from '@/store/useAuthStore';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLogin } = useAuthStore();
  const { userData } = useAuthStore();

  const handleLogout = useLogout();

  const [search, setSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    try {
      if (search.trim() && search) {
        navigate(`/category`, { state: { search: search } });
      } else if (!search) {
        alert('검색어를 입력해주세요.');
      }
    } catch (error) {
      navigate('/');
      alert(error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const getNavItemClasses = (path) => {
    const baseClasses = 'transition-colors duration-200 hover:scale-105';
    const isCurrentPath = location.pathname === path;

    const colorClasses = {
      '/': isCurrentPath
        ? 'text-[#FF5C38] font-bold hover:text-[#FF8A6B]'
        : 'text-gray-400 hover:text-[#FF8A6B]',
      '/category': isCurrentPath
        ? 'text-[#FFCA11] font-bold hover:text-[#FFD966]'
        : 'text-gray-400 hover:text-[#FFD966]',
      '/community': isCurrentPath
        ? 'text-[#23C4F7] font-bold hover:text-[#7BD4FF]'
        : 'text-gray-400 hover:text-[#7BD4FF]',
      '/live': isCurrentPath
        ? 'text-[#8F00FF] font-bold hover:text-[#C57BFF]'
        : 'text-gray-400 hover:text-[#C57BFF]',
    };

    return `${baseClasses} ${colorClasses[path] || 'text-gray-400 hover:text-gray-500'}`;
  };

  return (
    <div className="flex items-center">
      {/* 로고 */}
      <button onClick={() => navigate('/')} className="focus:outline-none">
        <LogoIcon />
      </button>

      {/* 네비게이션 메뉴 */}
      <div className="ml-[50px] flex flex-row gap-[25px] text-[18px]">
        <button onClick={() => navigate('/')} className={getNavItemClasses('/')}>
          홈
        </button>
        <button onClick={() => navigate('/category')} className={getNavItemClasses('/category')}>
          카테고리
        </button>
        <button onClick={() => navigate('/community')} className={getNavItemClasses('/community')}>
          커뮤니티
        </button>
        <button onClick={() => navigate('/live')} className={getNavItemClasses('/live')}>
          라이브
        </button>
        {/* 검색창 */}
        <div className="flex h-[50px] w-[400px] items-center justify-between rounded-xl border border-solid bg-[#EFEFEF] hover:bg-gray-300">
          <input
            type="text"
            className="ml-[25px] h-full w-full bg-[#EFEFEF] outline-none"
            placeholder="관심 카테고리, 강의 찾기"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchClick(e);
              }
            }}
          />
          <button onClick={handleSearchClick} className="focus:outline-none">
            <ReadingGlassesIcon width={20} height={20} />
          </button>
        </div>
      </div>

      {/* 로그인 / 회원가입 / 마이페이지 버튼 */}
      <div className="ml-auto flex items-center text-[15px]">
        {!isLogin ? (
          <>
            <button
              onClick={() => navigate('/signup')}
              className="hover:scale-105 hover:bg-gray-300 focus:outline-none"
            >
              회원가입
            </button>
            <div className="mx-5">|</div>
            <button
              onClick={() => navigate('/login')}
              className="h-[35px] w-[70px] rounded-xl bg-[#EFEFEF] hover:scale-105 hover:bg-gray-300 focus:outline-none"
            >
              <p className="text-text-gray-color">로그인</p>
            </button>
          </>
        ) : (
          <div className="flex flex-row items-center gap-5">
            <button
              onClick={() => navigate(`/mypage/${userData.id}`, { state: { joinId: userData.id } })}
              className="h-[35px] w-[90px] rounded-xl bg-[#EFEFEF] hover:scale-105 hover:bg-gray-300 focus:outline-none"
            >
              마이페이지
            </button>
            <div>|</div>
            <button
              onClick={() => handleLogout.mutate()}
              className="text-text-gray-color hover:scale-105 hover:bg-gray-300 focus:outline-none"
            >
              로그아웃
            </button>
          </div>
        )}

        {/* 알림 버튼 */}
        {isLogin && (
          <button
            onClick={toggleModal}
            className="group relative ml-[15px] flex h-[41px] w-[41px] items-center justify-center rounded-xl bg-[#EFEFEF] transition-all duration-200 hover:scale-110 hover:bg-primary-color focus:outline-none"
          >
            <AlarmIcon className="group-hover:stroke-white" />
            {notificationCount > 0 && (
              <div className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-xs text-white transition-all duration-200 group-hover:border group-hover:bg-white group-hover:text-black">
                {notificationCount}
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
