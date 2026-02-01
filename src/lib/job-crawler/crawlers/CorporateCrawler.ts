import axios from 'axios';
import cheerio from 'cheerio';
import { Job, CorporateConfig, CorporateCrawlResult } from '../types';
import ErrorHandler from '../core/ErrorHandler';

class CorporateCrawler {
  private config: CorporateConfig;
  private errorHandler: ErrorHandler;

  constructor(config: CorporateConfig) {
    this.config = config;
    this.errorHandler = new ErrorHandler();
  }

  /**
   * 抓取企业官网岗位
   * @returns 抓取结果
   */
  async crawl(): Promise<CorporateCrawlResult> {
    const startTime = Date.now();
    const jobs: Job[] = [];
    const errors: string[] = [];

    try {
      console.log(`开始抓取企业官网: ${this.config.name}`);

      // 构建岗位列表页URL
      const jobListUrl = `${this.config.baseUrl}${this.config.jobListPath}`;
      console.log(`访问岗位列表页: ${jobListUrl}`);

      // 获取岗位列表页
      const listPageResponse = await this.fetchPage(jobListUrl);
      const $ = cheerio.load(listPageResponse.data);

      // 解析岗位列表
      const jobElements = $(this.config.selectors.jobList);
      console.log(`找到 ${jobElements.length} 个岗位`);

      // 解析每个岗位
      for (let i = 0; i < jobElements.length; i++) {
        try {
          const jobElement = jobElements.eq(i);
          const job = await this.parseJob(jobElement);
          if (job) {
            jobs.push(job);
          }
        } catch (error) {
          this.errorHandler.handleError(
            error, 
            `解析 ${this.config.name} 岗位 ${i + 1}`,
            false
          );
          errors.push(`解析 ${this.config.name} 岗位 ${i + 1} 失败`);
        }
      }

      // 处理分页
      if (this.config.pagination.enabled) {
        let currentPage = 1;
        let hasNextPage = true;

        while (hasNextPage && currentPage < this.config.pagination.maxPages) {
          try {
            const nextPageElement = $(this.config.pagination.nextPageSelector);
            if (nextPageElement.length > 0) {
              const nextPageUrl = nextPageElement.attr('href');
              if (nextPageUrl) {
                const absoluteNextPageUrl = this.makeUrlAbsolute(nextPageUrl);
                console.log(`访问下一页: ${absoluteNextPageUrl}`);

                const nextPageResponse = await this.fetchPage(absoluteNextPageUrl);
                const nextPage$ = cheerio.load(nextPageResponse.data);
                const nextPageJobElements = nextPage$(this.config.selectors.jobList);

                if (nextPageJobElements.length === 0) {
                  hasNextPage = false;
                  break;
                }

                // 解析下一页的岗位
                for (let i = 0; i < nextPageJobElements.length; i++) {
                  try {
                    const jobElement = nextPageJobElements.eq(i);
                    const job = await this.parseJob(jobElement, absoluteNextPageUrl);
                    if (job) {
                      jobs.push(job);
                    }
                  } catch (error) {
                  this.errorHandler.handleError(
                    error, 
                    `解析 ${this.config.name} 下一页岗位 ${i + 1}`,
                    false
                  );
                  errors.push(`解析 ${this.config.name} 下一页岗位 ${i + 1} 失败`);
                }
                }

                currentPage++;
                // 添加延迟，避免请求过快
                await new Promise(resolve => setTimeout(resolve, this.config.delay));
              } else {
                hasNextPage = false;
              }
            } else {
              hasNextPage = false;
            }
          } catch (error) {
            this.errorHandler.handleError(
              error, 
              `处理 ${this.config.name} 分页`,
              false
            );
            errors.push(`处理 ${this.config.name} 分页失败`);
            hasNextPage = false;
          }
        }
      }

      console.log(`企业官网 ${this.config.name} 抓取完成，获取 ${jobs.length} 个岗位`);
    } catch (error) {
      this.errorHandler.handleError(
        error, 
        `抓取企业官网 ${this.config.name}`,
        false
      );
      errors.push(`抓取企业官网 ${this.config.name} 失败`);
    }

    const duration = Date.now() - startTime;
    return {
      jobs,
      errors,
      duration
    };
  }

