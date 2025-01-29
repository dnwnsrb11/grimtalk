export const truncateText = (text, maxLength = 250) => {
  // 기본은 100이지만 언제든지 값을 넣어 길이를 조절 가능
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  } else {
    return text;
  }
};
