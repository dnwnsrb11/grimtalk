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
