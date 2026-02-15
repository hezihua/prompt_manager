/**
 * 性能监控工具
 */
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  /**
   * 记录性能指标
   */
  static record(key: string, duration: number): void {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    this.metrics.get(key)!.push(duration);
  }

  /**
   * 测量函数执行时间
   */
  static async measure<T>(
    key: string,
    fn: () => Promise<T> | T
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.record(key, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(`${key}:error`, duration);
      throw error;
    }
  }

  /**
   * 获取统计信息
   */
  static getStats(key: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
  } | null {
    const values = this.metrics.get(key);
    if (!values || values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    return {
      count: values.length,
      avg: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  /**
   * 获取所有统计信息
   */
  static getAllStats(): Record<string, ReturnType<typeof PerformanceMonitor.getStats>> {
    const result: Record<string, ReturnType<typeof PerformanceMonitor.getStats>> = {};
    for (const [key, _] of this.metrics) {
      result[key] = this.getStats(key);
    }
    return result;
  }

  /**
   * 清空所有数据
   */
  static clear(): void {
    this.metrics.clear();
  }
}

/**
 * 错误日志管理器
 */
export class ErrorLogger {
  private static logs: Array<{
    timestamp: number;
    level: 'error' | 'warn' | 'info';
    message: string;
    stack?: string;
    context?: unknown;
  }> = [];

  private static maxLogs = 100;

  /**
   * 记录错误
   */
  static error(message: string, error?: Error, context?: unknown): void {
    this.log('error', message, error?.stack, context);
    console.error(message, error, context);
  }

  /**
   * 记录警告
   */
  static warn(message: string, context?: unknown): void {
    this.log('warn', message, undefined, context);
    console.warn(message, context);
  }

  /**
   * 记录信息
   */
  static info(message: string, context?: unknown): void {
    this.log('info', message, undefined, context);
    console.info(message, context);
  }

  /**
   * 内部记录方法
   */
  private static log(
    level: 'error' | 'warn' | 'info',
    message: string,
    stack?: string,
    context?: unknown
  ): void {
    this.logs.push({
      timestamp: Date.now(),
      level,
      message,
      stack,
      context,
    });

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * 获取所有日志
   */
  static getLogs(level?: 'error' | 'warn' | 'info'): typeof ErrorLogger.logs {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * 导出日志为文本
   */
  static exportLogs(): string {
    return this.logs
      .map((log) => {
        const date = new Date(log.timestamp).toISOString();
        const parts = [
          `[${date}] [${log.level.toUpperCase()}]`,
          log.message,
        ];
        if (log.stack) {
          parts.push(`\nStack: ${log.stack}`);
        }
        if (log.context) {
          parts.push(`\nContext: ${JSON.stringify(log.context)}`);
        }
        return parts.join(' ');
      })
      .join('\n\n');
  }

  /**
   * 下载日志文件
   */
  static downloadLogs(): void {
    const content = this.exportLogs();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-manager-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 清空日志
   */
  static clear(): void {
    this.logs = [];
  }
}

/**
 * 缓存管理器（用于性能优化）
 */
export class CacheManager {
  private static cache: Map<string, { value: unknown; expiry: number }> = new Map();

  /**
   * 设置缓存
   */
  static set(key: string, value: unknown, ttl: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * 获取缓存
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // 检查是否过期
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * 删除缓存
   */
  static delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  static clear(): void {
    this.cache.clear();
  }

  /**
   * 清理过期缓存
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// 定期清理过期缓存
setInterval(() => {
  CacheManager.cleanup();
}, 60 * 1000); // 每分钟清理一次