  /**
   * 解析单个岗位
   * @param jobElement 岗位元素
   * @param baseUrl 基础URL
   * @returns 解析后的岗位
   */
  private async parseJob(jobElement: any, baseUrl: string = this.config.baseUrl): Promise<Job | null> {
    try {
      // 提取岗位标题
      const title = jobElement.find(this.config.selectors.jobTitle).text().trim();
      if (!title) {
        return null;
      }

      // 提取岗位链接
      let jobUrl = '';
      const titleElement = jobElement.find(this.config.selectors.jobTitle);
      if (titleElement.length > 0) {
        jobUrl = titleElement.attr('href') || '';
      }
      const absoluteJobUrl = this.makeUrlAbsolute(jobUrl, baseUrl);

      // 提取其他字段
      const location = jobElement.find(this.config.selectors.location).text().trim();
      const department = jobElement.find(this.config.selectors.department).text().trim();
      const jobType = jobElement.find(this.config.selectors.jobType).text().trim();
      const postedDate = jobElement.find(this.config.selectors.postedDate).text().trim();

      // 获取岗位详情
      let description = '';
      let requirements = '';
      let benefits = '';

      if (absoluteJobUrl) {
        try {
          const detailResponse = await this.fetchPage(absoluteJobUrl);
          const detail$ = cheerio.load(detailResponse.data);
          
          description = detail$(this.config.selectors.jobDetail).text().trim();
          requirements = detail$(this.config.selectors.requirements).text().trim();
          benefits = detail$(this.config.selectors.benefits).text().trim();

          // 添加延迟，避免请求过快
          await new Promise(resolve => setTimeout(resolve, this.config.delay / 2));
        } catch (error) {
          this.errorHandler.handleError(
            error, 
            `获取 ${this.config.name} 岗位详情: ${title}`,
            false
          );
        }
      }

      // 构建岗位对象
      return {
        id: `corporate-${this.config.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        company: this.config.name,
        location,
        salary: '', // 企业官网通常不直接显示薪资
        type: jobType || '全职',
        experience: '', // 从描述中提取
        degree: '', // 从描述中提取
        skills: this.extractSkills(description + requirements),
        description: description + '\n\n' + requirements + '\n\n' + benefits,
        postedTime: postedDate || new Date().toISOString(),
        relevanceScore: 80, // 默认相关度评分
        url: absoluteJobUrl,
        source: `企业官网 - ${this.config.name}`,
        viewCount: 0,
        applyCount: 0,
        rating: 4.5, // 默认评分
        expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天后过期
        department
      };
    } catch (error) {
      this.errorHandler.handleError(
        error, 
        `解析 ${this.config.name} 岗位`,
        false
      );
      return null;
    }
  }

  /**
   * 从文本中提取技能
   * @param text 文本内容
   * @returns 技能数组
   */
  private extractSkills(text: string): string[] {
    const skills: string[] = [];
    const skillPatterns = [
      /\b(Python|Java|JavaScript|C\+\+|C#|Go|PHP|Ruby)\b/gi,
      /\b(React|Vue|Angular|Node\.js|Spring|Django|Flask|Express)\b/gi,
      /\b(AWS|Azure|GCP|Docker|Kubernetes|Git)\b/gi,
      /\b(MySQL|PostgreSQL|MongoDB|Redis|Elasticsearch)\b/gi,
      /\b(机器学习|深度学习|人工智能|大数据|数据挖掘|自然语言处理|计算机视觉)\b/gi
    ];

    for (const pattern of skillPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const skill = match.toLowerCase();
          if (!skills.includes(skill)) {
            skills.push(skill);
          }
        });
      }
    }

    return skills;
  }

  /**
   * 构建绝对URL
   * @param url 相对或绝对URL
   * @param baseUrl 基础URL
   * @returns 绝对URL
   */
  private makeUrlAbsolute(url: string, baseUrl: string = this.config.baseUrl): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return baseUrl.replace(/\/$/, '') + url;
    }
    return baseUrl.replace(/\/$/, '') + '/' + url;
  }

  /**
   * 获取页面内容
   * @param url 页面URL
   * @returns 响应
   */
  private async fetchPage(url: string) {
    return axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      timeout: 30000
    });
  }
}

export default CorporateCrawler;