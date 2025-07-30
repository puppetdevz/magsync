# MagSync 🔄

一个基于 Deno 的 TypeScript 项目，用于从 URL 获取新数据并与 PostgreSQL 数据库中的旧数据进行智能合并。

## ✨ 功能特性

- 🌐 从指定 URL 获取 JSON 数据
- 📊 从 PostgreSQL 数据库获取历史数据  
- 🔄 智能合并数据（新数据优先覆盖相同 key）
- ⚡ 并行处理提高性能
- 🛡️ 完善的错误处理机制（数据库异常时终止操作）
- 🚨 详细的故障排查日志
- 🧪 完整的单元测试覆盖

## 🚀 快速开始

### 环境准备

1. 安装 [Deno](https://deno.land/)
2. 设置 PostgreSQL 数据库

### 数据库初始化

```bash
# 1. 创建数据库
createdb magsync

# 2. 运行初始化脚本
psql -d magsync -f setup.sql
```

### 环境配置

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，配置你的数据库连接信息
# 或者使用环境变量直接设置：
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=magsync
export DB_USER=postgres
export DB_PASSWORD=your_password
```

### 运行项目

```bash
# 开发模式（带文件监听）
deno task dev

# 直接运行
deno run --allow-net --allow-env main.ts

# 使用自定义 URL
deno run --allow-net --allow-env main.ts "https://your-api-endpoint.com/data.json"

# 指定自定义表名
deno run --allow-net --allow-env main.ts "https://your-api-endpoint.com/data.json" "custom_table"
```

### 运行测试

```bash
# 运行所有测试
deno test --allow-net

# 运行特定测试
deno test --allow-net main_test.ts
```

## 🏗️ 项目架构

```
magsync/
├── main.ts                      # 主程序入口
├── main_test.ts                 # 单元测试
├── deno.json                   # Deno 配置文件
├── setup.sql                   # 数据库初始化脚本
├── .env.example                # 环境变量示例
├── README.md                   # 项目文档
└── DATABASE_TROUBLESHOOTING.md # 数据库故障排查指南
```

## 🚨 错误处理

MagSync 采用严格的错误处理策略：

### 数据库连接异常
- **行为**: 立即终止操作，输出详细排查信息
- **退出码**: 1 (非零状态)
- **日志**: 包含连接配置、错误信息和排查建议

### 无数据库配置
- **行为**: 跳过数据库连接，仅使用新数据
- **退出码**: 0 (正常)
- **日志**: 警告信息，程序继续执行

### 故障排查
详细的排查指南请参考 [DATABASE_TROUBLESHOOTING.md](./DATABASE_TROUBLESHOOTING.md)

## 📋 API 说明

### 主要函数

#### `fetchMagnificationFile(url: string, tableName?: string): Promise<DataObject>`
主要的数据同步函数，从 URL 获取新数据并与数据库中的旧数据合并。

**参数：**
- `url`: 要获取数据的 URL
- `tableName`: 可选，数据库表名（默认：`magnification_data`）

**返回：** 合并后的数据对象

#### `fetchOldDataFromDB(tableName?: string): Promise<DataObject>`
从 PostgreSQL 数据库获取最新的历史数据。

#### `fetchNewDataFromURL(url: string): Promise<DataObject>`
从指定 URL 获取新的 JSON 数据。

#### `mergeData(oldData: DataObject, newData: DataObject): DataObject`
合并新旧数据，新数据中的值会覆盖旧数据中的相同键。

## 🗃️ 数据库结构

```sql
CREATE TABLE magnification_data (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `DB_HOST` | 数据库主机地址 | `localhost` |
| `DB_PORT` | 数据库端口 | `5432` |
| `DB_NAME` | 数据库名称 | `magsync` |
| `DB_USER` | 数据库用户名 | `postgres` |
| `DB_PASSWORD` | 数据库密码 | _(必须设置)_ |

## 🧪 测试示例

```typescript
// 数据合并示例
const oldData = { a: 1, b: 2, c: 3 };
const newData = { b: 20, d: 4 };
const result = mergeData(oldData, newData);
// 结果: { a: 1, b: 20, c: 3, d: 4 }
```

## 🛠️ 开发指南

1. **代码风格**: 遵循 TypeScript 最佳实践
2. **错误处理**: 所有异步操作都有完整的错误处理
3. **类型安全**: 使用严格的 TypeScript 类型定义
4. **测试覆盖**: 为所有核心功能编写单元测试

## 📝 更新日志

### v2.0.0 (2025-01-30)
- ✨ 新增 PostgreSQL 数据库支持
- 🔄 实现智能数据合并功能
- ⚡ 添加并行数据获取
- 🧪 完善单元测试覆盖
- 📚 完整的项目文档

### v1.0.0
- 🌐 基础 URL 数据获取功能

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙋‍♂️ 支持

如有问题或建议，请创建 [Issue](../../issues) 或联系维护者。

---

*Made with ❤️ and TypeScript* 🦕

<!-- Contains AI-generated edits. -->
