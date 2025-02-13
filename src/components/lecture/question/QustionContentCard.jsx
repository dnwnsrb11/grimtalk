import { useMutation, useQueryClient } from '@tanstack/react-query';

import { _axiosAuth } from '@/api/instance';
import posterNoneImg from '@/assets/posterNoneImg.png';
import { useAuthStore } from '@/store/useAuthStore';
export const QuestionContentCard = ({ comment, boardId }) => {
  const queryClient = useQueryClient();
  const { id, email, nickname } = useAuthStore((state) => state.userData);

  const addCommentCheckMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.put('/board/pick', {
        answerId: comment.commentId,
      });
      return data;
    },
    onSuccess: () => {
      alert('답변을 채택하였습니다.');
      // ✅ 채택 후 데이터 갱신
      queryClient.invalidateQueries(['board', boardId, comment]);
    },
    onError: (error) => {
      alert(error);
    },
  });

  return (
    <div className="ml-[15px] mt-[15px] flex flex-col gap-3">
      <div className="flex flex-row">
        <img
          src={comment?.image || posterNoneImg}
          className="h-[45px] w-[45px] rounded-full bg-gray-600"
          alt=""
        />
        <div className="ml-[15px] flex w-full flex-col">
          <div className="flex w-full flex-row items-center justify-between">
            {/* 왼쪽: 닉네임 + 질문자 태그 */}
            <div className="flex flex-row items-center gap-3">
              <div className="text-[15px] font-bold">{comment?.nickname}</div>
              {boardId === comment?.commentCreatedMemberId && (
                <div className="rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                  질문자
                </div>
              )}
            </div>

            {/* 오른쪽: 기타 요소 */}
            {boardId === id ? (
              comment.picked ? (
                <span className="rounded-md bg-gray-300 px-2 py-1 text-xs font-medium text-gray-700">
                  채택 완료
                </span>
              ) : (
                <button
                  onClick={() => addCommentCheckMutation.mutate()}
                  className="rounded-md bg-primary-color px-2 py-1 text-xs font-medium text-white"
                >
                  채택하기
                </button>
              )
            ) : comment.picked ? (
              <span className="rounded-md bg-gray-300 px-2 py-1 text-xs font-medium text-gray-700">
                채택 완료
              </span>
            ) : null}
          </div>

          <div className="text-[14px] text-[#868296]">
            {comment?.createdAt
              ? new Date(comment.createdAt).toISOString().replace('T', ' ').slice(0, 16)
              : '날짜 없음'}
          </div>
        </div>
      </div>
      <div>{comment?.content}</div>
      <hr className="mt-[15px]" />
    </div>
  );
};
