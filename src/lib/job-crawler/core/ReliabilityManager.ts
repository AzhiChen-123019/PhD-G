class ReliabilityManager {
  private healthStatus: Map<string, boolean> = new Map();
  private performanceMetrics: Map<string, any> = new Map();
  private platformStatus: Map<string, { active: boolean; lastSuccess: number; failureCount: number }> = new Map();
  private maxFailureCount: number = 5;
  private recoveryTimeout: number = 30000; // 30秒恢复时间

  constructor() {
    this.initializeMetrics();
  }

  /**
   * 初始化性能指标
   */
  private initializeMetrics() {
    this.performanceMetrics.set('crawlSuccessRate', {
      total: 0,
      success: 0,
      rate: 0
    });

    this.performanceMetrics.set('averageCrawlTime', {
      total: 0,
      count: 0,
      average: 0
    });

    this.performanceMetrics.set('errorRate', {
      total: 0,
      errors: 0,
      rate: 0
    });
  }

  /**
   * 更新平台状态
   * @param platform 平台名称
   * @param success 是否成功
   */
  updatePlatformStatus(platform: string, success: boolean) {
    const now = Date.now();
    const currentStatus = this.platformStatus.get(platform) || {
      active: true,
      lastSuccess: now,
      failureCount: 0
    };

    if (success) {
      currentStatus.active = true;
      currentStatus.lastSuccess = now;
      currentStatus.failureCount = 0;
      console.log(`Platform ${platform} recovered`);
    } else {
      currentStatus.failureCount += 1;
      if (currentStatus.failureCount >= this.maxFailureCount) {
        currentStatus.active = false;
        console.warn(`Platform ${platform} disabled due to too many failures`);

        // 安排自动恢复
        setTimeout(() => {
          this.attemptPlatformRecovery(platform);
        }, this.recoveryTimeout);
      }
    }

    this.platformStatus.set(platform, currentStatus);
  }

  /**
   * 尝试恢复平台
   * @param platform 平台名称
   */
  private attemptPlatformRecovery(platform: string) {
    const currentStatus = this.platformStatus.get(platform);
    if (currentStatus && !currentStatus.active) {
      currentStatus.active = true;
      currentStatus.failureCount = 0;
      this.platformStatus.set(platform, currentStatus);
      console.log(`Attempting to recover platform ${platform}`);
    }
  }

  /**
   * 检查平台是否可用
   * @param platform 平台名称
   * @returns 是否可用
   */
  isPlatformAvailable(platform: string): boolean {
    const status = this.platformStatus.get(platform);
    return status ? status.active : true;
  }

  /**
   * 更新抓取成功率
   * @param success 是否成功
   */
  updateCrawlSuccessRate(success: boolean) {
    const metric = this.performanceMetrics.get('crawlSuccessRate');
    if (metric) {
      metric.total += 1;
      if (success) {
        metric.success += 1;
      }
      metric.rate = metric.total > 0 ? (metric.success / metric.total) * 100 : 0;
      this.performanceMetrics.set('crawlSuccessRate', metric);
    }
  }

  /**
   * 更新平均抓取时间
   * @param time 抓取时间（毫秒）
   */
  updateAverageCrawlTime(time: number) {
    const metric = this.performanceMetrics.get('averageCrawlTime');
    if (metric) {
      metric.total += time;
      metric.count += 1;
      metric.average = metric.count > 0 ? metric.total / metric.count : 0;
      this.performanceMetrics.set('averageCrawlTime', metric);
    }
  }

  /**
   * 更新错误率
   * @param error 是否发生错误
   */
  updateErrorRate(error: boolean) {
    const metric = this.performanceMetrics.get('errorRate');
    if (metric) {
      metric.total += 1;
      if (error) {
        metric.errors += 1;
      }
      metric.rate = metric.total > 0 ? (metric.errors / metric.total) * 100 : 0;
      this.performanceMetrics.set('errorRate', metric);
    }
  }

  /**
   * 获取系统健康状态
   * @returns 健康状态
   */
  getHealthStatus() {
    const platformStatus = Object.fromEntries(this.platformStatus.entries());
    const metrics = Object.fromEntries(this.performanceMetrics.entries());

    // 计算整体健康状态
    const activePlatforms = Array.from(this.platformStatus.values()).filter(status => status.active).length;
    const totalPlatforms = this.platformStatus.size || 1;
    const platformHealth = (activePlatforms / totalPlatforms) * 100;

    const successRate = metrics.crawlSuccessRate?.rate || 0;
    const errorRate = metrics.errorRate?.rate || 0;

    // 综合健康评分
    const healthScore = (
      platformHealth * 0.4 +
      successRate * 0.4 +
      Math.max(0, 100 - errorRate) * 0.2
    );

    return {
      overall: {
        healthScore,
        status: healthScore > 70 ? 'healthy' : healthScore > 40 ? 'degraded' : 'unhealthy'
      },
      platforms: platformStatus,
      metrics
    };
  }

  /**
   * 获取可用的平台列表
   * @returns 可用平台列表
   */
  getAvailablePlatforms(): string[] {
    return Array.from(this.platformStatus.entries())
      .filter(([_, status]) => status.active)
      .map(([platform]) => platform);
  }

  /**
   * 检查系统是否健康
   * @returns 是否健康
   */
  isSystemHealthy(): boolean {
    const healthStatus = this.getHealthStatus();
    return healthStatus.overall.status === 'healthy';
  }

  /**
   * 重置所有状态
   */
  reset() {
    this.healthStatus.clear();
    this.platformStatus.clear();
    this.initializeMetrics();
    console.log('Reliability manager reset');
  }

  /**
   * 生成健康报告
   * @returns 健康报告
   */
  generateHealthReport() {
    const healthStatus = this.getHealthStatus();
    const report = {
      timestamp: new Date().toISOString(),
      ...healthStatus
    };

    console.log('Health report generated', report);
    return report;
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.reset();
  }
}

export default ReliabilityManager;