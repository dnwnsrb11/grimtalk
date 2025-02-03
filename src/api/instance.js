import axios from 'axios';

// axios 인스턴스를 생성하여 공통 설정을 적용합니다
//
// 1. baseURL 설정
// - 모든 요청의 기본이 되는 API 서버 주소를 환경변수에서 가져옵니다
// - 예시: VITE_API_BASE_URL=https://api.example.com 인 경우
//   _axios.get('/users') -> https://api.example.com/users 로 요청됨
//   _axios.post('/auth') -> https://api.example.com/auth 로 요청됨
//
// 2. timeout 설정
// - 요청이 5초(5000ms) 이상 걸릴 경우 자동으로 요청을 중단합니다
// - 예시: 서버 응답이 늦어질 경우
//   throw AxiosError: timeout of 5000ms exceeded
//   이와 같은 에러가 발생하며 요청이 중단됨
const _axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 로그인 후 사용되는 axios 인스턴스(access token 포함)
const _axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
_axiosAuth.interceptors.request.use(
  (config) => {
    // 요청 직전에 항상 최신 토큰을 가져옴
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { _axios, _axiosAuth };
