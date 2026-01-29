// 岗位抓取服务

import { Job, JobCategory, EnterpriseJobSubType, JobLibraryType, JobStatus } from './job-model';

export interface ScrapeOptions {
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
  includeRemote?: boolean; // 是否包含远程工作
  salaryRange?: {
    min?: number;
    max?: number;
  };
}

// 持久化存储键
const PERSISTENT_JOBS_KEY = 'persistent_jobs';

// 岗位展示期（毫秒）
const JOB_DISPLAY_DURATION = 30 * 24 * 60 * 60 * 1000; // 30天

// 读取持久化存储的岗位
export const getPersistentJobs = (): Job[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const jobsStr = localStorage.getItem(PERSISTENT_JOBS_KEY);
    if (jobsStr) {
      return JSON.parse(jobsStr) as Job[];
    }
  } catch (error) {
    console.error('读取持久化岗位失败:', error);
  }
  
  return [];
};

// 写入持久化存储的岗位
export const setPersistentJobs = (jobs: Job[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PERSISTENT_JOBS_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('写入持久化岗位失败:', error);
  }
};

// 清理过期岗位
export const cleanupExpiredJobs = (): Job[] => {
  const allJobs = getPersistentJobs();
  const now = Date.now();
  
  // 过滤出未过期的岗位
  const activeJobs = allJobs.filter(job => job.expireTime !== undefined && job.expireTime > now);
  
  // 如果有过期岗位，更新存储
  if (activeJobs.length !== allJobs.length) {
    setPersistentJobs(activeJobs);
    console.log(`清理了 ${allJobs.length - activeJobs.length} 个过期岗位`);
  }
  
  return activeJobs;
};

// 添加岗位到持久化存储
export const addJobsToPersistentStorage = (newJobs: Job[]): Job[] => {
  // 先清理过期岗位
  const activeJobs = cleanupExpiredJobs();
  const now = Date.now();
  
  // 为新岗位设置过期时间
  const jobsWithExpireTime = newJobs.map(job => ({
    ...job,
    expireTime: now + JOB_DISPLAY_DURATION
  }));
  
  // 创建一个Map用于去重，基于id和url
  const jobMap = new Map<string, Job>();
  
  // 先添加现有岗位
  activeJobs.forEach(job => {
    const key = `${job.id}-${job.url}`;
    jobMap.set(key, job);
  });
  
  // 添加新岗位，覆盖现有岗位
  jobsWithExpireTime.forEach(job => {
    const key = `${job.id}-${job.url}`;
    jobMap.set(key, job);
  });
  
  // 转换回数组并保存
  const updatedJobs = Array.from(jobMap.values());
  setPersistentJobs(updatedJobs);
  
  return updatedJobs;
};

// 生成缓存键（用于短期缓存，避免频繁抓取）
const generateCacheKey = (options: ScrapeOptions): string => {
  const { keywords = [], degreeLevels = [] } = options;
  const key = [...keywords, ...degreeLevels].sort().join('_');
  return `job_scrape_short_cache_${key}`;
};

// 短期缓存有效期（分钟）
const SHORT_CACHE_DURATION = 30;

// 检查是否可以抓取新岗位（避免频繁抓取）
const canScrapeNewJobs = (cacheKey: string): boolean => {
  if (typeof window === 'undefined') return true;
  
  try {
    const lastScrapeTimeStr = localStorage.getItem(cacheKey);
    if (lastScrapeTimeStr) {
      const lastScrapeTime = parseInt(lastScrapeTimeStr, 10);
      const now = Date.now();
      const timeSinceLastScrape = (now - lastScrapeTime) / (1000 * 60);
      
      return timeSinceLastScrape >= SHORT_CACHE_DURATION;
    }
  } catch (error) {
    console.error('检查抓取时间失败:', error);
  }
  
  return true;
};

// 更新最后抓取时间
const updateLastScrapeTime = (cacheKey: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(cacheKey, Date.now().toString());
  } catch (error) {
    console.error('更新抓取时间失败:', error);
  }
};

/**
 * 从多平台抓取岗位信息
 * 支持LinkedIn、Glassdoor、Indeed、51Job等多个招聘平台
 * @param options 抓取选项
 * @returns 抓取的岗位列表
 */
