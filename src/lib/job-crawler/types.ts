// 爬虫相关类型定义

// 岗位接口
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  degree: string;
  skills: string[];
  description: string;
  postedTime: string;
  relevanceScore: number;
  url: string;
  source: string;
  viewCount: number;
  applyCount: number;
  rating: number;
  expireTime: number; // 岗位过期时间（毫秒时间戳）
  [key: string]: any; // 允许额外字段
}

// 抓取选项接口
export interface CrawlOptions {
  keywords?: string[];
  locations?: string[];
  jobTypes?: string[];
  experienceLevels?: string[];
  degreeLevels?: string[];
  maxResults?: number;
  minRating?: number;
  maxDuration?: number; // 最大抓取时长（毫秒）
  userProfile?: any; // 用户简历信息，用于精准匹配
  platforms?: string[]; // 招聘平台列表
  corporations?: string[]; // 企业官网列表
  universities?: string[]; // 大学官网列表
  includeRemote?: boolean; // 是否包含远程工作
  salaryRange?: {
    min?: number;
    max?: number;
  };
  proxyConfig?: ProxyConfig; // 代理配置
  crawlDepth?: number; // 抓取深度
}

// 代理配置接口
export interface ProxyConfig {
  enabled: boolean;
  type?: 'http' | 'https' | 'socks5';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  rotationInterval?: number; // 代理轮换间隔（毫秒）
}

// 平台抓取配置接口
export interface PlatformConfig {
  name: string;
  baseUrl: string;
  searchPath: string;
  paginationPath: string;
  jobDetailPath: string;
  searchParams: Record<string, string>;
  paginationParams: Record<string, string>;
  selectors: Record<string, string>;
  enabled: boolean;
  concurrency: number;
  delay: number;
  usePuppeteer: boolean;
}

// 企业官网配置接口
export interface CorporateConfig {
  id: string;
  name: string;
  baseUrl: string;
  careerPath: string;
  jobListPath: string;
  jobDetailPath: string;
  selectors: {
    jobList: string;
    jobTitle: string;
    location: string;
    department: string;
    jobType: string;
    postedDate: string;
    jobDetail: string;
    requirements: string;
    benefits: string;
  };
  pagination: {
    enabled: boolean;
    nextPageSelector: string;
    maxPages: number;
  };
  enabled: boolean;
  delay: number;
  usePuppeteer: boolean;
}

// 大学官网配置接口
export interface UniversityConfig {
  id: string;
  name: string;
  baseUrl: string;
  careerPath: string;
  jobListPath: string;
  jobDetailPath: string;
  selectors: {
    jobList: string;
    jobTitle: string;
    department: string;
    positionType: string;
    location: string;
    deadline: string;
    jobDetail: string;
    requirements: string;
    qualifications: string;
  };
  pagination: {
    enabled: boolean;
    nextPageSelector: string;
    maxPages: number;
  };
  enabled: boolean;
  delay: number;
  usePuppeteer: boolean;
}

// 抓取任务接口
export interface CrawlTask {
  id: string;
  options: CrawlOptions;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: number;
  endTime?: number;
  results?: Job[];
  error?: string;
}

// 抓取结果接口
export interface CrawlResult {
  success: boolean;
  jobs: Job[];
  totalCount: number;
  filteredCount: number;
  duration: number;
  errors: string[];
  platformStats: Record<string, PlatformStats>;
  corporateStats?: Record<string, CorporateStats>;
  universityStats?: Record<string, UniversityStats>;
}

// 企业统计接口
export interface CorporateStats {
  corporation: string;
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  duration: number;
  errors: string[];
}

// 大学统计接口
export interface UniversityStats {
  university: string;
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  duration: number;
  errors: string[];
}

// 平台统计接口
export interface PlatformStats {
  platform: string;
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  duration: number;
  errors: string[];
}

// 反爬虫配置接口
export interface AntiCrawlerConfig {
  enabled: boolean;
  userAgents: string[];
  requestDelay: {
    min: number;
    max: number;
  };
  rotateUserAgent: boolean;
  useProxy: boolean;
  retryAttempts: number;
  retryDelay: number;
}

// AI配置接口
export interface AIConfig {
  enabled: boolean;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  useAIForExtraction: boolean;
  useAIForAnalysis: boolean;
}

// 存储配置接口
export interface StorageConfig {
  type: 'localStorage' | 'mongodb' | 'firebase';
  connectionString?: string;
  collectionName?: string;
  cacheEnabled: boolean;
  cacheDuration: number;
}

// 爬虫配置接口
export interface CrawlerConfig {
  platforms: PlatformConfig[];
  corporations: CorporateConfig[];
  universities: UniversityConfig[];
  antiCrawler: AntiCrawlerConfig;
  ai: AIConfig;
  storage: StorageConfig;
  concurrency: number;
  timeout: number;
  maxRetries: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// 企业官网抓取结果
export interface CorporateCrawlResult {
  jobs: Job[];
  errors: string[];
  duration: number;
}

// 大学官网抓取结果
export interface UniversityCrawlResult {
  jobs: Job[];
  errors: string[];
  duration: number;
}

// 爬虫状态接口
export interface CrawlerStatus {
  isRunning: boolean;
  activeTasks: number;
  completedTasks: number;
  failedTasks: number;
  totalJobsCrawled: number;
  uptime: number;
  memoryUsage: number;
}
