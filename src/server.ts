import type { FastifyInstance, FastifyRequest } from 'fastify'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { nanoid } from 'nanoid'
import { appConfig } from '@/config'
import { errorHandler } from '@/core/error-handler'
import { registerMiddleware } from '@/core/middleware'
import { registerLifecycle, initDatabaseServices } from '@/core/lifecycle'
import { registerRoutes } from '@/core/router'
import { success } from '@/core/response'

// 创建 Fastify 实例
export async function createServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // 使用自定义 logger
    requestIdHeader: 'x-request-id',
    genReqId: () => nanoid(),
    bodyLimit: 1048576, // 1MB
  })

  // 注册安全插件
  await app.register(helmet, {
    global: true,
  })

  // 注册 CORS
  await app.register(cors, {
    origin: appConfig.env === 'production' ? process.env.CORS_ORIGIN : true,
    credentials: true,
  })

  // 注册 Rate Limit
  await app.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_TIME_WINDOW || '60000', 10),
    enableDraftSpec: true,
  })

  // 注册中间件
  registerMiddleware(app)

  // 注册生命周期
  registerLifecycle(app)

  // 注册全局错误处理
  app.setErrorHandler(errorHandler)

  // 健康检查端点
  app.get('/health', async (request: FastifyRequest) => {
    return success(request, {
      status: 'ok',
      timestamp: Date.now(),
      uptime: process.uptime(),
      services: {
        database: process.env.DB_ENABLED === 'true' ? 'enabled' : 'disabled',
        redis: process.env.REDIS_ENABLED === 'true' ? 'enabled' : 'disabled',
        mongo: process.env.MONGO_ENABLED === 'true' ? 'enabled' : 'disabled',
        rabbitmq: process.env.RABBITMQ_ENABLED === 'true' ? 'enabled' : 'disabled',
      },
    })
  })

  // 初始化数据库服务
  initDatabaseServices()

  // 注册路由
  await registerRoutes(app)

  return app
}