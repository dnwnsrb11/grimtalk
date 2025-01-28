import { useState } from 'react';

export const LectureCategory = ({ sendDatetoParent }) => {
  const liTextactive = 'text-[22px] font-bold cursor-pointer';
  const liTextDeactive = 'text-[22px] font-light text-[#828282] cursor-pointer';

  const [categoryActive, setCategoryActive] = useState(0);

  const sendData = () => {
    sendDatetoParent(categoryActive);
  };
  // 여기서 받은 값을 부모인 강의페이지로 넘김니다.
  const clickCateogry = (num) => {
    setCategoryActive(num);
    sendData();
  };
  return (
    <>
      <div>
        <ul className="mb-[16px] flex gap-[40px]">
          <li
            className={`${categoryActive === 0 ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry(0)}
          >
            강의 소개
          </li>
          <li
            className={`${categoryActive === 1 ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry(1)}
          >
            커리큘럼
          </li>
          <li
            className={`${categoryActive === 2 ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry(2)}
          >
            다시보기
          </li>
          <li
            className={`${categoryActive === 3 ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry(3)}
          >
            공지사항
          </li>
          <li
            className={`${categoryActive === 4 ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry(4)}
          >
            질문사항
          </li>
        </ul>
      </div>
      <hr />
    </>
  );
};
