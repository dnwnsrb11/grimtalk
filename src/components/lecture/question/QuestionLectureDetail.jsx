import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { _axios } from '@/api/instance';

export const QuestionLectureDetail = ({ setIsActive, questionId, checkInstructor }) => {
  const [answer, setAnswer] = useState('현재 답변이 없습니다.');

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

      return data.body.data;
    },
    onError: (error) => {},
  });

  const changeActive = () => {
    setIsActive(false);
  };

  if (isLoading) return <div>로딩 중...</div>;
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
          <div className="rounded-full bg-bg-gray-color px-[10px] py-[5px]">
            <p className="text-[14px] font-semibold text-text-gray-color">미답변</p>
          </div>
        </div>
        <div className="mt-[10px] min-h-[100px]">
          <p className="text-[18px]">{answer}</p>
          {board.comments?.map((comment, index) => (
            <p key={index} className="text-[18px]">
              {comment}
            </p>
          ))}
        </div>
      </div>
      <hr className="border-gray-border-color" />
      {checkInstructor && (
        // 조건부 렌더링을 하기위해 <> 추가
        <>
          <div className="mt-[20px]">
            <div className="flex items-center gap-3">
              <h1 className="text-[32px] font-bold">답변</h1>
            </div>
            <div className="mt-[20px] w-full">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[60px] w-full rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
                placeholder="답변을 입려해주세요."
              />
            </div>
          </div>
          <hr className="mt-[40px] border-gray-border-color" />
        </>
      )}
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
            // onClick={() => 답변 저장()}
          >
            <p className="text-[18px] font-semibold text-white">작성하기</p>
          </button>
        )}
      </div>
    </>
  );
};
