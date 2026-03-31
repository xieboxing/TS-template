import { describe, it, expect } from 'vitest'
import { mq } from '@/database/rabbitmq/client'
import { sendToQueue, publish } from '@/database/rabbitmq/producer'
import { consume } from '@/database/rabbitmq/consumer'

describe('RabbitMQ Client', () => {
  describe('RabbitMQ disabled', () => {
    it('should throw error when RabbitMQ is disabled', () => {
      expect(() => mq.channel).toThrow('RabbitMQ 未启用')
      expect(mq.isEnabled()).toBe(false)
    })

    it('should return false for isInitialized when not initialized', () => {
      expect(mq.isInitialized()).toBe(false)
    })
  })

  describe('Producer functions', () => {
    it('should have sendToQueue function', () => {
      expect(typeof sendToQueue).toBe('function')
    })

    it('should have publish function', () => {
      expect(typeof publish).toBe('function')
    })
  })

  describe('Consumer functions', () => {
    it('should have consume function', () => {
      expect(typeof consume).toBe('function')
    })
  })
})