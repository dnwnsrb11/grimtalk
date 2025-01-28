import { useEffect } from 'react';
import { useState } from 'react';

export const LectureCategory = ({ setSelectedCategory, selectedCategory }) => {
  const liTextactive = 'text-[22px] font-bold cursor-pointer';
  const liTextDeactive = 'text-[22px] font-light text-[#828282] cursor-pointer';

  const [categoryActive, setCategoryActive] = useState('강의소개');

  const sendData = (category) => {
    setSelectedCategory(category);
  };

  const clickCateogry = (category) => {
    sendData(category);
  };

  return (
    <>
      <div>
        <ul className="mb-[16px] flex gap-[40px]">
          <li
            className={`${selectedCategory === '강의소개' ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry('강의소개')}
          >
            강의 소개
          </li>
          <li
            className={`${selectedCategory === '커리큘럼' ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry('커리큘럼')}
          >
            커리큘럼
          </li>
          <li
            className={`${selectedCategory === '다시보기' ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry('다시보기')}
          >
            다시보기
          </li>
          <li
            className={`${selectedCategory === '공지사항' ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry('공지사항')}
          >
            공지사항
          </li>
          <li
            className={`${selectedCategory === '질문사항' ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry('질문사항')}
          >
            질문사항
          </li>
        </ul>
      </div>
      <hr />
    </>
  );
};
