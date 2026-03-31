/**
 * ⚠️ 此文件由代码生成器自动生成
 * 📅 生成时间: 2026-03-31T09:42:11.940Z
 * 📄 来源: api-spec\example.api.json
 *
 * 🚫 请勿手动修改此文件，修改将在下次生成时被覆盖
 * ✅ 业务逻辑请在 src/routes/ 对应文件中实现
 */

import type { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { z } from 'zod'


// 获取示例列表
export const example_listSchema = {
  params: undefined,
  query: {
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().min(1).max(100).optional().default(10),
  keyword: z.string().max(50).optional()
},
  body: undefined,
}

export type example_listParams = example_listSchema.params extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_listSchema.params>>
export type example_listQuery = example_listSchema.query extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_listSchema.query>>
export type example_listBody = example_listSchema.body extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_listSchema.body>>
export type example_listResponse = {
  total?: number
  page?: number
  pageSize?: number
}


// 根据ID获取示例详情
export const example_getByIdSchema = {
  params: {
  id: z.number().min(1)
},
  query: undefined,
  body: undefined,
}

export type example_getByIdParams = example_getByIdSchema.params extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_getByIdSchema.params>>
export type example_getByIdQuery = example_getByIdSchema.query extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_getByIdSchema.query>>
export type example_getByIdBody = example_getByIdSchema.body extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_getByIdSchema.body>>
export type example_getByIdResponse = {
  id?: number
  name?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}


// 创建示例
export const example_createSchema = {
  params: undefined,
  query: undefined,
  body: {
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional()
},
}

export type example_createParams = example_createSchema.params extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_createSchema.params>>
export type example_createQuery = example_createSchema.query extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_createSchema.query>>
export type example_createBody = example_createSchema.body extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_createSchema.body>>
export type example_createResponse = {
  id?: number
  name?: string
  description?: string
  createdAt?: string
}


// 更新示例
export const example_updateSchema = {
  params: {
  id: z.number().min(1)
},
  query: undefined,
  body: {
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional()
},
}

export type example_updateParams = example_updateSchema.params extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_updateSchema.params>>
export type example_updateQuery = example_updateSchema.query extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_updateSchema.query>>
export type example_updateBody = example_updateSchema.body extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_updateSchema.body>>
export type example_updateResponse = {
  id?: number
  name?: string
  description?: string
  updatedAt?: string
}


// 删除示例
export const example_deleteSchema = {
  params: {
  id: z.number().min(1)
},
  query: undefined,
  body: undefined,
}

export type example_deleteParams = example_deleteSchema.params extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_deleteSchema.params>>
export type example_deleteQuery = example_deleteSchema.query extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_deleteSchema.query>>
export type example_deleteBody = example_deleteSchema.body extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof example_deleteSchema.body>>
export type example_deleteResponse = {
  success?: boolean
}


export default [
  {
    method: 'GET',
    url: '/api/v1/example',
    schema: {
      params: example_listSchema.params !== undefined ? z.object(example_listSchema.params) : undefined,
      querystring: example_listSchema.query !== undefined ? z.object(example_listSchema.query) : undefined,
      body: example_listSchema.body !== undefined ? z.object(example_listSchema.body) : undefined,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { listHandler } = await import('@/routes/example.route')
      return listHandler(request, reply)
    },
  },
  {
    method: 'GET',
    url: '/api/v1/example/:id',
    schema: {
      params: example_getByIdSchema.params !== undefined ? z.object(example_getByIdSchema.params) : undefined,
      querystring: example_getByIdSchema.query !== undefined ? z.object(example_getByIdSchema.query) : undefined,
      body: example_getByIdSchema.body !== undefined ? z.object(example_getByIdSchema.body) : undefined,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { getByIdHandler } = await import('@/routes/example.route')
      return getByIdHandler(request, reply)
    },
  },
  {
    method: 'POST',
    url: '/api/v1/example',
    schema: {
      params: example_createSchema.params !== undefined ? z.object(example_createSchema.params) : undefined,
      querystring: example_createSchema.query !== undefined ? z.object(example_createSchema.query) : undefined,
      body: example_createSchema.body !== undefined ? z.object(example_createSchema.body) : undefined,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { createHandler } = await import('@/routes/example.route')
      return createHandler(request, reply)
    },
  },
  {
    method: 'PUT',
    url: '/api/v1/example/:id',
    schema: {
      params: example_updateSchema.params !== undefined ? z.object(example_updateSchema.params) : undefined,
      querystring: example_updateSchema.query !== undefined ? z.object(example_updateSchema.query) : undefined,
      body: example_updateSchema.body !== undefined ? z.object(example_updateSchema.body) : undefined,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { updateHandler } = await import('@/routes/example.route')
      return updateHandler(request, reply)
    },
  },
  {
    method: 'DELETE',
    url: '/api/v1/example/:id',
    schema: {
      params: example_deleteSchema.params !== undefined ? z.object(example_deleteSchema.params) : undefined,
      querystring: example_deleteSchema.query !== undefined ? z.object(example_deleteSchema.query) : undefined,
      body: example_deleteSchema.body !== undefined ? z.object(example_deleteSchema.body) : undefined,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { deleteHandler } = await import('@/routes/example.route')
      return deleteHandler(request, reply)
    },
  },
] as RouteOptions[]
