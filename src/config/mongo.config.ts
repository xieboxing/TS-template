import { z } from 'zod'

// MongoDB 配置 Schema
const MongoConfigSchema = z.object({
  enabled: z.boolean().default(false),
  uri: z.string().optional(),
})

// 从环境变量解析配置
function loadMongoConfig(): MongoConfig {
  return MongoConfigSchema.parse({
    enabled: process.env.MONGO_ENABLED === 'true',
    uri: process.env.MONGO_URI,
  })
}

// MongoDB 配置类型
export type MongoConfig = z.infer<typeof MongoConfigSchema>

// 导出配置实例
export const mongoConfig = loadMongoConfig()