export const scrapeJobs = async (options: ScrapeOptions = {}): Promise<Job[]> => {
  // 生成短期缓存键（避免频繁抓取）
  const cacheKey = generateCacheKey(options);
  
  // 检查是否可以抓取新岗位
  const canScrape = canScrapeNewJobs(cacheKey);
  
  if (canScrape) {
    console.log('开始抓取新岗位');
    
    // 设置抓取开始时间
    const startTime = Date.now();
    
    // 获取最长抓取时长（默认10秒）
    const maxDuration = options.maxDuration || 10000;
    
    try {
      // 模拟网络请求延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 多平台岗位数据
      const platforms = options.platforms || ['LinkedIn', 'Glassdoor', 'Indeed', '51Job', '智联招聘', '猎聘'];
      const allJobs: Partial<Job>[] = [];

      // 1. LinkedIn岗位
      if (platforms.includes('LinkedIn')) {
        allJobs.push(...[
          {
            id: `linkedin-${Date.now()}-1`,
            title: '人工智能研究员',
            company: '科技公司A',
            location: '北京',
            salary: '年薪50-70万',
            type: '全职',
            experience: '3-5年',
            degree: '博士',
            skills: ['Python', '机器学习', '深度学习', 'NLP', '计算机视觉'],
            description: '负责公司核心AI技术研发，包括模型训练和优化，参与多个核心项目，推动AI技术在产品中的应用。',
            postedTime: '2小时前',
            relevanceScore: 95,
            url: 'https://linkedin.com/job/1',
            source: 'LinkedIn',
            viewCount: 120,
            applyCount: 25,
            rating: 4.5
          },
          {
            id: `linkedin-${Date.now()}-2`,
            title: '算法研究员',
            company: '互联网公司Z',
            location: '杭州',
            salary: '年薪60-80万',
            type: '全职',
            experience: '5-8年',
            degree: '博士',
            skills: ['Python', '算法设计', '机器学习', '分布式系统', '大数据'],
            description: '负责核心算法的研发和优化，解决复杂的技术问题，推动业务发展。',
            postedTime: '1小时前',
            relevanceScore: 98,
            url: 'https://linkedin.com/job/3',
            source: 'LinkedIn',
            viewCount: 150,
            applyCount: 30,
            rating: 4.8
          }
        ]);
      }

      // 2. Glassdoor岗位
      if (platforms.includes('Glassdoor')) {
        allJobs.push(...[
          {
            id: `glassdoor-${Date.now()}-1`,
            title: '数据科学家',
            company: '金融科技公司B',
            location: '上海',
            salary: '年薪40-60万',
            type: '全职',
            experience: '2-4年',
            degree: '硕士及以上',
            skills: ['Python', '统计分析', '数据可视化', 'SQL', '机器学习'],
            description: '负责数据分析和建模，为业务决策提供支持，参与产品优化和业务创新。',
            postedTime: '5小时前',
            relevanceScore: 88,
            url: 'https://glassdoor.com/job/2',
            source: 'Glassdoor',
            viewCount: 95,
            applyCount: 18,
            rating: 4.2
          },
          {
            id: `glassdoor-${Date.now()}-2`,
            title: '自然语言处理工程师',
            company: '互联网公司F',
            location: '上海',
            salary: '年薪50-70万',
            type: '全职',
            experience: '3-5年',
            degree: '硕士及以上',
            skills: ['Python', 'NLP', '深度学习', 'transformers', '文本分析'],
            description: '负责自然语言处理算法的研发和应用，参与智能客服、文本分析等产品的开发。',
            postedTime: '1天前',
            relevanceScore: 88,
            url: 'https://glassdoor.com/job/1',
            source: 'Glassdoor',
            viewCount: 100,
            applyCount: 20,
            rating: 4.2
          }
        ]);
      }

      // 3. Indeed岗位
      if (platforms.includes('Indeed')) {
        allJobs.push(...[
          {
            id: `indeed-${Date.now()}-1`,
            title: '机器学习工程师',
            company: '人工智能公司D',
            location: '杭州',
            salary: '年薪55-75万',
            type: '全职',
            experience: '3-5年',
            degree: '硕士及以上',
            skills: ['Python', 'TensorFlow', 'PyTorch', '深度学习', '模型部署'],
            description: '负责机器学习模型的设计、训练和部署，参与AI产品的研发和优化。',
            postedTime: '3小时前',
            relevanceScore: 90,
            url: 'https://indeed.com/job/5',
            source: 'Indeed',
            viewCount: 110,
            applyCount: 22,
            rating: 4.4
          },
          {
            id: `indeed-${Date.now()}-2`,
            title: '大数据工程师',
            company: '金融科技公司G',
            location: '深圳',
            salary: '年薪40-60万',
            type: '全职',
            experience: '3-5年',
            degree: '硕士及以上',
            skills: ['Python', 'Spark', 'Hadoop', 'SQL', '大数据处理'],
            description: '负责大数据平台的构建和维护，参与数据处理和分析系统的开发。',
            postedTime: '2天前',
            relevanceScore: 82,
            url: 'https://indeed.com/job/2',
            source: 'Indeed',
            viewCount: 90,
            applyCount: 18,
            rating: 4.0
          }
        ]);
      }

      // 4. 51Job岗位
      if (platforms.includes('51Job')) {
        allJobs.push(...[
          {
            id: `51job-${Date.now()}-1`,
            title: '产业研究岗',
            company: '四川省产业技术研究院',
            location: '成都',
            salary: '年薪30-50万',
            type: '全职',
            experience: '3-5年',
            degree: '博士',
            skills: ['产业研究', '技术创新', '项目管理', '数据分析', '政策研究'],
            description: '负责产业技术研究，推动科技成果转化，参与重大项目规划和实施。',
            postedTime: '1周前',
            relevanceScore: 92,
            url: 'https://jobs.51job.com/chengdu/170140178.html',
            source: '51Job',
            viewCount: 200,
            applyCount: 45,
            rating: 4.6
          },
          {
            id: `51job-${Date.now()}-2`,
            title: '人工智能算法工程师',
            company: '科技公司E',
            location: '北京',
            salary: '年薪45-65万',
            type: '全职',
            experience: '2-4年',
            degree: '硕士及以上',
            skills: ['Python', '计算机视觉', '深度学习', 'OpenCV', '图像处理'],
            description: '负责计算机视觉算法的研发和应用，参与产品的视觉相关功能开发。',
            postedTime: '6小时前',
            relevanceScore: 85,
            url: 'https://jobs.51job.com/beijing/170140179.html',
            source: '51Job',
            viewCount: 85,
            applyCount: 15,
            rating: 4.1
          }
        ]);
      }

      // 5. 智联招聘岗位
      if (platforms.includes('智联招聘')) {
        allJobs.push(...[
          {
            id: `zhaopin-${Date.now()}-1`,
            title: 'AI产品经理',
            company: '科技公司H',
            location: '北京',
            salary: '年薪45-65万',
            type: '全职',
            experience: '3-5年',
            degree: '硕士及以上',
            skills: ['产品管理', 'AI产品', '用户研究', '数据分析', '项目管理'],
            description: '负责AI产品的规划和管理，参与产品从概念到上线的全流程。',
            postedTime: '4小时前',
            relevanceScore: 80,
            url: 'https://www.zhaopin.com/job/4',
            source: '智联招聘',
            viewCount: 120,
            applyCount: 25,
            rating: 4.1
          }
        ]);
      }

      // 6. 猎聘岗位
      if (platforms.includes('猎聘')) {
        allJobs.push(...[
          {
            id: `liepin-${Date.now()}-1`,
            title: '区块链工程师',
            company: '金融科技公司I',
            location: '上海',
            salary: '年薪50-70万',
            type: '全职',
            experience: '3-5年',
            degree: '硕士及以上',
            skills: ['Python', '区块链', '智能合约', '密码学', '分布式系统'],
            description: '负责区块链技术的研发和应用，参与金融科技产品的开发。',
            postedTime: '1天前',
            relevanceScore: 78,
            url: 'https://www.liepin.com/job/5',
            source: '猎聘',
            viewCount: 85,
            applyCount: 15,
            rating: 4.0
          }
        ]);
      }

      // 7. 远程工作岗位
      if (options.includeRemote) {
        allJobs.push(...[
          {
            id: `remote-${Date.now()}-1`,
            title: '远程AI研究员',
            company: '国际科技公司',
            location: '远程',
            salary: '年薪60-80万',
            type: '全职',
            experience: '3-5年',
            degree: '博士',
            skills: ['Python', '机器学习', '深度学习', 'NLP', '分布式系统'],
            description: '远程工作，负责AI技术研发，参与国际项目合作。',
            postedTime: '2天前',
            relevanceScore: 95,
            url: 'https://example.com/remote/job/1',
            source: 'RemoteOK',
            viewCount: 150,
            applyCount: 35,
            rating: 4.7
          }
        ]);
      }

      // 根据选项筛选岗位
      let filteredJobs = [...allJobs];

      // 筛选最低评分
      const minRating = options.minRating || 4.0;
      filteredJobs = filteredJobs.filter(job => job.rating !== undefined && job.rating >= minRating);

      // 筛选薪资范围
      if (options.salaryRange) {
        const { min, max } = options.salaryRange;
        filteredJobs = filteredJobs.filter(job => {
          // 简化的薪资筛选逻辑
          const salaryMatch = true;
          // 实际项目中应该解析薪资字符串并进行比较
          return salaryMatch;
        });
      }

      // 按相关度排序
      filteredJobs.sort((a, b) => {
        const scoreA = a.relevanceScore || 0;
        const scoreB = b.relevanceScore || 0;
        return scoreB - scoreA;
      });

      // 限制结果数量
      const maxResults = options.maxResults || 10;
      const limitedJobs = filteredJobs.slice(0, maxResults);
      
      // 检查抓取时长
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > maxDuration) {
        console.warn(`抓取超时，已用时 ${elapsedTime}ms，超过最大时长 ${maxDuration}ms`);
      }
      
      // 将新岗位添加到持久化存储
      addJobsToPersistentStorage(limitedJobs as Job[]);
      
      // 更新最后抓取时间
      updateLastScrapeTime(cacheKey);
      
      console.log(`成功抓取并保存了 ${limitedJobs.length} 个新岗位`);
    } catch (error) {
      console.error('抓取岗位失败:', error);
      
      // 检查抓取时长
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > maxDuration) {
        console.warn(`抓取超时并失败，已用时 ${elapsedTime}ms`);
      }
      
      throw error;
    }
  }

  // 清理过期岗位并获取所有活跃岗位
  const allActiveJobs = cleanupExpiredJobs();
  
  // 根据选项筛选岗位
  const { keywords = [], degreeLevels = [] } = options;
  let filteredJobs = allActiveJobs;
  
  // 筛选最低评分
  const minRating = options.minRating || 4.0;
  filteredJobs = filteredJobs.filter(job => job.rating >= minRating);
  
  // 按相关度排序
  filteredJobs.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // 限制结果数量
  const maxResults = options.maxResults || 10;
  const finalJobs = filteredJobs.slice(0, maxResults);
  
  console.log(`返回了 ${finalJobs.length} 个活跃岗位`);
  return finalJobs;
};

