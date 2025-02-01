## grimtalk front

![logo](https://github.com/user-attachments/assets/af7860e3-f960-4e4d-b7d2-b4b5c0ff5043)

### 폴더 구조

```
src/
├── api/            # API 관련 로직
│   ├── axios.js    # axios 인스턴스 설정
│   └── services/   # API 요청 함수들
│
├── assets/          # 이미지, 폰트 등 정적 파일
│   ├── images/
│   └── fonts/
│
├── components/      # 재사용 가능한 컴포넌트
│   ├── common/     # 공통 컴포넌트 (Button, Input 등)
│   └── layout/     # 레이아웃 관련 컴포넌트 (Header, Footer 등)
│       └── icons.jsx      # 아이콘 컴포넌트
│
├── hooks/          # 커스텀 훅
│   ├── useAuth.js
│   └── useForm.js
│
├── layouts/        # 레이아웃 컴포넌트
│   ├── RootLayout.jsx
│   └── MyPageContentLayout.jsx
│
├── routes/         # 라우트 설정
│   ├── pages/      # 페이지 컴포넌트
│   └── index.jsx   # 라우트 설정
│
├── store/          # 상태 관리 (Zustand)
│   ├── auth/       # 인증 관련 상태
│   └── user/       # 유저 관련 상태
│
├── styles/         # 전역 스타일
│   └── global.css
│
├── utils/          # 유틸리티 함수
│   ├── format.js
│   └── validate.js
│

```
