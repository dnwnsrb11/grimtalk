import { QuestionLectureCard } from './question/QuestionLectureCard';

export const LectureQuestions = () => {
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
          <QuestionLectureCard isActive={false} />
        </div>
      </div>
    </>
  );
};
