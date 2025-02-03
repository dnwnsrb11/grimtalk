import { useQuery } from '@tanstack/react-query';

import { _axios } from '@/api/instance';
export const QuestionLectureDetail = ({ setIsActive, questionId }) => {
  // 받은 boardId로 데이터를 조회한다.
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
        <div className="flex gap-3">
          <h1 className="text-[32px] font-bold">답변</h1>
          <div className="flex items-center justify-center rounded-full bg-primary-color px-[15px] py-0">
            <p className="font-semibold text-[14p] text-white">답변완료</p>
          </div>
        </div>
        <div className="mt-[10px] min-h-[100px]">
          {board.comments?.map((comment, index) => (
            <p key={index} className="text-[18px]">
              {comment}
            </p>
          ))}
        </div>
      </div>
      <hr />
      <div className="mt-[20px] flex justify-end">
        <button
          className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={() => changeActive()}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>
      </div>
    </>
  );
};
