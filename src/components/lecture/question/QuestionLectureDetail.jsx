import { useQuery } from '@tanstack/react-query';

import { _axios } from '@/api/instance';
export const QuestionLectureDetail = ({ setIsActive, questionData }) => {
  // 받은 boardId로 데이터를 조회한다.
  const { data: board } = useQuery({
    queryKey: ['board', questionData],
    queryFn: async () => {
      const { data } = await _axios.get(`/board/${questionData}`);
      return data;
    },
  });
  const changeActive = () => {
    setIsActive(false);
  };
  return (
    <>
      <div className="mt-[60px] min-h-[200px]">
        <h1 className="text-[32px] font-bold">{board?.body?.data?.subject}</h1>
        <div className="mt-[10px]">
          <p className="text-[18px]">{board?.body?.data?.content}</p>
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
          {board?.body?.data?.comment?.map((comment, index) => (
            <p className="text-[18px]">{comment}</p>
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
