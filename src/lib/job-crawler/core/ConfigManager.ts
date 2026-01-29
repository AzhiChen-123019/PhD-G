// 配置管理模块
import { CrawlerConfig, PlatformConfig, AntiCrawlerConfig, AIConfig, StorageConfig, CorporateConfig, UniversityConfig } from '../types';

class ConfigManager {
  private config: CrawlerConfig;
  private static instance: ConfigManager;

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 获取默认配置
   */
  private getDefaultConfig(): CrawlerConfig {
    return {
      platforms: this.getDefaultPlatforms(),
      corporations: this.getDefaultCorporations(),
      universities: this.getDefaultUniversities(),
      antiCrawler: this.getDefaultAntiCrawlerConfig(),
      ai: this.getDefaultAIConfig(),
      storage: this.getDefaultStorageConfig(),
      concurrency: 3,
      timeout: 30000,
      maxRetries: 3,
      logLevel: 'info'
    };
  }

  /**
   * 获取默认平台配置
   */
  private getDefaultPlatforms(): PlatformConfig[] {
    return [
      {
        name: '51Job',
        baseUrl: 'https://search.51job.com',
        searchPath: '/list/000000,000000,0000,00,9,99,{keywords},2,1.html',
        paginationPath: '/list/000000,000000,0000,00,9,99,{keywords},2,{page}.html',
        jobDetailPath: '/{jobId}.html',
        searchParams: {
          lang: 'c',
          postchannel: '0000',
          workyear: '99',
          cotype: '99',
          degreefrom: '99',
          jobterm: '99',
          companysize: '99',
          providesalary: '99',
         lonlat: '0,0',
          radius: '-1',
          ord_field: '0',
          confirmdate: '9',
          fromType: '',
          needAddtionalResult: '0'
        },
        paginationParams: {},
        selectors: {
          jobList: '.j_joblist > div',
          jobTitle: '.jname.at > a',
          companyName: '.cname.at > a',
          location: '.location.at',
          salary: '.sal.at',
          jobInfo: '.info > .at',
          jobDetail: '.bmsg.job_msg.inbox',
          skills: '.t1 > span',
          postedTime: '.time'
        },
        enabled: true,
        concurrency: 2,
        delay: 2000,
        usePuppeteer: false
      },
      {
        name: '智联招聘',
        baseUrl: 'https://sou.zhaopin.com',
        searchPath: '/jobs/searchresult.ashx',
        paginationPath: '/jobs/searchresult.ashx',
        jobDetailPath: '/jobs/{jobId}.htm',
        searchParams: {
         jl: '北京',
         kw: '{keywords}',
          sm: '0',
          p: '1'
        },
        paginationParams: {
          p: '{page}'
        },
        selectors: {
          jobList: '.newlist_list_content > table > tbody > tr[class^="newlist"]',
          jobTitle: '.zwmc > div > a',
          companyName: '.gsmc > a',
          location: '.gzdd',
          salary: '.zwyx',
          jobInfo: '.newlist_deatil_two',
          jobDetail: '.pos-ul',
          skills: '.tags',
          postedTime: '.gxsj'
        },
        enabled: true,
        concurrency: 2,
        delay: 2000,
        usePuppeteer: false
      },
      {
        name: '猎聘',
        baseUrl: 'https://www.liepin.com',
        searchPath: '/zhaopin/',
        paginationPath: '/zhaopin/p{page}/',
        jobDetailPath: '/job/{jobId}.shtml',
        searchParams: {
          key: '{keywords}',
          dqs: '{location}'
        },
        paginationParams: {},
        selectors: {
          jobList: '.job-list > li',
          jobTitle: '.job-info h3 a',
          companyName: '.company-name a',
          location: '.job-location',
          salary: '.job-salary',
          jobInfo: '.job-label',
          jobDetail: '.job-description',
          skills: '.skill-tag',
          postedTime: '.time-info'
        },
        enabled: true,
        concurrency: 2,
        delay: 2000,
        usePuppeteer: false
      },
      {
        name: 'BOSS直聘',
        baseUrl: 'https://www.zhipin.com',
        searchPath: '/web/geek/job',
        paginationPath: '/web/geek/job',
        jobDetailPath: '/web/geek/jobdetail/{jobId}',
        searchParams: {
          query: '{keywords}',
          city: '101010100' // 默认北京，可根据需要修改
        },
        paginationParams: {
          page: '{page}'
        },
        selectors: {
          jobList: '.job-card-wrapper',
          jobTitle: '.job-name',
          companyName: '.company-name',
          location: '.job-area',
          salary: '.salary',
          jobInfo: '.job-tag',
          jobDetail: '.job-detail-content',
          skills: '.skill-tag',
          postedTime: '.job-pub-time'
        },
        enabled: true,
        concurrency: 2,
        delay: 2000,
        usePuppeteer: false
      },
      {
        name: 'LinkedIn',
        baseUrl: 'https://www.linkedin.com',
        searchPath: '/jobs/search/',
        paginationPath: '/jobs/search/',
        jobDetailPath: '/jobs/view/{jobId}/',
        searchParams: {
          keywords: '{keywords}',
          location: '{location}',
          pageNum: '0'
        },
        paginationParams: {
          pageNum: '{page}'
        },
        selectors: {
          jobList: '.jobs-search__results-list > li',
          jobTitle: '.job-card-list__title',
          companyName: '.job-card-container__company-name',
          location: '.job-card-container__metadata-item',
          salary: '.job-card-container__salary-info',
          jobInfo: '.job-card-container__metadata-item',
          jobDetail: '.description__text',
          skills: '.skills__list-item',
          postedTime: '.job-card-container__listed-time'
        },
        enabled: false, // 需要登录，默认禁用
        concurrency: 1,
        delay: 3000,
        usePuppeteer: true
      },
      {
        name: 'Glassdoor',
        baseUrl: 'https://www.glassdoor.com',
        searchPath: '/Job/jobs.htm',
        paginationPath: '/Job/jobs.htm',
        jobDetailPath: '/job-listing/{jobId}.htm',
        searchParams: {
          keyword: '{keywords}',
          location: '{location}',
          pn: '1'
        },
        paginationParams: {
          pn: '{page}'
        },
        selectors: {
          jobList: '.react-job-listing',
          jobTitle: '.jobLink',
          companyName: '.companyName',
          location: '.location',
          salary: '.salaryEstimate',
          jobInfo: '.jobInfoItem',
          jobDetail: '.jobDescriptionContent',
          skills: '.skillBadge',
          postedTime: '.job-age'
        },
        enabled: false, // 需要反爬措施，默认禁用
        concurrency: 1,
        delay: 4000,
        usePuppeteer: true
      },
      {
        name: 'Indeed',
        baseUrl: 'https://www.indeed.com',
        searchPath: '/jobs',
        paginationPath: '/jobs',
        jobDetailPath: '/viewjob',
        searchParams: {
          q: '{keywords}',
          l: '{location}',
          start: '0'
        },
        paginationParams: {
          start: '{page}'
        },
        selectors: {
          jobList: '.jobsearch-ResultsList > li',
          jobTitle: '.jobTitle > a',
          companyName: '.companyName',
          location: '.companyLocation',
          salary: '.salary-snippet',
          jobInfo: '.jobMetaData',
          jobDetail: '.jobsearch-jobDescriptionText',
          skills: '.jobsearch-skills-list-item',
          postedTime: '.date'
        },
        enabled: false, // 需要反爬措施，默认禁用
        concurrency: 1,
        delay: 3000,
        usePuppeteer: true
      }
    ];
  }

