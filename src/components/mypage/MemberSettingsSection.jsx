import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { BadgeInformation } from '@/components/mypage/BadgeInformation';
import { PasswordEditSection } from '@/components/mypage/PasswordEditSection';
import { useAuthStore } from '@/store/useAuthStore';

export const MemberSettingsSection = () => {
  const navigate = useNavigate();
  const { id, email, nickname } = useAuthStore((state) => state.userData);
  // 정보 조회회
  const { data: memberSettings } = useQuery({
    queryKey: ['memberSettings'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/user/${id}`);
      return data.body.data;
    },
  });
  const { memberId, memberPassword, memberSubscribeNumber, memberIntro, memberImage } = {
    memberId: memberSettings?.email,
    memberPassword: 'password',
    memberSubscribeNumber: memberSettings?.subscribeNumber,
    memberIntro: memberSettings?.intro,
    memberImage: memberSettings?.image,
  };
  // console.log(memberSettings);
  const [memberProfileImage, setMemberProfileImage] = useState(memberImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPasswordEditMode, setIsPasswordEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  // 이미지 리사이징 함수
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxWidth = 150; // 원하는 이미지 가로 크기
          const maxHeight = 150; // 원하는 이미지 세로 크기
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (width > height) {
              width = maxWidth;
              height = maxWidth / aspectRatio;
            } else {
              height = maxHeight;
              width = maxHeight * aspectRatio;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, { type: file.type });
            resolve(resizedFile);
          }, file.type);
        };
      };
    });
  };

  const handleImageSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const resizedImage = await resizeImage(file);
        setSelectedFile(file);
        setMemberProfileImage(file.name);
        setPreviewImage(URL.createObjectURL(resizedImage));
      }
    };
    input.click();
  };
  // 수정 api 요청
  const memberSettingsChange = useMutation({
    mutationFn: async (formData) => {
      const { data } = await _axiosAuth.put(`/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 명시적으로 헤더 설정
        },
      });
      return data;
    },
    onSuccess: () => {
      alert('회원 정보가 성공적으로 수정되었습니다!'); // ✅ 성공 알림 추가
      navigate(`/mypage/${id}`, {
        state: {
          joinId: id,
          selectedMenu: '유저소개',
          selectedProfileMenu: '수강생',
        },
      });
    },
    onError: (error) => {
      alert('회원 정보 수정에 실패했습니다. 다시 시도해주세요.'); // ❌ 실패 알림 추가
    },
  });

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('intro', memberIntro || '');
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    console.log(formData+13);

    memberSettingsChange.mutate(formData);
  };

  const handlePasswordEditClick = () => {
    setIsPasswordEditMode(true);
  };

  if (isPasswordEditMode) {
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
        {previewImage && (
          <img
            src={previewImage}
            alt="미리보기"
            className="h-[150px] w-[150px] rounded-full border border-gray-300 object-cover"
          />
        )}
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
            nickname={nickname}
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
          disabled={!memberSettings} // memberSettings가 없으면 비활성화
          className={`rounded-md px-4 py-2 text-sm font-semibold text-white 
    ${
      memberSettings
        ? 'bg-primary-color hover:bg-primary-color/80 focus:bg-primary-color/80 active:bg-primary-color/80'
        : 'cursor-not-allowed bg-gray-400'
    }`}
        >
          수정하기
        </button>
      </div>
    </div>
  );
};
