// 爬虫引擎模块
import axios from 'axios';
import Bottleneck from 'bottleneck';
import { v4 as uuidv4 } from 'uuid';
import { Job, CrawlOptions, CrawlResult, PlatformStats, CrawlerStatus, CorporateStats, UniversityStats, PlatformConfig } from '../types';
import ConfigManager from './ConfigManager';
import OrganizationManager from './OrganizationManager';
import PlatformManager from './PlatformManager';

class CrawlerEngine {
  private static instance: CrawlerEngine;
  private isRunning: boolean = false;
  private activeTasks: number = 0;
  private completedTasks: number = 0;
  private failedTasks: number = 0;
  private totalJobsCrawled: number = 0;
  private startTime: number = Date.now();
  private platformManager: PlatformManager;
  private organizationManager: OrganizationManager;
  private rateLimiter: Bottleneck;

  private constructor() {
    // 初始化速率限制器
    const config = ConfigManager.getConfig();
    this.rateLimiter = new Bottleneck({
      maxConcurrent: config.concurrency,
      minTime: 1000 // 最小请求间隔
    });
    
    // 初始化平台管理器
    const platformConfigs = new Map<string, PlatformConfig>();
    config.platforms.forEach(platform => {
      platformConfigs.set(platform.name, platform);
    });
    this.platformManager = new PlatformManager(platformConfigs);
    
    // 初始化企业和大学管理器
    this.organizationManager = new OrganizationManager(
      config.corporations || [],
      config.universities || []
    );
  }

  static getInstance(): CrawlerEngine {
    if (!CrawlerEngine.instance) {
      CrawlerEngine.instance = new CrawlerEngine();
    }
    return CrawlerEngine.instance;
  }



  /**
   * 获取爬虫状态
   */
  getStatus(): CrawlerStatus {
    return {
      isRunning: this.isRunning,
      activeTasks: this.activeTasks,
      completedTasks: this.completedTasks,
      failedTasks: this.failedTasks,
      totalJobsCrawled: this.totalJobsCrawled,
      uptime: Date.now() - this.startTime,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 // MB
    };
  }

