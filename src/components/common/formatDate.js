const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  // +1을 제거해야 합니다. getMonth()에만 +1이 필요합니다
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0'); // +1 제거
  const hours = String(date.getHours()).padStart(2, '0'); // +1 제거
  const minutes = String(date.getMinutes()).padStart(2, '0'); // +1 제거

  const formatted = `${year}.${month}.${day} ${hours}:${minutes}`;
  return formatted;
};
