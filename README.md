## grimtalk front

![logo](https://github.com/user-attachments/assets/af7860e3-f960-4e4d-b7d2-b4b5c0ff5043)

### 폴더 구조

```
src/
├── assets/          # 이미지, 폰트 등 정적 파일
│   ├── images/
│   └── fonts/
│
├── components/      # 재사용 가능한 컴포넌트
│   ├── common/     # 공통 컴포넌트 (Button, Input 등)
│   └── layout/     # 레이아웃 관련 컴포넌트 (Header, Footer 등)
│
├── pages/          # 페이지 컴포넌트
│   ├── Home/
│   ├── Login/
│   └── Profile/
│
├── hooks/          # 커스텀 훅
│   ├── useAuth.js
│   └── useForm.js
│
├── api/            # API 관련 로직
│   ├── axios.js    # axios 인스턴스 설정
│   └── services/   # API 요청 함수들
│
├── store/          # 상태 관리 (Redux/Zustand 등)
│   ├── auth/
│   └── user/
│
├── utils/          # 유틸리티 함수
│   ├── format.js
│   └── validate.js
│
└── styles/         # 전역 스타일
    ├── global.css
    └── variables.css
```
