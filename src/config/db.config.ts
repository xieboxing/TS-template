import { z } from 'zod'

// 数据库配置 Schema
const DbConfigSchema = z.object({
  enabled: z.boolean().default(false),
  type: z.enum(['mysql', 'sqlite']).default('sqlite'),
  masterUrl: z.string().optional(),
  slaveUrls: z.array(z.string()).default([]),
})

// 从环境变量解析配置
function loadDbConfig(): DbConfig {
  const slaveUrlsStr = process.env.DB_SLAVE_URLS
  const slaveUrls = slaveUrlsStr ? slaveUrlsStr.split(',').filter(Boolean) : []

  return DbConfigSchema.parse({
    enabled: process.env.DB_ENABLED === 'true',
    type: process.env.DB_TYPE,
    masterUrl: process.env.DB_MASTER_URL,
    slaveUrls,
  })
}

// 数据库配置类型
export type DbConfig = z.infer<typeof DbConfigSchema>

// 导出配置实例
export const dbConfig = loadDbConfig()