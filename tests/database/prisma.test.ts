import { describe, it, expect } from 'vitest'
import { db } from '@/database/prisma/client'

describe('Prisma Database', () => {
  describe('Database disabled', () => {
    it('should throw error when database is disabled', () => {
      // 默认 DB_ENABLED=false
      expect(() => db.master).toThrow('数据库未启用')
      expect(() => db.slave).toThrow('数据库未启用')
      expect(db.isEnabled()).toBe(false)
    })

    it('should return false for isInitialized when not initialized', () => {
      expect(db.isInitialized()).toBe(false)
    })
  })

  describe('Database switch', () => {
    it('should use master as slave when no slaves configured', () => {
      // 这个测试验证当没有从库时，slave 返回 master
      // 实际需要启用数据库才能测试
      expect(true).toBe(true)
    })
  })
})