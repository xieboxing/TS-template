import dotenv from 'dotenv'
import { appConfig } from '@/config'
import { createServer } from '@/server'

// 加载环境变量
dotenv.config()

// 启动应用
async function main(): Promise<void> {
  try {
    const app = await createServer()

    // 启动服务器
    await app.listen({
      port: appConfig.port,
      host: appConfig.host,
    })

    console.log(`服务器已启动: http://${appConfig.host}:${appConfig.port}`)
    console.log(`环境: ${appConfig.env}`)
  } catch (error) {
    console.error('启动服务器失败', error)
    process.exit(1)
  }
}

// 执行启动
main()