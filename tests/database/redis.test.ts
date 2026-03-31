import { describe, it, expect } from 'vitest'
import { redis } from '@/database/redis/client'
import { redisUtils } from '@/database/redis'

describe('Redis Client', () => {
  describe('Redis disabled', () => {
    it('should throw error when Redis is disabled', () => {
      expect(() => redis.master).toThrow('Redis 未启用')
      expect(() => redis.slave).toThrow('Redis 未启用')
      expect(redis.isEnabled()).toBe(false)
    })

    it('should return false for isInitialized when not initialized', () => {
      expect(redis.isInitialized()).toBe(false)
    })
  })

  describe('Redis utils', () => {
    it('should have all required methods', () => {
      expect(typeof redisUtils.get).toBe('function')
      expect(typeof redisUtils.set).toBe('function')
      expect(typeof redisUtils.del).toBe('function')
      expect(typeof redisUtils.exists).toBe('function')
      expect(typeof redisUtils.expire).toBe('function')
      expect(typeof redisUtils.ttl).toBe('function')
      expect(typeof redisUtils.setJSON).toBe('function')
      expect(typeof redisUtils.getJSON).toBe('function')
      expect(typeof redisUtils.hset).toBe('function')
      expect(typeof redisUtils.hget).toBe('function')
      expect(typeof redisUtils.hgetall).toBe('function')
      expect(typeof redisUtils.hdel).toBe('function')
      expect(typeof redisUtils.lpush).toBe('function')
      expect(typeof redisUtils.rpush).toBe('function')
      expect(typeof redisUtils.lpop).toBe('function')
      expect(typeof redisUtils.rpop).toBe('function')
      expect(typeof redisUtils.lrange).toBe('function')
      expect(typeof redisUtils.sadd).toBe('function')
      expect(typeof redisUtils.srem).toBe('function')
      expect(typeof redisUtils.smembers).toBe('function')
      expect(typeof redisUtils.sismember).toBe('function')
      expect(typeof redisUtils.lock).toBe('function')
      expect(typeof redisUtils.unlock).toBe('function')
    })
  })
})