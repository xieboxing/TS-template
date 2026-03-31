// API 相关类型定义

// API 响应类型
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: number
  requestId: string
}

// 分页数据类型
export interface PaginateData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// API 规范 JSON 类型
export interface ApiSpecField {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required?: boolean
  description?: string
  format?: 'email' | 'datetime' | 'uuid' | 'url' | 'integer'
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  enum?: string[]
  default?: unknown
}

export interface ApiSpecApi {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description?: string
  params?: Record<string, ApiSpecField>
  query?: Record<string, ApiSpecField>
  body?: Record<string, ApiSpecField> | null
  response?: Record<string, ApiSpecField>
  auth?: boolean
  rateLimit?: {
    max: number
    timeWindow: string
  }
}

export interface ApiSpec {
  module: string
  basePath: string
  description?: string
  apis: ApiSpecApi[]
}