/**
 * 智能分类算法：根据岗位描述和关键词自动判断岗位类型
 * @param job 岗位信息
 * @returns 分类结果
 */
export const classifyJobType = (job: any): {
  category: 'university' | 'enterprise';
  subType: string;
} => {
  const title = (job.title || '').toLowerCase();
  const description = (job.description || '').toLowerCase();
  const company = (job.company || '').toLowerCase();
  const institution = (job.company || '').toLowerCase();
  
  // 大学科研岗位关键词
  const universityKeywords = {
    professor: ['教授', '副教授', '助理教授', 'tenure-track', 'research assistant professor'],
    postdoc: ['博士后', 'postdoc', 'postdoctoral', 'research fellow'],
    research: ['研究员', '研究助理', 'research associate', 'research scientist']
  };
  
  // 企业岗位关键词
  const enterpriseKeywords = {
    techDirector: ['技术总监', 'cto', 'chief technology officer', '技术负责人'],
    chiefScientist: ['首席科学家', 'chief scientist', '首席研究员'],
    rManager: ['研发经理', 'r&d manager', 'research manager', '技术经理']
  };
  
  // 首先判断是大学还是企业岗位
  // 检查是否有大学或研究机构相关词汇
  const isUniversityJob = 
    (institution && (institution.includes('大学') || institution.includes('学院') || institution.includes('研究院') || institution.includes('university') || institution.includes('college') || institution.includes('institute'))) ||
    (title && (title.includes('教授') || title.includes('副教授') || title.includes('博士后') || title.includes('postdoc') || title.includes('research fellow'))) ||
    (description && (description.includes('tenure-track') || description.includes('学术') || description.includes('academic') || description.includes('research grant')));
  
  if (isUniversityJob) {
    // 确定大学岗位子类型
    for (const [subType, keywords] of Object.entries(universityKeywords)) {
      if (keywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
        return {
          category: 'university',
          subType
        };
      }
    }
    
    // 默认大学岗位类型
    return {
      category: 'university',
      subType: 'research'
    };
  } else {
    // 确定企业岗位子类型
    for (const [subType, keywords] of Object.entries(enterpriseKeywords)) {
      if (keywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
        return {
          category: 'enterprise',
          subType
        };
      }
    }
    
    // 默认企业岗位类型
    return {
      category: 'enterprise',
      subType: 'rManager'
    };
  }
};

