---
applyTo: '**/*.ts'
---

# Project general coding standards

## General Coding Guidelines

- 使用 2 个空格进行缩进。
- 每行代码长度不超过 120 个字符。
- 使用单引号而不是双引号。
- 在对象字面量的属性之间使用空格。
- 每条语句尾部不加分号。

## Naming Conventions

- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (\_)
- Use ALL_CAPS for constants
- 函数名应清晰描述其功能，通常使用动词开头。

## Error Handling

- 使用 try-catch 语句捕获错误。
- Use try/catch blocks for async operations
- Implement proper error boundaries in React components
- Always log errors with contextual information
- 在 catch 块中记录错误信息，并提供友好的用户反馈。

## Documentation

- 重要的逻辑块应有适当的注释。
- 使用 JSDoc 风格的注释为函数和类提供文档。

## Testing

- 为关键功能编写单元测试。
- 使用 Deno 的内置测试功能。
