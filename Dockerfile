# 1️⃣ Node.js 환경에서 Vue(React) 빌드
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

# 2️⃣ Nginx로 정적 파일 제공
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY /home/ubuntu/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
