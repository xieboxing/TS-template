import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import type { FastifyInstance } from 'fastify'
import { errorHandler } from '@/core/error-handler'
import { registerMiddleware } from '@/core/middleware'

// 创建测试用的 Fastify 实例
export async function createTestApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false,
    requestIdHeader: 'x-request-id',
    genReqId: () => `test-${Date.now()}`,
  })

  // 注册安全插件
  await app.register(helmet, { global: true })
  await app.register(cors, { origin: true })

  // 注册中间件
  registerMiddleware(app)

  // 注册全局错误处理
  app.setErrorHandler(errorHandler)

  // 健康检查端点
  app.get('/health', async (request) => {
    return {
      code: 0,
      message: 'success',
      data: { status: 'ok', timestamp: Date.now() },
      requestId: request.id,
    }
  })

  return app
}