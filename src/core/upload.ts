import type { FastifyInstance, FastifyRequest } from 'fastify'
import multipart from '@fastify/multipart'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { AppError, ErrorCode } from '@/core/error-handler'
import { logger } from '@/core/logger'

// 文件上传配置
const uploadConfig = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 默认 10MB
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
  ],
}

// 确保上传目录存在
function ensureUploadDir(): void {
  if (!fs.existsSync(uploadConfig.uploadDir)) {
    fs.mkdirSync(uploadConfig.uploadDir, { recursive: true })
  }
}

// 注册文件上传插件
export async function registerFileUpload(app: FastifyInstance): Promise<void> {
  ensureUploadDir()

  await app.register(multipart, {
    limits: {
      fileSize: uploadConfig.maxFileSize,
      files: 5, // 最多 5 个文件
    },
  })

  logger.info('文件上传插件已注册')
}

// 文件信息接口
export interface UploadedFile {
  filename: string
  originalFilename: string
  mimetype: string
  size: number
  path: string
  url: string
}

// 保存单个文件
export async function saveFile(request: FastifyRequest): Promise<UploadedFile> {
  const data = await request.file()

  if (!data) {
    throw new AppError(ErrorCode.BAD_REQUEST, '未找到上传文件')
  }

  // 检查 MIME 类型
  if (uploadConfig.allowedMimeTypes.length > 0 && !uploadConfig.allowedMimeTypes.includes(data.mimetype)) {
    throw new AppError(ErrorCode.BAD_REQUEST, `不支持的文件类型: ${data.mimetype}`)
  }

  // 生成唯一文件名
  const ext = path.extname(data.filename)
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const filepath = path.join(uploadConfig.uploadDir, filename)

  // 保存文件
  await pipeline(data.file, fs.createWriteStream(filepath))

  return {
    filename,
    originalFilename: data.filename,
    mimetype: data.mimetype,
    size: data.file.bytesRead,
    path: filepath,
    url: `/uploads/${filename}`,
  }
}

// 保存多个文件
export async function saveFiles(
  request: FastifyRequest,
  maxFiles: number = 5,
): Promise<UploadedFile[]> {
  const files: UploadedFile[] = []
  const parts = request.files()

  for await (const part of parts) {
    if (files.length >= maxFiles) {
      break
    }

    if (part.type === 'file') {
      // 检查 MIME 类型
      if (uploadConfig.allowedMimeTypes.length > 0 && !uploadConfig.allowedMimeTypes.includes(part.mimetype)) {
        continue
      }

      const ext = path.extname(part.filename)
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
      const filepath = path.join(uploadConfig.uploadDir, filename)

      await pipeline(part.file, fs.createWriteStream(filepath))

      files.push({
        filename,
        originalFilename: part.filename,
        mimetype: part.mimetype,
        size: part.file.bytesRead,
        path: filepath,
        url: `/uploads/${filename}`,
      })
    }
  }

  return files
}

// 删除文件
export async function deleteFile(filename: string): Promise<boolean> {
  const filepath = path.join(uploadConfig.uploadDir, filename)

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
    return true
  }

  return false
}

// 获取上传配置
export function getUploadConfig() {
  return { ...uploadConfig }
}