/**
 * ⚠️ 此文件由代码生成器自动生成
 * 📅 生成时间: 2026-03-31T09:42:11.944Z
 *
 * 🚫 请勿手动修改此文件
 */

import type { FastifyInstance } from 'fastify'

// 导入所有生成的路由
import exampleRoutes from './example.route'

// 注册所有生成的路由
export async function registerGeneratedRoutes(app: FastifyInstance): Promise<void> {
  for (const route of exampleRoutes) {
    app.route(route)
  }
}
