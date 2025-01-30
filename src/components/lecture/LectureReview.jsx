import { StarReviewIcon } from '@/components/common/icons';
import { useEffect } from 'react';
import { useState } from 'react';

export const LectureReview = () => {
  const [score, setScore] = useState(0);
  //  1에서 다시 클릭하면 값이 0으로 변경되게
  const checkScore = (index, score) => {
    if (index === 0 && score === 1) {
      setScore(0);
    } else {
      setScore(index + 1);
    }
  };

  return (
    <>
      <div className="mt-[60px]">
        <div>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} onClick={() => checkScore(index, score)}>
                {index < score ? (
                  <StarReviewIcon />
                ) : (
                  <StarReviewIcon fill="#DBDBDB" stroke="#DBDBDB" />
                )}
              </div>
            ))}
          </div>
          <div>{/* 리뷰작성 */}</div>
        </div>
        <div>{/* 리뷰 모음 */}</div>
      </div>
    </>
  );
};
