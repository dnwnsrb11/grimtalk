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

# 3️⃣ GitLab에 추가한 `nginx.conf`를 컨테이너 내부로 복사
# nginx.conf (소스) → /etc/nginx/conf.d/default.conf (목적지)
# Nginx는 기본적으로 /etc/nginx/conf.d/*.conf 파일들을 자동으로 include 함
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 🔥 nginx.conf 복사 제거 → docker-compose에서 마운트됨
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
