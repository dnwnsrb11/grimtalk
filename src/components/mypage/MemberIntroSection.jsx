import { useState } from 'react';

// 마이페이지의 유저 소개 섹션을 담당하는 컴포넌트
export const MemberIntroSection = ({ isEditing, setIsEditing }) => {
  const [introText, setIntroText] =
    useState(`안녕하세요! 저는 프로그래밍을 사랑하는 열정적인 개발자입니다.
새로운 기술을 배우는 것을 즐기며, 특히 웹 개발에 큰 관심이 있습니다.
React와 TypeScript를 주로 사용하고 있으며, 클린 코드와 사용자 경험을 중요하게 생각합니다.
함께 성장하고 배우는 것을 좋아합니다.

현재는 프론트엔드 개발에 집중하고 있지만, 백엔드 기술도 꾸준히 공부하며 풀스택 개발자가 되기 위해 노력하고 있습니다.
개발자 커뮤니티에도 적극적으로 참여하여 다양한 경험을 쌓고 있으며, 오픈소스 프로젝트에도 기여하고 있습니다.
항상 사용자의 입장에서 생각하고, 더 나은 서비스를 만들기 위해 고민하는 개발자가 되고 싶습니다.`);

  const [editingText, setEditingText] = useState(introText);

  const handleSave = () => {
    setIntroText(editingText);
    setIsEditing(false);
    // 여기에 API 호출 로직 추가
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          className="h-[40vh] w-full resize-none overflow-auto rounded-[20px] border border-[#000000] border-opacity-20 p-5 focus:outline-none"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color 
            hover:bg-bg-gray-color/60 
            focus:bg-bg-gray-color/60 
            active:bg-bg-gray-color/60"
          >
            뒤로가기
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white hover:bg-primary-color/80 focus:bg-primary-color/80 active:bg-primary-color/80"
          >
            수정하기
          </button>
        </div>
      </div>
    );
  }

  return <p className="whitespace-pre-wrap break-all text-base">{introText}</p>;
};
