import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../src/app.js'

describe('Health Check', () => {
  let app: Awaited<ReturnType<typeof buildApp>>

  beforeEach(async () => {
    app = await buildApp()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should return status ok with timestamp', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    })

    assert.strictEqual(response.statusCode, 200)
    const body = response.json() as { status: string; timestamp: string }
    assert.strictEqual(body.status, 'ok')
    assert.ok(body.timestamp)
  })

  it('should return valid timestamp format', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    })

    const body = response.json() as { status: string; timestamp: string }
    const timestamp = new Date(body.timestamp)
    assert.ok(!isNaN(timestamp.getTime()))
  })
})
