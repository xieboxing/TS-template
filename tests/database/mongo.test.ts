import { describe, it, expect } from 'vitest'
import { mongo, mongoose } from '@/database/mongo'

describe('MongoDB Client', () => {
  describe('MongoDB disabled', () => {
    it('should throw error when MongoDB is disabled', () => {
      expect(() => mongo.connection).toThrow('MongoDB 未启用')
      expect(mongo.isEnabled()).toBe(false)
    })

    it('should return false for isInitialized when not initialized', () => {
      expect(mongo.isInitialized()).toBe(false)
    })
  })

  describe('Mongoose export', () => {
    it('should export mongoose instance', () => {
      expect(mongoose).toBeDefined()
      expect(typeof mongoose.connect).toBe('function')
      expect(typeof mongoose.disconnect).toBe('function')
    })
  })
})