import { Client } from 'postgres'

/**
 * PostgreSQL 数据库配置接口
 */
interface DatabaseConfig {
  hostname: string
  port: number
  database: string
  username: string
  password: string
}

/**
 * 数据对象类型定义
 */
type DataObject = Record<string, unknown>

/**
 * 数据库查询结果类型
 */
interface DatabaseRow {
  data: DataObject
}

/**
 * 获取数据库配置，优先从环境变量读取
 */
function getDatabaseConfig(): DatabaseConfig {
  return {
    hostname: Deno.env.get('DB_HOST') || 'localhost',
    port: parseInt(Deno.env.get('DB_PORT') || '5432'),
    database: Deno.env.get('DB_NAME') || 'magsync',
    username: Deno.env.get('DB_USER') || 'postgres',
    password: Deno.env.get('DB_PASSWORD') || '',
  }
}

/**
 * 从 PostgreSQL 数据库获取旧数据
 */
async function fetchOldDataFromDB(tableName: string = 'config'): Promise<DataObject> {
  const config = getDatabaseConfig()

  // 检查必需的连接参数是否存在
  if (!config.password) {
    console.log('⚠️  数据库密码未设置，跳过数据库连接')
    return {}
  }

  let client: Client

  try {
    client = new Client(config)
    await client.connect()
    console.log('📊 已连接到 PostgreSQL 数据库')

    // 查询数据，假设数据以 JSON 格式存储在 data 列中
    const result = await client.queryObject<DatabaseRow>(
      `SELECT key, value FROM ${tableName} ORDER BY updated_at DESC LIMIT 1`
    )

    if (result.rows.length === 0) {
      console.log('⚠️  数据库中未找到旧数据，返回空对象')
      return {}
    }

    const oldData = result.rows[0].data
    console.log('✅ 成功从数据库获取旧数据')
    return oldData
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    // 打印详细的数据库连接错误日志用于排查
    console.error('🚨 数据库连接异常，操作终止！')
    console.error('='.repeat(60))
    console.error('📋 错误信息:', errorMessage)
    console.error('🔧 数据库配置:')
    console.error(`   主机: ${config.hostname}:${config.port}`)
    console.error(`   数据库: ${config.database}`)
    console.error(`   用户名: ${config.username}`)
    console.error(`   密码: ${config.password ? '已设置' : '未设置'}`)
    console.error('🔍 排查建议:')
    console.error('   1. 检查 PostgreSQL 服务是否启动')
    console.error('   2. 验证数据库连接参数是否正确')
    console.error('   3. 确认数据库用户权限')
    console.error('   4. 检查网络连接和防火墙设置')
    console.error('   5. 验证数据库和表是否存在')
    console.error('='.repeat(60))

    // 抛出错误终止操作
    throw new Error(`数据库连接失败: ${errorMessage}`)
  } finally {
    try {
      if (client!) {
        await client.end()
      }
    } catch (error) {
      // 忽略关闭连接时的错误
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.warn('⚠️  关闭数据库连接时出现警告:', errorMessage)
    }
  }
}

/**
 * 从 URL 获取新的 JSON 数据
 */
async function fetchNewDataFromURL(url: string): Promise<DataObject> {
  try {
    console.log(`🌐 正在从 URL 获取新数据: ${url}`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const newData = (await response.json()) as DataObject
    console.log('✅ 成功从 URL 获取新数据')
    return newData
  } catch (error) {
    console.error('❌ 从 URL 获取数据时出错:', error)
    throw error
  }
}

/**
 * 合并新旧数据，新数据优先
 */
function mergeData(oldData: DataObject, newData: DataObject): DataObject {
  console.log('🔄 正在合并新旧数据...')

  // 使用展开运算符合并，新数据会覆盖旧数据中的相同 key
  const mergedData = { ...oldData, ...newData }

  console.log('✅ 数据合并完成')
  return mergedData
}

/**
 * 主要的数据获取和合并函数
 */
async function fetchMagnificationFile(url: string, tableName?: string): Promise<DataObject> {
  try {
    console.log('🚀 开始执行 MagSync 数据同步...')

    // 并行获取新旧数据以提高性能
    const [oldData, newData] = await Promise.all([fetchOldDataFromDB(tableName), fetchNewDataFromURL(url)])

    // 合并数据
    const mergedData = mergeData(oldData, newData)

    // 输出合并结果
    console.log('📋 合并后的数据:')
    console.log(JSON.stringify(mergedData, null, 2))

    return mergedData
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ MagSync 执行失败:', errorMessage)
    console.error('💡 程序已终止，请排查上述问题后重试')

    // 重新抛出错误以确保程序退出
    throw error
  }
}

// 导出函数供测试使用
export { fetchMagnificationFile, fetchOldDataFromDB, fetchNewDataFromURL, mergeData }

if (import.meta.main) {
  const url =
    Deno.args[0] ||
    'https://raw.githubusercontent.com/Veloera/public-assets/refs/heads/main/defaults/model-ratios/flexible/completion.json'

  const tableName = Deno.args[1] // 可选的表名参数

  console.log(`🎯 URL: ${url}`)
  if (tableName) {
    console.log(`📊 表名: ${tableName}`)
  }

  try {
    await fetchMagnificationFile(url, tableName)
    console.log('🎉 MagSync 同步完成！')
  } catch (error) {
    // 确保程序以非零状态码退出
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('💀 程序异常退出:', errorMessage)
    Deno.exit(1)
  }
}

// Contains AI-generated edits.
