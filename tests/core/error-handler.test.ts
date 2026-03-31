import { describe, it, expect } from 'vitest'
import { AppError, ErrorCode } from '@/core/error-handler'

describe('Error Handler Module', () => {
  it('should create AppError with code and message', () => {
    const error = new AppError(ErrorCode.NOT_FOUND, '资源不存在')
    expect(error.code).toBe(ErrorCode.NOT_FOUND)
    expect(error.message).toBe('资源不存在')
    expect(error.name).toBe('AppError')
  })

  it('should create AppError with details', () => {
    const error = new AppError(ErrorCode.BAD_REQUEST, '参数错误', { field: 'name' })
    expect(error.details).toEqual({ field: 'name' })
  })

  it('should map error code to HTTP status', () => {
    const notFoundError = new AppError(ErrorCode.NOT_FOUND, '未找到')
    expect(notFoundError.getHttpStatus()).toBe(404)

    const unauthorizedError = new AppError(ErrorCode.UNAUTHORIZED, '未授权')
    expect(unauthorizedError.getHttpStatus()).toBe(401)

    const internalError = new AppError(ErrorCode.INTERNAL_ERROR, '内部错误')
    expect(internalError.getHttpStatus()).toBe(500)
  })
})