import { HashTagChip } from '@/components/mypage/HashTagChip';

export const RecentLectureItem = ({ title, hashTags, image }) => {
  return (
    // 커리큘럼 이미지가 70px이기 때문에 컬럼 너비를 70px로 고정
    <div className="grid grid-cols-[70px_1fr_110px] items-center justify-between gap-2">
      <img
        src={image}
        alt="lecture-curriculum"
        className="h-[70px] w-[70px] flex-shrink-0 rounded-xl"
      />

      <div className="flex flex-col items-start truncate">
        <p className="w-full truncate text-lg font-bold">{title}</p>
        <div className="flex items-center gap-2">
          {hashTags.map((hashTag) => (
            <HashTagChip key={hashTag} hashTag={hashTag} />
          ))}
        </div>
      </div>

      <button className="text-lg font-semibold text-detail-text-color">자세히 보기 ＞</button>
    </div>
  );
};
