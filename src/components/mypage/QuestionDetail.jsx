import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';

export const QuestionDetail = ({ boardId, setIsActive }) => {
  const navigate = useNavigate();
  const checkInstructor = useState(true);
  const { data: questionDetail } = useQuery({
    queryKey: ['questionDetail'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/board/${boardId}`);
      return data.body.data;
    },
  });
  return (
    <>
      <div className="mt-[60px] min-h-[200px]">
        <h1 className="text-[32px] font-bold">{questionDetail?.subject || ''}</h1>
        <div className="mt-[10px]">
          <p className="text-[18px]">{questionDetail?.content || ''}</p>
        </div>
      </div>
      <hr />
      <div className="mt-[20px]">
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] font-bold">답변</h1>
          {questionDetail?.comments?.length > 0 ? (
            <div className="rounded-full bg-primary-color px-[10px] py-[5px]">
              <p className="text-[14px] font-semibold text-white">답변</p>
            </div>
          ) : (
            <div className="rounded-full bg-bg-gray-color px-[10px] py-[5px]">
              <p className="text-[14px] font-semibold text-text-gray-color">미답변</p>
            </div>
          )}
        </div>
        <div className="mt-[10px] min-h-[100px]">
          {questionDetail?.comments?.length > 0 ? (
            <p className="text-[18px] text-black">{questionDetail.comments[0]?.content || ''}</p>
          ) : (
            <p className="text-[18px] font-medium text-text-gray-color">현재 답변이 없습니다.</p>
          )}
        </div>
      </div>
      <hr className="border-gray-border-color" />
      <div className="mt-[20px] flex justify-end gap-2">
        <button
          className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={() => setIsActive()}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>
        {checkInstructor && (
          <button
            className="rounded-2xl border border-gray-border-color bg-primary-color p-[10px]"
            onClick={() => navigate(`/lecture/${boardId}`)}
          >
            <p className="text-[18px] font-semibold text-white">강의로 이동</p>
          </button>
        )}
      </div>
    </>
  );
};
