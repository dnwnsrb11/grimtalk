import starSVG from '@/assets/banner/star.svg';
import posterNoneImg from '@/assets/posterNoneImg.png';

export const LectureItem = ({ isMyPage = false, search }) => {
  // 추후 score 값을 받아와서 저장할 장소
  const score = 4.4;
  const isValidImageURL = (url) => {
    try {
      // URL이 정상적인 형태인지 확인
      new URL(url);
      // 이미지 확장자 검증 (.jpg, .png 등)
      return /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(url);
    } catch (e) {
      return false; // URL 객체 생성 실패 시 잘못된 주소로 간주
    }
  };

  const searchImage = isValidImageURL(search?.image) ? search.image : posterNoneImg;
  // const searchImage = search?.image || posterNoneImg;
  const searchSubjkect = search.subject;
  const searchNickname = search.nickname;
  const searchStar = search.star || 0;
  const searchTags = search.hashtags;
  const searchCategory = search.category;
  return (
    <>
      <div className="relative">
        <div className="min-h-[160px] overflow-hidden rounded-lg">
          <img src={searchImage} />
        </div>
        <div>
          <h4 className="mt-2 text-lg leading-tight">{searchSubjkect}</h4>
          <div className="mt-2 flex justify-start gap-3 ">
            <div className="flex flex-wrap items-center gap-1">
              <h4 className="mr-2 text-base font-bold">{searchNickname}</h4>
              {searchTags?.map((tag, index) => (
                <div className="inline-block rounded-full border bg-bg-gray-color px-3 py-1">
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
        {/* 마이페이지일 때는 별점 대신 삭제 버튼 표시 */}
        {isMyPage ? (
          <button className="mt-2 rounded-[10px] bg-bg-gray-color px-3 py-2 text-[#343434] hover:bg-red-50">
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
    </>
  );
};
