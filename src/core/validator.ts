import { z } from 'zod'
import type { FastifyRequest } from 'fastify'
import { AppError, ErrorCode } from './error-handler'

// 格式化 Zod 错误信息
function formatZodError(error: z.ZodError): string {
  const issues = error.issues || error.errors
  if (issues && Array.isArray(issues)) {
    return issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
  }
  return '参数校验失败'
}

// 校验请求体
export function validateBody<T>(request: FastifyRequest, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(request.body)
  if (!result.success) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, formatZodError(result.error))
  }
  return result.data
}

// 校验查询参数
export function validateQuery<T>(request: FastifyRequest, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(request.query)
  if (!result.success) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, formatZodError(result.error))
  }
  return result.data
}

// 校验路由参数
export function validateParams<T>(request: FastifyRequest, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(request.params)
  if (!result.success) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, formatZodError(result.error))
  }
  return result.data
}