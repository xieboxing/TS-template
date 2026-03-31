import type { FastifyInstance, RouteOptions } from 'fastify'
import { logger } from './logger'

// 路由模块类型定义
export interface RouteModule {
  default: RouteOptions[]
}

// 已知路由文件列表（手动维护或由构建工具生成）
const routeModules: Record<string, () => Promise<RouteModule>> = {
  'example.route': () => import('@/routes/example.route'),
}

// 自动扫描并注册路由
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // 注册手动编写的路由
  for (const [name, loadModule] of Object.entries(routeModules)) {
    try {
      const module = await loadModule()
      const routes: RouteOptions[] = module.default || []

      for (const route of routes) {
        app.route(route)
        logger.debug(`注册路由: ${route.method} ${route.url}`)
      }
    } catch (error) {
      logger.error(`加载路由文件失败: ${name}`, error)
    }
  }

  // 注册自动生成的路由（如果存在）
  // 后续由代码生成器生成路由注册文件
}