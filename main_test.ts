import { assertEquals, assertRejects } from "@std/assert";
import { mergeData, fetchNewDataFromURL, fetchOldDataFromDB } from "./main.ts";

Deno.test('mergeData 应该正确合并两个对象', () => {
  const oldData = { a: 1, b: 2, c: 3 }
  const newData = { b: 20, d: 4 }
  const expected = { a: 1, b: 20, c: 3, d: 4 }

  const result = mergeData(oldData, newData)
  assertEquals(result, expected)
})

Deno.test('mergeData 应该处理空对象', () => {
  const oldData = {}
  const newData = { a: 1, b: 2 }
  const expected = { a: 1, b: 2 }

  const result = mergeData(oldData, newData)
  assertEquals(result, expected)
})

Deno.test('mergeData 应该让新数据覆盖旧数据', () => {
  const oldData = {
    name: 'old',
    version: '1.0.0',
    config: { debug: false },
  }
  const newData = {
    name: 'new',
    config: { debug: true, verbose: true },
  }
  const expected = {
    name: 'new',
    version: '1.0.0',
    config: { debug: true, verbose: true },
  }

  const result = mergeData(oldData, newData)
  assertEquals(result, expected)
})

// 注意：这个测试需要网络权限，可能在某些环境下会失败
Deno.test({
  name: 'fetchNewDataFromURL 应该能够获取 JSON 数据',
  permissions: { net: true },
  async fn() {
    const testUrl =
      'https://raw.githubusercontent.com/Veloera/public-assets/refs/heads/main/defaults/model-ratios/flexible/completion.json'
    const result = await fetchNewDataFromURL(testUrl)

    // 检查返回的数据是否是对象
    assertEquals(typeof result, 'object')

    // 检查是否包含预期的模型配置
    const resultData = result as Record<string, unknown>

    // 验证返回的数据包含一些预期的模型
    const hasGptModels = 'gpt-4' in resultData || 'gpt-3.5-turbo' in resultData
    const hasClaudeModels = 'claude-3-opus' in resultData || 'claude-3-sonnet' in resultData

    // 至少应该包含一些模型配置
    assertEquals(Object.keys(resultData).length > 0, true, '应该包含模型配置数据')
    assertEquals(hasGptModels || hasClaudeModels, true, '应该包含已知的模型配置')
  },
});

// 测试数据库连接异常处理
Deno.test({
  name: "fetchOldDataFromDB 在数据库连接异常时应该抛出错误",
  permissions: { env: true },
  async fn() {
    // 设置错误的数据库配置
    const originalEnv = {
      DB_HOST: Deno.env.get("DB_HOST"),
      DB_USER: Deno.env.get("DB_USER"), 
      DB_PASSWORD: Deno.env.get("DB_PASSWORD"),
    };
    
    try {
      // 设置无效的数据库配置
      Deno.env.set("DB_HOST", "invalid-host");
      Deno.env.set("DB_USER", "invalid-user");
      Deno.env.set("DB_PASSWORD", "invalid-password");
      
      // 应该抛出数据库连接错误
      await assertRejects(
        () => fetchOldDataFromDB("test_table"),
        Error,
        "数据库连接失败"
      );
      
    } finally {
      // 恢复原始环境变量
      if (originalEnv.DB_HOST) {
        Deno.env.set("DB_HOST", originalEnv.DB_HOST);
      } else {
        Deno.env.delete("DB_HOST");
      }
      if (originalEnv.DB_USER) {
        Deno.env.set("DB_USER", originalEnv.DB_USER);
      } else {
        Deno.env.delete("DB_USER");
      }
      if (originalEnv.DB_PASSWORD) {
        Deno.env.set("DB_PASSWORD", originalEnv.DB_PASSWORD);
      } else {
        Deno.env.delete("DB_PASSWORD");
      }
    }
  },
});

// Contains AI-generated edits.
