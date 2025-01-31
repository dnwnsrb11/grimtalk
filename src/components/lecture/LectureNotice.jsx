import { useState } from 'react';
import { LectureNoticeDetail } from '@/components/lecture/notice/LectureNoticeDetail';
import { LectureNoticeCard } from '@/components/lecture/notice/LectureNoticeCard';

export const LectureNotice = () => {
  // test
  const testList = ['one', 'two', 'three'];
  // 상세페이지 기능 구현
  const [noticeDate, setNoticeDate] = useState('');
  const [isActive, setIsActive] = useState(false);

  if (isActive) {
    return <LectureNoticeDetail noticeDate={noticeDate} setIsActive={setIsActive} />;
  }
  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">공지사항</h1>
        {/* 공지사항 내용 */}
        <div className="mt-[40px]">
          {testList.map((testData, index) => (
            <div key={index} className="mb-3" onClick={() => setIsActive(true)}>
              <LectureNoticeCard />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
