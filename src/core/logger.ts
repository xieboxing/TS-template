import pino from 'pino'
import { appConfig, isDevelopment } from '@/config'

// 创建 Pino Logger
const baseLogger = pino({
  level: appConfig.logLevel,
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
})

// 创建子 logger 的辅助函数
export function createLogger(module: string): pino.Logger {
  return baseLogger.child({ module })
}

// 导出基础 logger
export const logger = createLogger('app')

// 导出类型
export type Logger = pino.Logger