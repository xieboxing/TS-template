// 配置相关类型定义

export interface AppConfig {
  port: number
  host: string
  env: 'development' | 'production' | 'test'
  logLevel: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
}

export interface DbConfig {
  enabled: boolean
  type: 'mysql' | 'sqlite'
  masterUrl?: string
  slaveUrls: string[]
}

export interface RedisConfig {
  enabled: boolean
  masterHost: string
  masterPort: number
  masterPassword?: string
  slaveHosts: string[]
}

export interface MongoConfig {
  enabled: boolean
  uri?: string
}

export interface MqConfig {
  enabled: boolean
  url?: string
}