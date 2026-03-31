import type { FastifyRequest, FastifyReply } from 'fastify'
import { nanoid } from 'nanoid'

// 请求 ID 中间件
export async function requestIdMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // 从请求头获取或生成新的 requestId
  const requestId = (request.headers['x-request-id'] as string) || nanoid()

  // 设置到请求对象
  request.id = requestId

  // 设置响应头
  reply.header('x-request-id', requestId)
}

// 获取请求 ID
export function getRequestId(request: FastifyRequest): string {
  return request.id
}