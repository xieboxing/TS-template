# TS-template

一个基于 TypeScript + Fastify 的企业级后端模板，支持 API 自动生成、多数据库（Prisma/Redis/MongoDB/RabbitMQ）和插件系统。

## 特性

- 🚀 **Fastify 5.x** - 高性能 HTTP 框架
- 🔒 **TypeScript 严格模式** - 完整类型安全
- 🤖 **API 自动生成** - JSON Schema → 路由代码
- 🗄️ **多数据库支持** - Prisma (主从) + Redis (主从) + MongoDB + RabbitMQ
- 🔌 **插件系统** - 自动扫描加载
- 🧪 **Vitest 测试** - 完整测试框架
- 🐳 **Docker 支持** - 本地开发环境一键启动

## 快速开始

### 环境要求

- Node.js 20+
- pnpm / npm / yarn
- Docker (可选，用于本地数据库服务)

### 安装

```bash
# 克隆项目
git clone <repo-url>
cd TS-template

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 复制环境变量
cp .env.example .env

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000/health 查看服务状态。

## 命令

```bash
# 开发
npm run dev           # 启动开发服务器（热重载）
npm run build         # 构建生产版本
npm run start         # 启动生产服务器

# 代码生成
npm run gen:routes    # 根据 api-spec/*.api.json 生成路由

# 数据库
npm run db:push       # 推送 schema 到数据库
npm run db:generate   # 生成 Prisma Client
npm run db:studio     # 打开 Prisma Studio

# 测试
npm run test          # 运行所有测试
npm run test:watch    # 监听模式
npm run test:coverage # 覆盖率报告

# 代码质量
npm run lint          # ESLint 检查
npm run lint:fix      # ESLint 自动修复
npm run format        # Prettier 格式化
npm run typecheck     # TypeScript 类型检查

# Docker
npm run docker:up     # 启动本地依赖服务
npm run docker:down   # 停止本地依赖服务
```

## 项目结构

```
src/
├── config/           # 配置管理（Zod 校验）
├── core/             # 核心模块
│   ├── logger.ts     # 日志（Pino）
│   ├── response.ts   # 统一响应格式
│   ├── error-handler.ts  # 错误处理
│   ├── validator.ts  # 请求校验（Zod）
│   ├── auth.ts       # JWT 认证
│   ├── scheduler.ts  # 定时任务
│   └── upload.ts     # 文件上传
├── database/         # 数据库封装
│   ├── prisma/       # Prisma 客户端（主从）
│   ├── redis/        # Redis 客户端（主从）
│   ├── mongo/        # MongoDB 客户端
│   └── rabbitmq/     # RabbitMQ 客户端
├── generated/        # 自动生成的代码
│   └── routes/       # 生成的路由
├── routes/           # 业务路由 Handler
├── plugins/          # 插件目录
├── types/            # 类型定义
└── utils/            # 工具函数

api-spec/             # API 规范 JSON
prisma/               # Prisma Schema
tests/                # 测试文件
docker/               # Docker 配置
```

## API 自动生成

### 1. 创建 API 规范

在 `api-spec/` 目录下创建 `user.api.json`：

```json
{
  "module": "user",
  "basePath": "/api/v1/user",
  "apis": [
    {
      "name": "getById",
      "method": "GET",
      "path": "/:id",
      "params": {
        "id": { "type": "number", "required": true }
      },
      "response": {
        "id": { "type": "number" },
        "name": { "type": "string" }
      }
    }
  ]
}
```

### 2. 生成路由

```bash
npm run gen:routes
```

### 3. 实现 Handler

在 `src/routes/user.route.ts` 中实现业务逻辑：

```typescript
export async function getByIdHandler(request, reply) {
  const { id } = request.params
  // 业务逻辑...
  return success(request, { id, name: 'User' })
}
```

## 数据库使用

### Prisma

```typescript
import { db } from '@/database/prisma'

// 写操作 → 主库
const user = await db.master.user.create({
  data: { name: 'Test', email: 'test@example.com' }
})

// 读操作 → 从库
const users = await db.slave.user.findMany()
```

### Redis

```typescript
import { redisUtils } from '@/database/redis'

// 基本操作
await redisUtils.set('key', 'value', 3600) // 1小时过期
const value = await redisUtils.get('key')

// JSON 操作
await redisUtils.setJSON('user:1', { name: 'Test' })
const user = await redisUtils.getJSON<User>('user:1')

// 分布式锁
const locked = await redisUtils.lock('resource:1', 10)
if (locked) {
  // 执行操作
  await redisUtils.unlock('resource:1')
}
```

### MongoDB

```typescript
import { mongoose } from '@/database/mongo'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
})

const User = mongoose.model('User', UserSchema)
const users = await User.find()
```

### RabbitMQ

```typescript
import { mq } from '@/database/rabbitmq'

// 发送消息
await mq.send('queue-name', { data: 'message' })

// 消费消息
await mq.consume('queue-name', async (message) => {
  console.log('Received:', message)
})
```

## 插件开发

在 `src/plugins/` 创建 `my.plugin.ts`：

```typescript
import type { Plugin } from '@/plugins'

const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  priority: 100,

  async register(app) {
    app.decorate('myHelper', () => 'Hello from plugin!')
  },

  async destroy() {
    console.log('Plugin destroyed')
  },
}

export default myPlugin
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| APP_PORT | 服务端口 | 3000 |
| APP_HOST | 监听地址 | 0.0.0.0 |
| APP_ENV | 环境 | development |
| APP_LOG_LEVEL | 日志级别 | debug |
| DB_ENABLED | 数据库开关 | false |
| DB_TYPE | 数据库类型 | sqlite |
| DB_MASTER_URL | 主库连接 | - |
| REDIS_ENABLED | Redis 开关 | false |
| REDIS_MASTER_HOST | Redis 主节点 | localhost |
| MONGO_ENABLED | MongoDB 开关 | false |
| MONGO_URI | MongoDB 连接 | - |
| RABBITMQ_ENABLED | RabbitMQ 开关 | false |
| RABBITMQ_URL | RabbitMQ 连接 | - |
| JWT_SECRET | JWT 密钥 | - |

## Docker 开发环境

```bash
# 启动所有服务
npm run docker:up

# MySQL: localhost:3306 (root/rootpassword)
# Redis: localhost:6379
# MongoDB: localhost:27017
# RabbitMQ: localhost:5672 (管理界面: localhost:15672)

# 停止所有服务
npm run docker:down
```

## 测试

```bash
# 运行测试
npm run test

# 带覆盖率
npm run test:coverage
```

测试文件放在 `tests/` 目录，镜像 `src/` 结构：

```
tests/
├── setup.ts          # 测试初始化
├── helpers/          # 测试工具
├── core/             # 核心模块测试
├── database/         # 数据库测试
└── plugins/          # 插件测试
```

## License

MIT