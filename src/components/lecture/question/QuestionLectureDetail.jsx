import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { _axios, _axiosAuth } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { QuestionContentCard } from '@/components/lecture/question/QustionContentCard';
import { useAuthStore } from '@/store/useAuthStore';

export const QuestionLectureDetail = ({
  setIsActive,
  questionId,
  checkInstructor,
  lectureInstructorInfoId,
  boardCreatedMemberId,
  routerBoardCreatedId,
  routerBoardBoardId,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [answerId, setAnserId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const { id, email, nickname } = useAuthStore((state) => state.userData);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };
  const {
    data: board,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['board', questionId],
    queryFn: async () => {
      let response;

      if (routerBoardBoardId) {
        response = await _axios.get(`/board/${routerBoardBoardId}`);
      } else {
        response = await _axios.get(`/board/${questionId}`);
      }

      const data = response.data.body.data;

      if (!data) {
        throw new Error('데이터가 없습니다.');
      }

      setAnserId(data?.comments[0]?.commentId);
      return data;
    },
    staleTime: 0,
    onError: () => {
      navigate('/notfound');
    },
  });

  const boardComments = board?.comments;

  // 작성 api
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (answer === '') {
        alert('댓글을 작성해주세요.');
        throw new Error('답변이 비어 있음');
      }
      const { data } = await _axiosAuth.post('/board/answer', {
        boardId: questionId,
        answerContent: answer,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('댓글 작성 완료!');
      setAnswer('');
      queryClient.invalidateQueries(['board', questionId]); // 🔥 해당 쿼리만 리패칭
    },
  });

  // 질문 삭제
  const deleteBoardMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.delete(`/board/${board?.boardId}`);
      return data;
    },
    onSuccess: (data) => {
      setIsActive(false);
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  // 질문 삭제 버튼
  const deleteBoardCheckMutation = () => {
    const isConfirmed = window.confirm('정말 삭제하시겠습니까?');
    if (isConfirmed) {
      deleteBoardMutation.mutate(null, {
        onSuccess: () => {
          queryClient.invalidateQueries(['board', questionId]); // ✅ 데이터 다시 불러오기
          toast.success('삭제가 완료되었습니다!');
        },
      });
    }
  };

  const changeActive = () => {
    navigate(-1); // 브라우저의 뒤로 가기 기능 실행
  };

  if (isLoading) {
    return <LoadingComponents />;
  }
  if (isError) return <div>에러가 발생했습니다.ㅁㄴㅇ</div>;

  return (
    <>
      <div className="mt-[60px] min-h-[200px]">
        <h1 className="text-[32px] font-bold">{board.subject || ''}</h1>
        <div className="text-[14px] text-[#868296]">
          {board?.createdAt
            ? new Date(board.createdAt).toISOString().replace('T', ' ').slice(0, 16)
            : '날짜 없음'}
        </div>
        <div className="ml-[10px] mt-[20px]">
          <p className="text-[18px]">{board.content || ''}</p>
        </div>
      </div>
      <div className="flex w-full justify-end">
        작성자 :&nbsp;<span className="font-bold"> {boardCreatedMemberId}</span>
      </div>
      <hr />
      <div className="mt-[20px]">
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] font-bold">답변</h1>
          {board?.comments?.length > 0 ? (
            <div className="rounded-full bg-primary-color px-[10px] py-[5px]">
              <p className="text-[14px] font-semibold text-white">답변</p>
            </div>
          ) : (
            <div className="rounded-full bg-bg-gray-color px-[10px] py-[5px]">
              <p className="text-[14px] font-semibold text-text-gray-color">미답변</p>
            </div>
          )}
        </div>

        {/* // 조건부 렌더링을 하기위해 <> 추가 */}
        <>
          <div className="mt-[20px] flex flex-col gap-2">
            <div className="mt-[20px] w-full">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // 기본 엔터 동작 방지
                    addCommentMutation.mutate(); // 버튼 클릭 함수 실행
                  }
                }}
                className="min-h-[60px] w-full rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
                placeholder="답변을 입력해주세요. (Shift+Enter: 줄바꿈, Enter: 작성)"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="w-[65px] rounded-2xl border border-gray-border-color bg-primary-color p-[10px]"
                onClick={() => addCommentMutation.mutate()}
              >
                <p className="text-[12px] font-semibold text-white">작성하기</p>
              </button>
            </div>
          </div>
          <hr className="mt-[40px] border-gray-border-color" />
        </>

        <div className="mt-[10px] min-h-[100px]">
          {boardComments?.length > 0 ? (
            <div className="space-y-3">
              {boardComments.slice(0, visibleCount).map((comment, index) => (
                <div key={index} className="flex h-full flex-col">
                  <QuestionContentCard
                    key={index}
                    comment={comment}
                    boardId={board?.boardCreatedMemberId}
                    picked={board?.picked}
                    // picked={board?.picked}
                  />
                </div>
              ))}
              {/* 🔥 '더보기' 버튼 추가 (모든 댓글이 표시되면 숨김) */}
              {visibleCount < boardComments.length && (
                <div className="flex justify-center">
                  <button
                    onClick={handleShowMore}
                    className="mt-4 w-[70px] rounded-lg bg-primary-color py-2 font-semibold text-white"
                  >
                    더보기
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[18px] font-medium text-text-gray-color">현재 답변이 없습니다.</p>
          )}
        </div>
      </div>
      <hr className="mt-[24px] border-gray-border-color" />

      <div className="mt-[20px] flex justify-end gap-2">
        <button
          className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={() => changeActive()}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>

        {lectureInstructorInfoId === id ? (
          <button
            className="ml-[10px] rounded-2xl border border-gray-border-color bg-gray-800 p-[10px] px-[15px]"
            onClick={() => deleteBoardCheckMutation()}
          >
            <p className="text-[18px] font-semibold text-white">질문 삭제</p>
          </button>
        ) : null}
      </div>
    </>
  );
};
