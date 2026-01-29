import { Job, CrawlOptions, CrawlResult } from './types';
import CrawlerEngine from './core/CrawlerEngine';
import ConfigManager from './core/ConfigManager';
// 移除对ai-job-matching-complete.tsx的导入，避免循环依赖

class JobCrawler {
  private crawlerEngine: CrawlerEngine;

  constructor() {
    this.crawlerEngine = CrawlerEngine.getInstance();
  }

  /**
   * 抓取岗位信息
   * @param options 抓取选项
   * @returns 抓取结果
   */
  async crawlJobs(options: CrawlOptions): Promise<CrawlResult> {
    return this.crawlerEngine.crawl(options);
  }

  /**
   * 测试平台抓取
   * @param platformName 平台名称
   * @param options 抓取选项
   * @returns 抓取结果
   */
  async testPlatform(platformName: string, options: CrawlOptions): Promise<CrawlResult> {
    return this.crawlerEngine.testPlatformCrawl(platformName, options);
  }

  /**
   * 获取爬虫状态
   * @returns 爬虫状态
   */
  getStatus() {
    return this.crawlerEngine.getStatus();
  }

  /**
   * 获取爬虫统计信息
   * @returns 统计信息
   */
  getStats() {
    return this.crawlerEngine.getStats();
  }

  /**
   * 停止爬虫
   */
  stop() {
    this.crawlerEngine.stop();
  }

  /**
   * 重启爬虫
   */
  restart() {
    this.crawlerEngine.restart();
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.crawlerEngine.cleanup();
  }

  /**
   * 智能抓取岗位
   * @param userProfile 用户简历信息
   * @param preferences 用户偏好
   * @param options 抓取选项
   * @returns 抓取结果
   */
  async smartCrawl(userProfile: any, preferences: any, options: Omit<CrawlOptions, 'keywords' | 'locations'> = {}) {
    // 基于用户信息和偏好生成抓取关键词
    const keywords = this.generateKeywordsFromProfile(userProfile, preferences);
    const locations = preferences.location ? [preferences.location] : ['全国'];

    // 构建抓取选项
    const crawlOptions: CrawlOptions = {
      keywords,
      locations,
      maxResults: this.getUserLimit(userProfile.membershipLevel),
      minRating: 4.0, // 只返回4星以上的岗位
      platforms: options.platforms,
      corporations: options.corporations,
      universities: options.universities,
      userProfile,
      ...options
    };

    // 执行抓取
    const result = await this.crawlJobs(crawlOptions);

    // 对结果进行智能排序和过滤
    const optimizedResults = this.optimizeResults(result.jobs, userProfile, preferences);

    return {
      ...result,
      jobs: optimizedResults
    };
  }

  /**
   * 抓取企业官网岗位
   * @param corporateIds 企业ID列表
   * @param options 抓取选项
   * @returns 抓取结果
   */
  async crawlCorporateJobs(corporateIds: string[], options: Omit<CrawlOptions, 'corporations'> = {}) {
    const crawlOptions: CrawlOptions = {
      corporations: corporateIds,
      maxResults: options.maxResults || 10,
      minRating: options.minRating || 4.0,
      ...options
    };

    return this.crawlJobs(crawlOptions);
  }

  /**
   * 抓取大学官网岗位
   * @param universityIds 大学ID列表
   * @param options 抓取选项
   * @returns 抓取结果
   */
  async crawlUniversityJobs(universityIds: string[], options: Omit<CrawlOptions, 'universities'> = {}) {
    const crawlOptions: CrawlOptions = {
      universities: universityIds,
      maxResults: options.maxResults || 10,
      minRating: options.minRating || 4.0,
      ...options
    };

    return this.crawlJobs(crawlOptions);
  }

  /**
   * 从用户信息生成抓取关键词
   * @param userProfile 用户信息
   * @param preferences 用户偏好
   * @returns 关键词数组
   */
  private generateKeywordsFromProfile(userProfile: any, preferences: any): string[] {
    const keywords = new Set<string>();

    // 从学术信息中提取关键词
    if (userProfile.academicInfo) {
      if (userProfile.academicInfo.field) {
        keywords.add(userProfile.academicInfo.field);
      }
      if (userProfile.academicInfo.degree) {
        keywords.add(userProfile.academicInfo.degree);
      }
    }

    // 从用户偏好中提取关键词
    if (preferences.skills) {
      preferences.skills.forEach((skill: string) => keywords.add(skill));
    }
    if (preferences.jobTypes) {
      preferences.jobTypes.forEach((jobType: string) => keywords.add(jobType));
    }

    // 确保至少有一个关键词
    if (keywords.size === 0) {
      keywords.add('Software Engineer');
    }

    return Array.from(keywords);
  }

  /**
   * 根据用户级别获取抓取限制
   * @param membershipLevel 会员级别
   * @returns 抓取限制数量
   */
  private getUserLimit(membershipLevel: string): number {
    switch (membershipLevel.toLowerCase()) {
      case 'free':
        return 10;
      case 'vip':
        return 30;
      case 'svip':
        return 100;
      default:
        return 10;
    }
  }

  /**
   * 优化抓取结果
   * @param jobs 抓取的岗位
   * @param userProfile 用户信息
   * @param preferences 用户偏好
   * @returns 优化后的岗位列表
   */
  private optimizeResults(jobs: Job[], userProfile: any, preferences: any): Job[] {
    // 简单的优化逻辑：按相关度排序并过滤4星以上的岗位
    return jobs
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .filter(job => job.rating >= 4.0); // 只保留4星以上的岗位
  }
}

// 导出单例实例
const jobCrawler = new JobCrawler();
export default jobCrawler;

// 导出类型和工具函数
export * from './types';
export { ConfigManager };