# 1️⃣ Node.js 환경에서 Vue(React) 빌드
FROM node:18 as build-stage
WORKDIR /app

# 패키지 매니저 설정 및 의존성 설치
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 프로젝트 파일 복사 및 빌드
COPY . .
RUN pnpm run build

# 2️⃣ Nginx로 정적 파일 제공
FROM nginx:alpine as production-stage

# 빌드된 정적 파일 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Nginx 설정 복사 (Docker 컨텍스트에서 가져오기)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 노출 및 Nginx 실행
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
