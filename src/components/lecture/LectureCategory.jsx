import { useState } from 'react';

export const LectureCategory = () => {
  const liTextactive = 'text-[22px] font-bold cursor-pointer';
  const liTextDeactive = 'text-[22px] font-light text-[#828282] cursor-pointer';

  const [categoryActive, setCategoryActive] = useState(0);
  const clickCateogry = (num) => {
    setCategoryActive(num);
  };

  return (
    <>
      <div>
        <ul className="flex gap-[40px]">
          <li
            className={`${categoryActive === 0 ? liTextactive : liTextDeactive}`}
            onClick={() => setCategoryActive(0)}
          >
            강의 소개
          </li>
          <li
            className={`${categoryActive === 1 ? liTextactive : liTextDeactive}`}
            onClick={() => setCategoryActive(1)}
          >
            커리큘럼
          </li>
          <li
            className={`${categoryActive === 2 ? liTextactive : liTextDeactive}`}
            onClick={() => setCategoryActive(2)}
          >
            다시보기
          </li>
          <li
            className={`${categoryActive === 3 ? liTextactive : liTextDeactive}`}
            onClick={() => setCategoryActive(3)}
          >
            공지사항
          </li>
          <li
            className={`${categoryActive === 4 ? liTextactive : liTextDeactive}`}
            onClick={() => setCategoryActive(4)}
          >
            질문사항
          </li>
        </ul>
      </div>
      <hr />
    </>
  );
};
