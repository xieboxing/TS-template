import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '@/server'
import type { FastifyInstance } from 'fastify'

describe('Server Module', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await createServer()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create Fastify instance', () => {
    expect(app).toBeDefined()
  })

  it('should return 404 for unknown route', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/unknown-route',
    })

    expect(response.statusCode).toBe(404)
  })

  it('should handle example route', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/example',
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.code).toBe(0)
  })
})