import { StarReviewIcon } from '@/components/common/icons';

export const ReviewLectureCard = () => {
  return (
    <>
      <div className="rounded-2xl border border-gray-border-color px-[20px] py-[35px]">
        <div className="flex items-center justify-between">
          <div>
            <h1>리뷰 입니다.</h1>
          </div>
          <div className="flex items-center gap-2">
            <StarReviewIcon />
            <div>
              <p className="text-[18px] text-[#828282]">
                <span className="text-primary-color">4</span> / 5
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
