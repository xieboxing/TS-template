# TS-template
## 为什么这样设计提示词

| 设计点 | 原因 |
|--------|------|
| **app.ts 与 server.ts 分离** | 测试时可以直接导入 app 用 `.inject()`，不需要启动端口 |
| **Fastify 而非 Express** | 原生 TS 支持更好，性能更高，自带 JSON Schema 校验 |
| **Node.js 内置 test runner** | Node 24 自带，零依赖，够用且轻量 |
| **ESLint 扁平配置** | ESLint v9+ 推荐格式，`.eslintrc` 已废弃 |
| **明确指定每条路由** | 避免 AI 自由发挥偏离预期 |
| **最后要求执行验证** | Claude Code 可以自动跑命令，确保项目真正能跑 |

完成后请执行
1.安装所有依赖（npm install）
2.运行 npm run format 格式化代码
3.运行 npm run lint 确认无报错
4.运行 npm test 确认所有测试通过
5.运行 npm run build 确认编译成功
6.如果任何步骤失败，自动修复后重试直到全部通过