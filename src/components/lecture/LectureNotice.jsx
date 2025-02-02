import { useEffect, useState } from 'react';

import { LectureNoticeCard } from '@/components/lecture/notice/LectureNoticeCard';
import { LectureNoticeDetail } from '@/components/lecture/notice/LectureNoticeDetail';

export const LectureNotice = ({ checkInstructor }) => {
  // test
  const testList = ['one', 'two', 'three'];
  // 상세페이지 기능 구현
  const [noticeDate, setNoticeDate] = useState('');
  const [isActive, setIsActive] = useState(false);
  // 작성 공지사항
  const [createNoticeDate, setCreateNoticeDate] = useState('');

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      setIsActive(false);
    };
    if (isActive) {
      // popstate 이벤트 리스너 등록
      window.addEventListener('popstate', handlePopState);

      // 초기 상태로 히스토리를 추가하여 뒤로가기 기능을 막음
      // 이를 통해 뒤로가기 버튼을 클릭하면 isActive 값만 변경됨
      history.pushState(null, document.title);
    } else {
      // isActive가 false일 때는 popstate 이벤트 리스너 제거
      window.removeEventListener('popstate', handlePopState);
    }
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isActive]);

  if (isActive) {
    return <LectureNoticeDetail noticeDate={noticeDate} setIsActive={setIsActive} />;
  }
  return (
    <>
      <div className="mt-[60px]">
        <div className="mb-[20px] flex gap-6">
          <h1 className="text-[32px] font-bold">공지사항</h1>
          <div className="rounded-2xl border bg-primary-color px-[15px] py-[10px]">
            <button onClick={() => setIsActive('질문 작성페이지')}>
              <p className="text-[18px] font-semibold text-white">공지사항 작성</p>
            </button>
          </div>
        </div>
        {/* 공지사항 내용 */}
        <div className="mt-[40px]">
          {testList.map((testData, index) => (
            <div
              key={index}
              className="mb-3"
              onClick={() => {
                setIsActive(true);
                setNoticeDate(testData);
              }}
            >
              <LectureNoticeCard />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
