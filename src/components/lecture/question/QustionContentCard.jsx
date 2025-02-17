import { useMutation, useQueryClient } from '@tanstack/react-query';

import { _axiosAuth } from '@/api/instance';
import posterNoneImg from '@/assets/posterNoneImg.png';
import { useAuthStore } from '@/store/useAuthStore';
export const QuestionContentCard = ({ comment, boardId, picked }) => {
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

  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.delete(`/board/answer/${comment.commentId}`);
      return data;
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
        <div className="ml-[15px] flex w-full flex-col gap-1">
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
            <div className="flex flex-col">
              {' '}
              {comment.picked ? (
                // 현재 댓글이 채택된 경우 "채택 완료" 표시
                <span className="rounded-md bg-gray-300 px-2 py-1 text-xs font-medium text-gray-700">
                  채택 완료
                </span>
              ) : boardId === id && !picked ? (
                // 로그인한 사용자가 질문자이고, 아직 다른 댓글이 채택되지 않은 경우만 "채택하기" 버튼 표시
                <button
                  onClick={() => addCommentCheckMutation.mutate()}
                  className="rounded-md bg-primary-color px-2 py-1 text-xs font-medium text-white"
                >
                  채택하기
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-row justify-between text-[14px] text-[#868296]">
            <div>
              {comment?.createdAt
                ? new Date(comment.createdAt).toISOString().replace('T', ' ').slice(0, 16)
                : '날짜 없음'}
            </div>
            {/* <div>
              <button
                className="rounded-md bg-black px-2 py-1 text-xs font-medium text-white"
                onClick={() => {
                  deleteCommentMutation.mutate(comment.commentId);
                }}
              >
                댓글삭제
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <div className="whitespace-pre-wrap">{comment?.content}</div>
      <hr className="mt-[15px]" />
    </div>
  );
};
