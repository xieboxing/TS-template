import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { validateBody, validateQuery, validateParams } from '@/core/validator'
import { AppError, ErrorCode } from '@/core/error-handler'
import type { FastifyRequest } from 'fastify'

// Mock request
const createMockRequest = (body?: unknown, query?: unknown, params?: unknown): FastifyRequest => {
  return {
    body,
    query,
    params,
  } as FastifyRequest
}

describe('Validator Module', () => {
  it('should validate valid body', () => {
    const schema = z.object({ name: z.string() })
    const request = createMockRequest({ name: 'test' })
    const result = validateBody(request, schema)
    expect(result).toEqual({ name: 'test' })
  })

  it('should throw error for invalid body', () => {
    const schema = z.object({ name: z.string().min(2) })
    const request = createMockRequest({ name: 't' })

    expect(() => validateBody(request, schema)).toThrow(AppError)
    try {
      validateBody(request, schema)
    } catch (error) {
      expect((error as AppError).code).toBe(ErrorCode.VALIDATION_ERROR)
    }
  })

  it('should validate valid query', () => {
    const schema = z.object({ page: z.coerce.number().default(1) })
    const request = createMockRequest(undefined, { page: '2' })
    const result = validateQuery(request, schema)
    expect(result.page).toBe(2)
  })

  it('should validate valid params', () => {
    const schema = z.object({ id: z.coerce.number() })
    const request = createMockRequest(undefined, undefined, { id: '123' })
    const result = validateParams(request, schema)
    expect(result.id).toBe(123)
  })
})