import { describe, it, expect } from 'vitest'
import { success, fail, paginate } from '@/core/response'
import type { FastifyRequest } from 'fastify'

// Mock request
const mockRequest = {
  id: 'test-request-id',
} as FastifyRequest

describe('Response Module', () => {
  it('should create success response', () => {
    const response = success(mockRequest, { name: 'test' })
    expect(response.code).toBe(0)
    expect(response.message).toBe('success')
    expect(response.data).toEqual({ name: 'test' })
    expect(response.timestamp).toBeDefined()
    expect(response.requestId).toBe('test-request-id')
  })

  it('should create fail response', () => {
    const response = fail(mockRequest, 10001, '参数错误')
    expect(response.code).toBe(10001)
    expect(response.message).toBe('参数错误')
    expect(response.data).toBeNull()
  })

  it('should create paginate response', () => {
    const list = [{ id: 1 }, { id: 2 }]
    const response = paginate(mockRequest, list, 10, 1, 5)
    expect(response.code).toBe(0)
    expect(response.data.list).toEqual(list)
    expect(response.data.total).toBe(10)
    expect(response.data.page).toBe(1)
    expect(response.data.pageSize).toBe(5)
    expect(response.data.totalPages).toBe(2)
  })
})