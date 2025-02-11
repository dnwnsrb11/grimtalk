# 1️⃣ Build Stage (Vite + esbuild 최적화)
FROM node:18 AS build-stage
WORKDIR /app

# 캐시 최적화를 위해 package.json과 pnpm-lock.yaml만 먼저 복사
COPY package.json pnpm-lock.yaml ./

# pnpm 설치 및 의존성 설치 (캐시 활용)
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 소스 코드 복사 (이후 단계에서 변경된 경우에만 캐시 무효화)
COPY . .

# Vite 빌드 (esbuild 최적화 적용됨)
RUN pnpm run build

# 2️⃣ Production Stage (Nginx로 정적 파일 서빙)
FROM nginx:alpine AS production-stage
WORKDIR /usr/share/nginx/html

# 빌드된 파일만 복사 (불필요한 파일 제거로 이미지 크기 최소화)
COPY --from=build-stage /app/dist .

# Nginx 설정 (커스터마이징 가능)
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