  /**
   * 获取默认企业官网配置
   */
  private getDefaultCorporations(): CorporateConfig[] {
    return [
      {
        id: 'tencent',
        name: '腾讯',
        baseUrl: 'https://careers.tencent.com',
        careerPath: '/search.html',
        jobListPath: '/search.html',
        jobDetailPath: '/jobdesc.html',
        selectors: {
          jobList: '.recruit-list > li',
          jobTitle: '.recruit-title',
          location: '.recruit-location',
          department: '.recruit-department',
          jobType: '.recruit-type',
          postedDate: '.recruit-date',
          jobDetail: '.job-detail',
          requirements: '.job-requirement',
          benefits: '.job-benefit'
        },
        pagination: {
          enabled: true,
          nextPageSelector: '.pagination-next',
          maxPages: 5
        },
        enabled: true,
        delay: 2000,
        usePuppeteer: false
      },
      {
        id: 'alibaba',
        name: '阿里巴巴',
        baseUrl: 'https://talent.alibaba.com',
        careerPath: '/jobs',
        jobListPath: '/jobs',
        jobDetailPath: '/job/{jobId}',
        selectors: {
          jobList: '.job-list .job-item',
          jobTitle: '.job-title',
          location: '.job-location',
          department: '.job-department',
          jobType: '.job-type',
          postedDate: '.job-date',
          jobDetail: '.job-description',
          requirements: '.job-requirements',
          benefits: '.job-benefits'
        },
        pagination: {
          enabled: true,
          nextPageSelector: '.page-next',
          maxPages: 5
        },
        enabled: true,
        delay: 2000,
        usePuppeteer: false
      },
      {
        id: 'baidu',
        name: '百度',
        baseUrl: 'https://talent.baidu.com',
        careerPath: '/jobs',
        jobListPath: '/jobs',
        jobDetailPath: '/job/{jobId}',
        selectors: {
          jobList: '.job-list > .job-item',
          jobTitle: '.job-title',
          location: '.job-location',
          department: '.job-department',
          jobType: '.job-type',
          postedDate: '.job-date',
          jobDetail: '.job-detail',
          requirements: '.job-requirements',
          benefits: '.job-benefits'
        },
        pagination: {
          enabled: true,
          nextPageSelector: '.pagination .next',
          maxPages: 5
        },
        enabled: true,
        delay: 2000,
        usePuppeteer: false
      }
    ];
  }

