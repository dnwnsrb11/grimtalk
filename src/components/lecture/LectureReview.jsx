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

  const [reviewText, setReviewText] = useState('');

  return (
    <>
      <div className="mt-[60px]">
        <div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                onClick={() => checkScore(index, score)}
                className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-125"
              >
                {index < score ? (
                  <StarReviewIcon />
                ) : (
                  <StarReviewIcon fill="#DBDBDB" stroke="#DBDBDB" />
                )}
              </div>
            ))}
            <div className="ml-[15px]">
              <p
                className={`text-[22px] text-[#828282] transition-all duration-500 ease-in-out ${score === 0 ? 'opacity-10' : `opacity-100`}`}
              >
                <span
                  className={`font-semibold ${score === 0 ? 'text-text-gray-color' : 'text-primary-color'}`}
                >
                  {score}
                </span>
                / 5
              </p>
            </div>
          </div>
          <div className="mt-[25px]">
            <textarea
              name=""
              id=""
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="강의에 대한 리뷰를 알려주세요~!"
              className="min-h-[200px] w-full resize-none rounded-2xl border p-5 transition-all duration-200 focus:border-primary-color focus:outline-none"
            ></textarea>
          </div>
        </div>
        <div>{/* 리뷰 모음 */}</div>
      </div>
    </>
  );
};
