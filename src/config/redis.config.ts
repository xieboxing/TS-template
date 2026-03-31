import { z } from 'zod'

// Redis 配置 Schema
const RedisConfigSchema = z.object({
  enabled: z.boolean().default(false),
  masterHost: z.string().default('localhost'),
  masterPort: z.number().default(6379),
  masterPassword: z.string().optional(),
  slaveHosts: z.array(z.string()).default([]),
})

// 从环境变量解析配置
function loadRedisConfig(): RedisConfig {
  const slaveHostsStr = process.env.REDIS_SLAVE_HOSTS
  const slaveHosts = slaveHostsStr ? slaveHostsStr.split(',').filter(Boolean) : []

  return RedisConfigSchema.parse({
    enabled: process.env.REDIS_ENABLED === 'true',
    masterHost: process.env.REDIS_MASTER_HOST,
    masterPort: process.env.REDIS_MASTER_PORT ? parseInt(process.env.REDIS_MASTER_PORT, 10) : undefined,
    masterPassword: process.env.REDIS_MASTER_PASSWORD,
    slaveHosts,
  })
}

// Redis 配置类型
export type RedisConfig = z.infer<typeof RedisConfigSchema>

// 导出配置实例
export const redisConfig = loadRedisConfig()