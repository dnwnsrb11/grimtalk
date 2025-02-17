import posterNoneImg from '@/assets/posterNoneImg.png';

// 라이브 방 카드 컴포넌트
export const LiveList = ({ LiveRoom, onJoinClick, onLectureClick }) => {
  // LiveRoom이 undefined인 경우 early return
  if (!LiveRoom) {
    return null;
  }

  const { curriculumName, hashtags, image, instructorName, lectureId } = LiveRoom;

  return (
    <div className="group relative">
      <button onClick={onJoinClick} className="w-full">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          {/* LIVE 뱃지 */}
          <div className="absolute left-3 top-3 z-20">
            <div className="flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-sm font-bold text-white">
              <div className="animate-pulse">
                <div className="h-2 w-2 rounded-full bg-red-500" />
              </div>
              <span>LIVE</span>
            </div>
          </div>

          {/* 썸네일 이미지 */}
          <img
            src={image || posterNoneImg}
            alt="poster"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />

          {/* 호버 시 오버레이 */}
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>

        {/* 방송 정보 */}
        <div className="mt-3 text-left">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLectureClick(lectureId);
            }}
            className="active:text-primary-hover-color text-base font-bold text-gray-900 transition-all duration-300 hover:text-primary-color hover:underline"
          >
            <h4 className="text-base font-medium">{curriculumName}</h4>
          </button>
          <div className="mt-1 flex items-center gap-2 ">
            <p className="text-lg font-bold">{instructorName}</p>
            <div className="flex flex-wrap gap-1.5">
              {hashtags?.slice(0, 2).map((tag, index) => (
                <p
                  key={index}
                  className="inline-block max-w-[80px]  overflow-hidden text-ellipsis whitespace-nowrap rounded-full border bg-bg-gray-color px-3 py-1 text-text-gray-color"
                  title={tag}
                >
                  {tag}
                </p>
              ))}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
