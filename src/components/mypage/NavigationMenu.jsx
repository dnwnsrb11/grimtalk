import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { useAuthStore } from '@/store/useAuthStore';

export const NavigationMenu = ({
  selectedMenu,
  selectedProfileMenu,
  setSelectedMenu,
  myid,
  targetid,
}) => {
  const { logoutAuth } = useAuthStore();
  const navigate = useNavigate();
  // 네비게이션 메뉴 아이템 목록을 상태로 관리
  const [studentMenuItems, setStudentMenuItems] = useState([]);
  const [instructorMenuItems, setInstructorMenuItems] = useState([]);
  // 다른사람 프로필 조회 시 대쉬보드에서 나가도록 설정하려고 사용함
  const queryClient = useQueryClient();
  // targetid와 myid 값이 바뀔 때마다 메뉴 아이템 업데이트
  useEffect(() => {
    // targetid가 빈 객체이거나 myid와 같을 때
    if (Object.keys(targetid).length === 0 && myid === targetid) {
      setStudentMenuItems(['유저소개', '대시보드', '마이 페이지', '내가 쓴 글', '구독, 즐겨찾기']);
      setInstructorMenuItems(['유저소개', '대시보드', '마이 페이지', '내 강의', '질문 확인']);
    } else if (targetid && targetid !== myid) {
      setStudentMenuItems(['유저소개']);
      setInstructorMenuItems(['유저소개', '내 강의']);
    }
  }, [myid, targetid]); // myid나 targetid가 변경될 때마다 실행
  useEffect(() => {
    if (targetid && targetid !== myid) {
      queryClient.invalidateQueries(['profileSectionCheck']);
    }
  }, [myid, targetid]);

  // 회원 탈퇴
  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.delete(`/user`);
      return data;
    },
    onSuccess: () => {
      logoutAuth();
      alert('회원탈퇴가 완료되었습니다.');
      navigate('/');
    },
  });

  return (
    <div className="mt-[40px] flex flex-col items-baseline gap-3 text-xl">
      {/* 메뉴 아이템들을 매핑하여 버튼으로 렌더링 */}
      {selectedProfileMenu === '수강생'
        ? studentMenuItems.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedMenu(item)}
              className={`hover:font-semibold ${selectedMenu === item ? 'font-bold text-black' : 'text-[#C6C6C6] hover:text-black'}`}
            >
              {item}
            </button>
          ))
        : instructorMenuItems.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedMenu(item)}
              className={`hover:font-semibold ${selectedMenu === item ? 'font-bold text-black' : 'text-[#C6C6C6] hover:text-black'}`}
            >
              {item}
            </button>
          ))}
      {myid && myid === targetid && (
        <button
          className="mt-[100%] font-bold text-black hover:font-semibold hover:text-black"
          onClick={() => {
            if (window.confirm('정말 회원탈퇴를 진행하시겠습니까?')) {
              deleteUserMutation.mutate();
            }
          }}
        >
          회원탈퇴
        </button>
      )}
    </div>
  );
};
