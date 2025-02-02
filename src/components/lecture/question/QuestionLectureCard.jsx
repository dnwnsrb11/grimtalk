export const QuestionLectureCard = ({ isActive, post }) => {
  // 날짜 까지만 나오게 하기 & 제목, 커리큘럼이름, 날짜, 닉네임
  const formattedDate = new Date(post?.updatedAt).toISOString().split('T')[0];
  const postSubject = post?.subject;
  const postCurriculumSubject = post?.curriculumSubject;
  const nickname = post?.nickname;
  // 활성화 버튼
  const QuestionActive = () => {
    return (
      <div className="rounded-full border border-gray-border-color bg-primary-color px-[15px] py-[5px]">
        <p className="text-[14px] font-semibold text-white">해결</p>
      </div>
    );
  };
  // 비활성화 버튼
  const QuestionDeActive = () => {
    return (
      <div className="rounded-full border border-gray-border-color bg-bg-gray-color px-[15px] py-[5px]">
        <p className="text-[14px] font-semibold text-[#AEAEAE]">미해결</p>
      </div>
    );
  };

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
                <p className="text-[14px] font-semibold">{formattedDate}</p>
              </div>
              {isActive ? <QuestionActive /> : <QuestionDeActive />}
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
