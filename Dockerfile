# Dockerfile
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖（如果需要，但如果你希望直接运行当前项目的代码，可以跳过）
# RUN npm install --production

# 复制项目文件（包括 node_modules）到容器
COPY . .

# 设置非 root 用户（可选，但推荐）
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 暴露端口（如果需要）
# EXPOSE 3000

# 设置默认命令（可选）
CMD ["node", "your_script.js"]