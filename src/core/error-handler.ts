import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { fail } from './response'

// 错误码枚举
export enum ErrorCode {
  // 系统级错误 (1xxxx)
  UNKNOWN = 10000,
  BAD_REQUEST = 10001,
  VALIDATION_ERROR = 10002,
  NOT_FOUND = 10003,
  METHOD_NOT_ALLOWED = 10004,
  INTERNAL_ERROR = 10005,

  // 认证相关错误 (2xxxx)
  UNAUTHORIZED = 20001,
  TOKEN_EXPIRED = 20002,
  TOKEN_INVALID = 20003,
  PERMISSION_DENIED = 20004,

  // 业务相关错误 (3xxxx)
  USER_NOT_FOUND = 30001,
  USER_ALREADY_EXISTS = 30002,
  PASSWORD_WRONG = 30003,
  RESOURCE_NOT_FOUND = 30004,
}

// HTTP 状态码映射
const errorCodeToHttpStatus: Record<number, number> = {
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.METHOD_NOT_ALLOWED]: 405,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.TOKEN_EXPIRED]: 401,
  [ErrorCode.TOKEN_INVALID]: 401,
  [ErrorCode.PERMISSION_DENIED]: 403,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.UNKNOWN]: 500,
}

// 自定义应用错误类
export class AppError extends Error {
  code: ErrorCode
  details?: Record<string, unknown>

  constructor(code: ErrorCode, message: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
  }

  // 获取对应的 HTTP 状态码
  getHttpStatus(): number {
    return errorCodeToHttpStatus[this.code] || 500
  }
}

// 全局错误处理器
export async function errorHandler(
  error: FastifyError | AppError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ApiResponse<null>> {
  // AppError 处理
  if (error instanceof AppError) {
    reply.status(error.getHttpStatus())
    return fail(request, error.code, error.message)
  }

  // Fastify 验证错误
  if ('validation' in error && error.validation) {
    reply.status(400)
    const messages = error.validation.map((v) => v.message).join(', ')
    return fail(request, ErrorCode.VALIDATION_ERROR, messages || '参数校验失败')
  }

  // 其他错误
  request.log.error(error)
  reply.status(500)
  return fail(request, ErrorCode.INTERNAL_ERROR, '服务器内部错误')
}