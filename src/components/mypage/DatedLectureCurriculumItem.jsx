import { Link } from 'react-router-dom'; // Link 임포트

import posterNoneImg from '@/assets/posterNoneImg.png';
import { DateChip } from '@/components/mypage/DateChip';

export const DatedLectureCurriculumItem = ({ title, image, createdAt, expectedLiveTime, id }) => {
  const isValidImage = (url) => {
    if (!url) return false;
    return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
  };

  const validImage = isValidImage(image) ? image : posterNoneImg;

  return (
    <div className="mb-7 grid grid-cols-[70px_1fr_110px] items-center justify-between gap-5">
      <img
        src={validImage}
        alt="lecture-curriculum"
        className="h-[70px] w-[70px] flex-shrink-0 rounded-xl"
      />

      <div className="flex flex-col items-start truncate">
        <p className="w-full truncate text-lg font-bold">{title}</p>
        <DateChip date={expectedLiveTime} />
      </div>

      <Link to={`/lecture/${id}`}>
        <button className="text-lg font-semibold text-detail-text-color hover:scale-110">
          자세히 보기 ＞
        </button>
      </Link>
    </div>
  );
};
