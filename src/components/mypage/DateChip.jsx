export const DateChip = ({ date }) => {
  const today = new Date();
  const targetDate = new Date(date);

  const diffDate = targetDate - today;
  const daysRemaining = Math.ceil(diffDate / (1000 * 60 * 60 * 24));
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-primary-color px-3 py-0 text-white">{date}</div>
      <p className="text-base font-semibold text-primary-color">D-{daysRemaining}</p>
    </div>
  );
};
