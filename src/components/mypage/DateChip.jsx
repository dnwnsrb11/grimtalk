import { formatDateOnly } from '@/utils/dateFormatter';

export const DateChip = ({ date }) => {
  const formattedDate = formatDateOnly(date);
  const today = new Date();
  const targetDate = new Date(formattedDate);

  const diffDate = targetDate - today;
  const daysRemaining = Math.ceil(diffDate / (1000 * 60 * 60 * 24));
  const dDayText = daysRemaining > 0 ? `D-${daysRemaining}` : `D+${Math.abs(daysRemaining)}`;

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-primary-color px-3 py-0 text-white">{formattedDate}</div>
      <p className="text-base font-semibold text-primary-color">
        {dDayText === 0 ? 'DAY' : dDayText}
      </p>
    </div>
  );
};
