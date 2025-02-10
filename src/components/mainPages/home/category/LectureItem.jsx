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

  const searchImage = isValidImageURL(search?.image) ? search.image : posterNoneImg;
  const searchSubject = search.subject;
  const searchNickname = search.nickname;
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
      className="relative cursor-pointer rounded-lg p-3 transition-all hover:bg-gray-100"
      onClick={handleClick}
    >
      <div className="h-[160px] w-full overflow-hidden rounded-lg">
        <img src={searchImage} className="h-full w-full object-cover" alt="검색 이미지" />
      </div>

      <div>
        <h4 className="mt-2 text-lg leading-tight">{searchSubject}</h4>
        <div className="mt-2 flex justify-start gap-3 ">
          <div className="flex flex-wrap items-center gap-1">
            <h4 className="mr-2 text-base font-bold">{searchNickname}</h4>
            {searchTags?.map((tag, index) => (
              <div
                className="inline-block rounded-full border bg-bg-gray-color px-3 py-1"
                key={index}
              >
                <p className="text-text-gray-color">{tag}</p>
              </div>
            ))}

            {!isMyPage && (
              <div className="inline-block rounded-full border bg-primary-color px-3 py-1 ">
                <p className=" text-white">{searchCategory}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMyPage ? (
        <button
          className="mt-2 rounded-[10px] bg-bg-gray-color px-3 py-2 text-[#343434] hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation(); // 부모 div 클릭 이벤트 방지
            console.log('삭제 로직 실행');
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
