/**
 * 날짜 문자열을 지정된 형식으로 포맷팅
 * @param {string} dateStr - 날짜 문자열
 * @param {string} format - 포맷 타입 (WITH_TIME 또는 DATE_ONLY)
 * @returns {string} 포맷팅된 날짜 문자열 (YYYY.MM.DD 또는 YYYY.MM.DD HH:mm)
 */

// 📌사용 예시
// {formatDate(new Date(), 'WITH_TIME')} : 2025.02.04 10:00
// {formatDate(new Date(), 'DATE_ONLY')} : 2025.02.04

export const dateFormatter = (dateStr, format) => {
  const date = new Date(dateStr);

  let dateFormat = '';
  // 시간이 포함된 형식으로 포맷팅
  if (format === 'WITH_TIME') {
    dateFormat = [
      date.getFullYear(),

      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('.');

    const timeFormat = [
      String(date.getHours()).padStart(2, '0'),
      String(date.getMinutes()).padStart(2, '0'),
    ].join(':');

    return `${dateFormat} ${timeFormat}`;
    // 시간이 포함되지 않은 형식으로 포맷팅
  } else if (format === 'DATE_ONLY') {
    dateFormat = [
      date.getFullYear(),

      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('.');
  }
  return dateFormat;
};
