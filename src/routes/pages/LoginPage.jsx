import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLogin } from '@/api/auth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = useLogin({ email, password });
  const navigate = useNavigate();

  // Enter 키 이벤트 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 엔터 동작 방지
      handleLogin.mutate(); // 로그인 실행
    }
  };

  return (
    <div className="mt-[200px] flex h-full items-center justify-center gap-2 pb-[250px]">
      <div className="relative z-10 w-80 rounded-lg bg-white bg-opacity-80 p-5 shadow-lg">
        <div className="mb-1 flex flex-row justify-between">
          <p className="text-xl">로그인</p>
          <p className="pt-2 text-xs">오신 것을 환영합니다.</p>
        </div>

        {/* onKeyDown 이벤트 추가 */}
        <div className="flex flex-col gap-3" onKeyDown={handleKeyDown}>
          <input
            type="text"
            placeholder="이메일을 입력하세요"
            className="h-10 rounded-md border border-gray-border-color pl-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="h-10 rounded-md border border-gray-border-color pl-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-center">
            <button
              onClick={() => handleLogin.mutate()}
              type="button"
              className="h-10 w-full rounded-full bg-primary-color text-center text-white transition-transform duration-300 hover:scale-95"
            >
              로그인
            </button>
          </div>
        </div>

        <div className="mt-[15px] text-center text-sm">
          <button
            type="button"
            onClick={() => navigate(`/signup`)}
            className="transition-transform duration-150 hover:scale-105"
          >
            회원가입
          </button>{' '}
          <span> | </span>
          <button type="button" className="transition-transform duration-150 hover:scale-105">
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
};
