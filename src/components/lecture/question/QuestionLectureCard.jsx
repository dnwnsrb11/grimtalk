import { formatDate } from '@/components/common/formatDate';

export const QuestionLectureCard = ({ isActive, question }) => {
  // 날짜 까지만 나오게 하기, 제목, 커리큘럼이름, 닉네임
  const formattedDate = new Date(question.updatedAt).toISOString().split('T')[0];
  const postSubject = question.subject;
  const postCurriculumSubject = question.curriculumSubject;
  const nickname = question.nickname;
  const picked = question.picked;

  const QuestionStatus = (
    <div
      className={`rounded-full border px-[15px] py-[5px] ${picked ? 'border-primary-color bg-primary-color' : 'border-gray-border-color bg-bg-gray-color'}`}
    >
      <p className={`text-[14px] font-semibold ${picked ? 'text-white' : 'text-[#AEAEAE]'}`}>
        {picked ? '해결' : '미해결'}
      </p>
    </div>
  );

  return (
    <>
      <div className="cursor-pointer rounded-2xl border border-gray-border-color px-[20px] py-[15px] transition-all duration-300 hover:border-primary-color">
        <div>
          {/* 왼쪽 */}
          <div>
            <h1 className="text-[22px] font-semibold ">{postSubject}</h1>
          </div>
          <div className="mt-[12px] flex justify-between">
            <div className="flex gap-2">
              <div className="rounded-full border border-gray-border-color bg-bg-gray-color px-[15px] py-[5px]">
                <p className="text-[14px] font-semibold">{postCurriculumSubject}</p>
              </div>
              <div className="rounded-full border border-gray-border-color bg-bg-gray-color px-[15px] py-[5px]">
                {/* common에 있는 formatDate 함수를 사용하여 출력하기 */}
                <p className="text-[14px] font-semibold">{formatDate(formattedDate)}</p>
              </div>
              {QuestionStatus}
            </div>
            <div>
              <div>
                <div className="rounded-full border border-gray-border-color px-[15px] py-[5px]">
                  <p className="text-[14px] font-semibold">{nickname}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
