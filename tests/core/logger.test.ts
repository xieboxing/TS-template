import { describe, it, expect } from 'vitest'
import { createLogger } from '@/core/logger'

describe('Logger Module', () => {
  it('should create logger instance', () => {
    const logger = createLogger('test')
    expect(logger).toBeDefined()
  })

  it('should create child logger with module name', () => {
    const logger = createLogger('test-module')
    expect(logger).toBeDefined()
    // Logger 应该有标准的日志方法
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.debug).toBe('function')
  })
})