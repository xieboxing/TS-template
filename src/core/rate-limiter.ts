import type { FastifyRequest, FastifyReply } from 'fastify'

// 限流配置接口
export interface RateLimitConfig {
  max: number
  timeWindow: number // 毫秒
  keyGenerator?: (request: FastifyRequest) => string
}

// 内存限流存储（生产环境建议使用 Redis）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// 清理过期记录
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // 每分钟清理一次

// 默认 IP 限流配置
const defaultRateLimit: RateLimitConfig = {
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  timeWindow: parseInt(process.env.RATE_LIMIT_TIME_WINDOW || '60000', 10),
}

// 限流中间件
export function createRateLimiter(config: RateLimitConfig = defaultRateLimit) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // 生成限流 key
    const key = config.keyGenerator
      ? config.keyGenerator(request)
      : request.ip || 'unknown'

    const now = Date.now()

    // 获取或创建限流记录
    let record = rateLimitStore.get(key)

    if (!record || record.resetTime < now) {
      record = { count: 0, resetTime: now + config.timeWindow }
      rateLimitStore.set(key, record)
    }

    // 增加计数
    record.count++

    // 设置响应头
    const remaining = Math.max(0, config.max - record.count)
    const resetTime = Math.ceil((record.resetTime - now) / 1000)

    reply.header('X-RateLimit-Limit', config.max)
    reply.header('X-RateLimit-Remaining', remaining)
    reply.header('X-RateLimit-Reset', resetTime)

    // 检查是否超限
    if (record.count > config.max) {
      reply.header('Retry-After', resetTime)
      reply.code(429).send({
        code: 10006,
        message: '请求过于频繁，请稍后再试',
        data: null,
        timestamp: now,
        requestId: request.id,
      })
      return
    }
  }
}

// 路由级别限流配置存储
const routeRateLimits = new Map<string, RateLimitConfig>()

// 注册路由限流配置
export function registerRouteRateLimit(route: string, config: RateLimitConfig): void {
  routeRateLimits.set(route, config)
}

// 获取路由限流配置
export function getRouteRateLimit(route: string): RateLimitConfig | undefined {
  return routeRateLimits.get(route)
}