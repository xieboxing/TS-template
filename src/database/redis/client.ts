import Redis from 'ioredis'
import { redisConfig } from '@/config'
import { logger } from '@/core/logger'

// 主节点客户端
let masterClient: Redis | null = null

// 从节点客户端列表
let slaveClients: Redis[] = []

// 当前从节点索引（用于轮询）
let currentSlaveIndex = 0

// 是否已初始化
let isInitialized = false

// 初始化 Redis 客户端
export function initRedis(): void {
  if (!redisConfig.enabled) {
    logger.info('Redis 未启用，跳过初始化')
    return
  }

  if (isInitialized) {
    return
  }

  // 创建主节点客户端
  masterClient = new Redis({
    host: redisConfig.masterHost,
    port: redisConfig.masterPort,
    password: redisConfig.masterPassword,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
    maxRetriesPerRequest: 3,
  })

  masterClient.on('connect', () => {
    logger.info('Redis 主节点已连接')
  })

  masterClient.on('error', (error) => {
    logger.error('Redis 主节点错误', error)
  })

  // 创建从节点客户端
  if (redisConfig.slaveHosts.length > 0) {
    slaveClients = redisConfig.slaveHosts.map((hostStr, index) => {
      const [host, portStr] = hostStr.split(':')
      const port = parseInt(portStr || '6379', 10)

      const client = new Redis({
        host,
        port,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        maxRetriesPerRequest: 3,
      })

      client.on('connect', () => {
        logger.info(`Redis 从节点 ${index + 1} 已连接`)
      })

      return client
    })
  }

  isInitialized = true
}

// 关闭 Redis 客户端
export async function closeRedis(): Promise<void> {
  if (masterClient) {
    await masterClient.quit()
    logger.info('Redis 主节点已断开')
  }

  for (const client of slaveClients) {
    await client.quit()
  }
  logger.info('Redis 从节点已断开')

  masterClient = null
  slaveClients = []
  isInitialized = false
}

// 获取下一个从节点客户端（轮询）
function getNextSlaveClient(): Redis {
  if (slaveClients.length === 0) {
    throw new Error('没有可用的从节点客户端')
  }

  const client = slaveClients[currentSlaveIndex]
  currentSlaveIndex = (currentSlaveIndex + 1) % slaveClients.length
  return client
}

// Redis 操作接口
export const redis = {
  // 主节点（读写）
  get master(): Redis {
    if (!redisConfig.enabled) {
      throw new Error('Redis 未启用，请在 .env 中设置 REDIS_ENABLED=true')
    }
    if (!masterClient) {
      throw new Error('Redis 客户端未初始化')
    }
    return masterClient
  },

  // 从节点（只读）
  get slave(): Redis {
    if (!redisConfig.enabled) {
      throw new Error('Redis 未启用，请在 .env 中设置 REDIS_ENABLED=true')
    }
    if (slaveClients.length > 0) {
      return getNextSlaveClient()
    }
    return this.master
  },

  // 只读节点（别名）
  get readonly(): Redis {
    return this.slave
  },

  // 检查是否已初始化
  isInitialized(): boolean {
    return isInitialized
  },

  // 检查是否启用
  isEnabled(): boolean {
    return redisConfig.enabled
  },
}

// 默认导出
export default redis