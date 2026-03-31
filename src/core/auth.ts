import type { FastifyRequest } from 'fastify'
import { AppError, ErrorCode } from '@/core/error-handler'

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

// 简单的 JWT 实现（生产环境建议使用 @fastify/jwt）
// 这里使用基础的 Base64 编码演示，实际项目请替换为真正的 JWT 库

interface JwtPayload {
  userId: number
  email: string
  roles?: string[]
  iat: number
  exp: number
}

// Base64 URL 编码
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Base64 URL 解码
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return Buffer.from(str, 'base64').toString()
}

// 简单的 JWT 签名（仅用于演示，生产环境请使用真正的 JWT 库）
function sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const now = Math.floor(Date.now() / 1000)
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 天
  }

  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payloadStr = base64UrlEncode(JSON.stringify(fullPayload))
  const signature = base64UrlEncode(`${header}.${payloadStr}.${JWT_SECRET}`)

  return `${header}.${payloadStr}.${signature}`
}

// 验证 JWT
function verify(token: string): JwtPayload {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new AppError(ErrorCode.TOKEN_INVALID, 'Token 格式无效')
  }

  const [header, payloadStr, signature] = parts
  const expectedSignature = base64UrlEncode(`${header}.${payloadStr}.${JWT_SECRET}`)

  if (signature !== expectedSignature) {
    throw new AppError(ErrorCode.TOKEN_INVALID, 'Token 签名无效')
  }

  const payload: JwtPayload = JSON.parse(base64UrlDecode(payloadStr))
  const now = Math.floor(Date.now() / 1000)

  if (payload.exp < now) {
    throw new AppError(ErrorCode.TOKEN_EXPIRED, 'Token 已过期')
  }

  return payload
}

// 从请求头提取 Token
function extractToken(request: FastifyRequest): string | null {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.slice(7)
}

// 扩展 FastifyRequest 类型
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload
  }
}

// 认证中间件
export async function authMiddleware(request: FastifyRequest): Promise<void> {
  const token = extractToken(request)

  if (!token) {
    throw new AppError(ErrorCode.UNAUTHORIZED, '未提供认证 Token')
  }

  try {
    const payload = verify(token)
    request.user = payload
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(ErrorCode.TOKEN_INVALID, 'Token 验证失败')
  }
}

// 可选认证中间件（不强制要求认证）
export async function optionalAuthMiddleware(request: FastifyRequest): Promise<void> {
  const token = extractToken(request)

  if (token) {
    try {
      const payload = verify(token)
      request.user = payload
    } catch {
      // 忽略错误，继续处理请求
    }
  }
}

// 角色检查中间件
export function requireRoles(...roles: string[]) {
  return async (request: FastifyRequest): Promise<void> => {
    if (!request.user) {
      throw new AppError(ErrorCode.UNAUTHORIZED, '未认证')
    }

    const userRoles = request.user.roles || []
    const hasRole = roles.some((role) => userRoles.includes(role))

    if (!hasRole) {
      throw new AppError(ErrorCode.PERMISSION_DENIED, '权限不足')
    }
  }
}

// 导出 JWT 工具函数
export const jwt = {
  sign,
  verify,
}