// 测试全局初始化
// 此文件在运行测试前自动执行

// 设置测试环境变量
process.env.APP_ENV = 'test'
process.env.APP_PORT = '3000'
process.env.APP_HOST = '0.0.0.0'
process.env.APP_LOG_LEVEL = 'error'
process.env.DB_ENABLED = 'false'
process.env.REDIS_ENABLED = 'false'
process.env.MONGO_ENABLED = 'false'
process.env.RABBITMQ_ENABLED = 'false'
process.env.JWT_SECRET = 'test-jwt-secret'

// 如果需要，可以在这里初始化测试数据库连接
// 例如使用 SQLite 内存模式进行 Prisma 测试