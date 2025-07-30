# MagSync 项目编码指南

## 项目概述

MagSync 是一个基于 Deno 的 TypeScript 项目，主要功能是合并两个 JSON 对象：从 URL 获取新的 JSON 数据，并从 PostgreSQL 数据库中获取旧数据，将两者合并为一个新的对象，如果存在相同 key，但 value 不同，那么则采用新数据中的 value。项目采用简单的模块化架构，专注于异步数据获取和处理。

## 技术栈

- **运行时**: Deno (TypeScript native)
- **测试框架**: Deno 内置测试 + JSR 标准库断言
- **包管理**: 通过 `deno.json` 的 imports 映射

## 核心架构

- `main.ts`: 主入口文件，包含 `fetchMagnificationFile` 核心函数
- `main_test.ts`: 测试文件，使用 `@std/assert` 进行断言
- `deno.json`: 项目配置，定义任务和导入映射

## 开发工作流

### 运行项目

```bash
deno task dev  # 开发模式，带文件监听
deno run main.ts [URL]  # 直接运行，可选 URL 参数
```

### 测试

```bash
deno test  # 运行所有测试
```

## 代码约定

1. **错误处理**: 使用 try-catch 包装异步操作，提供清晰的错误信息
2. **函数命名**: 使用描述性名称，如 `fetchMagnificationFile` 表明功能
3. **导入**: 优先使用 JSR 标准库 (`jsr:@std/*`)
4. **入口检查**: 使用 `import.meta.main` 确保脚本安全执行

## 关键模式

- **异步处理**: 核心功能围绕 `fetch` API 进行 HTTP 请求
- **参数**: 通过 `Deno.args[0]` 接收 URL，提供默认值
- **模块导出**: 确保函数正确导出以支持测试（注意：当前 `add` 函数缺失）

## 注意事项

- 确保导出的函数与测试文件中的导入保持一致
- 所有响应尽可能地使用简体中文，以便于理解和维护，同时适当使用一些 emoji 表情或者颜文字来表达你的心情感受
