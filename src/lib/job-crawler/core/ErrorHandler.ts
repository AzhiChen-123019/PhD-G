class ErrorHandler {
  private retryCounts: Map<string, number> = new Map();
  private maxRetries: number = 3;
  private retryDelay: number = 2000; // 初始重试延迟（毫秒）

  constructor() {
  }

  /**
   * 处理错误
   * @param error 错误对象
   * @param context 错误上下文
   * @param retryable 是否可重试
   * @returns 是否成功处理
   */
  handleError(error: any, context: string, retryable: boolean = false): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error(`Error in ${context}: ${errorMessage}`, {
      stack: errorStack,
      context
    });

    if (retryable) {
      return this.handleRetryableError(error, context);
    }

    return false;
  }

  /**
   * 处理可重试的错误
   * @param error 错误对象
   * @param context 错误上下文
   * @returns 是否应该重试
   */
  private handleRetryableError(error: any, context: string): boolean {
    const retryKey = context;
    const currentRetryCount = this.retryCounts.get(retryKey) || 0;

    if (currentRetryCount < this.maxRetries) {
      const nextRetryCount = currentRetryCount + 1;
      this.retryCounts.set(retryKey, nextRetryCount);

      const delay = this.retryDelay * Math.pow(2, nextRetryCount - 1); // 指数退避

      console.warn(`Retrying ${context} (${nextRetryCount}/${this.maxRetries}) after ${delay}ms`);

      return true;
    } else {
      this.retryCounts.delete(retryKey);
      console.error(`Max retries reached for ${context}`);
      return false;
    }
  }

  /**
   * 重置重试计数
   * @param context 错误上下文
   */
  resetRetryCount(context: string): void {
    this.retryCounts.delete(context);
  }

  /**
   * 执行带错误处理的操作
   * @param operation 要执行的操作
   * @param context 操作上下文
   * @param retryable 是否可重试
   * @returns 操作结果
   */
  async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context: string,
    retryable: boolean = false
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      const shouldRetry = this.handleError(error, context, retryable);

      if (shouldRetry) {
        const retryKey = context;
        const currentRetryCount = this.retryCounts.get(retryKey) || 1;
        const delay = this.retryDelay * Math.pow(2, currentRetryCount - 1);

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithErrorHandling(operation, context, retryable);
      }

      return null;
    }
  }

  /**
   * 检查是否是网络错误
   * @param error 错误对象
   * @returns 是否是网络错误
   */
  isNetworkError(error: any): boolean {
    const networkErrorMessages = [
      'Network Error',
      'timeout',
      'Connection refused',
      'ENOTFOUND',
      'ETIMEDOUT',
      'ECONNRESET',
      'ECONNREFUSED'
    ];

    const errorMessage = error instanceof Error ? error.message : String(error);
    return networkErrorMessages.some(message => errorMessage.includes(message));
  }

  /**
   * 检查是否是反爬虫错误
   * @param error 错误对象
   * @param response 响应对象
   * @returns 是否是反爬虫错误
   */
  isAntiCrawlerError(error: any, response?: any): boolean {
    // 检查状态码
    if (response) {
      if (response.status === 403 || response.status === 429 || response.status === 503) {
        return true;
      }
    }

    // 检查错误信息
    const errorMessage = error instanceof Error ? error.message : String(error);
    const antiCrawlerMessages = [
      'captcha',
      'CAPTCHA',
      '验证',
      '验证码',
      'rate limit',
      'Rate Limit',
      'Too Many Requests',
      'blocked',
      'Blocked'
    ];

    return antiCrawlerMessages.some(message => errorMessage.includes(message));
  }

  /**
   * 获取错误类型
   * @param error 错误对象
   * @param response 响应对象
   * @returns 错误类型
   */
  getErrorType(error: any, response?: any): string {
    if (this.isNetworkError(error)) {
      return 'network';
    }

    if (this.isAntiCrawlerError(error, response)) {
      return 'anti_crawler';
    }

    if (error instanceof SyntaxError) {
      return 'syntax';
    }

    if (error instanceof TypeError) {
      return 'type';
    }

    if (response && response.status >= 400) {
      return `http_${response.status}`;
    }

    return 'unknown';
  }

  /**
   * 生成错误报告
   * @param error 错误对象
   * @param context 错误上下文
   * @param response 响应对象
   * @returns 错误报告
   */
  generateErrorReport(error: any, context: string, response?: any): object {
    const errorType = this.getErrorType(error, response);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    return {
      type: errorType,
      message: errorMessage,
      stack: errorStack,
      context,
      timestamp: new Date().toISOString(),
      response: response ? {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      } : undefined
    };
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.retryCounts.clear();
  }
}

export default ErrorHandler;