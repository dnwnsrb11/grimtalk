// import { useQuery } from '@tanstack/react-query';

// import { _axios } from '@/api/instance';
import { Link } from 'react-router-dom'; // Link 임포트

import { HashTagChip } from '@/components/mypage/HashTagChip';

export const HashTaggedLectureCurriculumItem = ({ title, hashTags, image, id }) => {
  return (
    // 커리큘럼 이미지가 70px이기 때문에 컬럼 너비를 70px로 고정
    <div className="grid grid-cols-[70px_1fr_110px] items-center justify-between gap-5">
      <img
        src={image}
        alt="lecture-curriculum"
        className="h-[70px] w-[70px] flex-shrink-0 rounded-xl"
      />

      <div className="flex flex-col items-start truncate">
        <p className="w-full truncate text-lg font-bold">{title}</p>
        <div className="flex items-center gap-2">
          {hashTags?.map((hashTag) => (
            <HashTagChip key={hashTag} hashTag={hashTag} />
          ))}
        </div>
      </div>

      <Link to={`/lecture/${id}`}>
        <button className="text-lg font-semibold text-detail-text-color">자세히 보기 ＞</button>
      </Link>
    </div>
  );
};
