import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { _axiosAuth } from '@/api/instance';
import { BadgeInformation } from '@/components/mypage/BadgeInformation';
import { PasswordEditSection } from '@/components/mypage/PasswordEditSection';
import { useAuthStore } from '@/store/useAuthStore';

export const MemberSettingsSection = () => {
  const { id, email, nickname } = useAuthStore((state) => state.userData);
  console.log(id, email, nickname);
  // 정보 조회회
  const { data: memberSettings } = useQuery({
    queryKey: ['memberSettings'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/user/${id}`);

      return data.body.data;
    },
  });
  const { memberId, memberPassword, memberSubscribeNumber, memberIntro } = {
    memberId: memberSettings?.email,
    memberPassword: 'password',
    memberSubscribeNumber: memberSettings?.subscribeNumber,
    memberIntro: memberSettings?.intro,
  };
  const [memberProfileImage, setMemberProfileImage] = useState('MYPROFILEIMAGE.jpg');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPasswordEditMode, setIsPasswordEditMode] = useState(false);

  const handleImageSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setMemberProfileImage(file.name);
      }
    };
    input.click();
  };

  // 수정 api 요청
  const memberSettingsChange = useMutation({
    mutationFn: async (formData) => {
      const { data } = await _axiosAuth.put(`/user`, formData);
      return data;
    },
    onSuccess: () => {
      alert('회원정보 수정에 성공했습니다.');
    },
    onError: (err) => {
      alert('회원정보 수정에 실패했습니다.');
    },
  });

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('intro', memberSettings?.intro || '');
    if (selectedFile) {
      console.log(selectedFile);
      formData.append('image', selectedFile);
      console.log(formData.get('image'));
    }

    // FormData 내용 확인 (출력)
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, value.name, value.type, value.size);
      } else {
        console.log(key, value);
      }
    }

    memberSettingsChange.mutate(formData);
  };

  const handlePasswordEditClick = () => {
    setIsPasswordEditMode(true);
  };

  if (isPasswordEditMode) {
    console.log(isPasswordEditMode);
    return <PasswordEditSection onGoBack={() => setIsPasswordEditMode(false)} />;
  }

  return (
    <div className="flex w-[65%] flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">아이디</label>
        <input
          type="email"
          disabled
          className="rounded-md border border-[#000000] border-opacity-20 bg-[#E6E6E6] p-2 text-[#C6C6C6]"
          value={memberId}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">비밀번호</label>
        <div className="flex flex-row justify-between gap-2">
          <input
            type="password"
            disabled
            className="flex-[80%] rounded-md border border-[#000000] border-opacity-20 bg-[#E6E6E6] p-2 text-[#C6C6C6]"
            value={memberPassword}
          />
          <button
            onClick={handlePasswordEditClick}
            className="flex-[20%] rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color hover:bg-primary-color hover:text-white focus:bg-primary-color focus:text-white active:bg-primary-color active:text-white"
          >
            비밀번호 변경
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">프로필 이미지</label>
        <div className="flex flex-row justify-between gap-2">
          <input
            type="text"
            disabled
            className="flex-[80%] rounded-md border border-[#000000] border-opacity-20 bg-[#E6E6E6] p-2 text-[#C6C6C6]"
            value={memberProfileImage}
          />
          <button
            onClick={handleImageSelect}
            className="flex-[20%] rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color hover:bg-primary-color hover:text-white focus:bg-primary-color focus:text-white active:bg-primary-color active:text-white"
          >
            이미지 찾기
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">뱃지</label>
        <div className="flex flex-row gap-2 rounded-md border border-[#000000] border-opacity-20 p-4">
          <BadgeInformation
            nickname="우준규"
            subscribeNumber={memberSubscribeNumber}
            badgeWidth={40}
            badgeHeight={40}
            textSize="sm"
          />
        </div>
      </div>
      <hr className="mt-5 border-divider-color" />
      <div className="flex flex-row justify-end gap-2">
        <button
          className="rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color 
            hover:bg-bg-gray-color/60 
            focus:bg-bg-gray-color/60 
            active:bg-bg-gray-color/60"
        >
          뒤로가기
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white hover:bg-primary-color/80 focus:bg-primary-color/80 active:bg-primary-color/80"
        >
          수정하기
        </button>
      </div>
    </div>
  );
};
