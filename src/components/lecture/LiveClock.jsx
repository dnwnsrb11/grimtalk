import { useEffect, useState } from 'react';

export const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // 실시간 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 날짜 포맷 함수
  const formatDate = (date) => {
    return date
      .toLocaleDateString('ko-KR', {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '.');
  };

  // 시간 포맷 함수
  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-[20px] font-medium text-[#565252]">{formatDate(currentTime)}</h3>
      <h2 className="text-[30px] font-bold">{formatTime(currentTime)}</h2>
    </div>
  );
};
