export const SubscriptionCard = ({ nickname, memberTagContent }) => {
  return (
    <div className="flex flex-row items-center rounded-xl border border-gray-border-color p-4">
      <div className="h-24 w-24 rounded-full bg-bg-gray-color"></div>
      <div className="flex flex-col gap-1 p-4">
        <p className="text-lg font-bold">{nickname}</p>
        <div className="flex flex-row gap-1">
          {memberTagContent &&
            memberTagContent.map((tag) => (
              <span className="rounded-3xl bg-bg-gray-color px-2 py-0.5 text-base text-detail-text-color">
                {tag}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};
