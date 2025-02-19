import { useNavigate } from 'react-router-dom';

import starSVG from '@/assets/banner/star.svg';
import posterNoneImg from '@/assets/posterNoneImg.png';

export const LectureItem = ({ isMyPage = false, search }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  // 이미지 URL 검증 함수
  const isValidImageURL = (url) => {
    try {
      new URL(url);
      return /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(url);
    } catch (e) {
      return false;
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const searchImage = isValidImageURL(search?.image) ? search.image : posterNoneImg;
  const searchSubject = truncateText(search.subject, 13);
  const searchNickname = truncateText(search.nickname, 5);
  const searchStar = search.star || 0;
  const searchTags = search.hashtags;
  const searchCategory = search.category;

  // 카드 클릭 시 이동
  const handleClick = () => {
    if (search?.lectureId) {
      navigate(`/lecture/${search.lectureId}`);
    }
  };

  return (
    <div
      className="relative cursor-pointer rounded-lg border border-gray-200 p-3"
      onClick={handleClick}
    >
      <div className="">
        <div className="max-h-[175px] min-h-[175px] w-full overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          <img
            src={searchImage}
            className="h-full max-h-[175px] min-h-[175px] w-full object-contain"
            alt="검색 이미지"
            onError={(e) => {
              e.target.onerror = null; // 무한 루프 방지
              e.target.src = posterNoneImg;
            }}
          />
        </div>
      </div>

      <div className="max-w-[300px]">
        <div className="flex flex-row justify-between">
          <h4 className="mt-2 text-lg leading-tight">{searchSubject}</h4>
          {!isMyPage && (
            <div className="inline-block rounded-full border px-3 py-1">
              <p className="text-text-gray-color">{searchCategory}</p>
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-start gap-3">
          <div className="flex flex-wrap items-center gap-1">
            <h4 className="mr-2 text-base font-bold">{searchNickname}</h4>
            {searchTags?.slice(0, 2).map((tag, index) => (
              <div
                className="inline-block rounded-full border bg-bg-gray-color px-3 py-1"
                key={index}
              >
                <p className="text-text-gray-color">{truncateText(tag, 2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isMyPage ? (
        <button
          className="mt-2 rounded-[10px] bg-bg-gray-color px-3 py-2 text-[#343434] transition-all duration-200 hover:bg-red-50 hover:shadow-md"
          onClick={(e) => {
            e.stopPropagation(); // 부모 div 클릭 이벤트 방지
          }}
        >
          삭제하기
        </button>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <div>
            <img src={starSVG} alt="starIcon" />
          </div>
          <p className="text-text-gray-color">{searchStar} / 5</p>
        </div>
      )}
    </div>
  );
};
