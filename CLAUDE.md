

## 文件一：`CLAUDE.md`

```markdown
# CLAUDE.md — Claude Code 工作指引与代码规范

## 🔴 核心工作流程

每次启动时，请执行以下步骤：
1. 读取本文件 `CLAUDE.md`，了解代码规范
2. 读取 `CHECKLIST.md`，找到第一个状态为 `[ ]`（未完成）的任务
3. 执行该任务，完成后将 `[ ]` 改为 `[x]`，并在后面追加完成日期
4. 如果 token 充裕，继续下一个 `[ ]` 任务
5. 每完成一个 Phase，运行一次 `npm run test` 确保不破坏已有功能
6. 如果任务中途 token 不够，在 CHECKLIST.md 对应任务后追加 `⏸️ 进行中` 标记和进度说明

## 📁 项目目录结构（严格遵守）

```
project-root/
├── CLAUDE.md                    # 本文件：代码规范 + 工作指引
├── CHECKLIST.md                 # 功能清单（任务列表）
├── README.md                    # 用户使用文档
├── package.json
├── tsconfig.json
├── .env                         # 环境变量（不提交到git）
├── .env.example                 # 环境变量模板
├── prisma/
│   └── schema.prisma            # Prisma 数据库模型定义
├── api-spec/                    # API 接口定义 JSON 文件
│   └── example.api.json         # 示例接口定义
├── scripts/                     # CLI 脚本
│   ├── generate-routes.ts       # 根据 api-spec 生成路由
│   ├── generate-models.ts       # 根据 SQL 生成 Prisma 模型
│   └── dev.ts                   # 开发服务器启动脚本
├── src/
│   ├── index.ts                 # 应用入口
│   ├── server.ts                # 服务器创建与启动
│   ├── config/                  # 配置管理
│   │   ├── index.ts             # 统一配置导出
│   │   ├── app.config.ts        # 应用配置
│   │   ├── db.config.ts         # 数据库配置
│   │   ├── redis.config.ts      # Redis 配置
│   │   ├── mongo.config.ts      # MongoDB 配置
│   │   └── mq.config.ts         # RabbitMQ 配置
│   ├── core/                    # 核心框架模块
│   │   ├── router.ts            # 路由注册引擎
│   │   ├── middleware.ts        # 中间件管理
│   │   ├── logger.ts            # 日志模块
│   │   ├── error-handler.ts     # 全局错误处理
│   │   ├── validator.ts         # 请求参数校验
│   │   ├── response.ts          # 统一响应格式
│   │   └── lifecycle.ts         # 应用生命周期（启动/关闭）
│   ├── database/                # 数据库服务层
│   │   ├── prisma/              # Prisma 客户端封装
│   │   │   ├── client.ts        # Prisma 客户端（支持主从）
│   │   │   └── index.ts
│   │   ├── redis/               # Redis 客户端封装
│   │   │   ├── client.ts        # Redis 客户端（支持主从）
│   │   │   └── index.ts
│   │   ├── mongo/               # MongoDB 客户端封装
│   │   │   ├── client.ts        # MongoDB 客户端
│   │   │   └── index.ts
│   │   └── rabbitmq/            # RabbitMQ 客户端封装
│   │       ├── client.ts        # RabbitMQ 连接管理
│   │       ├── producer.ts      # 消息生产者
│   │       ├── consumer.ts      # 消息消费者
│   │       └── index.ts
│   ├── generated/               # 自动生成的代码（不要手动编辑）
│   │   └── routes/              # 自动生成的路由文件
│   ├── routes/                  # 手动编写的路由（业务逻辑）
│   │   └── example.route.ts
│   ├── plugins/                 # 用户自定义插件
│   │   ├── index.ts             # 插件注册中心
│   │   └── example.plugin.ts    # 示例插件
│   ├── services/                # 业务逻辑层
│   ├── types/                   # 全局类型定义
│   │   ├── api.types.ts         # API 相关类型
│   │   ├── config.types.ts      # 配置相关类型
│   │   └── index.ts
│   └── utils/                   # 工具函数
│       ├── crypto.ts            # 加密相关
│       ├── date.ts              # 日期处理
│       └── index.ts
├── tests/                       # 单元测试
│   ├── setup.ts                 # 测试初始化
│   ├── core/                    # 核心模块测试
│   ├── routes/                  # 路由测试
│   ├── database/                # 数据库测试
│   └── plugins/                 # 插件测试
└── docker/                      # Docker 相关
    ├── Dockerfile
    └── docker-compose.yml       # 本地开发环境（MySQL, Redis, MongoDB, RabbitMQ）
