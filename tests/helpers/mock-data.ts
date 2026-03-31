// 测试数据工厂
export const mockData = {
  // 用户数据
  user: {
    create: (overrides = {}) => ({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      ...overrides,
    }),
    list: (count = 3) =>
      Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      })),
  },

  // 示例数据
  example: {
    create: (overrides = {}) => ({
      id: 1,
      name: 'Test Example',
      description: 'Test description',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      ...overrides,
    }),
    list: (count = 3) =>
      Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Example ${i + 1}`,
        description: `Description ${i + 1}`,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      })),
  },

  // 分页响应
  paginate: <T>(list: T[], total: number, page = 1, pageSize = 10) => ({
    list,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }),
}