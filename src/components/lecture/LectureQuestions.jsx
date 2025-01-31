import { QuestionLectureCard } from '@/components/lecture/question/QuestionLectureCard';
import { QuestionLectureDetail } from '@/components/lecture/question/QuestionLectureDetail';
import { useState } from 'react';

export const LectureQuestions = () => {
  // test
  const testList = ['one', 'two', 'three'];
  // 상세 페이지 기능
  const [isActive, setIsActive] = useState(false);
  const [questionData, setQuestionData] = useState('');

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
              <QuestionLectureCard isActive={false} testData={testData} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
