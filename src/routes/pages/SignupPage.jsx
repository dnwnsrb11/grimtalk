import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { _axios } from '@/api/instance';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [nickname, setNickname] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // 회원가입 API 요청
  const signupMutation = useMutation({
    mutationFn: async () => {
      const response = await _axios.post('/user', {
        email,
        password,
        password2,
        nickname,
        question,
        answer,
      });
      return response.data;
    },
    onSuccess: () => {
      // 회원가입 성공 시
      // 페이지 이동
      history.push('/signup-success');
    },
    onError: (error) => {
      // 회원가입 실패 시
      // 에러 처리
      console.error(error);
    },
  });

  return (
    <div className="relative flex h-full items-center justify-center gap-2 mt-[150px] pb-[250px]">
      <div className="relative z-10 w-80 rounded-lg bg-white bg-opacity-80 p-5 shadow-lg">
        <div className="mb-1 flex flex-row justify-between">
          <p className="text-xl">회원가입</p>
          <p className="pt-2 text-xs">오신 것을 환영합니다.</p>
        </div>
        <form>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="이메일을 입력하세요."
              className="h-10 rounded-md border border-gray-border-color pl-3"
            />
            <input
              type="password"
              placeholder="비밀번호를 입력하세요."
              className="h-10 rounded-md border border-gray-border-color pl-3"
            />
            <input
              type="password"
              placeholder="비밀번호를 다시 입력하세요."
              className="h-10 rounded-md border border-gray-border-color pl-3"
            />
            <br />
            <input
              type="text"
              placeholder="닉네임을 알려주세요."
              className="h-10 rounded-md border border-gray-border-color pl-3"
            />
            <select className="h-10 rounded-md border border-gray-border-color pl-3">
              <option value="">-- 질문을 선택하세요 --</option>
              <option value="petName">첫 번째 애완동물의 이름은 무엇인가요?</option>
              <option value="favoriteFood">어렸을 때 좋아하던 음식은 무엇인가요?</option>
              <option value="schoolName">첫 번째 학교의 이름은 무엇인가요?</option>
              <option value="birthPlace">부모님의 출생지는 어디인가요?</option>
              <option value="favoriteMovie">좋아하는 영화의 제목은 무엇인가요?</option>
            </select>
            <input
              type="text"
              placeholder="질문 답변을 작성해주세요."
              className="h-10 rounded-md border border-gray-border-color pl-3"
            />
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="h-10 w-full rounded-full bg-primary-color text-center text-white"
              >
                회원가입
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
