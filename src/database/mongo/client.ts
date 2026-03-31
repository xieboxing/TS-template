import mongoose from 'mongoose'
import { mongoConfig } from '@/config'
import { logger } from '@/core/logger'

// 是否已初始化
let isInitialized = false

// 初始化 MongoDB 连接
export async function initMongo(): Promise<void> {
  if (!mongoConfig.enabled) {
    logger.info('MongoDB 未启用，跳过初始化')
    return
  }

  if (isInitialized) {
    return
  }

  if (!mongoConfig.uri) {
    throw new Error('MongoDB URI 未配置')
  }

  try {
    await mongoose.connect(mongoConfig.uri)
    logger.info('MongoDB 已连接')
    isInitialized = true
  } catch (error) {
    logger.error('MongoDB 连接失败', error)
    throw error
  }
}

// 关闭 MongoDB 连接
export async function closeMongo(): Promise<void> {
  if (isInitialized) {
    await mongoose.disconnect()
    logger.info('MongoDB 已断开')
    isInitialized = false
  }
}

// MongoDB 操作接口
export const mongo = {
  // 获取 mongoose 实例
  get connection(): mongoose.Connection {
    if (!mongoConfig.enabled) {
      throw new Error('MongoDB 未启用，请在 .env 中设置 MONGO_ENABLED=true')
    }
    return mongoose.connection
  },

  // 检查是否已初始化
  isInitialized(): boolean {
    return isInitialized
  },

  // 检查是否启用
  isEnabled(): boolean {
    return mongoConfig.enabled
  },
}

// 导出 mongoose
export { mongoose }

// 默认导出
export default mongo