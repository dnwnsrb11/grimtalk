import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { _axiosAuth } from '@/api/instance';
import {
  CheckIcon,
  LockIcon,
  LockKeyIcon,
  LockOpenIcon,
  WrongIcon,
} from '@/components/common/icons';
import { useAuthStore } from '@/store/useAuthStore';

export const PasswordEditSection = ({ onGoBack, memberPassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const { email } = useAuthStore((state) => state.userData);
  // 비밀번호 유효성 검사 로직(추후 변경)
  const isPasswordValid = (password) => {
    return password.length >= 8;
  };
  const { mutate: changePassword, isLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.put(`/user/password`, {
        email: email,
        password: currentPassword,
        newPassword,
        newPassword2: newPasswordConfirm,
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.body.code === 200) {
        alert('비밀번호 변경이 완료되었습니다.');
        onGoBack();
      } else {
        alert('현재 비밀번호가 일치하지 않습니다.');
      }
    },
    onError: (error) => {
      alert('비밀번호 변경에 실패했습니다.:', error);
    },
  });
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
  // api 호출 필요(DB 변경 로직)
  const handlePasswordEditClick = () => {
    if (!passwordRegex.test(newPassword)) {
      alert('비밀번호는 10자 이상, 숫자, 문자, 기호를 포함해야 합니다.', {
        style: { fontSize: '14px', width: '300px' },
      });
      return;
    }
    if (!isPasswordValid(newPassword) || newPassword !== newPasswordConfirm) {
      alert('새로운 비밀번호가 다릅니다.');
      return;
    }
    changePassword();
  };
  // 회원 이메일

  return (
    <div className="flex w-[65%] flex-col gap-5">
      <div className="flex flex-col gap-4">
        <p className="my-6 text-3xl font-bold">비밀번호 변경</p>
        <div className="flex flex-col items-baseline gap-2">
          <div className="flex flex-row items-center gap-2">
            <LockIcon />
            <span className="text-xl font-bold">현재 비밀번호</span>
          </div>
          <div className="relative w-full">
            <input
              type="password"
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-semibold"
            />
            {/* <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {currentPassword === memberPassword ? <CheckIcon /> : <WrongIcon />}
            </div> */}
          </div>
          {/* {currentPassword === memberPassword ? (
            <p className="text-[18px] text-check-color">비밀번호가 일치합니다.</p>
          ) : (
            <p className="text-[18px] text-red-500">비밀번호가 일치하지 않습니다.</p>
          )} */}
        </div>
        <div className="flex flex-col items-baseline gap-2">
          <div className="flex flex-row items-center gap-2">
            <LockKeyIcon />
            <span className="text-xl font-bold">새로운 비밀번호</span>
          </div>
          <div className="relative w-full">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-semibold"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isPasswordValid(newPassword) ? <CheckIcon /> : <WrongIcon />}
            </div>
          </div>
          <p className="text-[18px] text-text-gray-color">
            (영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자 ~ 16자)
          </p>
        </div>
        <div className="flex flex-col items-baseline gap-2">
          <div className="flex flex-row items-center gap-2">
            <LockOpenIcon />
            <span className="text-xl font-bold">새로운 비밀번호 확인</span>
          </div>
          <div className="relative w-full">
            <input
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-semibold"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isPasswordValid(newPasswordConfirm) ? <CheckIcon /> : <WrongIcon />}
            </div>
          </div>
          {isPasswordValid(newPasswordConfirm) && newPassword === newPasswordConfirm ? (
            <p className="text-[18px] text-check-color">비밀번호가 일치합니다.</p>
          ) : (
            <p className="text-[18px] text-red-500">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-row justify-end gap-2">
        <button
          onClick={onGoBack}
          className="rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color hover:bg-bg-gray-color/60 focus:bg-bg-gray-color/60 active:bg-bg-gray-color/60"
        >
          뒤로가기
        </button>
        <button
          className="rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white hover:bg-primary-color/80 focus:bg-primary-color/80 active:bg-primary-color/80"
          onClick={handlePasswordEditClick}
        >
          변경하기
        </button>
      </div>
    </div>
  );
};