  /**
   * 获取默认大学官网配置
   */
  private getDefaultUniversities(): UniversityConfig[] {
    return [
      {
        id: 'pku',
        name: '北京大学',
        baseUrl: 'https://www.pku.edu.cn',
        careerPath: '/employment',
        jobListPath: '/employment',
        jobDetailPath: '/employment/detail/{jobId}',
        selectors: {
          jobList: '.career-list > .career-item',
          jobTitle: '.career-title',
          department: '.career-department',
          positionType: '.career-position',
          location: '.career-location',
          deadline: '.career-deadline',
          jobDetail: '.career-detail',
          requirements: '.career-requirements',
          qualifications: '.career-qualifications'
        },
        pagination: {
          enabled: true,
          nextPageSelector: '.pagination .next',
          maxPages: 5
        },
        enabled: true,
        delay: 2000,
        usePuppeteer: false
      },
      {
        id: 'tsinghua',
        name: '清华大学',
        baseUrl: 'https://www.tsinghua.edu.cn',
        careerPath: '/employment',
        jobListPath: '/employment',
        jobDetailPath: '/employment/job/{jobId}',
        selectors: {
          jobList: '.job-list > .job-item',
          jobTitle: '.job-title',
          department: '.job-department',
          positionType: '.job-type',
          location: '.job-location',
          deadline: '.job-deadline',
          jobDetail: '.job-content',
          requirements: '.job-requirements',
          qualifications: '.job-qualifications'
        },
        pagination: {
          enabled: true,
          nextPageSelector: '.page-nav .next',
          maxPages: 5
        },
        enabled: true,
        delay: 2000,
        usePuppeteer: false
      },
      {
        id: 'fudan',
        name: '复旦大学',
        baseUrl: 'https://www.fudan.edu.cn',
        careerPath: '/en/employment',
        jobListPath: '/en/employment',
        jobDetailPath: '/en/employment/{jobId}',
        selectors: {
          jobList: '.employment-list > .employment-item',
          jobTitle: '.employment-title',
          department: '.employment-department',
          positionType: '.employment-position',
          location: '.employment-location',
          deadline: '.employment-deadline',
          jobDetail: '.employment-detail',
          requirements: '.employment-requirements',
          qualifications: '.employment-qualifications'
        },
        pagination: {
          enabled: true,
          nextPageSelector: '.pagination .next-page',
          maxPages: 5
        },
        enabled: true,
        delay: 2000,
        usePuppeteer: false
      }
    ];
  }

