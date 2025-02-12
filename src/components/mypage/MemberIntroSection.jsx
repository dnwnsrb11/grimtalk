import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { _axiosAuth } from '@/api/instance';
import { useAuthStore } from '@/store/useAuthStore';

// 마이페이지의 유저 소개 섹션을 담당하는 컴포넌트
export const MemberIntroSection = ({ joinId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [introText, setIntroText] = useState(''); // 초기 소개글 상태
  const [editingText, setEditingText] = useState(introText); // 수정할 텍스트 상태
  const { id, email, nickname } = useAuthStore((state) => state.userData);

  // 유저소개 조회 api (joinId를 사용해서 해당 유저의 소개글을 가져옴)
  const {
    data: userintroduce,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['userintroduce', joinId], // joinId가 변경될 때마다 새로 불러옴
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/user/${joinId}`);
      return data.body.data.intro; // 해당 유저의 소개글을 반환
    },
    enabled: !!joinId, // joinId가 있을 때만 요청
  });

  // 로딩 중일 때와 에러가 발생한 경우 처리
  useEffect(() => {
    if (userintroduce) {
      setIntroText(userintroduce); // 가져온 소개글을 상태에 저장
      setEditingText(userintroduce); // 수정용 상태에 저장
    }
  }, [userintroduce]); // userintroduce가 바뀔 때마다 실행

  const handleSave = async () => {
    try {
      await _axiosAuth.put(`/user/intro`, {
        intro: editingText,
      }); // 소개글 수정 API 호출

      setIntroText(editingText); // 수정된 소개글 상태 업데이트
      setIsEditing(false); // 수정 완료 후 편집 모드 종료

      alert('소개글이 성공적으로 수정되었습니다!'); // ✅ 성공 알림 추가
    } catch (error) {
      alert('소개글 수정에 실패했습니다. 다시 시도해주세요.'); // ❌ 실패 알림 추가
    }
  };

  const handleEditClick = () => {
    setEditingText(introText); // 수정 모드 진입 시 현재 저장된 텍스트로 초기화
    setIsEditing(true);
  };

  if (isLoading) return <div>Loading...</div>; // 로딩 중일 때
  if (isError) return <div>Error occurred while fetching data</div>; // 에러 발생 시

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <textarea
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          className={`absolute inset-0 h-[40vh] w-full resize-none overflow-auto rounded-[20px] border p-5 transition-[border-color] duration-300 focus:outline-none ${
            isEditing ? 'border-primary-color' : 'border-gray-border-color'
          }`}
        />

        <p
          className={`h-[40vh] w-full overflow-auto whitespace-pre-wrap break-all rounded-[20px] border p-5 text-base transition-[border-color] duration-300 ${
            isEditing ? 'invisible z-0' : 'visible z-10 border-divider-color'
          } ${!introText ? 'text-text-gray-color' : 'text-common-font-color'}`}
        >
          {introText || '소개글을 작성해주세요.'} {/* 기본값 설정 */}
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
          id === joinId && ( // ✅ myid와 joinid가 같을 때만 버튼 보이게 처리
            <button
              onClick={handleEditClick}
              className="rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white hover:bg-primary-color/80"
            >
              수정하기
            </button>
          )
        )}
      </div>
    </div>
  );
};
