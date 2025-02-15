import { StarReviewIcon } from '@/components/common/icons';

export const ReviewLectureCard = ({ review }) => {
  return (
    <>
      <div className="rounded-2xl border border-gray-border-color px-[20px] py-[35px] transition-all duration-300  hover:border-primary-color">
        <div className="flex items-center justify-between">
          <div className="w-[70%]">
            <div className="">{review.content}</div>
          </div>
          <div className="flex items-center gap-2">
            <StarReviewIcon />
            <div>
              <p className="text-[18px] text-[#828282]">
                <span className="text-primary-color">{review.star}</span> / 5
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
