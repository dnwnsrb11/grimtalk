import { useState } from 'react';

export const CommunityList = () => {
  const [checkA, setCheckA] = useState(true);
  return (
    <>
      <div className="mb-[20px] flex cursor-pointer flex-col rounded-3xl border border-gray-border-color p-5">
        <div className="mb-3">
          {/* 제목 */}
          <h2 className="text-[22px] font-bold">질문이 있습니다</h2>
        </div>
        <div className="flex justify-between">
          {/* 처음 */}
          <div className="flex gap-2">
            <div className="rounded-full border bg-bg-gray-color p-1 px-5">
              <p>이모티콘으로 부자가 되는 법 12월 수업</p>
            </div>
            <div className="rounded-full border bg-bg-gray-color p-1 px-5">
              <p>2025년 1월 20일</p>
            </div>
            <div className="rounded-full border bg-primary-color p-1 px-5">
              <p className="text-white">답변완료</p>
            </div>
          </div>
          <div>
            <div className="rounded-full border border-[#AEAEAE]  p-1 px-5">
              <p>크와와와왕</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
