import type { FastifyInstance } from 'fastify'
import type { Plugin } from './index'
import { logger } from '@/core/logger'

// 示例插件
const examplePlugin: Plugin = {
  name: 'example',
  version: '1.0.0',
  description: '示例插件，演示插件开发方式',
  priority: 100,

  async register(app: FastifyInstance): Promise<void> {
    // 注册一个自定义装饰器
    app.decorate('examplePlugin', {
      sayHello: (name: string) => `Hello, ${name}!`,
    })

    // 注册一个中间件
    app.addHook('onRequest', async (request) => {
      logger.debug(`Example plugin: 处理请求 ${request.id}`)
    })

    logger.info('示例插件已注册')
  },

  async destroy(): Promise<void> {
    logger.info('示例插件已销毁')
  },
}

export default examplePlugin