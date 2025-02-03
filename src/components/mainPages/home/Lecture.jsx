import starSVG from '@/assets/banner/star.svg';
import posterNoneImg from '@/assets/posterNoneImg.png';

export const Lecture = ({ index, lecture }) => {
  const score = 4.4;
  const lectureSubject = lecture.subject;
  const lectureNickname = lecture.nickname;
  const lectureTags = lecture.tags;
  const lectureCategory = lecture.category ?? null;
  const lectureStar = lecture.start ?? `0.0`;
  const lectureImg = lecture.image || posterNoneImg;

  const handleImageError = (e) => {
    e.target.src = posterNoneImg; // 이미지 로딩 실패 시 기본 이미지로 변경
  };

  return (
    <div>
      <div className="min-h-[160px] overflow-hidden rounded-lg">
        <img
          src={lectureImg} // 기본적으로 lectureImg를 사용
          alt={lectureSubject}
          className="h-full w-full object-cover"
          onError={handleImageError} // 이미지 로딩 실패 시 실행되는 함수
        />
      </div>
      <div>
        <h4 className="mt-2 text-lg leading-tight">{lectureSubject}</h4>
        <div className="mt-2 flex items-center gap-3 ">
          <h4 className="text-base font-bold">{lectureNickname}</h4>
          <div className="flex gap-1">
            {lectureTags?.map((tag, index) => (
              <div
                key={index}
                className="inline-block rounded-full border bg-bg-gray-color px-3 py-1"
              >
                <p className="text-text-gray-color">{tag}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div>
          <img src={starSVG} alt="starIcon" />
        </div>
        <p className="text-text-gray-color">{lectureStar} / 5</p>
      </div>
    </div>
  );
};
