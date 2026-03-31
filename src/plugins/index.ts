import type { FastifyInstance } from 'fastify'
import { glob } from 'glob'
import { logger } from '@/core/logger'

// 插件接口定义
export interface Plugin {
  name: string
  version: string
  description?: string
  priority?: number
  register: (app: FastifyInstance) => Promise<void>
  destroy?: () => Promise<void>
}

// 已加载的插件列表
const loadedPlugins: Map<string, Plugin> = new Map()

// 自动扫描并加载插件
export async function loadPlugins(app: FastifyInstance): Promise<void> {
  // 扫描 src/plugins 目录下的所有 .plugin.ts 文件
  const pluginFiles = await glob('src/plugins/*.plugin.ts')

  // 按优先级排序的插件列表
  const plugins: Array<{ plugin: Plugin }> = []

  for (const file of pluginFiles) {
    try {
      const module = await import(`../${file.replace('src/', '')}`)
      const plugin: Plugin = module.default || module

      if (!plugin.name || !plugin.version || !plugin.register) {
        logger.warn(`插件文件格式不正确: ${file}`)
        continue
      }

      plugins.push({ plugin })
    } catch (error) {
      logger.error(`加载插件文件失败: ${file}`, error)
    }
  }

  // 按优先级排序（数字越小优先级越高）
  plugins.sort((a, b) => (a.plugin.priority || 100) - (b.plugin.priority || 100))

  // 注册插件
  for (const { plugin } of plugins) {
    try {
      await plugin.register(app)
      loadedPlugins.set(plugin.name, plugin)
      logger.info(`插件已加载: ${plugin.name}@${plugin.version}`)
    } catch (error) {
      logger.error(`注册插件失败: ${plugin.name}`, error)
    }
  }
}

// 销毁所有插件
export async function destroyPlugins(): Promise<void> {
  for (const [name, plugin] of loadedPlugins) {
    try {
      if (plugin.destroy) {
        await plugin.destroy()
        logger.info(`插件已销毁: ${name}`)
      }
    } catch (error) {
      logger.error(`销毁插件失败: ${name}`, error)
    }
  }
  loadedPlugins.clear()
}

// 获取已加载的插件
export function getPlugin(name: string): Plugin | undefined {
  return loadedPlugins.get(name)
}

// 检查插件是否已加载
export function hasPlugin(name: string): boolean {
  return loadedPlugins.has(name)
}