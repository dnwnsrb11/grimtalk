import { StarReviewIcon } from '@/components/common/icons';

export const ReviewLectureCard = () => {
  return (
    <>
      <div className="rounded-2xl border border-gray-border-color px-[20px] py-[35px]">
        <div>
          <div>
            <h1>리뷰 입니다.</h1>
          </div>
          <div>
            <ReviewLectureCard />
          </div>
        </div>
      </div>
    </>
  );
};
