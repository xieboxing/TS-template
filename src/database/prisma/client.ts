import { PrismaClient } from '@prisma/client'
import { dbConfig } from '@/config'
import { logger } from '@/core/logger'

// 主库客户端
let masterClient: PrismaClient | null = null

// 从库客户端列表
let slaveClients: PrismaClient[] = []

// 当前从库索引（用于轮询）
let currentSlaveIndex = 0

// 是否已初始化
let isInitialized = false

// 初始化 Prisma 客户端
export function initPrisma(): void {
  if (!dbConfig.enabled) {
    logger.info('数据库未启用，跳过 Prisma 初始化')
    return
  }

  if (isInitialized) {
    return
  }

  // 创建主库客户端 (Prisma 7.x 使用 adapter 配置)
  if (dbConfig.masterUrl) {
    masterClient = new PrismaClient({
      datasourceUrl: dbConfig.masterUrl,
    })
    logger.info(`Prisma 主库客户端已创建: ${dbConfig.type}`)
  }

  // 创建从库客户端
  if (dbConfig.slaveUrls.length > 0) {
    slaveClients = dbConfig.slaveUrls.map((url) => {
      return new PrismaClient({
        datasourceUrl: url,
      })
    })
    logger.info(`Prisma 从库客户端已创建: ${slaveClients.length} 个`)
  }

  isInitialized = true
}

// 关闭 Prisma 客户端
export async function closePrisma(): Promise<void> {
  if (masterClient) {
    await masterClient.$disconnect()
    logger.info('Prisma 主库客户端已断开')
  }

  for (const client of slaveClients) {
    await client.$disconnect()
  }
  logger.info('Prisma 从库客户端已断开')

  masterClient = null
  slaveClients = []
  isInitialized = false
}

// 获取下一个从库客户端（轮询）
function getNextSlaveClient(): PrismaClient {
  if (slaveClients.length === 0) {
    throw new Error('没有可用的从库客户端')
  }

  const client = slaveClients[currentSlaveIndex]
  currentSlaveIndex = (currentSlaveIndex + 1) % slaveClients.length
  return client
}

// 数据库操作接口
export const db = {
  // 主库（写操作）
  get master(): PrismaClient {
    if (!dbConfig.enabled) {
      throw new Error('数据库未启用，请在 .env 中设置 DB_ENABLED=true')
    }
    if (!masterClient) {
      throw new Error('数据库客户端未初始化')
    }
    return masterClient
  },

  // 从库（读操作）
  get slave(): PrismaClient {
    if (!dbConfig.enabled) {
      throw new Error('数据库未启用，请在 .env 中设置 DB_ENABLED=true')
    }
    if (slaveClients.length > 0) {
      return getNextSlaveClient()
    }
    // 如果没有从库，使用主库
    return this.master
  },

  // 只读库（别名）
  get readonly(): PrismaClient {
    return this.slave
  },

  // 检查是否已初始化
  isInitialized(): boolean {
    return isInitialized
  },

  // 检查是否启用
  isEnabled(): boolean {
    return dbConfig.enabled
  },
}

// 默认导出
export default db