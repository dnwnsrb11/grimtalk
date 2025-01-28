import { useEffect } from 'react';
import { useState } from 'react';

export const LectureCategory = ({ setSelectedCategory }) => {
  const liTextactive = 'text-[22px] font-bold cursor-pointer';
  const liTextDeactive = 'text-[22px] font-light text-[#828282] cursor-pointer';

  const [categoryActive, setCategoryActive] = useState('강의소개');

  const sendData = () => {
    setSelectedCategory(categoryActive);
  };
  // 여기서 받은 값을 부모인 강의페이지로 넘김니다.
  // 비동기 함수라 문제 발생
  useEffect(() => {
    if (categoryActive) {
      sendData();
    }
  }, [categoryActive]);

  const clickCateogry = (text) => {
    setCategoryActive(text);
  };

  return (
    <>
      <div>
        <ul className="mb-[16px] flex gap-[40px]">
          <li
            className={`${categoryActive === '강의소개' ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry('강의소개')}
          >
            강의 소개
          </li>
          <li
            className={`${categoryActive === '커리큘럼' ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry('커리큘럼')}
          >
            커리큘럼
          </li>
          <li
            className={`${categoryActive === '다시보기' ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry('다시보기')}
          >
            다시보기
          </li>
          <li
            className={`${categoryActive === '공지사항' ? liTextactive : liTextDeactive}`}
            onClick={() => clickCateogry('공지사항')}
          >
            공지사항
          </li>
          <li
            className={`${categoryActive === '질문사항' ? liTextactive : liTextDeactive}`}
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
