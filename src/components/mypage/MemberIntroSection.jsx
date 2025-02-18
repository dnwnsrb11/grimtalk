import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { _axiosAuth } from '@/api/instance';
import { useAuthStore } from '@/store/useAuthStore';

// 마이페이지의 유저 소개 섹션을 담당하는 컴포넌트
export const MemberIntroSection = ({ joinId }) => {
  const queryClint = useQueryClient();
  const MAX_LENGTH = 1000; // 글자 수 제한
  const [isEditing, setIsEditing] = useState(false);
  const [introText, setIntroText] = useState(''); // 초기 소개글 상태
  const [editingText, setEditingText] = useState(''); // 수정할 텍스트 상태
  const { id } = useAuthStore((state) => state.userData);

  // 유저소개 조회 API (joinId를 사용해서 해당 유저의 소개글을 가져옴)
  const {
    data: userIntroduce,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['userIntroduce', joinId, id],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/user/${joinId}`);
      return data.body.data.intro;
    },
    // enabled: !!joinId, // joinId가 있을 때만 요청
    staleTime: 0,
    onSuccess: (data) => {
      console.log(data.body.code);
      if (data.body.code !== 200) {
        alert('로그인 후 이용해주세요.');
        console.log('ㅁㄴㅇㄹ');
        navigate('/login');
      }
    },
  });
  // fetch로 바로 조회
  useEffect(() => {
    if (joinId) {
      refetch(); // ✅ 새로운 유저 정보 가져오기
    }
    setIntroText(userIntroduce);
    setEditingText(userIntroduce);
  }, [joinId, refetch, userIntroduce]);

  const handleSave = async () => {
    if (editingText?.length >= MAX_LENGTH) {
      toast.error(`소개글은 ${MAX_LENGTH}자 이내로 입력해주세요.`);
      return;
    }

    try {
      await _axiosAuth.put(`/user/intro`, { intro: editingText });

      setIntroText(editingText);
      setIsEditing(false);
      toast.success('소개글이 성공적으로 수정되었습니다!');
      queryClint.invalidateQueries(['useIntroduce'], joinId);
    } catch (error) {
      toast.error('소개글 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text?.length > MAX_LENGTH) {
      toast.error(`소개글은 ${MAX_LENGTH}자 이내로 입력해주세요.`);
      return;
    }
    setEditingText(text);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred while fetching data</div>;
  return (
    <div className="flex flex-col gap-2">
      {isEditing ? (
        <div>
          <div className="relative">
            <textarea
              value={editingText}
              onChange={handleTextChange} // ✅ 1000자 초과 감지 및 토스트 알림 실행
              className="h-[40vh] w-full resize-none overflow-auto rounded-[20px] border border-primary-color p-5 pr-16 transition-[border-color] duration-300 focus:outline-none"
              maxLength={MAX_LENGTH}
            />
            {/* 글자 수 표시 - textarea 내부 우측 하단 */}
            <small className="absolute bottom-4 right-5 text-xs text-gray-500">
              {editingText?.length} / {MAX_LENGTH}
            </small>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingText(userIntroduce);
              }}
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
          </div>
        </div>
      ) : (
        <div className="relative">
          <p
            className={`h-[40vh] w-full overflow-auto whitespace-pre-wrap break-all rounded-[20px] border border-divider-color p-5 text-base transition-[border-color] duration-300 ${
              !introText ? 'text-text-gray-color' : 'text-common-font-color'
            }`}
          >
            {introText || '소개글을 작성해주세요.'}
          </p>
          {id === joinId && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white hover:bg-primary-color/80"
              >
                수정하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
