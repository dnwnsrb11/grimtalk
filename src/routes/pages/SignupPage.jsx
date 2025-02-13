import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [nickname, setNickname] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const navigate = useNavigate();
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
    onSuccess: (data) => {
      // 회원가입 성공 시
      // 페이지 이동
      if (data.body.code === 200) {
        navigate('/signup-success', { state: { nickname: nickname } });
      } else {
        // 회원가입 실패 시
        // 에러 처리
        alert(data.body.message);
      }
    },
    onError: (error) => {
      // 회원가입 실패 시
      // 에러 처리
      console.error(error);
    },
  });

  return (
    <div className="relative mt-[160px] flex h-full items-center justify-center gap-2 pb-[250px]">
      <div className="relative z-10 w-80 rounded-lg bg-white bg-opacity-80 p-5 shadow-lg">
        <div className="mb-1 flex flex-row justify-between">
          <p className="text-xl">회원가입</p>
          <p className="pt-2 text-xs">오신 것을 환영합니다.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
            if (!email || !password || !password2 || !nickname || !question || !answer) {
              toast.error('모든 정보를 입력해 주세요.', {
                style: { fontSize: '14px', width: '300px' },
              });
              return;
            }
            if (password !== password2) {
              toast.error('비밀번호가 일치하지 않습니다.', {
                style: { fontSize: '14px', width: '300px' },
              });
              return;
            }

            if (!passwordRegex.test(password)) {
              toast.error('비밀번호는 10자 이상, 숫자, 문자, 기호를 포함해야 합니다.', {
                style: { fontSize: '14px', width: '300px' },
              });
              return;
            }
            signupMutation.mutate();
          }}
        >
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="이메일을 입력하세요."
              className="mb-[7px] h-10 rounded-md border border-gray-border-color pl-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호를 입력하세요."
              className="mb-[7px] h-10 rounded-md border border-gray-border-color pl-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호를 다시 입력하세요."
              className="mb-[7px] h-10 rounded-md border border-gray-border-color pl-3"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <br />
            <input
              type="text"
              placeholder="닉네임을 알려주세요."
              className="mb-[7px] h-10 rounded-md border border-gray-border-color pl-3"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <select
              className="mb-[7px] h-10 rounded-md border border-gray-border-color pl-3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            >
              <option value="">-- 질문을 선택하세요 --</option>
              <option value="1">첫 번째 애완동물의 이름은 무엇인가요?</option>
              <option value="2">어렸을 때 좋아하던 음식은 무엇인가요?</option>
              <option value="3">첫 번째 학교의 이름은 무엇인가요?</option>
              <option value="4">부모님의 출생지는 어디인가요?</option>
              <option value="5">좋아하는 영화의 제목은 무엇인가요?</option>
            </select>
            <input
              type="text"
              placeholder="질문 답변을 작성해주세요."
              className="mb-[7px] h-10 rounded-md border border-gray-border-color pl-3"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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