  /**
   * 启动爬虫
   */
  async crawl(options: CrawlOptions): Promise<CrawlResult> {
    this.isRunning = true;
    this.activeTasks++;
    const startTime = Date.now();
    const results: Job[] = [];
    const errors: string[] = [];
    const platformStats: Record<string, PlatformStats> = {};
    const corporateStats: Record<string, CorporateStats> = {};
    const universityStats: Record<string, UniversityStats> = {};

    try {
      console.log(`开始抓取任务，选项: ${JSON.stringify(options)}`);

      // 获取启用的平台
      const platforms = options.platforms || 
        ConfigManager.getConfig().platforms
          .filter(p => p.enabled)
          .map(p => p.name);

      // 获取企业列表
      const corporations = options.corporations || 
        ConfigManager.getConfig().corporations
          .filter(c => c.enabled)
          .map(c => c.id);

      // 获取大学列表
      const universities = options.universities || 
        ConfigManager.getConfig().universities
          .filter(u => u.enabled)
          .map(u => u.id);

      // 并行抓取各平台
      await Promise.all(
        platforms.map(async (platformName) => {
          try {
            console.log(`开始抓取平台: ${platformName}`);
            
            // 执行平台抓取
            const platformResult = await this.rateLimiter.schedule(() => 
              this.platformManager.crawlFromPlatform(platformName, Array.isArray(options.keywords) ? options.keywords.join(',') : options.keywords || '', Array.isArray(options.locations) ? options.locations.join(',') : options.locations || '', options.maxResults || 10)
            );

            // 处理结果
            results.push(...platformResult.jobs);
            errors.push(...platformResult.errors);
            platformStats[platformName] = {
              platform: platformName,
              totalJobs: platformResult.jobs.length,
              successfulJobs: platformResult.jobs.length,
              failedJobs: 0,
              duration: platformResult.duration,
              errors: platformResult.errors
            };

            this.totalJobsCrawled += platformResult.jobs.length;
            console.log(`平台 ${platformName} 抓取完成，获取 ${platformResult.jobs.length} 个岗位`);
          } catch (error) {
            const errorMessage = `平台 ${platformName} 抓取失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(errorMessage);
            errors.push(errorMessage);
            platformStats[platformName] = {
              platform: platformName,
              totalJobs: 0,
              successfulJobs: 0,
              failedJobs: 1,
              duration: Date.now() - startTime,
              errors: [errorMessage]
            };
          }
        })
      );

      // 并行抓取各企业官网
      await Promise.all(
        corporations.map(async (corporateId) => {
          try {
            const corporateCrawler = this.organizationManager.getCorporateCrawler(corporateId);
            if (!corporateCrawler) {
              throw new Error(`企业爬虫未初始化: ${corporateId}`);
            }

            console.log(`开始抓取企业官网: ${corporateId}`);
            
            // 执行企业抓取
            const corporateResult = await this.rateLimiter.schedule(() => 
              corporateCrawler.crawl()
            );

            // 处理结果
            results.push(...corporateResult.jobs);
            errors.push(...corporateResult.errors);
            corporateStats[corporateId] = {
              corporation: corporateId,
              totalJobs: corporateResult.jobs.length,
              successfulJobs: corporateResult.jobs.length,
              failedJobs: 0,
              duration: corporateResult.duration,
              errors: corporateResult.errors
            };

            this.totalJobsCrawled += corporateResult.jobs.length;
            console.log(`企业官网 ${corporateId} 抓取完成，获取 ${corporateResult.jobs.length} 个岗位`);
          } catch (error) {
            const errorMessage = `企业官网 ${corporateId} 抓取失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(errorMessage);
            errors.push(errorMessage);
            corporateStats[corporateId] = {
              corporation: corporateId,
              totalJobs: 0,
              successfulJobs: 0,
              failedJobs: 1,
              duration: Date.now() - startTime,
              errors: [errorMessage]
            };
          }
        })
      );

      // 并行抓取各大学官网
      await Promise.all(
        universities.map(async (universityId) => {
          try {
            const universityCrawler = this.organizationManager.getUniversityCrawler(universityId);
            if (!universityCrawler) {
              throw new Error(`大学爬虫未初始化: ${universityId}`);
            }

            console.log(`开始抓取大学官网: ${universityId}`);
            
            // 执行大学抓取
            const universityResult = await this.rateLimiter.schedule(() => 
              universityCrawler.crawl()
            );

            // 处理结果
            results.push(...universityResult.jobs);
            errors.push(...universityResult.errors);
            universityStats[universityId] = {
              university: universityId,
              totalJobs: universityResult.jobs.length,
              successfulJobs: universityResult.jobs.length,
              failedJobs: 0,
              duration: universityResult.duration,
              errors: universityResult.errors
            };

            this.totalJobsCrawled += universityResult.jobs.length;
            console.log(`大学官网 ${universityId} 抓取完成，获取 ${universityResult.jobs.length} 个岗位`);
          } catch (error) {
            const errorMessage = `大学官网 ${universityId} 抓取失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(errorMessage);
            errors.push(errorMessage);
            universityStats[universityId] = {
              university: universityId,
              totalJobs: 0,
              successfulJobs: 0,
              failedJobs: 1,
              duration: Date.now() - startTime,
              errors: [errorMessage]
            };
          }
        })
      );

      // 简单的结果处理（替代dataProcessor）
      const processedResults = results.map(job => ({
        ...job,
        id: job.id || uuidv4(),
        rating: job.rating || 4.0,
        relevanceScore: job.relevanceScore || 80
      }));

      // 简单的存储处理（替代storageManager）
      // 这里可以添加实际的存储逻辑

      const duration = Date.now() - startTime;
      this.completedTasks++;

      console.log(`抓取任务完成，用时 ${duration}ms，获取 ${processedResults.length} 个岗位`);

      return {
        success: true,
        jobs: processedResults,
        totalCount: processedResults.length,
        filteredCount: processedResults.filter(job => job.rating >= (options.minRating || 4.0)).length,
        duration,
        errors,
        platformStats,
        corporateStats,
        universityStats
      };
    } catch (error) {
      const errorMessage = `抓取任务失败: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);
      errors.push(errorMessage);
      this.failedTasks++;

      const duration = Date.now() - startTime;

      return {
        success: false,
        jobs: [],
        totalCount: 0,
        filteredCount: 0,
        duration,
        errors,
        platformStats,
        corporateStats,
        universityStats
      };
    } finally {
      this.isRunning = false;
      this.activeTasks--;
    }
  }

  /**
   * 停止爬虫
   */
  stop(): void {
    this.isRunning = false;
    console.log('爬虫已停止');
  }

  /**
   * 重启爬虫
   */
  restart(): void {
    this.stop();
    this.resetStats();
    
    // 重新初始化平台管理器
    const config = ConfigManager.getConfig();
    const platformConfigs = new Map<string, PlatformConfig>();
    config.platforms.forEach(platform => {
      platformConfigs.set(platform.name, platform);
    });
    this.platformManager = new PlatformManager(platformConfigs);
    
    // 重新初始化企业和大学管理器
    this.organizationManager = new OrganizationManager(
      config.corporations || [],
      config.universities || []
    );
    
    console.log('爬虫已重启');
  }

  /**
   * 重置统计信息
   */
  private resetStats(): void {
    this.activeTasks = 0;
    this.completedTasks = 0;
    this.failedTasks = 0;
    this.totalJobsCrawled = 0;
    this.startTime = Date.now();
  }



  /**
   * 测试平台抓取
   */
  async testPlatformCrawl(platformName: string, options: CrawlOptions): Promise<CrawlResult> {
    console.log(`开始测试平台 ${platformName} 抓取`);
    const result = await this.platformManager.crawlFromPlatform(platformName, Array.isArray(options.keywords) ? options.keywords.join(',') : options.keywords || '', Array.isArray(options.locations) ? options.locations.join(',') : options.locations || '', options.maxResults || 10);
    console.log(`平台 ${platformName} 测试完成，获取 ${result.jobs.length} 个岗位`);

    return result;
  }

  /**
   * 批量抓取
   */
  async batchCrawl(tasks: Array<{
    options: CrawlOptions;
    callback?: (result: CrawlResult) => void;
  }>): Promise<CrawlResult[]> {
    const results: CrawlResult[] = [];

    for (const task of tasks) {
      try {
        const result = await this.crawl(task.options);
        results.push(result);
        if (task.callback) {
          task.callback(result);
        }
      } catch (error) {
        console.error(`批量抓取任务失败: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return results;
  }

  /**
   * 获取爬虫状态
   */
  getStats(): {
    uptime: number;
    totalJobs: number;
    tasks: {
      active: number;
      completed: number;
      failed: number;
      total: number;
    };
    successRate: number;
  } {
    const totalTasks = this.completedTasks + this.failedTasks;
    const successRate = totalTasks > 0 ? (this.completedTasks / totalTasks) * 100 : 0;

    return {
      uptime: Date.now() - this.startTime,
      totalJobs: this.totalJobsCrawled,
      tasks: {
        active: this.activeTasks,
        completed: this.completedTasks,
        failed: this.failedTasks,
        total: totalTasks
      },
      successRate
    };
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.stop();
    if (this.organizationManager) {
      this.organizationManager.cleanup();
    }
    console.log('爬虫资源已清理');
  }
}

export default CrawlerEngine;
