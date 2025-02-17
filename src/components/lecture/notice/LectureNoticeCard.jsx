import { formatDateWithTime } from '@/utils/dateFormatter';

export const LectureNoticeCard = ({ notice }) => {
  return (
    <div className="cursor-pointer rounded-2xl border border-gray-border-color px-[20px] py-[15px] transition-all duration-300 hover:border-primary-color">
      <div className="mb-[12px]">
        <h1 className="text-[22px] font-semibold">
          {notice?.subject?.length > 20 ? `${notice?.subject?.slice(0, 20)}...` : notice?.subject}
        </h1>
      </div>
      <p className="text-gray-700">
        {notice?.content?.length > 50 ? `${notice?.content?.slice(0, 50)}...` : notice?.content}
      </p>
      <div className="mt-2 flex">
        <div className="rounded-full border border-gray-border-color bg-bg-gray-color px-[15px] py-[5px]">
          <p className="font-semibold">{formatDateWithTime(notice?.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};