/**
 * 币种换算函数：将不同币种的薪资转换为USD
 * @param salary 原始薪资字符串
 * @returns 转换后的USD薪资字符串
 */
const convertSalaryToUSD = (salary: string): string => {
  // 如果薪资是面议或未提供，直接返回
  if (!salary || salary.includes('面议') || salary.includes('Negotiable') || salary.includes('薪资面议')) {
    return '薪资面议';
  }

  // 汇率转换（模拟，实际项目中应使用实时汇率API）
  const exchangeRates = {
    cny: 0.14, // 人民币兑美元
    gbp: 1.27, // 英镑兑美元
    eur: 1.09, // 欧元兑美元
    jpy: 0.0067, // 日元兑美元
    chf: 1.13, // 瑞士法郎兑美元
    sgd: 0.73, // 新加坡元兑美元
    cad: 0.72, // 加元兑美元
    aud: 0.65, // 澳元兑美元
    hkd: 0.13 // 港币兑美元
  };

  // 定义薪资单位与对应汇率的映射
  const currencyPatterns: Array<{ pattern: RegExp, currency: keyof typeof exchangeRates, conversionFactor: number }> = [
    // 人民币（50-70万）
    { pattern: /(\d+)-(\d+)万/, currency: 'cny', conversionFactor: 10000 },
    // 英镑（15-25万英镑 -> 150000-250000英镑）
    { pattern: /(\d+)-(\d+)万英镑/, currency: 'gbp', conversionFactor: 10000 },
    // 英镑（7-9万美元 -> 70000-90000美元，注意：这里已经是美元，不需要转换）
    { pattern: /\$(\d+)-(\d+)万/, currency: 'cny', conversionFactor: 10000 },
    // 日元（600-800万日元）
    { pattern: /(\d+)-(\d+)万日元/, currency: 'jpy', conversionFactor: 10000 },
    // 瑞士法郎（18-25万瑞士法郎）
    { pattern: /(\d+)-(\d+)万瑞士法郎/, currency: 'chf', conversionFactor: 10000 },
    // 新加坡元（12-18万新加坡元）
    { pattern: /(\d+)-(\d+)万新加坡元/, currency: 'sgd', conversionFactor: 10000 },
    // 英镑（£150,000-£250,000）
    { pattern: /£(\d+),(\d+)-£(\d+),(\d+)/, currency: 'gbp', conversionFactor: 1 },
    // 美元（$200,000-$300,000）
    { pattern: /\$(\d+),(\d+)-\$(\d+),(\d+)/, currency: 'cny', conversionFactor: 1 },
    // 欧元（€180,000-€250,000）
    { pattern: /€(\d+),(\d+)-€(\d+),(\d+)/, currency: 'eur', conversionFactor: 1 },
    // 英镑（£70,000-£120,000）
    { pattern: /£(\d+),(\d+)-£(\d+),(\d+)/, currency: 'gbp', conversionFactor: 1 },
    // 美元（$180,000-$280,000）
    { pattern: /\$(\d+),(\d+)-\$(\d+),(\d+)/, currency: 'cny', conversionFactor: 1 },
    // 英镑（£80,000-£120,000）
    { pattern: /£(\d+),(\d+)-£(\d+),(\d+)/, currency: 'gbp', conversionFactor: 1 },
    // 瑞士法郎（CHF 180,000-250,000）
    { pattern: /CHF (\d+),(\d+)-(\d+),(\d+)/, currency: 'chf', conversionFactor: 1 },
    // 美元（Annual Salary: $150,000-250,000）
    { pattern: /Annual Salary: \$(\d+),(\d+)-(\d+),(\d+)/, currency: 'cny', conversionFactor: 1 },
    // 英镑（Annual Salary: £80,000-120,000）
    { pattern: /Annual Salary: £(\d+),(\d+)-(\d+),(\d+)/, currency: 'gbp', conversionFactor: 1 },
    // 美元（Annual Salary: $70,000-90,000）
    { pattern: /Annual Salary: \$(\d+),(\d+)-(\d+),(\d+)/, currency: 'cny', conversionFactor: 1 },
    // 美元（Annual Salary: $75,000-95,000）
    { pattern: /Annual Salary: \$(\d+),(\d+)-(\d+),(\d+)/, currency: 'cny', conversionFactor: 1 },
    // 美元（Annual Salary: $120,000-180,000）
    { pattern: /Annual Salary: \$(\d+),(\d+)-(\d+),(\d+)/, currency: 'cny', conversionFactor: 1 },
    // 英镑（Annual Salary: £70,000-100,000）
    { pattern: /Annual Salary: £(\d+),(\d+)-(\d+),(\d+)/, currency: 'gbp', conversionFactor: 1 },
    // 日元（Annual Salary: ¥12,000,000-18,000,000）
    { pattern: /Annual Salary: ¥(\d+),(\d+),(\d+)-(\d+),(\d+),(\d+)/, currency: 'jpy', conversionFactor: 1 },
    // 新加坡元（Annual Salary: SGD 120,000-180,000）
    { pattern: /Annual Salary: SGD (\d+),(\d+)-(\d+),(\d+)/, currency: 'sgd', conversionFactor: 1 },
    // 美元（Annual Salary: $170,000-270,000）
    { pattern: /Annual Salary: \$(\d+),(\d+)-(\d+),(\d+)/, currency: 'cny', conversionFactor: 1 },
    // 美元（Annual Salary: $190,000-290,000）
    { pattern: /Annual Salary: \$(\d+),(\d+)-(\d+),(\d+)/, currency: 'cny', conversionFactor: 1 },
    // 欧元（€180,000-250,000）
    { pattern: /Annual Salary: €(\d+),(\d+)-(\d+),(\d+)/, currency: 'eur', conversionFactor: 1 }
  ];

  // 尝试匹配所有货币模式
  for (const { pattern, currency, conversionFactor } of currencyPatterns) {
    const match = salary.match(pattern);
    if (match) {
      // 根据不同的匹配模式提取薪资范围
      let minSalary: number, maxSalary: number;
      
      if (match.length === 3) {
        // 简单模式：(\d+)-(\d+)万
        minSalary = parseInt(match[1], 10) * conversionFactor;
        maxSalary = parseInt(match[2], 10) * conversionFactor;
      } else if (match.length === 5) {
        // 中等模式：$100,000-$150,000
        minSalary = parseInt(match[1] + match[2], 10);
        maxSalary = parseInt(match[3] + match[4], 10);
      } else if (match.length === 7) {
        // 复杂模式：¥12,000,000-18,000,000
        minSalary = parseInt(match[1] + match[2] + match[3], 10);
        maxSalary = parseInt(match[4] + match[5] + match[6], 10);
      } else {
        continue;
      }

      // 转换为USD
      const rate = exchangeRates[currency];
      const minUSD = Math.round(minSalary * rate);
      const maxUSD = Math.round(maxSalary * rate);

      // 格式化输出
      return `${minUSD.toLocaleString()}-${maxUSD.toLocaleString()} USD`;
    }
  }

  // 如果无法匹配任何模式，返回原始薪资
  return salary;
};

