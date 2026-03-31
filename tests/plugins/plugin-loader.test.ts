import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { loadPlugins, destroyPlugins, getPlugin, hasPlugin } from '@/plugins'
import type { FastifyInstance } from 'fastify'
import { createTestApp } from '../helpers'

describe('Plugin System', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Plugin loader', () => {
    it('should have loadPlugins function', () => {
      expect(typeof loadPlugins).toBe('function')
    })

    it('should have destroyPlugins function', () => {
      expect(typeof destroyPlugins).toBe('function')
    })

    it('should have getPlugin function', () => {
      expect(typeof getPlugin).toBe('function')
    })

    it('should have hasPlugin function', () => {
      expect(typeof hasPlugin).toBe('function')
    })
  })

  describe('Plugin management', () => {
    it('should return undefined for non-existent plugin', () => {
      const plugin = getPlugin('non-existent')
      expect(plugin).toBeUndefined()
    })

    it('should return false for non-existent plugin check', () => {
      const exists = hasPlugin('non-existent')
      expect(exists).toBe(false)
    })
  })
})