import { mq } from './client'
import { logger } from '@/core/logger'

// 消息处理函数类型
type MessageHandler<T = unknown> = (message: T) => Promise<void>

// 消费队列消息
export async function consume<T = unknown>(
  queue: string,
  handler: MessageHandler<T>,
  prefetch = 10,
): Promise<void> {
  const channel = mq.channel

  // 设置预取数量
  channel.prefetch(prefetch)

  // 声明队列
  await channel.assertQueue(queue, { durable: true })

  // 消费消息
  await channel.consume(queue, async (msg) => {
    if (!msg) return

    try {
      // 解析消息
      const content = JSON.parse(msg.content.toString()) as T

      // 调用处理函数
      await handler(content)

      // 确认消息
      channel.ack(msg)
      logger.debug(`消息已处理: ${queue}`)
    } catch (error) {
      logger.error(`消息处理失败: ${queue}`, error)

      // 拒绝消息，重新入队
      channel.nack(msg, false, true)
    }
  })

  logger.info(`开始消费队列: ${queue}`)
}

// 默认导出
export default { consume }