-- MagSync PostgreSQL 数据库初始化脚本
-- 创建 config 表用于存储测试的用的模型倍率数据

-- 创建数据库（如果需要）
-- CREATE DATABASE magsync;

-- 连接到数据库后运行以下命令
-- \c magsync;

-- 创建存储同步数据的表
CREATE TABLE IF NOT EXISTS config (
    id SERIAL PRIMARY KEY,
    key varchar(255) NOT NULL,
    value text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_config_updated_at 
ON config(updated_at DESC);


-- 创建触发器函数，自动更新 updated_at 时间戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
DROP TRIGGER IF EXISTS update_config_updated_at ON config;
CREATE TRIGGER update_config_updated_at
    BEFORE UPDATE ON config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据（可选）
INSERT INTO config ( key, value) VALUES 
('price', '{
  "aion-1.0": 2,
  "aion-1.0-mini": 2,
  "aion-rp-llama-3.1-8b": 1,
  "anubis-70b-v1.1": 1.6,
  "anubis-pro-105b-v1": 2,
  "chatgpt-4o-latest": 3,
  "claude-3-haiku": 5,
  "claude-3-haiku:beta": 5,
  "claude-3-opus": 5,
  "claude-3-opus:beta": 5,
  "claude-3-sonnet": 5,
  "claude-3.5-haiku": 5
}')
ON CONFLICT DO NOTHING;

-- 显示表信息
\d config;

-- 查询示例数据
SELECT id, key, value, created_at, updated_at FROM config ORDER BY updated_at DESC LIMIT 5;

-- Contains AI-generated edits.