```

## 📝 代码规范

### 1. TypeScript 严格模式
- `tsconfig.json` 必须开启 `strict: true`
- 禁止使用 `any`，必须使用具体类型或 `unknown`
- 所有函数必须有明确的返回类型注解
- 所有对外导出的接口必须用 `interface` 或 `type` 定义

### 2. 命名规范
| 类别 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `user-auth.service.ts` |
| 类名 | PascalCase | `UserService` |
| 接口/类型 | PascalCase，接口不加I前缀 | `UserProfile` |
| 函数/变量 | camelCase | `getUserById` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 枚举 | PascalCase，成员UPPER_SNAKE | `enum Status { ACTIVE }` |
| 文件后缀 | 按功能分 | `.route.ts` `.service.ts` `.plugin.ts` `.config.ts` `.test.ts` `.types.ts` |

### 3. 导入顺序（严格执行）
```typescript
// 1. Node.js 内置模块
import path from 'node:path';
import fs from 'node:fs';

// 2. 第三方库
import Fastify from 'fastify';
import { z } from 'zod';

// 3. 项目内部模块 - 按层级从上到下
import { appConfig } from '@/config';
import { logger } from '@/core/logger';
import { UserService } from '@/services/user.service';

// 4. 类型导入（使用 import type）
import type { FastifyRequest } from 'fastify';
import type { UserProfile } from '@/types';
```

### 4. 路径别名
- 使用 `@/` 作为 `src/` 的路径别名
- 在 `tsconfig.json` 中配置 `paths`

### 5. 错误处理规范
```typescript
// ✅ 正确：使用自定义 AppError
import { AppError, ErrorCode } from '@/core/error-handler';

throw new AppError(ErrorCode.NOT_FOUND, '用户不存在', { userId: 123 });

// ✅ 正确：异步函数必须有 try-catch 或由全局错误处理器捕获
async function getUser(id: number): Promise<User> {
  // 业务逻辑直接写，错误由框架统一捕获
}

// ❌ 错误：不要吞掉错误
try { ... } catch (e) { /* 什么都不做 */ }
```

### 6. 统一响应格式
```typescript
// 所有 API 响应必须遵循此格式
interface ApiResponse<T = unknown> {
  code: number;        // 业务状态码，0 = 成功
  message: string;     // 状态描述
  data: T;            // 响应数据
  timestamp: number;   // 时间戳
  requestId: string;   // 请求追踪 ID
}
```

### 7. 环境变量规范
- 所有环境变量必须在 `.env.example` 中有对应模板
- 必须通过 `src/config/` 中的配置模块读取，禁止在业务代码中直接 `process.env`
- 必须在配置模块中用 Zod 做校验，缺失关键配置时启动即报错

### 8. 数据库服务开关规范
```typescript
// 在 .env 中控制开关
DB_ENABLED=true          # MySQL/SQLite 总开关
DB_TYPE=mysql            # mysql | sqlite
REDIS_ENABLED=false      # Redis 总开关
MONGO_ENABLED=false      # MongoDB 总开关
RABBITMQ_ENABLED=false   # RabbitMQ 总开关

// 代码中通过 config 判断是否初始化
// 关闭的服务不会初始化连接，调用时给出明确错误提示
```

### 9. 主从库配置规范
```typescript
// MySQL 主从配置示例
DB_MASTER_URL=mysql://user:pass@master-host:3306/mydb
DB_SLAVE_URLS=mysql://user:pass@slave1:3306/mydb,mysql://user:pass@slave2:3306/mydb

// Redis 主从配置示例
REDIS_MASTER_HOST=master-host
REDIS_MASTER_PORT=6379
REDIS_SLAVE_HOSTS=slave1:6379,slave2:6379

// 代码中使用
import { db } from '@/database/prisma';
await db.master.user.create({ ... });  // 写操作 → 主库
await db.slave.user.findMany({ ... }); // 读操作 → 从库
```

### 10. 插件规范
```typescript
// 每个插件必须导出符合此接口的对象
import type { FastifyInstance } from 'fastify';

