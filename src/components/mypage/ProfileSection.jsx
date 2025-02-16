// nonImage 가져오기
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import posterNoneImg from '@/assets/posterNoneImg.png';
import {
  InstructorIcon,
  LeveloneBadgeIcon,
  LevelthirdBadgeIcon,
  LeveltwoBadgeIcon,
  StudentIcon,
} from '@/components/common/icons';
import { NavigationMenu } from '@/components/mypage/NavigationMenu';
import { useAuthStore } from '@/store/useAuthStore';

// 마이페이지의 프로필 섹션을 담당하는 컴포넌트
export const ProfileSection = ({
  selectedMenu, // 현재 선택된 네비게이션 메뉴
  selectedProfileMenu, // 현재 선택된 프로필 메뉴 (수강생/강사)
  setSelectedMenu, // 네비게이션 메뉴 선택 핸들러
  setSelectedProfileMenu, // 프로필 메뉴 선택 핸들러
  myid, // 조회를 요청한은 사용자의 id
  targetid, // 조회 대상 사용자의 id
}) => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.selectedMenu) {
      setSelectedMenu(location.state.selectedMenu);
    }
    // if (location.state?.selectedProfileMenu) {
    //   setSelectedProfileMenu(location.state.selectedProfileMenu);
    // }
  }, [location, targetid, setSelectedMenu, selectedProfileMenu, setSelectedProfileMenu]);

  const handleProfileMenuClick = (menu) => {
    setSelectedMenu('유저소개');
    setSelectedProfileMenu(menu);
  };
  const { id } = useAuthStore((state) => state.userData);
  const { id: urlid } = useParams();
  // 유저 데이터 조회
  const { data: profileSectionCheck, refetch } = useQuery({
    queryKey: ['profileSectionCheck', id, targetid],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/user/${targetid}`);
      return data.body.data;
    },
    enabled: !!targetid,
  });
  useEffect(() => {
    if (location.state) {
      refetch(); // 새로고침 없이 강제 데이터 갱신
    }
  }, [location.state, refetch]);
  return (
    <div className="mt-10 flex flex-col  items-start">
      {/* 프로필 정보 영역 */}
      <div className="flex flex-col items-center gap-1">
        {/* 프로필 이미지 */}
        {/* 프로필 이미지 -> 값이 없을 경우 랜더링 유무 체크 */}
        <img
          className="h-40 w-40 rounded-full bg-gray-600"
          src={profileSectionCheck?.image || posterNoneImg}
          alt="profile"
        />
        {/* 사용자 이름과 뱃지 */}
        <div className="flex items-center gap-1">
          {/* 뱃지 이미지 추가 */}
          {profileSectionCheck?.subscribeNumber <= 10 ? (
            <LeveloneBadgeIcon />
          ) : profileSectionCheck?.subscribeNumber <= 100 ? (
            <LeveltwoBadgeIcon />
          ) : profileSectionCheck?.subscribeNumber >= 101 ? (
            <LevelthirdBadgeIcon />
          ) : null}

          <span className="text-2xl font-bold">{profileSectionCheck?.nickname}</span>
        </div>

        {/* 수강생/강사 전환 버튼 */}
        <div className="mt-2 flex gap-3 text-lg font-semibold">
          {/* 수강생 버튼 */}
          <button
            onClick={() => handleProfileMenuClick('수강생')}
            className={`group flex items-center gap-1 rounded-lg border px-3 py-1 
              ${
                selectedProfileMenu === '수강생'
                  ? 'bg-primary-color text-white'
                  : 'bg-bg-gray-color text-black hover:bg-primary-color hover:text-white'
              }`}
          >
            <StudentIcon
              className={`${
                selectedProfileMenu === '수강생'
                  ? 'fill-white'
                  : 'fill-black group-hover:fill-white'
              }`}
              width={20}
              height={20}
            />
            수강생
          </button>
          {/* 강사 버튼 */}
          <button
            onClick={() => handleProfileMenuClick('강사')}
            className={`group flex items-center gap-1 rounded-lg border px-3 py-1 
              ${
                selectedProfileMenu === '강사'
                  ? 'bg-primary-color text-white'
                  : 'bg-bg-gray-color text-black hover:bg-primary-color hover:text-white'
              }`}
          >
            <InstructorIcon
              className={`${
                selectedProfileMenu === '강사' ? 'fill-white' : 'fill-black group-hover:fill-white'
              }`}
              width={20}
              height={20}
            />
            강사
          </button>
        </div>
      </div>
      {/* 네비게이션 메뉴 컴포넌트 */}
      <NavigationMenu
        selectedMenu={selectedMenu}
        selectedProfileMenu={selectedProfileMenu}
        setSelectedMenu={setSelectedMenu}
        myid={myid}
        targetid={targetid}
      />
    </div>
  );
};
