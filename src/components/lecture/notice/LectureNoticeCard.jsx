import { formatDateWithTime } from '@/utils/dateFormatter';

export const LectureNoticeCard = ({ noticeDate }) => {
  return (
    <>
      <div className="cursor-pointer rounded-2xl border border-gray-border-color px-[20px] py-[15px] transition-all duration-300 hover:border-primary-color">
        <div className="mb-[12px]">
          <h1 className="text-[22px] font-semibold">{noticeDate.subject}</h1>
        </div>
        <div className="flex">
          <div className="rounded-full border border-gray-border-color bg-bg-gray-color px-[15px] py-[5px]">
            {/* common에 있는 formatDate 함수를 사용하여 출력하기 */}
            <p className="font-semibold">{formatDateWithTime(noticeDate.createdAt)}</p>
          </div>
        </div>
      </div>
    </>
  );
};
