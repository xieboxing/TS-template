import type { FastifyInstance } from 'fastify'
import { createUserSchema, updateUserSchema, userSchema } from '../schemas/user.schema.js'
import * as userService from '../services/user.service.js'

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  // 注册 JSON Schema
  app.addSchema(userSchema)
  app.addSchema(createUserSchema)
  app.addSchema(updateUserSchema)

  // GET /api/users - 获取所有用户
  app.get('/api/users', async () => {
    return userService.findAllUsers()
  })

  // GET /api/users/:id - 根据 ID 获取单个用户
  app.get<{
    Params: { id: string }
  }>('/api/users/:id', async (request, reply) => {
    const { id } = request.params
    const user = userService.findUserById(id)
    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }
    return user
  })

  // POST /api/users - 创建用户
  app.post<{
    Body: { name: string; email: string }
  }>('/api/users', async (request, reply) => {
    const user = userService.createUser(request.body)
    return reply.status(201).send(user)
  })

  // PUT /api/users/:id - 更新用户
  app.put<{
    Params: { id: string }
    Body: { name?: string; email?: string }
  }>('/api/users/:id', async (request, reply) => {
    const { id } = request.params
    const user = userService.updateUser(id, request.body)
    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }
    return user
  })

  // DELETE /api/users/:id - 删除用户
  app.delete<{
    Params: { id: string }
  }>('/api/users/:id', async (request, reply) => {
    const { id } = request.params
    const deleted = userService.deleteUser(id)
    if (!deleted) {
      return reply.status(404).send({ error: 'User not found' })
    }
    return reply.status(204).send()
  })
}
