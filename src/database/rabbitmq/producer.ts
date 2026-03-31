import { mq } from './client'
import { logger } from '@/core/logger'

// 发送消息到队列
export async function sendToQueue(queue: string, message: unknown, persistent = true): Promise<void> {
  const channel = mq.channel

  // 声明队列
  await channel.assertQueue(queue, { durable: persistent })

  // 发送消息
  const content = Buffer.from(JSON.stringify(message))
  channel.sendToQueue(queue, content, { persistent })

  logger.debug(`消息已发送到队列: ${queue}`)
}

// 发布消息到交换机
export async function publish(
  exchange: string,
  routingKey: string,
  message: unknown,
  persistent = true,
): Promise<void> {
  const channel = mq.channel

  // 声明交换机
  await channel.assertExchange(exchange, 'topic', { durable: persistent })

  // 发布消息
  const content = Buffer.from(JSON.stringify(message))
  channel.publish(exchange, routingKey, content, { persistent })

  logger.debug(`消息已发布到交换机: ${exchange}, 路由键: ${routingKey}`)
}

// 默认导出
export default { sendToQueue, publish }