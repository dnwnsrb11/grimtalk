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
export const _axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});
