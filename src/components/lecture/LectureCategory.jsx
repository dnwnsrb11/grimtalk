export const LectureCategory = () => {
  const liTextactive = 'text-[22px] font-bold';
  const liTextDeactive = 'text-[22px] font-light';

  return (
    <>
      <div>
        <ul className="flex gap-[30px]">
          <li>강의 소개</li>
          <li>커리큘럼</li>
          <li>다시보기</li>
          <li>공지사항</li>
          <li>질문사항</li>
        </ul>
      </div>
      <hr />
    </>
  );
};
