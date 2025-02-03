import axios from 'axios';

import { useAuthStore } from '@/store/useAuthStore';
import { ERROR_CODES } from '@/utils/errorHandler';

const _axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // API 서버 주소
  timeout: 5000, // 요청이 5초(5000ms) 이상 걸릴 경우 자동으로 요청을 중단합니다
  withCredentials: true, // 쿠키를 주고받기 위한 설정
  headers: {
    // 요청 헤더 설정
    'Content-Type': 'application/json', // 요청 본문이 JSON 형식임을 명시
  },
});

// [정상 요청 흐름]
// 1. 클라이언트가 API 요청 시 Authorization 헤더에 access token을 포함
// 2. 쿠키에 저장된 refresh token도 자동으로 서버에 전송됨
// 3. 서버는 유효한 토큰 확인 후 정상 응답

// [토큰 만료 시 자동 갱신 흐름]
// 1. 클라이언트가 만료된 access token으로 API 요청
// 2. 서버가 토큰 만료 확인하고 5001 커스텀 코드 응답
// 3. 서버는 쿠키의 유효한 refresh token을 확인
// 4. 새로운 access token을 발급하여 클라이언트에 전달,

// [모든 토큰 만료 시 흐름]
// 1. 클라이언트가 만료된 access token으로 API 요청
// 2. 서버에서 refresh token도 만료된 것을 확인
// 3. 서버가 5004, 5005 커스텀 코드 에러와 함께 "로그인 필요" 메시지 응답
// 4. 클라이언트는 로그인 페이지로 리다이렉트

// 로그인 후 사용되는 axios 인스턴스 (access token 포함)
const _axiosAuth = _axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 토큰 헤더 설정
  },
});

// 요청 인터셉터 설정
_axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // 토큰 가져오기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 토큰 헤더 설정
  }
  return config; // 설정된 헤더를 반환
});

_axiosAuth.interceptors.response.use(
  // 응답 인터셉터 설정
  (response) => {
    // 응답의 커스텀 코드 확인
    const customCode = response.data?.body?.code;

    // Access Token 만료
    if (customCode === ERROR_CODES.EXPIRED_ACCESS_TOKEN) {
      const originalRequest = response.config;

      if (!originalRequest._retry) {
        // 원래 요청을 다시 시도 (쿠키의 refresh token은 자동으로 전송됨)
        originalRequest._retry = true;
        return _axiosAuth(originalRequest); // 원래 요청을 다시 시도
      }
    }

    // 모든 토큰 만료 및 유효하지 않은 토큰
    if (
      customCode === ERROR_CODES.EXPIRED_ACCESS_TOKEN ||
      customCode === ERROR_CODES.EXPIRED_REFRESH_TOKEN ||
      customCode === ERROR_CODES.INVALID_REFRESH_TOKEN ||
      customCode === ERROR_CODES.NOT_FOUND_REFRESH_TOKEN
    ) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
      return Promise.reject(response); // 오류 반환
    }

    return response;
  },
  (error) => {
    return Promise.reject(error); // 오류 반환
  },
);

export { _axios, _axiosAuth };