export interface Plugin {
  name: string;                                    // 插件名称
  version: string;                                 // 版本号
  description?: string;                            // 描述
  register: (app: FastifyInstance) => Promise<void>; // 注册方法
  destroy?: () => Promise<void>;                   // 销毁方法（可选）
}
```

### 11. API 接口定义 JSON 规范
```jsonc
// 文件路径: api-spec/user.api.json
{
  "module": "user",
  "basePath": "/api/v1/user",
  "description": "用户模块",
  "apis": [
    {
      "name": "getUserById",
      "method": "GET",
      "path": "/:id",
      "description": "根据ID获取用户",
      "params": {
        "id": { "type": "number", "required": true, "description": "用户ID" }
      },
      "query": {},
      "body": null,
      "response": {
        "id": { "type": "number" },
        "name": { "type": "string" },
        "email": { "type": "string" },
        "createdAt": { "type": "string", "format": "datetime" }
      },
      "auth": true,
      "rateLimit": { "max": 100, "timeWindow": "1m" }
    },
    {
      "name": "createUser",
      "method": "POST",
      "path": "/",
      "description": "创建用户",
      "params": {},
      "query": {},
      "body": {
        "name": { "type": "string", "required": true, "minLength": 2, "maxLength": 50 },
        "email": { "type": "string", "required": true, "format": "email" },
        "password": { "type": "string", "required": true, "minLength": 8 }
      },
      "response": {
        "id": { "type": "number" },
        "name": { "type": "string" },
        "email": { "type": "string" }
      },
      "auth": false
    }
  ]
}
```

### 12. 自动生成代码标记
```typescript
// 所有自动生成的文件头部必须包含以下注释
/**
 * ⚠️ 此文件由代码生成器自动生成
 * 📅 生成时间: 2024-01-01T00:00:00.000Z
 * 📄 来源: api-spec/user.api.json
 *
 * 🚫 请勿手动修改此文件，修改将在下次生成时被覆盖
 * ✅ 业务逻辑请在 src/routes/ 对应文件中实现
 */
```

### 13. 测试规范
- 测试框架使用 Vitest
- 测试文件放在 `tests/` 目录，目录结构镜像 `src/`
- 测试文件命名: `xxx.test.ts`
- 每个模块至少覆盖：正常流程 + 边界情况 + 错误处理
- 数据库相关测试使用 SQLite 内存模式

### 14. 日志规范
```typescript
import { logger } from '@/core/logger';

// 日志级别使用规范
logger.debug('调试信息，仅开发环境');
logger.info('正常业务流程', { userId: 1, action: 'login' });
logger.warn('需要注意但不影响运行', { retryCount: 3 });
logger.error('错误，需要排查', { error, stack: error.stack });
logger.fatal('致命错误，服务即将停止');
```

### 15. Git 提交规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 🛠️ 技术栈选择（必须使用以下技术）

| 类别 | 技术 | 理由 |
|------|------|------|
| 运行时 | Node.js 20+ | LTS |
| 语言 | TypeScript 5.x strict | 类型安全 |
| HTTP 框架 | Fastify 5.x | 高性能 + 原生 TS + Schema |
| 参数校验 | Zod | TS 原生推导 |
| SQL ORM | Prisma | 自动类型生成 + IDE 提示 |
| Redis | ioredis | 功能全面 + 主从支持 |
| MongoDB | mongoose 8.x | Schema + TS 支持好 |
| 消息队列 | amqplib | RabbitMQ 官方推荐 |
| 日志 | pino（Fastify 内置） | 高性能 JSON 日志 |
| 测试 | vitest | 快速 + ESM 支持 + TS 原生 |
| 进程管理 | tsx (开发) / node (生产) | 快速 TS 执行 |
| 构建 | tsup | 快速打包 |
| 环境变量 | dotenv | 标准方案 |

## ⚡ 关键命令（最终实现目标）

```bash
# 开发
npm run dev                    # 启动开发服务器（热重载）
npm run build                  # 构建生产版本
npm run start                  # 启动生产服务器

# 代码生成
npm run gen:routes             # 读取 api-spec/*.api.json → 生成路由代码
npm run gen:models             # 读取 SQL → 生成 Prisma 模型
npm run gen:all                # 生成所有

# 数据库
npm run db:push                # 推送 Prisma schema 到数据库
npm run db:migrate             # 运行数据库迁移
npm run db:generate            # 生成 Prisma Client
npm run db:studio              # 打开 Prisma Studio

# 测试
npm run test                   # 运行所有测试
npm run test:watch             # 监听模式
npm run test:coverage          # 覆盖率报告

# 代码质量
npm run lint                   # ESLint 检查
npm run lint:fix               # ESLint 自动修复
npm run format                 # Prettier 格式化
npm run typecheck              # TypeScript 类型检查

# Docker
npm run docker:up              # 启动本地依赖（MySQL, Redis, MongoDB, RabbitMQ）
npm run docker:down            # 停止本地依赖

# 部署
npm run deploy                 # 构建 + 启动（生产环境）
```

## 🔒 安全规范
- 所有密码、密钥通过环境变量注入，禁止硬编码
- SQL 操作全部通过 Prisma，防止注入
- 请求体大小限制（默认 1MB）
- Rate Limiting 默认开启
- CORS 可配置白名单
- Helmet 安全头
```

---

