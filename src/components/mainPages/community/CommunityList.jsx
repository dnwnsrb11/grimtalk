export const CommunityList = ({ community }) => {
  console.log(community);
  return (
    <>
      <div className="mb-[20px] flex cursor-pointer flex-col rounded-3xl border border-gray-border-color px-[22px] py-[15px] transition-colors duration-300 ease-in-out hover:border-primary-color hover:bg-[#ffd8cf] active:border-primary-color active:bg-[#ffd8cf]">
        <div className="mb-3">
          <h2 className="text-[22px] font-bold">{community.subject}</h2>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="rounded-full border bg-bg-gray-color p-1 px-5">
              <p>{community.curriculumSubject}</p>
            </div>
            <div className="rounded-full border bg-bg-gray-color p-1 px-5">
              <p>{community.createdAt}</p>
            </div>
            {community.picked ? (
              <div className="rounded-full border bg-primary-color p-1 px-5">
                <p className="text-white">답변완료</p>
              </div>
            ) : (
              <div className="rounded-full border bg-bg-gray-color p-1 px-5">
                <p className="text-text-gray-color">미답변</p>
              </div>
            )}
          </div>
          <div>
            <div className="rounded-full border border-[#AEAEAE]  p-1 px-5">
              <p>{community.nickname}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
