import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { useAuthStore } from '@/store/useAuthStore';

const usePostLogin = ({ email, password }) => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    // 로그인 API 호출 함수
    mutationFn: async () => {
      const response = await _axios.post(
        '/user/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // 쿠키를 주고받기 위한 설정
        },
      );
      return response;
    },
    // API 호출 성공 시 실행되는 콜백
    onSuccess: (data) => {
      if (data.data.body.code === 200) {
        // 로그인 성공
        const authHeader = data.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const accessToken = authHeader.substring(7); // 'Bearer ' 접두사 제거
          localStorage.setItem('accessToken', accessToken); // 로컬 스토리지에 토큰 저장
          setAccessToken(accessToken); // 전역 상태에 토큰 저장
        }
        navigate('/'); // 홈 페이지로 이동
      } else if (data.data.body.code === 4001) {
        // 로그인 실패
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    },
    // API 호출 실패 시 실행되는 콜백
    onError: (error) => {},
  });
};

export { usePostLogin };