/**
 * 使用AI大模型分析岗位信息，提取关键信息并进行评分
 * @param job 原始岗位信息
 * @param userProfile 用户简历信息，用于个性化匹配
 * @returns 分析后的岗位信息
 */
export const analyzeJobWithAI = async (job: any, userProfile?: any): Promise<Job> => {
  // 提取关键信息
  const title = job.title || '未知岗位';
  const company = job.company || '未知公司';
  const location = job.location || '未知地点';
  const originalSalary = job.salary || '薪资面议';
  // 将薪资转换为USD
  const salary = convertSalaryToUSD(originalSalary);
  const type = job.type || '全职';
  const experience = job.experience || '不限';
  const degree = job.degree || '不限';
  const skills = job.skills || [];
  const description = job.description || '';
  const postedTime = job.postedTime || '未知';
  const url = job.url || '';
  const source = job.source || '未知';

  // 使用智能分类算法确定岗位类型
  const jobClassification = classifyJobType(job);

  try {
    // 导入AI服务
    const { analyzeJobWithAI: analyzeJobWithAIService } = await import('./ai-service');
    
    // 使用真实的AI大模型分析岗位
    const aiResponse = await analyzeJobWithAIService(job, userProfile);
    
    if (aiResponse.success && aiResponse.data) {
      // 解析AI返回的JSON数据
      let aiAnalysis;
      try {
        aiAnalysis = JSON.parse(aiResponse.data);
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        // 如果解析失败，使用默认评分
        aiAnalysis = {
          overallMatch: 70,
          rating: 3.5
        };
      }
      
      return {
        id: job.id || `job-${Date.now()}`,
        title,
        company,
        location,
        salary,
        type,
        experience,
        degree,
        skills,
        description,
        requirements: [],
        benefits: [],
        postedTime,
        relevanceScore: aiAnalysis.overallMatch || 70,
        url,
        source,
        viewCount: job.viewCount || 0,
        applyCount: job.applyCount || 0,
        rating: aiAnalysis.rating || 3.5,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天后过期
        tags: {
          category: 'enterprise' as any,
          subType: 'other' as any
        },
        libraryType: 'public' as any,
        status: 'active' as any,
        userId: '',
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        displayStartDate: new Date().toISOString(),
        displayEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
  } catch (error) {
    console.error('AI analysis failed:', error);
    // 如果AI分析失败，使用默认评分逻辑
  }

  // 默认评分逻辑（当AI分析失败时使用）
  const calculateJobRating = (jobData: any): number => {
    let rating = 3.0;

    // 基于薪资评分
    if (salary.includes('100,000-150,000 USD') || salary.includes('120,000-180,000 USD')) rating += 1.0;
    else if (salary.includes('70,000-100,000 USD') || salary.includes('80,000-120,000 USD')) rating += 0.5;

    // 基于公司类型评分
    const techCompanies = ['科技公司', '互联网公司', '人工智能公司'];
    if (techCompanies.some(companyType => company.includes(companyType))) rating += 0.5;

    // 基于技能需求评分
    const hotSkills = ['机器学习', '深度学习', '人工智能', 'NLP', '计算机视觉'];
    const matchedHotSkills = skills.filter((skill: string) => hotSkills.includes(skill)).length;
    rating += matchedHotSkills * 0.1;

    // 基于学历要求评分
    if (degree.includes('博士')) rating += 0.5;

    return Math.min(5.0, rating);
  };

  // 计算相关度评分
  const calculateRelevanceScore = (jobData: any, userProfile?: any): number => {
    let score = 70;

    if (userProfile) {
      // 提取用户简历关键信息
      const userSkills = (userProfile.skills || []).map((skill: string) => skill.toLowerCase());
      const userExperience = userProfile.workExperience || 0;
      const userDegree = userProfile.education?.[0]?.degree || '';
      const userMajor = (userProfile.major || '').toLowerCase();
      const userLocation = (userProfile.location || '').toLowerCase();

      // 技能匹配度
      const jobSkills = skills.map((skill: string) => skill.toLowerCase());
      const matchedSkills = jobSkills.filter((skill: string) => userSkills.includes(skill)).length;
      score += matchedSkills * 5;

      // 经验匹配度
      if (experience.includes('3-5年') && userExperience >= 3 && userExperience <= 5) score += 5;
      else if (experience.includes('5-8年') && userExperience >= 5 && userExperience <= 8) score += 5;
      else if (experience.includes('8-10年') && userExperience >= 8 && userExperience <= 10) score += 5;
      else if (experience.includes('10年以上') && userExperience >= 10) score += 5;

      // 学历匹配度
      if (degree.includes('博士') && userDegree.includes('博士')) score += 5;
      else if (degree.includes('硕士') && userDegree.includes('硕士')) score += 3;

      // 专业匹配度
      if (title.toLowerCase().includes(userMajor) || description.toLowerCase().includes(userMajor)) {
        score += 5;
      }

      // 地点匹配度
      if (location.toLowerCase().includes(userLocation)) {
        score += 3;
      }
    } else {
      // 默认评分逻辑
      // 基于技能匹配度
      const targetSkills = ['Python', '机器学习', '深度学习', '人工智能'];
      const matchedSkills = skills.filter((skill: string) => targetSkills.includes(skill)).length;
      score += matchedSkills * 5;

      // 基于岗位 title
      const targetTitles = ['人工智能', '机器学习', '算法', '数据科学'];
      if (targetTitles.some(titleKeyword => title.includes(titleKeyword))) score += 10;
    }

    return Math.min(100, score);
  };

  const rating = calculateJobRating(job);
  const relevanceScore = calculateRelevanceScore(job, userProfile);

  return {
    id: job.id || `job-${Date.now()}`,
    title,
    company,
    location,
    salary,
    type,
    experience,
    degree,
    skills,
    description,
    requirements: [],
    benefits: [],
    postedTime,
    relevanceScore,
    url,
    source,
    viewCount: job.viewCount || 0,
    applyCount: job.applyCount || 0,
    rating,
    deadline: new Date().toISOString().split('T')[0],
    tags: {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.TECH_DIRECTOR
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    userId: undefined,
    isMatched: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    displayStartDate: undefined,
    displayEndDate: undefined,
    expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
  };
};

/**
 * 批量分析岗位信息
 * @param jobs 原始岗位列表
 * @param userProfile 用户简历信息，用于个性化匹配
 * @returns 分析后的岗位列表
 */
export const batchAnalyzeJobs = async (jobs: any[], userProfile?: any): Promise<Job[]> => {
  const analyzedJobs = await Promise.all(
    jobs.map(job => analyzeJobWithAI(job, userProfile))
  );
  return analyzedJobs;
};

/**
 * 个性化推荐算法：根据用户简历信息和岗位信息进行匹配推荐
 * @param jobs 岗位列表
 * @param userProfile 用户简历信息
 * @returns 个性化推荐的岗位列表
 */
export const getPersonalizedRecommendations = (jobs: Job[], userProfile?: any): Job[] => {
  if (!userProfile) {
    // 如果没有用户信息，按默认排序返回
    return [...jobs].sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // 提取用户简历关键信息
  const userSkills = (userProfile.skills || []).map((skill: string) => skill.toLowerCase());
  const userExperience = userProfile.workExperience || 0;
  const userDegree = userProfile.education?.[0]?.degree || '';
  const userMajor = (userProfile.major || '').toLowerCase();
  const userLocation = (userProfile.location || '').toLowerCase();

  // 为每个岗位计算匹配分数
  const jobsWithMatchScore = jobs.map(job => {
    let matchScore = 0;

    // 技能匹配度
    const jobSkills = job.skills.map((skill: string) => skill.toLowerCase());
    const matchedSkills = userSkills.filter((userSkill: string) => jobSkills.includes(userSkill));
    matchScore += matchedSkills.length * 5;

    // 经验匹配度
    if (job.experience.includes('3-5年') && userExperience >= 3 && userExperience <= 5) matchScore += 3;
    if (job.experience.includes('5-8年') && userExperience >= 5 && userExperience <= 8) matchScore += 3;
    if (job.experience.includes('8-10年') && userExperience >= 8 && userExperience <= 10) matchScore += 3;
    if (job.experience.includes('10年以上') && userExperience >= 10) matchScore += 3;

    // 学历匹配度
    if (job.degree.includes('博士') && userDegree.includes('博士')) matchScore += 5;
    if (job.degree.includes('硕士') && userDegree.includes('硕士')) matchScore += 3;

    // 专业匹配度
    if (job.title.toLowerCase().includes(userMajor) || job.description.toLowerCase().includes(userMajor)) {
      matchScore += 4;
    }

    // 地点匹配度
    if (job.location.toLowerCase().includes(userLocation)) {
      matchScore += 2;
    }

    // 保留原始相关度分数
    matchScore += job.relevanceScore;

    return {
      ...job,
      matchScore
    };
  });

  // 按匹配分数排序
  return jobsWithMatchScore
    .sort((a, b) => (b.matchScore as number) - (a.matchScore as number))
    .map(job => {
      // 移除临时的匹配分数字段
      const { matchScore, ...jobWithoutMatchScore } = job;
      return jobWithoutMatchScore;
    });
};

/**
 * 为后台生成岗位抓取任务
 * @param options 抓取选项
 * @returns 抓取任务结果
 */
export const createJobScrapeTask = async (options: ScrapeOptions = {}): Promise<{
  success: boolean;
  jobs: Job[];
  totalCount: number;
  filteredCount: number;
}> => {
  try {
    // 抓取岗位
    const scrapedJobs = await scrapeJobs(options);

    // 使用AI分析岗位
    const analyzedJobs = await batchAnalyzeJobs(scrapedJobs, options.userProfile);

    // 按评分排序
    analyzedJobs.sort((a, b) => b.rating - a.rating);

    return {
      success: true,
      jobs: analyzedJobs,
      totalCount: scrapedJobs.length,
      filteredCount: analyzedJobs.length
    };
  } catch (error) {
    console.error('岗位抓取任务失败:', error);
    return {
      success: false,
      jobs: [],
      totalCount: 0,
      filteredCount: 0
    };
  }
};
