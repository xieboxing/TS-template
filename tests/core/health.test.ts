import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '@/server'
import type { FastifyInstance } from 'fastify'

describe('Health Endpoint', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await createServer()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.code).toBe(0)
    expect(body.data.status).toBe('ok')
    expect(body.data.services).toBeDefined()
  })
})