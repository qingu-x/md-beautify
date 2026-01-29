# 构建阶段
FROM node:22-alpine AS builder

WORKDIR /build

# 安装 pnpm
RUN npm install -g pnpm@latest

# 复制依赖相关文件
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/core/package.json ./packages/core/
COPY apps/web/package.json ./apps/web/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# 构建项目
RUN pnpm build

# 运行阶段 - 使用 nginx 提供静态文件服务
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /build/apps/web/dist /usr/share/nginx/html

# 复制 nginx 配置（支持 SPA 路由）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
