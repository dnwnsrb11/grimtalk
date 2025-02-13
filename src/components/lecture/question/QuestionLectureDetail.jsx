import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axios, _axiosAuth } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';

export const QuestionLectureDetail = ({ setIsActive, questionId, checkInstructor }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [answerId, setAnserId] = useState(null);

  const {
    data: board,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['board', questionId],
    queryFn: async () => {
      const { data } = await _axios.get(`/board/${questionId}`);

      if (!data.body.data) {
        throw new Error('데이터가 없습니다.');
      }
      setAnserId(data?.body?.data?.comments[0]?.commentId);
      return data.body.data;
    },
    onError: () => {
      navigate('/notfound');
    },
  });
  const boardComments = board.comments;

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
    onSuccess: (data) => {
      setIsActive(false);
      console.log('댓글 작성 성공', answer);
      queryClient.setQueryData(['board', questionId], (oldBoard) => {
        return {
          ...oldBoard,
          comment: data.body.data.answerContent,
        };
      });
      setAnswer('');
    },
  });

  // 채택 기능
  const addCommentCheckMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.put('/board/pick', {
        answerId: answerId,
      });
      return data;
    },
    onSuccess: () => {
      alert('답변을 채택하였습니다.');
      setIsActive(false);
    },
  });

  const changeActive = () => {
    setIsActive(false);
  };

  if (isLoading) {
    return <LoadingComponents />;
  }
  if (isError) return <div>에러가 발생했습니다.</div>;

  return (
    <>
      <div className="mt-[60px] min-h-[200px]">
        <h1 className="text-[32px] font-bold">{board.subject || ''}</h1>
        <div className="mt-[10px]">
          <p className="text-[18px]">{board.content || ''}</p>
        </div>
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
          <div className="mt-[20px]">
            <div className="mt-[20px] w-full">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[60px] w-full rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
                placeholder="답변을 입력해주세요."
              />
            </div>
          </div>
          <hr className="mt-[40px] border-gray-border-color" />
        </>

        <div className="mt-[10px] min-h-[100px]">
          {boardComments?.length > 0 ? (
            <div className="space-y-3">
              {boardComments.map((comment, index) => (
                <div key={index} className="flex h-full flex-col">
                  <div>{comment.content}</div>
                  <div>{comment.nickname}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[18px] font-medium text-text-gray-color">현재 답변이 없습니다.</p>
          )}
        </div>
      </div>
      <hr className="border-gray-border-color" />

      <div className="mt-[20px] flex justify-end gap-2">
        <button
          className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={() => changeActive()}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>
        {checkInstructor && (
          <button
            className="rounded-2xl border border-gray-border-color bg-primary-color p-[10px]"
            onClick={() => addCommentMutation.mutate()}
          >
            <p className="text-[18px] font-semibold text-white">작성하기</p>
          </button>
        )}
        {!checkInstructor && board?.comments?.length > 0 && (
          <button
            className="ml-[10px] rounded-2xl border border-gray-border-color bg-gray-800 p-[10px] px-[15px]"
            onClick={() => addCommentCheckMutation.mutate()}
          >
            <p className="text-[18px] font-semibold text-white">답변완료</p>
          </button>
        )}
      </div>
    </>
  );
};
