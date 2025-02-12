import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { useAuthStore } from '@/store/useAuthStore';
import { handleApiError } from '@/utils/errorHandler';

// 로그인 API 호출 함수
const useLogin = ({ email, password }) => {
  const navigate = useNavigate();

  return useMutation({
    // 로그인 API 호출 함수
    mutationFn: async () => {
      const response = await _axios.post('/user/login', {
        email: email,
        password: password,
      });
      return response;
    },

    // API 호출 성공 시 실행되는 콜백
    onSuccess: (data) => {
      const responseBody = data.data.body;

      // 성공 코드 200 처리
      if (responseBody.code === 200) {
        // 토큰 헤더 확인
        const authHeader = data.headers['X-Access-Token'] || data.headers['x-access-token'];
        const BEARER_PREFIX = 'Bearer '; // 토큰 접두사

        // 토큰 헤더가 있고, 토큰 접두사로 시작하는 경우
        if (authHeader?.startsWith(BEARER_PREFIX)) {
          const accessToken = authHeader.substring(BEARER_PREFIX.length); // 토큰 추출
          useAuthStore.getState().loginAuth(accessToken); // 토큰 저장

          toast.success('로그인 되었습니다.');
          navigate('/signup-success'); // 홈 페이지로 이동
        }
      }

      // 커스텀 실패 코드 처리
      else {
        handleApiError(data);
      }
    },

    // API 호출 실패 시 실행되는 콜백 NotFound Page로 이동
    onError: () => {
      navigate('/notfound');
    },
  });
};

// 로그아웃 API 호출 함수
const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const response = await _axios.post('/user/logout');
      return response;
    },

    onSuccess: (data) => {
      const responseBody = data.data.body;

      if (responseBody.code === 200) {
        useAuthStore.getState().logoutAuth();
        navigate('/');
        toast.success('로그아웃 되었습니다.');
      } else {
        handleApiError(data);
      }
    },

    onError: () => {
      navigate('/notfound');
    },
  });
};

export { useLogin, useLogout };
