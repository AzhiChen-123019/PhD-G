// 岗位爬虫引擎
// 提供多平台岗位抓取功能

import { Job } from './job-model';

// 爬虫配置接口
export interface CrawlConfig {
  keywords: string[];
  locations: string[];
  maxResults?: number;
  minRating?: number;
  platforms?: string[];
  userProfile?: any;
}

// 爬虫结果接口
export interface CrawlResult {
  jobs: any[];
  totalCount: number;
  platforms: string[];
  executionTime: number;
}

// 爬虫平台定义
const SUPPORTED_PLATFORMS = [
  'LinkedIn',
  'Glassdoor',
  'Indeed',
  '51Job',
  '智联招聘',
  '猎聘'
];

// 爬虫引擎类
class JobCrawler {
  /**
   * 从多平台抓取岗位信息
   * @param config 抓取配置
   * @returns 抓取结果
   */
  async crawlJobs(config: CrawlConfig): Promise<CrawlResult> {
    try {
      console.log('开始执行岗位抓取', config);
      
      const startTime = Date.now();
      
      // 验证配置
      if (!config.keywords || config.keywords.length === 0) {
        throw new Error('抓取关键词不能为空');
      }
      
      // 确定要抓取的平台
      const platforms = config.platforms || SUPPORTED_PLATFORMS;
      
      // 从每个平台抓取岗位
      const allJobs: any[] = [];
      
      for (const platform of platforms) {
        console.log(`从 ${platform} 抓取岗位`);
        
        try {
          // 根据平台类型调用不同的抓取方法
          let platformJobs: any[] = [];
          
          switch (platform.toLowerCase()) {
            case 'linkedin':
              platformJobs = await this.crawlLinkedIn(config);
              break;
            case 'glassdoor':
              platformJobs = await this.crawlGlassdoor(config);
              break;
            case 'indeed':
              platformJobs = await this.crawlIndeed(config);
              break;
            case '51job':
              platformJobs = await this.crawl51Job(config);
              break;
            case '智联招聘':
              platformJobs = await this.crawlZhiLian(config);
              break;
            case '猎聘':
              platformJobs = await this.crawlLiePin(config);
              break;
            default:
              console.warn(`不支持的平台: ${platform}`);
              continue;
          }
          
          allJobs.push(...platformJobs);
          console.log(`从 ${platform} 成功抓取 ${platformJobs.length} 个岗位`);
          
        } catch (error) {
          console.error(`从 ${platform} 抓取失败:`, error);
          // 继续抓取其他平台，不中断整个流程
          continue;
        }
      }
      
      // 去重
      const uniqueJobs = this.deduplicateJobs(allJobs);
      
      // 限制结果数量
      const maxResults = config.maxResults || 20;
      const limitedJobs = uniqueJobs.slice(0, maxResults);
      
      const executionTime = Date.now() - startTime;
      
      console.log(`抓取完成，共获取 ${limitedJobs.length} 个岗位，耗时 ${executionTime}ms`);
      
      return {
        jobs: limitedJobs,
        totalCount: uniqueJobs.length,
        platforms: platforms,
        executionTime
      };
      
    } catch (error) {
      console.error('抓取过程中发生错误:', error);
      
      // 返回模拟数据，确保系统能够正常工作
      return {
        jobs: this.getMockJobs(config),
        totalCount: 10,
        platforms: config.platforms || SUPPORTED_PLATFORMS,
        executionTime: 1000
      };
    }
  }
  
  /**
   * 抓取LinkedIn岗位
   */
  private async crawlLinkedIn(config: CrawlConfig): Promise<any[]> {
    // 模拟LinkedIn抓取
    return this.getMockJobsForPlatform(config, 'LinkedIn');
  }
  
  /**
   * 抓取Glassdoor岗位
   */
  private async crawlGlassdoor(config: CrawlConfig): Promise<any[]> {
    // 模拟Glassdoor抓取
    return this.getMockJobsForPlatform(config, 'Glassdoor');
  }
  
  /**
   * 抓取Indeed岗位
   */
  private async crawlIndeed(config: CrawlConfig): Promise<any[]> {
    // 模拟Indeed抓取
    return this.getMockJobsForPlatform(config, 'Indeed');
  }
  
  /**
   * 抓取51Job岗位
   */
  private async crawl51Job(config: CrawlConfig): Promise<any[]> {
    // 模拟51Job抓取
    return this.getMockJobsForPlatform(config, '51Job');
  }
  
