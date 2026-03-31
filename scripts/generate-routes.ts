/**
 * 路由代码生成器
 * 读取 api-spec/*.api.json 文件，生成对应的路由代码
 */

import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import dayjs from 'dayjs'
import type { ApiSpec, ApiSpecApi, ApiSpecField } from '../src/types/api-spec.types'
import { ApiSpecSchema } from '../src/types/api-spec.types'

// 配置
const API_SPEC_DIR = 'api-spec'
const OUTPUT_DIR = 'src/generated/routes'
const ROUTES_DIR = 'src/routes'

// 生成文件头部注释
function generateFileHeader(sourceFile: string): string {
  return `/**
 * ⚠️ 此文件由代码生成器自动生成
 * 📅 生成时间: ${dayjs().toISOString()}
 * 📄 来源: ${sourceFile}
 *
 * 🚫 请勿手动修改此文件，修改将在下次生成时被覆盖
 * ✅ 业务逻辑请在 ${ROUTES_DIR}/ 对应文件中实现
 */
`
}

// 将字段类型转换为 Zod Schema 代码
function fieldToZodSchema(field: ApiSpecField, fieldName: string): string {
  let schema: string

  switch (field.type) {
    case 'string':
      schema = 'z.string()'
      if (field.minLength) schema += `.min(${field.minLength})`
      if (field.maxLength) schema += `.max(${field.maxLength})`
      if (field.pattern) schema += `.regex(/${field.pattern}/)`
      if (field.enum) schema += `.enum([${field.enum.map((e) => `'${e}'`).join(', ')}])`
      if (field.format) {
        switch (field.format) {
          case 'email':
            schema += '.email()'
            break
          case 'uuid':
            schema += '.uuid()'
            break
          case 'url':
            schema += '.url()'
            break
          case 'datetime':
            schema += '.datetime()'
            break
          case 'date':
            schema += '.date()'
            break
          case 'time':
            schema += '.time()'
            break
        }
      }
      break
    case 'number':
      schema = 'z.number()'
      if (field.min !== undefined) schema += `.min(${field.min})`
      if (field.max !== undefined) schema += `.max(${field.max})`
      if (field.format === 'integer') schema += '.int()'
      break
    case 'boolean':
      schema = 'z.boolean()'
      break
    case 'array':
      if (field.items) {
        const itemSchema = fieldToZodSchema(field.items, `${fieldName}Item`)
        schema = `z.array(${itemSchema})`
      } else {
        schema = 'z.array(z.unknown())'
      }
      break
    case 'object':
      if (field.properties) {
        const props = Object.entries(field.properties)
          .map(([key, value]) => `    ${key}: ${fieldToZodSchema(value, key)}`)
          .join(',\n')
        schema = `z.object({\n${props}\n  })`
      } else {
        schema = 'z.record(z.unknown())'
      }
      break
    default:
      schema = 'z.unknown()'
  }

  // 处理可选/必填
  if (!field.required) {
    schema += '.optional()'
  }

  // 处理默认值
  if (field.default !== undefined) {
    if (typeof field.default === 'string') {
      schema += `.default('${field.default}')`
    } else {
      schema += `.default(${field.default})`
    }
  }

  return schema
}

// 生成字段 Schema 对象
function generateFieldsSchema(fields: Record<string, ApiSpecField>): string {
  const entries = Object.entries(fields)
    .map(([key, value]) => `  ${key}: ${fieldToZodSchema(value, key)}`)
    .join(',\n')

  return `{\n${entries}\n}`
}

// 生成响应类型
function generateResponseType(api: ApiSpecApi): string {
  if (!api.response) {
    return 'Record<string, unknown>'
  }

  const fields = Object.entries(api.response)
    .map(([key, value]) => {
      let typeStr = value.type
      if (value.format === 'datetime' || value.format === 'date' || value.format === 'time') {
        typeStr = 'string'
      }
      if (value.type === 'array') {
        typeStr = `${value.items?.type || 'unknown'}[]`
      }
      // 可选字段使用 TypeScript 的可选属性语法
      const optionalMark = value.required ? '' : '?'
      return `  ${key}${optionalMark}: ${typeStr}`
    })
    .join('\n')

  return `{\n${fields}\n}`
}

// 生成单个 API Schema 和类型（不包含 export default）
function generateApiSchema(api: ApiSpecApi, module: string): string {
  const routeName = `${module}_${api.name}`

  // 生成参数 Schema
  const paramsSchema = api.params ? generateFieldsSchema(api.params) : 'undefined'
  const querySchema = api.query ? generateFieldsSchema(api.query) : 'undefined'
  const bodySchema = api.body ? generateFieldsSchema(api.body) : 'undefined'

  // 生成响应类型
  const responseType = generateResponseType(api)

  return `
// ${api.description || api.name}
export const ${routeName}Schema = {
  params: ${paramsSchema},
  query: ${querySchema},
  body: ${bodySchema},
}

export type ${routeName}Params = ${routeName}Schema.params extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof ${routeName}Schema.params>>
export type ${routeName}Query = ${routeName}Schema.query extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof ${routeName}Schema.query>>
export type ${routeName}Body = ${routeName}Schema.body extends undefined ? Record<string, never> : z.infer<z.ZodObject<typeof ${routeName}Schema.body>>
export type ${routeName}Response = ${responseType}
`
}

