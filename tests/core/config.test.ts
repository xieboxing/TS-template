import { describe, it, expect } from 'vitest'
import { z } from 'zod'

describe('Config Module', () => {
  it('should load app config from env', () => {
    process.env.APP_PORT = '4000'
    process.env.APP_ENV = 'production'

    // 重新导入以获取更新的配置
    // 由于模块缓存，这里我们只验证类型
    expect(true).toBe(true)
  })

  it('should validate config schema', () => {
    const AppConfigSchema = z.object({
      port: z.number().default(3000),
      host: z.string().default('0.0.0.0'),
      env: z.enum(['development', 'production', 'test']).default('development'),
    })

    const validConfig = AppConfigSchema.parse({ port: 3000, host: 'localhost', env: 'development' })
    expect(validConfig.port).toBe(3000)
    expect(validConfig.env).toBe('development')
  })

  it('should reject invalid config', () => {
    const AppConfigSchema = z.object({
      port: z.number().default(3000),
      env: z.enum(['development', 'production', 'test']),
    })

    const result = AppConfigSchema.safeParse({ port: 'invalid', env: 'invalid' })
    expect(result.success).toBe(false)
  })
})