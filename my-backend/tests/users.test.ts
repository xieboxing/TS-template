import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../src/app.js'
import * as userService from '../src/services/user.service.js'

describe('Users API', () => {
  let app: Awaited<ReturnType<typeof buildApp>>

  beforeEach(async () => {
    app = await buildApp()
  })

  afterEach(async () => {
    userService.resetUsers()
    await app.close()
  })

  describe('GET /api/users', () => {
    it('should return empty array when no users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users',
      })

      assert.strictEqual(response.statusCode, 200)
      assert.deepStrictEqual(response.json(), [])
    })

    it('should return all users', async () => {
      // 创建测试用户
      await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: { name: 'User 1', email: 'user1@test.com' },
      })
      await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: { name: 'User 2', email: 'user2@test.com' },
      })

      const response = await app.inject({
        method: 'GET',
        url: '/api/users',
      })

      assert.strictEqual(response.statusCode, 200)
      const users = response.json() as Array<{ name: string; email: string }>
      assert.strictEqual(users.length, 2)
    })
  })

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: { name: 'Test User', email: 'test@test.com' },
      })
      const createdUser = createResponse.json() as { id: string }

      const response = await app.inject({
        method: 'GET',
        url: `/api/users/${createdUser.id}`,
      })

      assert.strictEqual(response.statusCode, 200)
      const user = response.json() as { name: string; email: string }
      assert.strictEqual(user.name, 'Test User')
      assert.strictEqual(user.email, 'test@test.com')
    })

    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/non-existent-id',
      })

      assert.strictEqual(response.statusCode, 404)
    })
  })

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: { name: 'New User', email: 'newuser@test.com' },
      })

      assert.strictEqual(response.statusCode, 201)
      const user = response.json() as {
        id: string
        name: string
        email: string
        createdAt: string
        updatedAt: string
      }
      assert.ok(user.id)
      assert.strictEqual(user.name, 'New User')
      assert.strictEqual(user.email, 'newuser@test.com')
      assert.ok(user.createdAt)
      assert.ok(user.updatedAt)
    })

    it('should create user with valid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: { name: 'Valid User', email: 'valid@test.com' },
      })

      assert.strictEqual(response.statusCode, 201)
      const user = response.json() as { id: string }
      assert.ok(user.id)
    })
  })

  describe('PUT /api/users/:id', () => {
    it('should update existing user', async () => {
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: { name: 'Original Name', email: 'original@test.com' },
      })
      const createdUser = createResponse.json() as { id: string }

      const response = await app.inject({
        method: 'PUT',
        url: `/api/users/${createdUser.id}`,
        payload: { name: 'Updated Name' },
      })

      assert.strictEqual(response.statusCode, 200)
      const user = response.json() as { name: string; email: string }
      assert.strictEqual(user.name, 'Updated Name')
      assert.strictEqual(user.email, 'original@test.com')
    })

    it('should update email only', async () => {
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: { name: 'Test User', email: 'old@test.com' },
      })
      const createdUser = createResponse.json() as { id: string }

      const response = await app.inject({
        method: 'PUT',
        url: `/api/users/${createdUser.id}`,
        payload: { email: 'new@test.com' },
      })

      assert.strictEqual(response.statusCode, 200)
      const user = response.json() as { name: string; email: string }
      assert.strictEqual(user.name, 'Test User')
      assert.strictEqual(user.email, 'new@test.com')
    })

    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/api/users/non-existent-id',
        payload: { name: 'Updated Name' },
      })

      assert.strictEqual(response.statusCode, 404)
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('should delete existing user', async () => {
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: { name: 'User to Delete', email: 'delete@test.com' },
      })
      const createdUser = createResponse.json() as { id: string }

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/users/${createdUser.id}`,
      })

      assert.strictEqual(response.statusCode, 204)

      // 验证用户已被删除
      const getResponse = await app.inject({
        method: 'GET',
        url: `/api/users/${createdUser.id}`,
      })
      assert.strictEqual(getResponse.statusCode, 404)
    })

    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/users/non-existent-id',
      })

      assert.strictEqual(response.statusCode, 404)
    })
  })
})