  /**
   * 获取默认反爬虫配置
   */
  private getDefaultAntiCrawlerConfig(): AntiCrawlerConfig {
    return {
      enabled: true,
      userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ],
      requestDelay: {
        min: 1000,
        max: 3000
      },
      rotateUserAgent: true,
      useProxy: false,
      retryAttempts: 3,
      retryDelay: 2000
    };
  }

  /**
   * 获取默认AI配置
   */
  private getDefaultAIConfig(): AIConfig {
    return {
      enabled: false,
      apiKey: '',
      model: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 1000,
      useAIForExtraction: false,
      useAIForAnalysis: false
    };
  }

  /**
   * 获取默认存储配置
   */
  private getDefaultStorageConfig(): StorageConfig {
    return {
      type: 'localStorage',
      cacheEnabled: true,
      cacheDuration: 24 * 60 * 60 * 1000 // 24小时
    };
  }

  /**
   * 获取配置
   */
  getConfig(): CrawlerConfig {
    return this.config;
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<CrawlerConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      platforms: newConfig.platforms || this.config.platforms,
      antiCrawler: newConfig.antiCrawler || this.config.antiCrawler,
      ai: newConfig.ai || this.config.ai,
      storage: newConfig.storage || this.config.storage
    };
  }

  /**
   * 获取平台配置
   */
  getPlatformConfig(platformName: string): PlatformConfig | undefined {
    return this.config.platforms.find(p => p.name === platformName);
  }

  /**
   * 更新平台配置
   */
  updatePlatformConfig(platformName: string, config: Partial<PlatformConfig>): void {
    const index = this.config.platforms.findIndex(p => p.name === platformName);
    if (index !== -1) {
      this.config.platforms[index] = {
        ...this.config.platforms[index],
        ...config
      };
    }
  }

  /**
   * 启用/禁用平台
   */
  togglePlatform(platformName: string, enabled: boolean): void {
    const platform = this.getPlatformConfig(platformName);
    if (platform) {
      platform.enabled = enabled;
    }
  }

  /**
   * 获取启用的平台
   */
  getEnabledPlatforms(): PlatformConfig[] {
    return this.config.platforms.filter(p => p.enabled);
  }

  /**
   * 获取企业配置
   */
  getCorporateConfig(corporateId: string): CorporateConfig | undefined {
    return this.config.corporations.find(c => c.id === corporateId);
  }

  /**
   * 获取所有企业配置
   */
  getCorporateConfigs(): CorporateConfig[] {
    return this.config.corporations;
  }

  /**
   * 更新企业配置
   */
  updateCorporateConfig(corporateId: string, config: Partial<CorporateConfig>): void {
    const index = this.config.corporations.findIndex(c => c.id === corporateId);
    if (index !== -1) {
      this.config.corporations[index] = {
        ...this.config.corporations[index],
        ...config
      };
    }
  }

  /**
   * 添加企业配置
   */
  addCorporateConfig(config: CorporateConfig): void {
    this.config.corporations.push(config);
  }

  /**
   * 启用/禁用企业
   */
  toggleCorporate(corporateId: string, enabled: boolean): void {
    const corporate = this.getCorporateConfig(corporateId);
    if (corporate) {
      corporate.enabled = enabled;
    }
  }

  /**
   * 获取启用的企业
   */
  getEnabledCorporations(): CorporateConfig[] {
    return this.config.corporations.filter(c => c.enabled);
  }

  /**
   * 获取大学配置
   */
  getUniversityConfig(universityId: string): UniversityConfig | undefined {
    return this.config.universities.find(u => u.id === universityId);
  }

  /**
   * 获取所有大学配置
   */
  getUniversityConfigs(): UniversityConfig[] {
    return this.config.universities;
  }

  /**
   * 更新大学配置
   */
  updateUniversityConfig(universityId: string, config: Partial<UniversityConfig>): void {
    const index = this.config.universities.findIndex(u => u.id === universityId);
    if (index !== -1) {
      this.config.universities[index] = {
        ...this.config.universities[index],
        ...config
      };
    }
  }

  /**
   * 添加大学配置
   */
  addUniversityConfig(config: UniversityConfig): void {
    this.config.universities.push(config);
  }

  /**
   * 启用/禁用大学
   */
  toggleUniversity(universityId: string, enabled: boolean): void {
    const university = this.getUniversityConfig(universityId);
    if (university) {
      university.enabled = enabled;
    }
  }

  /**
   * 获取启用的大学
   */
  getEnabledUniversities(): UniversityConfig[] {
    return this.config.universities.filter(u => u.enabled);
  }

  /**
   * 保存配置到本地存储
   */
  saveConfig(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('crawlerConfig', JSON.stringify(this.config));
      } catch (error) {
        console.error('Failed to save config:', error);
      }
    }
  }

  /**
   * 从本地存储加载配置
   */
  loadConfig(): void {
    if (typeof window !== 'undefined') {
      try {
        const savedConfig = localStorage.getItem('crawlerConfig');
        if (savedConfig) {
          this.config = JSON.parse(savedConfig);
        }
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    }
  }
}

export default ConfigManager.getInstance();
