import { logger } from '@/core/logger'

// 定时任务类型
export interface Job {
  name: string
  cron: string // cron 表达式
  handler: () => Promise<void>
  enabled?: boolean
}

// 定时任务存储
const jobs: Map<string, { job: Job; intervalId?: NodeJS.Timeout }> = new Map()

// 解析简单的 cron 表达式（仅支持基本格式）
// 格式: "*/5 * * * *" 表示每5分钟执行一次
function parseCron(cron: string): number {
  const parts = cron.split(' ')

  // 简化实现：只处理 "*/N * * * *" 格式
  if (parts.length === 5 && parts[0].startsWith('*/')) {
    const minutes = parseInt(parts[0].slice(2), 10)
    return minutes * 60 * 1000
  }

  // 默认每分钟
  return 60000
}

// 注册定时任务
export function registerJob(job: Job): void {
  if (jobs.has(job.name)) {
    logger.warn(`定时任务已存在: ${job.name}`)
    return
  }

  jobs.set(job.name, { job })

  if (job.enabled !== false) {
    startJob(job.name)
  }

  logger.info(`定时任务已注册: ${job.name}`)
}

// 启动定时任务
export function startJob(name: string): void {
  const entry = jobs.get(name)
  if (!entry) {
    logger.warn(`定时任务不存在: ${name}`)
    return
  }

  const { job } = entry

  if (entry.intervalId) {
    logger.warn(`定时任务已在运行: ${name}`)
    return
  }

  const interval = parseCron(job.cron)

  entry.intervalId = setInterval(async () => {
    try {
      logger.debug(`执行定时任务: ${name}`)
      await job.handler()
    } catch (error) {
      logger.error(`定时任务执行失败: ${name}`, error)
    }
  }, interval)

  logger.info(`定时任务已启动: ${name}, 间隔: ${interval}ms`)
}

// 停止定时任务
export function stopJob(name: string): void {
  const entry = jobs.get(name)
  if (!entry || !entry.intervalId) {
    return
  }

  clearInterval(entry.intervalId)
  entry.intervalId = undefined

  logger.info(`定时任务已停止: ${name}`)
}

// 停止所有定时任务
export function stopAllJobs(): void {
  for (const [name] of jobs) {
    stopJob(name)
  }
  logger.info('所有定时任务已停止')
}

// 获取所有定时任务
export function getAllJobs(): Job[] {
  return Array.from(jobs.values()).map((entry) => entry.job)
}

// 自动加载 jobs 目录下的任务（如果存在）
export async function autoLoadJobs(): Promise<void> {
  try {
    // 动态导入 jobs 目录
    const jobFiles = await import('glob').then((glob) =>
      glob.glob('src/jobs/*.job.ts'),
    )

    for (const file of jobFiles) {
      try {
        const module = await import(`../${file.replace('src/', '')}`)
        const job: Job = module.default || module

        if (job.name && job.cron && job.handler) {
          registerJob(job)
        }
      } catch (error) {
        logger.error(`加载定时任务失败: ${file}`, error)
      }
    }
  } catch {
    // jobs 目录不存在，忽略
  }
}