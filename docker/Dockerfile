# 多阶段构建
# 阶段1: 构建依赖
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装所有依赖
RUN npm ci

# 复制源代码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建 TypeScript
RUN npm run build

# 阶段2: 生产镜像
FROM node:20-alpine AS production

WORKDIR /app

# 设置 Node 环境
ENV NODE_ENV=production

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 只安装生产依赖
RUN npm ci --only=production && npm cache clean --force

# 从构建阶段复制产物
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/server.js"]