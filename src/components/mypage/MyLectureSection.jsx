import { LectureItem } from '@/components/mainPages/home/category/LectureItem';

export const MyLectureSection = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* 반복용으로 나둔 요소 추후 변경 예정 */}
      {Array.from({ length: 3 }).map((_, index) => (
        <LectureItem isMyPage={true} key={index} />
      ))}
    </div>
  );
};
