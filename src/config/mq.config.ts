import { z } from 'zod'

// RabbitMQ 配置 Schema
const MqConfigSchema = z.object({
  enabled: z.boolean().default(false),
  url: z.string().optional(),
})

// 从环境变量解析配置
function loadMqConfig(): MqConfig {
  return MqConfigSchema.parse({
    enabled: process.env.RABBITMQ_ENABLED === 'true',
    url: process.env.RABBITMQ_URL,
  })
}

// RabbitMQ 配置类型
export type MqConfig = z.infer<typeof MqConfigSchema>

// 导出配置实例
export const mqConfig = loadMqConfig()