import type { User } from '../schemas/user.schema.js'

// 内存数据存储
const users: Map<string, User> = new Map()

// 生成唯一 ID
function generateId(): string {
  return crypto.randomUUID()
}

// 获取当前时间戳
function getTimestamp(): string {
  return new Date().toISOString()
}

// 获取所有用户
export function findAllUsers(): User[] {
  return Array.from(users.values())
}

// 根据 ID 获取用户
export function findUserById(id: string): User | undefined {
  return users.get(id)
}

// 创建用户
export function createUser(data: { name: string; email: string }): User {
  const now = getTimestamp()
  const user: User = {
    id: generateId(),
    name: data.name,
    email: data.email,
    createdAt: now,
    updatedAt: now,
  }
  users.set(user.id, user)
  return user
}

// 更新用户
export function updateUser(id: string, data: { name?: string; email?: string }): User | null {
  const user = users.get(id)
  if (!user) {
    return null
  }
  const updatedUser: User = {
    ...user,
    ...data,
    updatedAt: getTimestamp(),
  }
  users.set(id, updatedUser)
  return updatedUser
}

// 删除用户
export function deleteUser(id: string): boolean {
  return users.delete(id)
}

// 重置数据存储（用于测试）
export function resetUsers(): void {
  users.clear()
}