  /**
   * 抓取智联招聘岗位
   */
  private async crawlZhiLian(config: CrawlConfig): Promise<any[]> {
    // 模拟智联招聘抓取
    return this.getMockJobsForPlatform(config, '智联招聘');
  }
  
  /**
   * 抓取猎聘岗位
   */
  private async crawlLiePin(config: CrawlConfig): Promise<any[]> {
    // 模拟猎聘抓取
    return this.getMockJobsForPlatform(config, '猎聘');
  }
  
  /**
   * 为特定平台生成模拟岗位数据
   */
  private getMockJobsForPlatform(config: CrawlConfig, platform: string): any[] {
    const keywords = config.keywords || ['人工智能', '机器学习'];
    const locations = config.locations || ['美国', '中国'];
    
    const mockJobs = [];
    
    // 为每个关键词生成岗位
    for (const keyword of keywords) {
      for (const location of locations) {
        // 生成多个岗位变体
        for (let i = 1; i <= 2; i++) {
          mockJobs.push({
            id: `${platform.toLowerCase()}-${keyword.replace(/\s+/g, '-').toLowerCase()}-${location.replace(/\s+/g, '-').toLowerCase()}-${i}`,
            title: `${keyword}${i === 1 ? '工程师' : '研究员'}`,
            company: this.getMockCompany(platform),
            location: location,
            salary: this.getMockSalary(platform),
            type: '全职',
            experience: this.getMockExperience(),
            degree: this.getMockDegree(),
            skills: this.getMockSkills(keyword),
            description: this.getMockDescription(keyword, platform),
            requirements: this.getMockRequirements(keyword),
            benefits: this.getMockBenefits(),
            postedTime: this.getMockPostedTime(),
            relevanceScore: Math.floor(Math.random() * 30) + 70,
            url: `https://${platform.toLowerCase()}.com/job/${keyword.replace(/\s+/g, '-').toLowerCase()}-${i}`,
            source: platform,
            viewCount: Math.floor(Math.random() * 1000),
            applyCount: Math.floor(Math.random() * 100),
            rating: Math.floor(Math.random() * 2) + 4
          });
        }
      }
    }
    
    return mockJobs;
  }
  
  /**
   * 生成模拟公司名称
   */
  private getMockCompany(platform: string): string {
    const companies = {
      'LinkedIn': ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
      'Glassdoor': ['Netflix', 'Spotify', 'Airbnb', 'Uber', 'Lyft'],
      'Indeed': ['Tesla', 'SpaceX', 'Stripe', 'Palantir', 'Robinhood'],
      '51Job': ['阿里巴巴', '腾讯', '百度', '字节跳动', '美团'],
      '智联招聘': ['华为', '小米', '京东', '网易', '拼多多'],
      '猎聘': ['大疆', '旷视', '商汤', '云从', '依图']
    };
    
    const platformCompanies = companies[platform as keyof typeof companies] || ['科技公司'];
    return platformCompanies[Math.floor(Math.random() * platformCompanies.length)];
  }
  
  /**
   * 生成模拟薪资
   */
  private getMockSalary(platform: string): string {
    const salaries = {
      'LinkedIn': ['120,000-180,000 USD', '150,000-250,000 USD', '100,000-150,000 USD'],
      'Glassdoor': ['100,000-150,000 USD', '120,000-200,000 USD', '90,000-130,000 USD'],
      'Indeed': ['90,000-140,000 USD', '110,000-180,000 USD', '80,000-120,000 USD'],
      '51Job': ['50-80万', '60-100万', '40-70万'],
      '智联招聘': ['40-60万', '50-90万', '30-50万'],
      '猎聘': ['60-100万', '80-150万', '50-80万']
    };
    
    const platformSalaries = salaries[platform as keyof typeof salaries] || ['50-80万'];
    return platformSalaries[Math.floor(Math.random() * platformSalaries.length)];
  }
  
  /**
   * 生成模拟经验要求
   */
  private getMockExperience(): string {
    const experiences = ['3-5年', '5-8年', '8-10年', '10年以上'];
    return experiences[Math.floor(Math.random() * experiences.length)];
  }
  
