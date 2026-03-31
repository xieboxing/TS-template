import amqp from 'amqplib'
import { mqConfig } from '@/config'
import { logger } from '@/core/logger'

// 连接实例
let connection: amqp.Connection | null = null

// 通道实例
let channel: amqp.Channel | null = null

// 是否已初始化
let isInitialized = false

// 初始化 RabbitMQ 连接
export async function initRabbitMQ(): Promise<void> {
  if (!mqConfig.enabled) {
    logger.info('RabbitMQ 未启用，跳过初始化')
    return
  }

  if (isInitialized) {
    return
  }

  if (!mqConfig.url) {
    throw new Error('RabbitMQ URL 未配置')
  }

  try {
    connection = await amqp.connect(mqConfig.url)
    channel = await connection.createChannel()

    connection.on('close', () => {
      logger.warn('RabbitMQ 连接已关闭')
      isInitialized = false
    })

    connection.on('error', (error) => {
      logger.error('RabbitMQ 连接错误', error)
    })

    logger.info('RabbitMQ 已连接')
    isInitialized = true
  } catch (error) {
    logger.error('RabbitMQ 连接失败', error)
    throw error
  }
}

// 关闭 RabbitMQ 连接
export async function closeRabbitMQ(): Promise<void> {
  if (channel) {
    await channel.close()
  }
  if (connection) {
    await connection.close()
  }
  logger.info('RabbitMQ 已断开')
  isInitialized = false
  connection = null
  channel = null
}

// RabbitMQ 操作接口
export const mq = {
  // 获取通道
  get channel(): amqp.Channel {
    if (!mqConfig.enabled) {
      throw new Error('RabbitMQ 未启用，请在 .env 中设置 RABBITMQ_ENABLED=true')
    }
    if (!channel) {
      throw new Error('RabbitMQ 通道未初始化')
    }
    return channel
  },

  // 检查是否已初始化
  isInitialized(): boolean {
    return isInitialized
  },

  // 检查是否启用
  isEnabled(): boolean {
    return mqConfig.enabled
  },
}

// 默认导出
export default mq