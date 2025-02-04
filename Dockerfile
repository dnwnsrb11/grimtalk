# 1) Node로 프론트 빌드
FROM node:18 as build-stage
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build
# 결과물 /app/dist

# 2) Nginx (alpine or latest)
FROM nginx:alpine as production-stage

# 빌드된 정적 파일을 /usr/share/nginx/html 에 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html

# ❌ 여기서는 nginx.conf 복사 안 함
#  => 서버에서 마운트(/home/ubuntu/nginx.conf:/etc/nginx/nginx.conf)

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
