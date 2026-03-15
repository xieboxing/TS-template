import Fastify from 'fastify'
import { registerRoutes } from './routes/index.js'

export async function buildApp() {
  const app = Fastify({
    logger: true,
  })

  // 注册路由
  await registerRoutes(app)

  return app
}
