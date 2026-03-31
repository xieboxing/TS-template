import type { FastifyInstance } from 'fastify'
import { dbConfig, redisConfig, mongoConfig, mqConfig } from '@/config'
import { logger } from './logger'
import { initPrisma, closePrisma } from '@/database/prisma'

// 启动钩子类型
type StartupHook = () => Promise<void>

// 关闭钩子类型
type ShutdownHook = () => Promise<void>

// 钩子管理
const startupHooks: StartupHook[] = []
const shutdownHooks: ShutdownHook[] = []

// 注册启动钩子
export function registerStartupHook(hook: StartupHook): void {
  startupHooks.push(hook)
}

// 注册关闭钩子
export function registerShutdownHook(hook: ShutdownHook): void {
  shutdownHooks.push(hook)
}

// 执行启动钩子
async function runStartupHooks(): Promise<void> {
  logger.info('执行启动钩子...')
  for (const hook of startupHooks) {
    await hook()
  }
  logger.info('启动钩子执行完成')
}

// 执行关闭钩子
async function runShutdownHooks(): Promise<void> {
  logger.info('执行关闭钩子...')
  for (const hook of shutdownHooks) {
    try {
      await hook()
    } catch (error) {
      logger.error('关闭钩子执行失败', error)
    }
  }
  logger.info('关闭钩子执行完成')
}

// 注册生命周期管理
export function registerLifecycle(app: FastifyInstance): void {
  // 启动时初始化各服务
  app.addHook('onReady', async () => {
    await runStartupHooks()
    logger.info('服务已就绪')
  })

  // 关闭时清理资源
  app.addHook('onClose', async () => {
    await runShutdownHooks()
    logger.info('服务已关闭')
  })

  // 监听进程信号
  process.on('SIGTERM', async () => {
    logger.info('收到 SIGTERM 信号，准备关闭...')
    await app.close()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    logger.info('收到 SIGINT 信号，准备关闭...')
    await app.close()
    process.exit(0)
  })
}

// 初始化数据库服务（根据配置）
export async function initDatabaseServices(): Promise<void> {
  // 初始化 Prisma
  if (dbConfig.enabled) {
    initPrisma()
    registerShutdownHook(closePrisma)
    logger.info(`数据库已启用: ${dbConfig.type}`)
  }
  if (redisConfig.enabled) {
    logger.info('Redis 已启用')
  }
  if (mongoConfig.enabled) {
    logger.info('MongoDB 已启用')
  }
  if (mqConfig.enabled) {
    logger.info('RabbitMQ 已启用')
  }
}