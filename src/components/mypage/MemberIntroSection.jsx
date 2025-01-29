import { useState } from 'react';

// 마이페이지의 유저 소개 섹션을 담당하는 컴포넌트
export const MemberIntroSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [introText, setIntroText] = useState('');

  const [editingText, setEditingText] = useState(introText);

  const handleSave = () => {
    setIntroText(editingText);
    setIsEditing(false);
    // 여기에 API 호출 로직 추가
  };

  const handleEditClick = () => {
    setEditingText(introText); // 수정 모드 진입 시 현재 저장된 텍스트로 초기화
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <textarea
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          className={`absolute inset-0 h-[40vh] w-full resize-none overflow-auto rounded-[20px] border p-5 transition-[border-color] duration-300 focus:outline-none ${
            isEditing ? 'visible z-10 border-primary-color' : 'invisible z-0'
          }`}
        />
        <p
          className={`h-[40vh] w-full overflow-auto whitespace-pre-wrap break-all rounded-[20px] border p-5 text-base transition-[border-color] duration-300 ${
            isEditing ? 'invisible z-0' : 'visible z-10 border-divider-color'
          } ${!introText ? 'text-text-gray-color' : 'text-common-font-color'}`}
        >
          {introText ? introText : '소개글을 작성해주세요.'}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color hover:bg-bg-gray-color/60"
            >
              뒤로가기
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white hover:bg-primary-color/80"
            >
              수정완료
            </button>
          </>
        ) : (
          <button
            onClick={() => handleEditClick()}
            className="rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white hover:bg-primary-color/80"
          >
            수정하기
          </button>
        )}
      </div>
    </div>
  );
};
