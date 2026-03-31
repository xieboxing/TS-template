import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { logger } from './logger'

// 中间件类型定义
export type MiddlewareHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) => void | Promise<void>

// 注册全局中间件
export function registerMiddleware(app: import('fastify').FastifyInstance): void {
  // 请求日志中间件
  app.addHook('onRequest', async (request: FastifyRequest) => {
    request.log = logger.child({ requestId: request.id })
    logger.debug(`--> ${request.method} ${request.url}`)
  })

  // 响应日志中间件
  app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const responseTime = reply.elapsedTime
    logger.debug(`<-- ${request.method} ${request.url} ${reply.statusCode} (${responseTime}ms)`)
  })
}