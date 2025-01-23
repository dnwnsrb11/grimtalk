/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      'primary-color': '#FF5C38', // 메인 색상
      'bg-gray-color': '#EFEFEF', // 그레이 배경 색상
      'text-gray-color': '#828282', // 그레이 배경 폰트 색상
      'common-font-color': '#070707', // 전체 폰트 색상
      'disabled-font-color': '#D9D9D9', // 비활성 폰트 색상
      'gray-border-color': '#CCCCCC', // 그레이 테두리 색상
      'divider-color': '#EFEFEF', // 구분선 색상
      'detail-text-color': '#828282', // 상세보기 텍스트 클릭 색상
      'check-color': '#1EB813', // 확인 색상
      'replay-disable-btn-bg-color': '#C1C1C1', // (다시보기) 비활성화 버튼 배경 색상
      'replay-disable-btn-font-color': '#969696', // (다시보기) 비활성화 버튼 폰트 색상
    },
  },
  plugins: [],
};