// 生成单个路由配置
function generateRouteConfig(api: ApiSpecApi, module: string, basePath: string): string {
  const handlerPath = `@/routes/${module}.route`
  const routeName = `${module}_${api.name}`
  const fullPath = basePath + api.path

  return `  {
    method: '${api.method}',
    url: '${fullPath}',
    schema: {
      params: ${routeName}Schema.params !== undefined ? z.object(${routeName}Schema.params) : undefined,
      querystring: ${routeName}Schema.query !== undefined ? z.object(${routeName}Schema.query) : undefined,
      body: ${routeName}Schema.body !== undefined ? z.object(${routeName}Schema.body) : undefined,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { ${api.name}Handler } = await import('${handlerPath}')
      return ${api.name}Handler(request, reply)
    },
  },`
}

// 生成模块路由文件
function generateModuleRoutes(spec: ApiSpec, sourceFile: string): string {
  const header = generateFileHeader(sourceFile)
  const imports = `import type { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { z } from 'zod'
`

  // 生成所有 Schema 和类型
  const schemas = spec.apis.map((api) => generateApiSchema(api, spec.module)).join('\n')

  // 生成所有路由配置
  const routeConfigs = spec.apis.map((api) => generateRouteConfig(api, spec.module, spec.basePath)).join('\n')

  // 合并为一个 export default
  const routesExport = `
export default [
${routeConfigs}
] as RouteOptions[]
`

  return `${header}\n${imports}\n${schemas}\n${routesExport}`
}

// 生成 handler 模板（如果不存在）
function generateHandlerTemplate(spec: ApiSpec): string {
  const handlers = spec.apis
    .map((api) => {
      const routeName = `${spec.module}_${api.name}`
      return `
// ${api.description || api.name}
export async function ${api.name}Handler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ApiResponse<${routeName}Response>> {
  // TODO: 实现业务逻辑
  return success(request, {
    // 返回数据
  } as ${routeName}Response)
}
`
    })
    .join('\n')

  return `import type { FastifyRequest, FastifyReply } from 'fastify'
import { success, type ApiResponse } from '@/core/response'
import type { ${spec.apis.map((api) => `${spec.module}_${api.name}Response`).join(', ')} } from '@/generated/routes/${spec.module}.route'

${handlers}
`
}

// 主函数
async function main(): Promise<void> {
  console.log('开始生成路由代码...')

  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // 查找所有 api-spec 文件
  const specFiles = await glob(`${API_SPEC_DIR}/*.api.json`)

  if (specFiles.length === 0) {
    console.log('没有找到 api-spec 文件')
    return
  }

  // 处理每个 spec 文件
  for (const specFile of specFiles) {
    try {
      // 读取并解析 JSON
      const content = fs.readFileSync(specFile, 'utf-8')
      const spec: ApiSpec = JSON.parse(content)

      // 使用 Zod 校验
      const validatedSpec = ApiSpecSchema.parse(spec)

      // 生成路由文件
      const routeCode = generateModuleRoutes(validatedSpec, specFile)
      const routeFileName = path.join(OUTPUT_DIR, `${validatedSpec.module}.route.ts`)
      fs.writeFileSync(routeFileName, routeCode)
      console.log(`✅ 生成路由文件: ${routeFileName}`)

      // 检查 handler 文件是否存在，不存在则生成模板
      const handlerFileName = path.join(ROUTES_DIR, `${validatedSpec.module}.route.ts`)
      if (!fs.existsSync(handlerFileName)) {
        const handlerCode = generateHandlerTemplate(validatedSpec)
        fs.writeFileSync(handlerFileName, handlerCode)
        console.log(`✅ 生成 handler 模板: ${handlerFileName}`)
      }
    } catch (error) {
      console.error(`❌ 处理文件 ${specFile} 失败:`, error)
    }
  }

  // 生成路由索引文件
  const indexContent = `/**
 * ⚠️ 此文件由代码生成器自动生成
 * 📅 生成时间: ${dayjs().toISOString()}
 *
 * 🚫 请勿手动修改此文件
 */

import type { FastifyInstance } from 'fastify'

// 导入所有生成的路由
${specFiles
  .map((f) => {
    const content = fs.readFileSync(f, 'utf-8')
    const spec: ApiSpec = JSON.parse(content)
    return `import ${spec.module}Routes from './${spec.module}.route'`
  })
  .join('\n')}

// 注册所有生成的路由
export async function registerGeneratedRoutes(app: FastifyInstance): Promise<void> {
${specFiles
  .map((f) => {
    const content = fs.readFileSync(f, 'utf-8')
    const spec: ApiSpec = JSON.parse(content)
    return `  for (const route of ${spec.module}Routes) {
    app.route(route)
  }`
  })
  .join('\n')}
}
`
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent)
  console.log(`✅ 生成路由索引文件: ${path.join(OUTPUT_DIR, 'index.ts')}`)

  console.log('路由代码生成完成!')
}

main()