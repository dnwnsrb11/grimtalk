import { useState } from 'react';

export const CommunityList = () => {
  const [checkA, setCheckA] = useState(true);
  return (
    <>
      <div className="flex flex-col rounded-2xl border p-5">
        <div>
          {/* 제목 */}
          <h2>질문이 있습니다</h2>
        </div>
        <div className="flex justify-between">
          {/* 처음 */}
          <div className="flex gap-3">
            <div>
              <p>이모티콘으로 부자가 되는 법 12월 수업</p>
            </div>
            <div>
              <p>2025년 1월 20일</p>
            </div>
            <div>
              <p>답변완료</p>
            </div>
          </div>
          <div>
            <div>
              <p>크와와와왕</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
