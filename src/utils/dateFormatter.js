/**
 * 날짜 문자열을 지정된 형식으로 포맷팅
 * @param {string} dateStr - 날짜 문자열
 * @param {string} format - 포맷 타입 (WITH_TIME 또는 DATE_ONLY)
 * @returns {string} 포맷팅된 날짜 문자열 (YYYY.MM.DD 또는 YYYY.MM.DD HH:mm)
 */

// 📌사용 예시
// {formatDateOnly(new Date())} : 2025.02.04
// {formatDateWithTime(new Date())} : 2025.02.04 10:00

const dateFormatter = (dateStr, format) => {
  const date = new Date(dateStr);

  // 공통 날짜 포맷 부분 추출
  const dateParts = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ];

  const formattedDate = dateParts.join('.');

  if (format === 'DATE_ONLY') {
    return formattedDate;
  }
  // 시간 형식 처리
  if (format === 'WITH_TIME') {
    const formattedTime = [
      String(date.getHours()).padStart(2, '0'),
      String(date.getMinutes()).padStart(2, '0'),
    ].join(':');
    return `${formattedDate} ${formattedTime}`;
  }
};

/**
 * ISO 8601 형식 문자열을 날짜 전용 형식으로 포맷팅
 * @param {string} isoString - ISO 8601 형식 날짜 문자열 (예: '2023-10-05T00:00:00.000Z')
 * @returns {string} YYYY.MM.DD 형식 문자열
 */
const formatDateOnly = (isoString) => {
  return dateFormatter(isoString, 'DATE_ONLY');
};

/**
 * ISO 8601 형식 문자열을 시간 포함 형식으로 포맷팅
 * @param {string} isoString - ISO 8601 형식 날짜 문자열 (예: '2023-10-05T00:00:00.000Z')
 * @returns {string} YYYY.MM.DD HH:mm 형식 문자열
 */
const formatDateWithTime = (isoString) => {
  return dateFormatter(isoString, 'WITH_TIME');
};

export { formatDateOnly, formatDateWithTime };
