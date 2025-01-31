import { QuestionLectureCard } from '@/components/lecture/question/QuestionLectureCard';
import { QuestionLectureDetail } from '@/components/lecture/question/QuestionLectureDetail';
import { useState, useEffect } from 'react';

export const LectureQuestions = () => {
  // test
  const testList = ['one', 'two', 'three'];
  // 상세 페이지 기능
  const [isActive, setIsActive] = useState(false);
  const [questionData, setQuestionData] = useState('');
  // 뒤로가기 버튼 기능
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
    return <QuestionLectureDetail setIsActive={setIsActive} questionData={questionData} />;
  }

  return (
    <>
      <div className="mt-[60px]">
        <div className="mb-[20px] flex gap-6">
          <h1 className="text-[32px] font-bold">질문하기</h1>
          <div className="rounded-2xl border bg-primary-color px-[15px] py-[10px]">
            <button>
              <p className="text-[18px] font-semibold text-white">질문하기</p>
            </button>
          </div>
        </div>
        <hr className="border border-divider-color" />
        <div className="mt-[40px]">
          {testList.map((testData, index) => (
            <div key={index} onClick={() => setIsActive(true)} className="mb-3">
              <QuestionLectureCard setIsActive={setIsActive} testData={testData} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
