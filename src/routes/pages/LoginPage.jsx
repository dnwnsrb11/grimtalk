import { useState } from 'react';

import { usePostLogin } from '@/api/auth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = usePostLogin({ email, password });

  return (
    <div className="flex h-full items-center justify-center gap-2 pb-[250px]">
      {' '}
      {/* pt-[105px] 추가 */}
      <div className="relative z-10 w-80 rounded-lg bg-white bg-opacity-80 p-5 shadow-lg">
        <div className="mb-1 flex flex-row justify-between">
          <p className="text-xl">로그인</p>
          <p className="pt-2 text-xs">오신 것을 환영합니다.</p>
        </div>

        <div className="flex flex-col gap-3">
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
              type="submit"
              className="h-10 w-full rounded-full bg-primary-color text-center text-white"
            >
              로그인
            </button>
          </div>
          <div className="text-center text-xs">
            <button type="submit">회원가입</button> | <button type="submit">비밀번호 찾기</button>
          </div>
        </div>
      </div>
    </div>
  );
};
