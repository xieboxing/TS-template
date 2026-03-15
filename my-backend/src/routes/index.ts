import type { FastifyInstance } from 'fastify'
import { healthRoutes } from './health.route.js'
import { usersRoutes } from './users.route.js'

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(healthRoutes)
  await app.register(usersRoutes)
}
