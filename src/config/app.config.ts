import { z } from 'zod'

// 应用配置 Schema
const AppConfigSchema = z.object({
  port: z.number().default(3000),
  host: z.string().default('0.0.0.0'),
  env: z.enum(['development', 'production', 'test']).default('development'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error', 'fatal']).default('info'),
})

// 从环境变量解析配置
function loadAppConfig(): AppConfig {
  return AppConfigSchema.parse({
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : undefined,
    host: process.env.APP_HOST,
    env: process.env.APP_ENV,
    logLevel: process.env.APP_LOG_LEVEL,
  })
}

// 应用配置类型
export type AppConfig = z.infer<typeof AppConfigSchema>

// 导出配置实例
export const appConfig = loadAppConfig()

// 判断是否开发环境
export const isDevelopment = appConfig.env === 'development'

// 判断是否生产环境
export const isProduction = appConfig.env === 'production'

// 判断是否测试环境
export const isTest = appConfig.env === 'test'