# 数据库连接异常处理指南

## 概述

MagSync 现在在遇到数据库连接异常时会立即终止操作，并提供详细的排查信息。

## 行为说明

### 1. 无数据库密码配置 ⚠️
- **行为**: 跳过数据库连接，仅使用新数据
- **日志**: `⚠️  数据库密码未设置，跳过数据库连接`
- **结果**: 程序正常运行，返回新数据

### 2. 数据库连接异常 🚨
- **行为**: 立即终止操作
- **退出码**: 1 (非零状态)
- **日志**: 详细的错误信息和排查指南

## 错误日志示例

当数据库连接异常时，MagSync 会输出以下信息：

```
🚨 数据库连接异常，操作终止！
============================================================
📋 错误信息: Missing connection parameters: user
🔧 数据库配置:
   主机: localhost:5432
   数据库: magsync
   用户名: postgres
   密码: 已设置
🔍 排查建议:
   1. 检查 PostgreSQL 服务是否启动
   2. 验证数据库连接参数是否正确
   3. 确认数据库用户权限
   4. 检查网络连接和防火墙设置
   5. 验证数据库和表是否存在
============================================================
```

## 排查步骤

### 1. 检查 PostgreSQL 服务
```bash
# macOS (使用 Homebrew)
brew services list | grep postgresql
brew services start postgresql

# Linux (systemd)
sudo systemctl status postgresql
sudo systemctl start postgresql

# 手动启动
pg_ctl -D /usr/local/var/postgres start
```

### 2. 验证数据库连接
```bash
# 测试连接
psql -h localhost -p 5432 -U postgres -d magsync

# 检查数据库是否存在
psql -h localhost -p 5432 -U postgres -l
```

### 3. 确认环境变量
```bash
echo $DB_HOST
echo $DB_PORT  
echo $DB_NAME
echo $DB_USER
echo $DB_PASSWORD
```

### 4. 创建数据库和表
```bash
# 创建数据库
createdb magsync

# 运行初始化脚本
psql -d magsync -f setup.sql
```

### 5. 检查用户权限
```sql
-- 连接到数据库
\c magsync

-- 检查表权限
\dp config

-- 授予权限（如果需要）
GRANT ALL ON TABLE config TO your_username;
```

## 环境变量配置

确保设置了以下环境变量：

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=magsync
export DB_USER=postgres
export DB_PASSWORD=your_password
```

或者创建 `.env` 文件：

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=magsync
DB_USER=postgres
DB_PASSWORD=your_password
```

## 测试连接

可以使用以下命令测试不同的连接情况：

```bash
# 测试无数据库连接（应该正常运行）
deno run --allow-net --allow-env main.ts

# 测试数据库连接异常（应该终止并显示错误）
DB_PASSWORD=test DB_USER=postgres deno run --allow-net --allow-env main.ts

# 测试正常的数据库连接
DB_HOST=localhost DB_PORT=5432 DB_NAME=magsync DB_USER=postgres DB_PASSWORD=your_password deno run --allow-net --allow-env main.ts
```

## 日志级别

- 🎉 **成功**: 正常操作完成
- ✅ **信息**: 操作步骤确认  
- ⚠️ **警告**: 非致命问题
- 🚨 **错误**: 致命错误，程序终止
- 💀 **退出**: 程序异常退出

## 故障排除

如果遇到问题，请按照以下顺序检查：

1. **服务状态**: PostgreSQL 是否运行？
2. **连接参数**: 主机、端口、数据库名是否正确？
3. **认证信息**: 用户名和密码是否正确？
4. **权限检查**: 用户是否有访问数据库的权限？
5. **网络连接**: 防火墙是否阻止连接？
6. **数据库结构**: 表和索引是否存在？

## 支持

如果问题仍然存在，请：
1. 收集完整的错误日志
2. 记录环境变量配置
3. 确认 PostgreSQL 版本
4. 提供网络配置信息

<!-- Contains AI-generated edits. -->
