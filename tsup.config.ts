import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts', 'src/index.ts'],
  format: ['esm'],
  dts: false, // 禁用声明文件生成，因为 TS 6.0 不支持 baseUrl
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: ['@prisma/client'],
  alias: {
    '@': './src',
  },
})