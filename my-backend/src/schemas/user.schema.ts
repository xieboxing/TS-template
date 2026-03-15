export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  name: string
  email: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
}

export const userSchema = {
  $id: 'user',
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
} as const

export const createUserSchema = {
  $id: 'createUser',
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
  },
  required: ['name', 'email'],
} as const

export const updateUserSchema = {
  $id: 'updateUser',
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
  },
  minProperties: 1,
} as const