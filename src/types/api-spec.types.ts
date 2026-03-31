// API 规范 JSON 类型定义
// 用于代码生成器解析 api-spec/*.api.json 文件

// 字段类型定义
export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object'

// 字段格式
export type FieldFormat = 'email' | 'datetime' | 'uuid' | 'url' | 'integer' | 'date' | 'time'

// 字段定义
export interface ApiSpecField {
  type: FieldType
  required?: boolean
  description?: string
  format?: FieldFormat
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  enum?: string[]
  default?: unknown
  items?: ApiSpecField // 用于 array 类型
  properties?: Record<string, ApiSpecField> // 用于 object 类型
}

// API 定义
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
  roles?: string[]
  rateLimit?: {
    max: number
    timeWindow: string
  }
}

// API 规范模块定义
export interface ApiSpec {
  module: string
  basePath: string
  description?: string
  apis: ApiSpecApi[]
}

// Zod Schema 定义（用于校验 api-spec JSON）
import { z } from 'zod'

export const ApiSpecFieldSchema: z.ZodType<ApiSpecField> = z.object({
  type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
  required: z.boolean().optional(),
  description: z.string().optional(),
  format: z.enum(['email', 'datetime', 'uuid', 'url', 'integer', 'date', 'time']).optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  enum: z.array(z.string()).optional(),
  default: z.unknown().optional(),
  items: z.lazy(() => ApiSpecFieldSchema).optional(),
  properties: z.record(z.string(), z.lazy(() => ApiSpecFieldSchema)).optional(),
})

export const ApiSpecApiSchema: z.ZodType<ApiSpecApi> = z.object({
  name: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  path: z.string(),
  description: z.string().optional(),
  params: z.record(z.string(), ApiSpecFieldSchema).optional(),
  query: z.record(z.string(), ApiSpecFieldSchema).optional(),
  body: z.record(z.string(), ApiSpecFieldSchema).nullable().optional(),
  response: z.record(z.string(), ApiSpecFieldSchema).optional(),
  auth: z.boolean().optional(),
  roles: z.array(z.string()).optional(),
  rateLimit: z
    .object({
      max: z.number(),
      timeWindow: z.string(),
    })
    .optional(),
})

export const ApiSpecSchema: z.ZodType<ApiSpec> = z.object({
  module: z.string(),
  basePath: z.string(),
  description: z.string().optional(),
  apis: z.array(ApiSpecApiSchema),
})