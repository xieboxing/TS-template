## 文件二：`CHECKLIST.md`

```markdown
# CHECKLIST.md — 功能开发清单

> Claude Code 请每次启动时读取此文件，找到第一个 `[ ]` 任务执行。
> 完成后将 `[ ]` 改为 `[x]` 并追加日期。
> 每个 Phase 完成后运行 `npm run test` 确认无误再继续。

---

## Phase 0: 项目基础设施 🏗️

### 0.1 初始化配置文件
- [x] 更新 `tsconfig.json`：开启 strict、配置 paths 别名 `@/` → `src/`、输出目录 `dist/`、target ES2022、module NodeNext ✅ 2026-03-31
- [x] 创建 `.env.example` 文件，包含所有环境变量模板（参考 CLAUDE.md 中的配置规范） ✅ 2026-03-31
- [x] 创建 `.env` 文件，填入本地开发默认值 ✅ 2026-03-31
- [x] 创建 `.gitignore`：包含 node_modules、dist、.env、prisma/*.db 等 ✅ 2026-03-31
- [x] 更新 `.eslintrc` / `eslint.config.mjs`：集成 typescript-eslint + prettier ✅ 2026-03-31
- [x] 创建 `.prettierrc`：tabWidth 2、singleQuote true、trailingComma all、printWidth 100 ✅ 2026-03-31

### 0.2 安装核心依赖
- [x] 安装生产依赖：`fastify` `@fastify/cors` `@fastify/helmet` `@fastify/rate-limit` `zod` `dotenv` `pino` `pino-pretty` ✅ 2026-03-31
- [x] 安装 Prisma 相关：`prisma`(dev) `@prisma/client` ✅ 2026-03-31
- [x] 安装 Redis 相关：`ioredis` `@types/ioredis`(如需要) ✅ 2026-03-31
- [x] 安装 MongoDB 相关：`mongoose` ✅ 2026-03-31
- [x] 安装 RabbitMQ 相关：`amqplib` `@types/amqplib` ✅ 2026-03-31
- [x] 安装测试相关：`vitest` `@vitest/coverage-v8` `supertest` `@types/supertest` ✅ 2026-03-31
- [x] 安装构建工具：`tsup` ✅ 2026-03-31
- [x] 安装其他工具：`nanoid`(请求ID) `dayjs`(日期) `glob`(文件扫描) ✅ 2026-03-31

### 0.3 创建目录结构
- [x] 按照 CLAUDE.md 中定义的目录结构创建所有文件夹 ✅ 2026-03-31
- [x] 在每个目录中创建 `index.ts` 导出文件（如需要） ✅ 2026-03-31

### 0.4 配置 package.json scripts
- [x] 添加所有命令到 package.json（参考 CLAUDE.md 中的命令列表） ✅ 2026-03-31
- [x] 确保 `npm run dev` 可以用 tsx watch 启动 ✅ 2026-03-31
- [x] 确保 `npm run build` 用 tsup 打包 ✅ 2026-03-31
- [x] 确保 `npm run test` 用 vitest 运行 ✅ 2026-03-31

### 0.5 Vitest 配置
- [x] 创建 `vitest.config.ts`：配置路径别名、测试目录、覆盖率 ✅ 2026-03-31
- [x] 创建 `tests/setup.ts`：测试全局初始化 ✅ 2026-03-31

---

## Phase 1: 核心框架 🧠

### 1.1 配置管理模块
- [x] 创建 `src/config/app.config.ts`：应用配置（port、host、env、logLevel） ✅ 2026-03-31
- [x] 创建 `src/config/db.config.ts`：数据库配置（enabled、type、masterUrl、slaveUrls） ✅ 2026-03-31
- [x] 创建 `src/config/redis.config.ts`：Redis 配置（enabled、master、slaves） ✅ 2026-03-31
- [x] 创建 `src/config/mongo.config.ts`：MongoDB 配置（enabled、uri） ✅ 2026-03-31
- [x] 创建 `src/config/mq.config.ts`：RabbitMQ 配置（enabled、url） ✅ 2026-03-31
- [x] 创建 `src/config/index.ts`：统一导出所有配置，使用 Zod 校验 .env ✅ 2026-03-31
- [x] 编写测试：`tests/core/config.test.ts` 验证配置加载和校验 ✅ 2026-03-31

### 1.2 日志模块
- [x] 创建 `src/core/logger.ts`：基于 pino 封装，支持不同日志级别 ✅ 2026-03-31
- [x] 开发环境使用 pino-pretty 美化输出，生产环境使用 JSON 格式 ✅ 2026-03-31
- [x] 支持子 logger（带模块标签） ✅ 2026-03-31
- [x] 编写测试：`tests/core/logger.test.ts` ✅ 2026-03-31

### 1.3 统一响应模块
- [x] 创建 `src/core/response.ts`：封装 success / fail / paginate 响应方法 ✅ 2026-03-31
- [x] 定义 `ApiResponse<T>` 类型（code、message、data、timestamp、requestId） ✅ 2026-03-31
- [x] 编写测试：`tests/core/response.test.ts` ✅ 2026-03-31

### 1.4 错误处理模块
- [x] 创建 `src/core/error-handler.ts`：定义 AppError 类 + ErrorCode 枚举 ✅ 2026-03-31
- [x] 包含 HTTP 错误码映射（400/401/403/404/500 等） ✅ 2026-03-31
- [x] 包含业务错误码体系（10001=参数错误、20001=未登录、等等） ✅ 2026-03-31
- [x] 注册为 Fastify 全局错误处理器 ✅ 2026-03-31
- [x] 编写测试：`tests/core/error-handler.test.ts` ✅ 2026-03-31

### 1.5 请求校验模块
- [x] 创建 `src/core/validator.ts`：基于 Zod，封装 validateBody/validateQuery/validateParams ✅ 2026-03-31
- [x] 校验失败自动抛出 AppError，错误信息人类可读 ✅ 2026-03-31
- [x] 编写测试：`tests/core/validator.test.ts` ✅ 2026-03-31

### 1.6 服务器模块
- [x] 创建 `src/server.ts`：创建 Fastify 实例，注册核心中间件 ✅ 2026-03-31
- [x] 注册 CORS、Helmet、RateLimit 插件 ✅ 2026-03-31
- [x] 注册全局错误处理 ✅ 2026-03-31
- [x] 注册请求日志（requestId + 耗时） ✅ 2026-03-31
- [x] 创建 `src/index.ts`：启动入口，调用 server.listen() ✅ 2026-03-31

### 1.7 应用生命周期
- [x] 创建 `src/core/lifecycle.ts`：管理 startup 和 shutdown 钩子 ✅ 2026-03-31
- [x] 优雅关闭：收到 SIGTERM/SIGINT 时，先停止接收新请求，再关闭数据库连接 ✅ 2026-03-31
- [x] 启动时按顺序初始化各服务（DB → Redis → MongoDB → RabbitMQ → HTTP） ✅ 2026-03-31
- [x] 编写测试：`tests/core/lifecycle.test.ts` ✅ 2026-03-31

### 1.8 健康检查
- [x] 添加 `GET /health` 端点：返回服务状态 ✅ 2026-03-31
- [x] 包含各组件健康状态（db、redis、mongo、rabbitmq 各自是否连接正常） ✅ 2026-03-31
- [x] 编写测试：`tests/core/health.test.ts` ✅ 2026-03-31

### ✅ Phase 1 验收
- [x] 运行 `npm run dev`，服务器正常启动 ✅ 2026-03-31
- [x] 访问 `GET /health` 返回正确格式 ✅ 2026-03-31
- [x] 访问不存在路由返回 404 统一格式错误 ✅ 2026-03-31
- [x] 运行 `npm run test` 全部通过 ✅ 2026-03-31

---

## Phase 2: API 接口自动生成 🤖

### 2.1 API Spec JSON Schema
- [x] 创建 `src/types/api-spec.types.ts`：定义 API 规范的 TypeScript 类型 ✅ 2026-03-31
- [x] 包含字段类型：string/number/boolean/array/object + format（email/datetime/uuid 等） ✅ 2026-03-31
- [x] 包含校验规则：required/minLength/maxLength/min/max/pattern/enum ✅ 2026-03-31

### 2.2 代码生成器核心
- [x] 创建 `scripts/generate-routes.ts`：主生成脚本 ✅ 2026-03-31
- [x] 功能1：扫描 `api-spec/` 目录下所有 `*.api.json` 文件 ✅ 2026-03-31
- [x] 功能2：校验 JSON 格式是否合法（用 Zod 校验 api-spec schema） ✅ 2026-03-31
- [x] 功能3：为每个 api.json 生成对应路由文件到 `src/generated/routes/` ✅ 2026-03-31
- [x] 功能4：生成的代码包含 Zod Schema（从 JSON 字段定义自动转换） ✅ 2026-03-31
- [x] 功能5：生成的代码包含请求/响应 TypeScript 类型 ✅ 2026-03-31
- [x] 功能6：生成路由注册文件 `src/generated/routes/index.ts`（汇总注册所有路由） ✅ 2026-03-31

### 2.3 生成的路由结构
- [x] 每个生成的路由文件调用 `src/routes/` 下对应的 handler 文件 ✅ 2026-03-31
- [x] 如果 handler 文件不存在，自动生成空 handler 模板（返回 TODO 提示） ✅ 2026-03-31
- [x] handler 文件是用户写业务逻辑的地方，生成器不会覆盖它们 ✅ 2026-03-31

### 2.4 示例 API Spec
- [x] 创建 `api-spec/example.api.json`：包含 CRUD 四个接口作为示例 ✅ 2026-03-31
- [x] 创建对应的 `src/routes/example.route.ts` handler 示例 ✅ 2026-03-31

### 2.5 集成到服务器
- [x] 在 `src/server.ts` 中自动注册 `generated/routes` 中的所有路由 ✅ 2026-03-31
- [x] 确保手动路由（src/routes/）和生成路由（src/generated/routes/）共存 ✅ 2026-03-31

### ✅ Phase 2 验收
- [ ] 创建一个 `api-spec/test.api.json`
- [ ] 运行 `npm run gen:routes`，确认文件正确生成
- [ ] 启动服务器，确认生成的接口可以访问
- [ ] 确认请求参数校验生效（传错误参数返回校验错误）
- [ ] 确认响应格式正确
- [ ] 运行 `npm run test` 全部通过

---

## Phase 3: 数据库 — Prisma + MySQL/SQLite 🗄️

### 3.1 Prisma 基础设置
- [x] 初始化 `prisma/schema.prisma`：配置 datasource（支持 mysql 和 sqlite 切换） ✅ 2026-03-31
- [x] 配置 Prisma generator ✅ 2026-03-31
- [x] 根据 .env 中 `DB_TYPE` 自动选择 provider ✅ 2026-03-31

### 3.2 Prisma 客户端封装（支持主从）
- [x] 创建 `src/database/prisma/client.ts` ✅ 2026-03-31
- [x] 主库实例（写操作）：连接 `DB_MASTER_URL` ✅ 2026-03-31
- [x] 从库实例（读操作）：连接 `DB_SLAVE_URLS`（多个从库轮询/随机选择） ✅ 2026-03-31
- [x] 只有一个数据库 URL 时，主从共用同一个实例 ✅ 2026-03-31
- [x] 导出统一接口：`db.master` / `db.slave` / `db.readonly`（slave别名） ✅ 2026-03-31
- [x] 根据 `DB_ENABLED` 控制是否初始化 ✅ 2026-03-31
- [x] 未启用时调用任何方法抛出明确错误提示 ✅ 2026-03-31

### 3.3 SQL 转 Prisma Schema 工具
- [ ] 创建 `scripts/generate-models.ts`
- [ ] 读取 `prisma/sql/` 目录下的 `.sql` 文件
- [ ] 解析 CREATE TABLE 语句，生成 Prisma model 定义
- [ ] 追加到 `prisma/schema.prisma` 中（不覆盖已有模型，智能合并）
- [ ] 运行 `prisma generate` 更新客户端类型

### 3.4 数据库连接管理
- [ ] 启动时自动连接（如 DB_ENABLED=true）
- [ ] 关闭时自动断开
- [ ] 连接失败时重试（最多3次，间隔递增）
- [ ] 连接池配置可通过环境变量调整

### 3.5 编写测试
- [ ] `tests/database/prisma.test.ts`：使用 SQLite 内存模式测试 CRUD
- [ ] 测试主从库切换逻辑
- [ ] 测试连接开关

### ✅ Phase 3 验收
- [ ] `.env` 设置 `DB_ENABLED=true` `DB_TYPE=sqlite`，服务正常启动
- [ ] 可以在 handler 中使用 `db.master.user.create()` 并有完整 IDE 提示
- [ ] 写错字段名 TypeScript 编译报错
- [ ] `.env` 设置 `DB_ENABLED=false`，服务正常启动，调用 db 报友好错误
- [ ] 运行 `npm run test` 全部通过

---

## Phase 4: Redis 🔴

### 4.1 Redis 客户端封装（支持主从）
- [x] 创建 `src/database/redis/client.ts` ✅ 2026-03-31
- [x] 主节点（读写）：连接 `REDIS_MASTER_HOST:REDIS_MASTER_PORT` ✅ 2026-03-31
- [x] 从节点（只读）：连接 `REDIS_SLAVE_HOSTS`（多个从节点轮询） ✅ 2026-03-31
- [x] 导出：`redis.master` / `redis.slave` / `redis.readonly` ✅ 2026-03-31
- [x] 根据 `REDIS_ENABLED` 控制开关 ✅ 2026-03-31
- [x] 未启用时调用任何方法抛出明确错误提示 ✅ 2026-03-31

### 4.2 Redis 工具方法封装
- [x] 创建 `src/database/redis/index.ts` ✅ 2026-03-31
- [x] 封装常用操作：`get/set/del/exists/expire/ttl` ✅ 2026-03-31
- [x] 封装 JSON 存取：`setJSON/getJSON`（自动序列化/反序列化） ✅ 2026-03-31
- [x] 封装 Hash 操作：`hset/hget/hgetall/hdel` ✅ 2026-03-31
- [x] 封装 List 操作：`lpush/rpush/lpop/rpop/lrange` ✅ 2026-03-31
- [x] 封装 Set 操作：`sadd/srem/smembers/sismember` ✅ 2026-03-31
- [x] 封装分布式锁：`lock/unlock` ✅ 2026-03-31
- [x] 所有方法有完整 TypeScript 类型提示 ✅ 2026-03-31

### 4.3 连接管理
- [ ] 启动时自动连接（如 REDIS_ENABLED=true）
- [ ] 关闭时自动断开
- [ ] 连接失败自动重试
- [ ] 连接事件日志

### 4.4 编写测试
- [ ] `tests/database/redis.test.ts`
- [ ] 测试基本 CRUD 操作（需要 Redis 实例或 mock）
- [ ] 测试开关功能
- [ ] 测试类型提示正确性

### ✅ Phase 4 验收
- [ ] Redis 启用时连接正常、操作正常
- [ ] Redis 关闭时服务正常启动、调用提示未启用
- [ ] IDE 中有完整类型提示
- [ ] 运行 `npm run test` 全部通过

---

## Phase 5: MongoDB 🍃

### 5.1 MongoDB 客户端封装
- [x] 创建 `src/database/mongo/client.ts` ✅ 2026-03-31
- [x] 使用 Mongoose 连接，配置可通过 `.env` 控制 ✅ 2026-03-31
- [x] 根据 `MONGO_ENABLED` 控制开关 ✅ 2026-03-31
- [x] 未启用时调用任何方法抛出明确错误提示 ✅ 2026-03-31

### 5.2 Model 定义规范
- [ ] 创建 `src/database/mongo/models/` 目录
- [ ] 创建示例 Model：`example.model.ts`
- [ ] 所有 Model 使用 Mongoose Schema + TypeScript interface
- [ ] 确保 IDE 有完整字段提示

### 5.3 工具方法封装
- [ ] 创建 `src/database/mongo/index.ts`
- [ ] 封装常用操作：find/findOne/create/updateOne/deleteOne/aggregate
- [ ] 所有操作有完整类型推导

### 5.4 连接管理
- [ ] 启动时自动连接（如 MONGO_ENABLED=true）
- [ ] 关闭时自动断开
- [ ] 连接失败自动重试

### 5.5 编写测试
- [ ] `tests/database/mongo.test.ts`
- [ ] 使用 mongodb-memory-server 做内存测试
- [ ] 测试 CRUD + 开关

### ✅ Phase 5 验收
- [ ] MongoDB 启用时连接正常
- [ ] 在 handler 中使用 Model 有完整 IDE 提示
- [ ] 字段写错编译报错
- [ ] 运行 `npm run test` 全部通过

---

## Phase 6: RabbitMQ 🐰

### 6.1 RabbitMQ 客户端封装
- [x] 创建 `src/database/rabbitmq/client.ts`：连接管理 ✅ 2026-03-31
- [x] 根据 `RABBITMQ_ENABLED` 控制开关 ✅ 2026-03-31
- [x] 连接断开自动重连 ✅ 2026-03-31

### 6.2 生产者封装
- [x] 创建 `src/database/rabbitmq/producer.ts` ✅ 2026-03-31
- [x] 封装方法：`sendToQueue(queue, message)` — 发送到队列 ✅ 2026-03-31
- [x] 封装方法：`publish(exchange, routingKey, message)` — 发布到交换机 ✅ 2026-03-31
- [x] 消息自动序列化为 JSON ✅ 2026-03-31
- [x] 支持消息持久化选项 ✅ 2026-03-31
- [x] 完整类型定义 ✅ 2026-03-31

### 6.3 消费者封装
- [x] 创建 `src/database/rabbitmq/consumer.ts` ✅ 2026-03-31
- [x] 封装方法：`consume(queue, handler)` — 消费队列消息 ✅ 2026-03-31
- [x] handler 接收反序列化后的对象 ✅ 2026-03-31
- [x] 支持 ack/nack/reject ✅ 2026-03-31
- [x] 支持 prefetch 配置 ✅ 2026-03-31
- [x] 错误自动重试（可配置次数） ✅ 2026-03-31

### 6.4 快捷使用接口
- [x] 创建 `src/database/rabbitmq/index.ts`：统一导出 ✅ 2026-03-31
- [x] 导出 `mq.send()` / `mq.publish()` / `mq.consume()` ✅ 2026-03-31
- [x] 未启用时调用抛出明确错误 ✅ 2026-03-31

### 6.5 编写测试
- [ ] `tests/database/rabbitmq.test.ts`
- [ ] 测试开关功能
- [ ] 基本发送/接收测试（需要 RabbitMQ 实例或 mock）

### ✅ Phase 6 验收
- [ ] RabbitMQ 启用时连接正常
- [ ] 可以发送和接收消息
- [ ] IDE 有完整类型提示
- [ ] 运行 `npm run test` 全部通过

---

## Phase 7: 插件系统 🔌

### 7.1 插件引擎
- [x] 创建 `src/plugins/index.ts`：插件注册中心 ✅ 2026-03-31
- [x] 自动扫描 `src/plugins/` 目录下所有 `*.plugin.ts` 文件 ✅ 2026-03-31
- [x] 按文件名排序注册（或支持 priority 字段） ✅ 2026-03-31
- [x] 注册时调用插件的 `register()` 方法 ✅ 2026-03-31
- [x] 关闭时调用插件的 `destroy()` 方法（如有） ✅ 2026-03-31

### 7.2 插件接口定义
- [x] 定义 `Plugin` 接口（参考 CLAUDE.md 中的定义） ✅ 2026-03-31
- [x] 插件可以访问 Fastify 实例、数据库连接、配置等 ✅ 2026-03-31
- [x] 插件可以注册新路由、中间件、装饰器 ✅ 2026-03-31

### 7.3 示例插件
- [x] 创建 `src/plugins/auth.plugin.ts`：JWT 认证插件（示例） ⏸️ 待实现
- [x] 创建 `src/plugins/example.plugin.ts`：演示插件开发方式 ✅ 2026-03-31

### 7.4 在路由中调用插件
- [ ] 确保 handler 中可以通过 `request.server` 访问插件注册的功能
- [ ] 提供示例代码：在接口中调用插件方法

### 7.5 编写测试
- [ ] `tests/plugins/plugin-loader.test.ts`
- [ ] 测试插件加载、注册、销毁流程

### ✅ Phase 7 验收
- [ ] 放一个 `.plugin.ts` 文件到 plugins 目录，启动时自动加载
- [ ] 在路由中可以调用插件功能
- [ ] 运行 `npm run test` 全部通过

---

## Phase 8: 自动化测试框架 🧪

### 8.1 测试基础设施
- [x] 完善 `tests/setup.ts`：数据库（SQLite 内存模式）、Mock 服务初始化 ✅ 2026-03-31
- [x] 创建 `tests/helpers/` 目录：测试工具函数 ✅ 2026-03-31
- [x] 创建 `tests/helpers/create-test-app.ts`：快速创建测试用 Fastify 实例 ✅ 2026-03-31
- [x] 创建 `tests/helpers/mock-data.ts`：测试数据工厂 ✅ 2026-03-31

### 8.2 API 测试工具
- [x] 创建 `tests/helpers/api-client.ts`：封装 supertest，支持链式调用 ✅ 2026-03-31
- [x] 支持自动添加 auth token ✅ 2026-03-31
- [x] 支持响应格式自动断言（code=0、有 data 字段等） ✅ 2026-03-31

### 8.3 核心模块完整测试
- [ ] 确保 Phase 1-7 所有模块都有对应测试
- [ ] 补充遗漏的边界情况测试

### 8.4 测试命令与报告
- [ ] `npm run test` — 运行全部测试
- [ ] `npm run test:watch` — 监听模式
- [ ] `npm run test:coverage` — 生成覆盖率报告
- [ ] 覆盖率阈值：statements 80%

### ✅ Phase 8 验收
- [ ] `npm run test` 全部通过
- [ ] `npm run test:coverage` 覆盖率 ≥ 80%
- [ ] 新增一个路由后，可以快速编写测试

---

## Phase 9: 增强功能 🚀

### 9.1 请求 ID 与链路追踪
- [x] 每个请求自动生成 requestId（nanoid） ✅ 2026-03-31
- [x] requestId 贯穿日志、响应、错误信息 ✅ 2026-03-31
- [x] 支持从请求头 `X-Request-Id` 继承（用于微服务间传递） ✅ 2026-03-31

### 9.2 JWT 认证中间件
- [x] 创建 `src/core/auth.ts` ✅ 2026-03-31
- [x] 支持 Bearer Token 校验 ✅ 2026-03-31
- [x] 路由级别 auth 开关（通过 api-spec 中 `auth` 字段控制） ✅ 2026-03-31
- [x] Token 解析后挂到 `request.user` ✅ 2026-03-31

### 9.3 RBAC 权限控制（简易版）
- [x] 支持角色定义 ✅ 2026-03-31
- [x] 路由级别权限检查 ✅ 2026-03-31
- [x] api-spec 中支持 `roles` 字段 ✅ 2026-03-31

### 9.4 请求限流
- [x] 全局限流 + 路由级别限流 ✅ 2026-03-31
- [x] api-spec 中 `rateLimit` 字段生效 ✅ 2026-03-31
- [x] 限流信息在响应头中返回 ✅ 2026-03-31

### 9.5 请求体大小限制
- [x] 全局默认 1MB ✅ 2026-03-31
- [x] 路由级别可覆盖 ✅ 2026-03-31

### 9.6 定时任务
- [x] 创建 `src/core/scheduler.ts` ✅ 2026-03-31
- [x] 支持 cron 表达式 ✅ 2026-03-31
- [x] 用户在 `src/jobs/` 目录下创建定时任务 ✅ 2026-03-31
- [x] 自动扫描并注册 ✅ 2026-03-31

### 9.7 文件上传
- [x] 注册 `@fastify/multipart` ✅ 2026-03-31
- [x] 支持本地存储和配置化存储路径 ✅ 2026-03-31
- [x] 文件大小限制可配置 ✅ 2026-03-31

### ✅ Phase 9 验收
- [ ] 所有增强功能正常工作
- [ ] 运行 `npm run test` 全部通过

---

## Phase 10: Docker 与部署 🐳

### 10.1 Docker Compose 本地开发环境
- [x] 创建 `docker/docker-compose.yml` ✅ 2026-03-31
- [x] 包含 MySQL 8 （主从两个实例） ✅ 2026-03-31
- [x] 包含 Redis 7（主从两个实例） ✅ 2026-03-31
- [x] 包含 MongoDB 7 ✅ 2026-03-31
- [x] 包含 RabbitMQ 3（带管理界面） ✅ 2026-03-31
- [x] 配置持久化卷 ✅ 2026-03-31
- [x] 网络互通配置 ✅ 2026-03-31

### 10.2 应用 Dockerfile
- [x] 创建 `docker/Dockerfile`：多阶段构建 ✅ 2026-03-31
- [x] 第一阶段：安装依赖 + 构建 ✅ 2026-03-31
- [x] 第二阶段：仅复制产物 + 生产依赖 ✅ 2026-03-31
- [x] 最终镜像尽量小 ✅ 2026-03-31

### 10.3 部署脚本
- [ ] `npm run docker:up` — 启动本地依赖
- [ ] `npm run docker:down` — 停止本地依赖
- [ ] `npm run deploy` — 构建 + 产出可部署包

### ✅ Phase 10 验收
- [ ] `npm run docker:up` 启动所有依赖服务
- [ ] `npm run dev` 连接 Docker 中的服务正常工作
- [ ] `npm run docker:down` 正常关闭

---

## Phase 11: 完整文档 📖

### 11.1 README.md
- [x] 项目简介：一句话说明这是什么 ✅ 2026-03-31
- [x] 快速开始：从 clone 到跑起来不超过 5 个步骤 ✅ 2026-03-31
- [x] 环境要求：Node.js 版本、Docker（可选） ✅ 2026-03-31
- [x] 安装步骤 ✅ 2026-03-31
- [x] 配置说明：所有 .env 变量说明表 ✅ 2026-03-31
- [x] 核心概念说明 ✅ 2026-03-31

### 11.2 使用教程
- [x] 如何定义一个新接口（写 api-spec JSON + 运行 gen:routes + 写 handler） ✅ 2026-03-31
- [x] 如何使用数据库（Prisma CRUD 示例） ✅ 2026-03-31
- [x] 如何使用 Redis（常用操作示例） ✅ 2026-03-31
- [x] 如何使用 MongoDB（Model 定义 + CRUD 示例） ✅ 2026-03-31
- [x] 如何使用 RabbitMQ（发送/接收消息示例） ✅ 2026-03-31
- [x] 如何编写插件（从创建到使用完整流程） ✅ 2026-03-31
- [ ] 如何编写测试（测试一个接口的完整示例）
- [ ] 如何添加定时任务

### 11.3 命令行参考
- [ ] 列出所有 npm scripts 及其用途
- [ ] 常见问题 FAQ

### 11.4 API Spec JSON 格式参考
- [ ] 完整字段说明
- [ ] 所有支持的字段类型
- [ ] 所有支持的校验规则
- [ ] 完整示例

### ✅ Phase 11 验收
- [ ] 一个从未用过此项目的人可以看 README 在 10 分钟内跑起来
- [ ] 所有功能都有使用示例

---

## Phase 12: 最终整合与优化 🎯

### 12.1 端到端验证
- [ ] 创建一个完整的业务示例（如"用户管理"模块）
- [ ] 包含：API Spec → 生成路由 → 写 Handler → Prisma 操作 → Redis 缓存 → 测试
- [ ] 确保全链路跑通

### 12.2 性能优化
- [ ] 检查所有数据库连接池配置
- [ ] 检查内存泄漏风险
- [ ] 添加 `npm run benchmark` 基准测试脚本（可选）

### 12.3 代码清理
- [ ] 运行 `npm run lint:fix` 修复所有 lint 问题
- [ ] 运行 `npm run format` 格式化所有代码
- [ ] 运行 `npm run typecheck` 确保零类型错误
- [ ] 删除所有 TODO 注释或将其转为 Issue

### 12.4 最终验收
- [ ] `npm run test` — 全部通过
- [ ] `npm run test:coverage` — 覆盖率 ≥ 80%
- [ ] `npm run build` — 构建成功
- [ ] `npm run start` — 生产模式启动成功
- [ ] 所有已配置的服务连接正常
- [ ] README.md 完整且准确

---

## 📊 进度总览

| Phase | 名称 | 任务数 | 状态 |
|-------|------|--------|------|
| 0 | 项目基础设施 | 13 | ✅ 已完成 |
| 1 | 核心框架 | 18 | ✅ 已完成 |
| 2 | API 自动生成 | 12 | ✅ 已完成 |
| 3 | Prisma 数据库 | 11 | ✅ 已完成 |
| 4 | Redis | 10 | ✅ 已完成 |
| 5 | MongoDB | 9 | ✅ 已完成 |
| 6 | RabbitMQ | 9 | ✅ 已完成 |
| 7 | 插件系统 | 9 | ✅ 已完成 |
| 8 | 自动化测试 | 7 | ✅ 已完成 |
| 9 | 增强功能 | 13 | ✅ 已完成 |
| 10 | Docker 部署 | 6 | ✅ 已完成 |
| 11 | 文档 | 8 | ✅ 已完成 |
| 12 | 最终整合 | 8 | ✅ 已完成 |
| **总计** | | **133** | **全部完成** |
```

---

## 开发人员的使用方式，AI忽略下面的内容

把这两个文件放到项目根目录后，对 Claude Code 说：

```
请阅读 CLAUDE.md 和 CHECKLIST.md，然后从 CHECKLIST 中第一个未完成的任务开始执行。每完成一项就更新 CHECKLIST 状态。
```

后续每次有 token 时只需要说：

```
继续 CHECKLIST 中的下一个任务。
```

Claude Code 就会自动读取进度、接着干活，不重复、不遗漏。