export * from './client'
export * from './producer'
export * from './consumer'

// 统一导出快捷接口
import { sendToQueue, publish } from './producer'
import { consume } from './consumer'

export const mq = {
  send: sendToQueue,
  publish,
  consume,
}