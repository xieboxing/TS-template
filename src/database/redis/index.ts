import { redis } from './client'

// 基本操作封装
export const redisUtils = {
  // 获取值
  async get(key: string): Promise<string | null> {
    return redis.master.get(key)
  },

  // 设置值
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await redis.master.setex(key, ttl, value)
    } else {
      await redis.master.set(key, value)
    }
  },

  // 删除键
  async del(key: string): Promise<number> {
    return redis.master.del(key)
  },

  // 检查键是否存在
  async exists(key: string): Promise<boolean> {
    const result = await redis.master.exists(key)
    return result === 1
  },

  // 设置过期时间
  async expire(key: string, seconds: number): Promise<boolean> {
    const result = await redis.master.expire(key, seconds)
    return result === 1
  },

  // 获取剩余过期时间
  async ttl(key: string): Promise<number> {
    return redis.master.ttl(key)
  },

  // JSON 操作
  async setJSON<T>(key: string, value: T, ttl?: number): Promise<void> {
    const json = JSON.stringify(value)
    await this.set(key, json, ttl)
  },

  async getJSON<T>(key: string): Promise<T | null> {
    const json = await redis.slave.get(key)
    if (!json) return null
    try {
      return JSON.parse(json) as T
    } catch {
      return null
    }
  },

  // Hash 操作
  async hset(key: string, field: string, value: string): Promise<number> {
    return redis.master.hset(key, field, value)
  },

  async hget(key: string, field: string): Promise<string | null> {
    return redis.slave.hget(key, field)
  },

  async hgetall(key: string): Promise<Record<string, string>> {
    return redis.slave.hgetall(key)
  },

  async hdel(key: string, field: string): Promise<number> {
    return redis.master.hdel(key, field)
  },

  // List 操作
  async lpush(key: string, value: string): Promise<number> {
    return redis.master.lpush(key, value)
  },

  async rpush(key: string, value: string): Promise<number> {
    return redis.master.rpush(key, value)
  },

  async lpop(key: string): Promise<string | null> {
    return redis.master.lpop(key)
  },

  async rpop(key: string): Promise<string | null> {
    return redis.master.rpop(key)
  },

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return redis.slave.lrange(key, start, stop)
  },

  // Set 操作
  async sadd(key: string, member: string): Promise<number> {
    return redis.master.sadd(key, member)
  },

  async srem(key: string, member: string): Promise<number> {
    return redis.master.srem(key, member)
  },

  async smembers(key: string): Promise<string[]> {
    return redis.slave.smembers(key)
  },

  async sismember(key: string, member: string): Promise<boolean> {
    const result = await redis.slave.sismember(key, member)
    return result === 1
  },

  // 分布式锁
  async lock(key: string, ttl: number = 10): Promise<boolean> {
    const result = await redis.master.set(key, 'locked', 'NX', 'EX', ttl)
    return result === 'OK'
  },

  async unlock(key: string): Promise<boolean> {
    const result = await redis.master.del(key)
    return result === 1
  },
}

export default redisUtils