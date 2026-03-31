import type { FastifyRequest } from 'fastify'
import { nanoid } from 'nanoid'

// API 响应类型定义
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: number
  requestId: string
}

// 分页响应数据类型
export interface PaginateData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 获取请求 ID
function getRequestId(request: FastifyRequest): string {
  return request.id || nanoid()
}

// 成功响应
export function success<T>(
  request: FastifyRequest,
  data: T,
  message = 'success',
): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
    timestamp: Date.now(),
    requestId: getRequestId(request),
  }
}

// 失败响应
export function fail(
  request: FastifyRequest,
  code: number,
  message: string,
): ApiResponse<null> {
  return {
    code,
    message,
    data: null,
    timestamp: Date.now(),
    requestId: getRequestId(request),
  }
}

// 分页响应
export function paginate<T>(
  request: FastifyRequest,
  list: T[],
  total: number,
  page: number,
  pageSize: number,
): ApiResponse<PaginateData<T>> {
  const totalPages = Math.ceil(total / pageSize)
  return success(request, {
    list,
    total,
    page,
    pageSize,
    totalPages,
  })
}