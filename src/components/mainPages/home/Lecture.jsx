import starSVG from '@/assets/banner/star.svg';

export const Lecture = ({ index, lecture }) => {
  const score = 4.4;
  const lectureSubject = lecture.subject;
  const lectureImg = lecture.image;
  const lectureNickname = lecture.nickname;
  const lectureTags = lecture.tags;
  const lectureCategory = lecture.category ?? null;
  const lectureStar = lecture.start ?? `0.0`;
  console.log(lectureSubject);
  return (
    <>
      <div>
        <div className="min-h-[160px] overflow-hidden rounded-lg">
          <img src={lectureImg} alt="" className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="mt-2 text-lg leading-tight">{lectureSubject}</h4>
          <div className="mt-2 flex items-center gap-3 ">
            <h4 className="text-base font-bold">{lectureNickname}</h4>
            <div className="flex gap-1">
              {lectureTags?.map((tag, index) => (
                <div className="inline-block rounded-full border bg-bg-gray-color px-3 py-1">
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
    </>
  );
};
