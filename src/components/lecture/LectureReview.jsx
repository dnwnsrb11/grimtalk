import { StarReviewIcon } from '@/components/common/icons';

export const LectureReview = () => {
  return (
    <>
      <div className="mt-[60px]">
        <div>
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <StarReviewIcon key={index} />
            ))}
          </div>
          <div>{/* 리뷰작성 */}</div>
        </div>
        <div>{/* 리뷰 모음 */}</div>
      </div>
    </>
  );
};
