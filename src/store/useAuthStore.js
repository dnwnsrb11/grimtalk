import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // 상태 (State)
  accessToken: null, // JWT 토큰을 저장
  userData: null, // 디코딩된 토큰에서 사용자 정보를 저장

  // 액션 (Actions)
  getAuthHeader: (state) => {
    return state.accessToken ? `Bearer ${state.accessToken}` : null;
  },

  setAccessToken: (token) => {
    if (token) {
      const decoded = jwtDecode(token); // JWT 토큰을 디코딩하여 사용자 정보 추출
      set({ accessToken: token, userData: decoded });
    }
  },

  clearAuth: () => {
    // 로그아웃 시 인증 정보 초기화
    set({ accessToken: null, userData: null });
  },

  // 초기화 함수 - 앱 시작시 토큰 복원
  initializeAuth: () => {
    const token = localStorage.getItem('accessToken'); // localStorage에서 토큰을 가져옴
    if (token) {
      const decoded = jwtDecode(token);
      set({ accessToken: token, userData: decoded });
    }
  },
}));

// 사용방법
//import { useAuthStore } from '../store/useAuthStore'; //

//function UserProfile() {
// userData 가져오기
//  const userData = useAuthStore((state) => state.userData);

//  if (!userData) {
//    return <div>로그인이 필요합니다.</div>;
//  }

//  return (
//    <div>
//      {/* userData 예시 사용법 */}
//      <h2>사용자 정보</h2>
//      <p>이메일: {userData.email}</p>
//      <p>이름: {userData.name}</p>

//    </div>
//  );
//}
//
