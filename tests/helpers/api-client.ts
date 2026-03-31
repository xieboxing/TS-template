import type { FastifyInstance } from 'fastify'

// API 测试客户端
export class ApiClient {
  private app: FastifyInstance
  private authToken?: string

  constructor(app: FastifyInstance) {
    this.app = app
  }

  // 设置认证 token
  setAuthToken(token: string): this {
    this.authToken = token
    return this
  }

  // 清除认证 token
  clearAuthToken(): this {
    this.authToken = undefined
    return this
  }

  // 获取请求头
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }
    return headers
  }

  // GET 请求
  async get<T = unknown>(url: string, query?: Record<string, string>): Promise<T> {
    const response = await this.app.inject({
      method: 'GET',
      url,
      query,
      headers: this.getHeaders(),
    })
    return response.json()
  }

  // POST 请求
  async post<T = unknown>(url: string, body?: unknown): Promise<T> {
    const response = await this.app.inject({
      method: 'POST',
      url,
      payload: body,
      headers: this.getHeaders(),
    })
    return response.json()
  }

  // PUT 请求
  async put<T = unknown>(url: string, body?: unknown): Promise<T> {
    const response = await this.app.inject({
      method: 'PUT',
      url,
      payload: body,
      headers: this.getHeaders(),
    })
    return response.json()
  }

  // DELETE 请求
  async delete<T = unknown>(url: string): Promise<T> {
    const response = await this.app.inject({
      method: 'DELETE',
      url,
      headers: this.getHeaders(),
    })
    return response.json()
  }

  // 断言成功响应
  assertSuccess<T>(response: T & { code: number; message: string }): void {
    if (response.code !== 0) {
      throw new Error(`Expected success, got code ${response.code}: ${response.message}`)
    }
  }

  // 断言失败响应
  assertError(response: { code: number; message: string }, expectedCode: number): void {
    if (response.code !== expectedCode) {
      throw new Error(`Expected code ${expectedCode}, got ${response.code}`)
    }
  }
}

// 创建 API 客户端
export function createApiClient(app: FastifyInstance): ApiClient {
  return new ApiClient(app)
}