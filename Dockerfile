# 1️⃣ Node.js 환경에서 Vue(React) 빌드
FROM node:18 as build-stage
WORKDIR /app

# 패키지 매니저 설정 및 의존성 설치
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 프로젝트 파일 복사 및 빌드
COPY . .
RUN pnpm run build
# dist 폴더 생성됨

# 2️⃣ Nginx로 정적 파일 제공
FROM nginx:alpine as production-stage

# 1) dist 폴더 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 2) 이 부분은 "프론트엔드 도커 컨테이너"용 기본 nginx.conf를 복사하던 것이었는데,
#    이제 /home/ubuntu/nginx.conf를 마운트해서 쓰므로, 이 파일이 필요 없다면 생략 가능.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