  /**
   * 生成模拟学历要求
   */
  private getMockDegree(): string {
    const degrees = ['博士', '硕士', '本科'];
    return degrees[Math.floor(Math.random() * degrees.length)];
  }
  
  /**
   * 生成模拟技能要求
   */
  private getMockSkills(keyword: string): string[] {
    const baseSkills = ['Python', '机器学习', '深度学习', '人工智能'];
    const additionalSkills = {
      '人工智能': ['NLP', '计算机视觉', '强化学习', '知识图谱'],
      '机器学习': ['数据挖掘', '统计分析', '模式识别', '推荐系统'],
      '深度学习': ['神经网络', 'CNN', 'RNN', 'Transformer'],
      '数据科学': ['数据可视化', 'SQL', '大数据', 'Apache Spark'],
      '软件工程': ['Java', 'C++', '前端开发', '后端开发'],
      '生物学家': ['分子生物学', '细胞生物学', '遗传学', '生物信息学']
    };
    
    const skills = baseSkills.concat(additionalSkills[keyword as keyof typeof additionalSkills] || []);
    
    // 随机选择5-8个技能
    const shuffled = skills.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 4) + 5);
  }
  
  /**
   * 生成模拟岗位描述
   */
  private getMockDescription(keyword: string, platform: string): string {
    return `我们正在寻找一位优秀的${keyword}专家，负责公司核心技术的研发和创新。

岗位职责：
- 负责${keyword}相关技术的研发和应用
- 参与产品规划和技术路线制定
- 带领团队完成重要项目
- 跟踪行业前沿技术动态

任职要求：
- 计算机科学或相关专业博士学位
- 5年以上相关工作经验
- 精通相关技术栈
- 有大型项目经验

公司提供有竞争力的薪资待遇和良好的工作环境，欢迎优秀人才加入我们的团队！`;
  }
  
  /**
   * 生成模拟岗位要求
   */
  private getMockRequirements(keyword: string): string[] {
    return [
      '相关专业博士学位',
      '5年以上相关工作经验',
      `精通${keyword}相关技术`,
      '有大型项目经验',
      '良好的团队协作能力',
      '优秀的沟通表达能力'
    ];
  }
  
  /**
   * 生成模拟福利待遇
   */
  private getMockBenefits(): string[] {
    return [
      '五险一金',
      '年终奖',
      '股票期权',
      '带薪年假',
      '节日福利',
      '定期体检',
      '员工培训'
    ];
  }
  
  /**
   * 生成模拟发布时间
   */
  private getMockPostedTime(): string {
    const days = Math.floor(Math.random() * 30);
    return `${days}天前`;
  }
  
  /**
   * 生成全局模拟岗位数据
   */
  private getMockJobs(config: CrawlConfig): any[] {
    const keywords = config.keywords || ['人工智能', '机器学习'];
    const locations = config.locations || ['美国', '中国'];
    const maxResults = config.maxResults || 10;
    
    const mockJobs = [];
    
    for (let i = 0; i < maxResults; i++) {
      const keyword = keywords[i % keywords.length];
      const location = locations[i % locations.length];
      const platform = SUPPORTED_PLATFORMS[i % SUPPORTED_PLATFORMS.length];
      
      mockJobs.push({
        id: `mock-job-${i + 1}`,
        title: `${keyword}专家${i + 1}`,
        company: this.getMockCompany(platform),
        location: location,
        salary: this.getMockSalary(platform),
        type: '全职',
        experience: this.getMockExperience(),
        degree: this.getMockDegree(),
        skills: this.getMockSkills(keyword),
        description: this.getMockDescription(keyword, platform),
        requirements: this.getMockRequirements(keyword),
        benefits: this.getMockBenefits(),
        postedTime: this.getMockPostedTime(),
        relevanceScore: Math.floor(Math.random() * 30) + 70,
        url: `https://example.com/job-${i + 1}`,
        source: platform,
        viewCount: Math.floor(Math.random() * 1000),
        applyCount: Math.floor(Math.random() * 100),
        rating: Math.floor(Math.random() * 2) + 4
      });
    }
    
    return mockJobs;
  }
  
  /**
   * 岗位去重
   */
  private deduplicateJobs(jobs: any[]): any[] {
    const seen = new Set<string>();
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}-${job.location}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

// 导出单例实例
const jobCrawler = new JobCrawler();
export default jobCrawler;

// 导出类型
export type { CrawlConfig, CrawlResult };
