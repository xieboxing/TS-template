import type { RouteOptions } from 'fastify'

// 示例路由
export default [
  {
    method: 'GET',
    url: '/api/v1/example',
    handler: async (request) => {
      return {
        code: 0,
        message: 'success',
        data: {
          message: 'This is an example endpoint',
          timestamp: Date.now(),
        },
        requestId: request.id,
      }
    },
  },
] as RouteOptions[]