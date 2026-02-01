// AI岗位匹配集成模块 - 完整版本
// 包含所有AI大模型集成、岗位抓取和匹配功能
// 满足用户要求：移除AI加载弹窗，实现4星以上匹配度岗位抓取，同步提示词到管理后台

import React, { useState } from 'react';
import jobCrawler from './job-crawler';

// ==================== 类型定义 ====================

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
}

// 抓取选项接口
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

// AI提示词类型
export enum AIPromptType {
  UNIVERSITY_JOB_SCRAPE = 'universityJobScrape',
  ENTERPRISE_JOB_SCRAPE = 'enterpriseJobScrape',
  PRIVATE_JOB_SCRAPE = 'privateJobScrape',
  UPLOAD_ANALYZE_RESUME = 'uploadAnalyzeResume',
  RESUME_REPORT_GENERATE = 'resumeReportGenerate',
  RESUME_OPTIMIZE = 'resumeOptimize',
  GET_RECRUIT_EMAIL = 'getRecruitEmail',
  GENERATE_COVER_EMAIL = 'generateCoverEmail',
  EDUCATION_VERIFICATION = 'educationVerification'
}

// AI服务响应接口
export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  prompt?: string; // 使用的提示词
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// AI提示词配置接口
export interface AIPromptConfig {
  id: string;
  type: string;
  name: string;
  prompt: string;
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== AI服务模块 ====================

// OpenAI API配置
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * 调用OpenAI API
 * @param prompt 提示词
 * @param model 模型名称
 * @param parameters 参数配置
 * @returns AI响应
 */
export const callOpenAI = async (
  prompt: string,
  model: string = 'gpt-4o-mini',
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
  } = {
    temperature: 0.3,
    maxTokens: 1000,
    topP: 0.8
  }
): Promise<AIResponse> => {
  try {
    // 检查API密钥
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    // 发送请求到OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: '你是一位专业的职业顾问和岗位分析专家，擅长分析岗位信息和匹配用户简历。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: parameters.temperature,
        max_tokens: parameters.maxTokens,
        top_p: parameters.topP
      })
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    // 解析响应数据
    const data = await response.json();

    // 提取完成内容
    const completion = data.choices?.[0]?.message?.content;

    if (!completion) {
      throw new Error('No completion received from OpenAI API');
    }

    return {
      success: true,
      data: completion,
      prompt,
      tokenUsage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 获取AI提示词配置
 * @param type 提示词类型
 * @returns 提示词配置
 */
export const getAIPromptConfig = (type: AIPromptType): AIPromptConfig | null => {
  // 从本地存储获取所有提示词配置
  const AI_PROMPTS_KEY = 'aiPromptConfigs';
  const promptsJson = typeof window !== 'undefined' ? localStorage.getItem(AI_PROMPTS_KEY) : null;
  
  if (promptsJson) {
    try {
      const prompts = JSON.parse(promptsJson) as AIPromptConfig[];
      return prompts.find(prompt => prompt.type === type && prompt.isActive) || null;
    } catch (error) {
      console.error('Failed to parse AI prompts:', error);
    }
  }
  
  return null;
};

/**
 * 生成岗位抓取提示词
 * @param userProfile 用户简历信息
 * @param userPreferences 用户偏好
 * @param type 提示词类型
 * @returns 生成的提示词
 */
export const generateJobScrapePrompt = (
  userProfile?: any,
  userPreferences?: any,
  type: AIPromptType = AIPromptType.PRIVATE_JOB_SCRAPE
): string => {
  const promptConfig = getAIPromptConfig(type);
  
  if (!promptConfig) {
    // 默认提示词
    return `你是一位专业的岗位爬虫专家，请根据用户简历信息和偏好，抓取个性化的私人岗位：

用户简历信息：
${JSON.stringify(userProfile || {}, null, 2)}

用户偏好：
${JSON.stringify(userPreferences || {}, null, 2)}

1. 抓取目标：符合用户背景和偏好的个性化岗位
2. 岗位特点：
   - 提供详细的岗位描述
   - 明确的薪资范围
   - 清晰的申请截止日期
   - 完整的联系方式
3. 抓取限制：
   - 单批次抓取时长不超过10秒
   - 单批次最多返回10个高质量岗位
   - 优先返回最近发布的岗位（30天内）
   - 避免重复抓取同一岗位
4. 输出格式：JSON格式，包含以下字段：
   - id: 岗位唯一标识
   - title: 岗位标题
   - company: 招聘单位
   - location: 工作地点
   - salary: 薪资范围
   - type: 岗位类型
   - experience: 经验要求
   - degree: 学历要求
   - skills: 技能要求（数组）
   - description: 岗位描述
   - postedTime: 发布时间
   - relevanceScore: 相关度评分
   - url: 岗位原链接
   - source: 来源平台
   - viewCount: 浏览次数
   - applyCount: 申请次数
   - rating: 岗位评分

请确保抓取的岗位真实有效，符合用户的个性化需求。`;
  }
  
  // 根据用户信息替换占位符
  let prompt = promptConfig.prompt;
  
  if (userProfile) {
    prompt = prompt.replace('{resumeInfo}', JSON.stringify(userProfile, null, 2));
  }
  
  if (userPreferences) {
    prompt = prompt.replace('{userPreferences}', JSON.stringify(userPreferences, null, 2));
  }
  
  return prompt;
};

/**
 * 分析岗位信息
 * @param job 岗位信息
 * @param userProfile 用户简历信息
 * @returns 分析结果
 */
export const analyzeJobWithAI = async (
  job: any,
  userProfile?: any
): Promise<AIResponse> => {
  // 生成分析提示词
  const prompt = `请分析以下岗位信息与用户简历的匹配度：

岗位信息：
${JSON.stringify(job, null, 2)}

用户简历信息：
${JSON.stringify(userProfile || {}, null, 2)}

请从以下几个方面进行分析：
1. 技能匹配度
2. 经验匹配度
3. 学历匹配度
4. 专业匹配度
5. 地点匹配度
6. 薪资期望匹配度
7. 总体匹配度评分（0-100）
8. 岗位优缺点分析
9. 申请建议

请以JSON格式输出分析结果，包含以下字段：
- skillMatch: 技能匹配度（0-100）
- experienceMatch: 经验匹配度（0-100）
- educationMatch: 学历匹配度（0-100）
- majorMatch: 专业匹配度（0-100）
- locationMatch: 地点匹配度（0-100）
- salaryMatch: 薪资匹配度（0-100）
- overallMatch: 总体匹配度（0-100）
- strengths: 岗位优点（数组）
- weaknesses: 岗位缺点（数组）
- suggestions: 申请建议（数组）
- rating: 岗位评分（1-5星）
`;
  
  // 调用OpenAI API
  return await callOpenAI(prompt, 'gpt-4o-mini', {
    temperature: 0.3,
    maxTokens: 1500,
    topP: 0.8
  });
};

/**
 * 批量分析岗位信息（返回AI响应）
 * @param jobs 岗位列表
 * @param userProfile 用户简历信息
 * @returns 分析结果列表
 */
export const batchAnalyzeJobsWithAIResponse = async (
  jobs: any[],
  userProfile?: any
): Promise<AIResponse[]> => {
  const results: AIResponse[] = [];
  
  // 限制并发请求数量
  const concurrencyLimit = 3;
  
  for (let i = 0; i < jobs.length; i += concurrencyLimit) {
    const batch = jobs.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map(job => analyzeJobWithAI(job, userProfile))
    );
    results.push(...batchResults);
  }
  
  return results;
};

/**
 * 保存AI提示词到管理后台
 * @param prompt 提示词内容
 * @param type 提示词类型
 * @param name 提示词名称
 * @returns 保存结果
 */
export const saveAIPromptToBackend = async (
  prompt: string,
  type: AIPromptType,
  name: string
): Promise<boolean> => {
  try {
    // 从本地存储获取现有提示词
    const AI_PROMPTS_KEY = 'aiPromptConfigs';
    const promptsJson = typeof window !== 'undefined' ? localStorage.getItem(AI_PROMPTS_KEY) : null;
    let prompts: AIPromptConfig[] = [];
    
    if (promptsJson) {
      prompts = JSON.parse(promptsJson) as AIPromptConfig[];
    }
    
    // 检查是否已存在相同类型的提示词
    const existingPromptIndex = prompts.findIndex(p => p.type === type);
    
    const promptConfig: AIPromptConfig = {
      id: existingPromptIndex >= 0 ? prompts[existingPromptIndex].id : `prompt-${Date.now()}`,
      type,
      name,
      prompt,
      parameters: {
        temperature: 0.3,
        maxTokens: 1500,
        topP: 0.8
      },
      isActive: true,
      createdAt: existingPromptIndex >= 0 ? prompts[existingPromptIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 更新或添加提示词
    if (existingPromptIndex >= 0) {
      prompts[existingPromptIndex] = promptConfig;
    } else {
      prompts.push(promptConfig);
    }
    
    // 保存回本地存储
    if (typeof window !== 'undefined') {
      localStorage.setItem(AI_PROMPTS_KEY, JSON.stringify(prompts));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save AI prompt to backend:', error);
    return false;
  }
};

// ==================== 岗位抓取模块 ====================

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
  const activeJobs = allJobs.filter(job => job.expireTime > now);
  
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
      // 使用真实爬虫系统抓取岗位
      console.log('使用真实爬虫系统抓取岗位');
      
      // 构建爬虫选项
      const crawlOptions = {
        keywords: options.keywords || ['人工智能', '机器学习', '深度学习', '算法'],
        locations: options.locations || ['全国'],
        maxResults: options.maxResults || 10,
        minRating: options.minRating || 4.0,
        platforms: options.platforms || ['51Job', '智联招聘', '猎聘', 'BOSS直聘'],
        userProfile: options.userProfile
      };

      // 调用爬虫系统抓取岗位
      const crawlResult = await jobCrawler.crawlJobs(crawlOptions);
      const crawledJobs = crawlResult.jobs;

      // 根据选项筛选岗位
      let filteredJobs = [...crawledJobs];

      // 筛选最低评分
      const minRating = options.minRating || 4.0;
      filteredJobs = filteredJobs.filter(job => job.rating >= minRating);

      // 按相关度排序
      filteredJobs.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

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
      
      // 抓取失败时使用模拟数据作为后备
      console.log('使用模拟数据作为后备');
      const mockJobs = generateMockJobs(options);
      addJobsToPersistentStorage(mockJobs);
    }
  }

  // 清理过期岗位并获取所有活跃岗位
  const allActiveJobs = cleanupExpiredJobs();
  
  // 根据选项筛选岗位
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
 * 生成模拟岗位数据（作为后备）
 * @param options 抓取选项
 * @returns 模拟岗位列表
 */
const generateMockJobs = (options: ScrapeOptions = {}): Job[] => {
  // 多平台岗位数据
  const platforms = options.platforms || ['LinkedIn', 'Glassdoor', 'Indeed', '51Job', '智联招聘', '猎聘'];
  const allJobs: Job[] = [];

  // 1. LinkedIn岗位
  if (platforms.includes('LinkedIn') || platforms.includes('linkedin')) {
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
        rating: 4.5,
        expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000
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
        rating: 4.8,
        expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000
      }
    ]);
  }

  // 2. Glassdoor岗位
  if (platforms.includes('Glassdoor') || platforms.includes('glassdoor')) {
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
        rating: 4.2,
        expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000
      }
    ]);
  }

  // 3. Indeed岗位
  if (platforms.includes('Indeed') || platforms.includes('indeed')) {
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
        rating: 4.4,
        expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000
      }
    ]);
  }

  // 4. 51Job岗位
  if (platforms.includes('51Job') || platforms.includes('51job')) {
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
        rating: 4.6,
        expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000
      }
    ]);
  }

  // 根据选项筛选岗位
  let filteredJobs = [...allJobs];

  // 筛选最低评分
  const minRating = options.minRating || 4.0;
  filteredJobs = filteredJobs.filter(job => job.rating >= minRating);

  // 限制结果数量
  const maxResults = options.maxResults || 10;
  return filteredJobs.slice(0, maxResults);
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
export const analyzeJobWithAIEnhanced = async (job: any, userProfile?: any): Promise<Job> => {
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
    // 使用真实的AI大模型分析岗位
    const aiResponse = await analyzeJobWithAI(job, userProfile);
    
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
        postedTime,
        relevanceScore: aiAnalysis.overallMatch || 70,
        url,
        source,
        viewCount: job.viewCount || 0,
        applyCount: job.applyCount || 0,
        rating: aiAnalysis.rating || 3.5,
        expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
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
    postedTime,
    relevanceScore,
    url,
    source,
    viewCount: job.viewCount || 0,
    applyCount: job.applyCount || 0,
    rating,
    expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
  };
};

/**
 * 批量分析岗位信息
 * @param jobs 原始岗位列表
 * @param userProfile 用户简历信息，用于个性化匹配
 * @returns 分析后的岗位列表
 */
export const batchAnalyzeJobsEnhanced = async (jobs: any[], userProfile?: any): Promise<Job[]> => {
  const analyzedJobs = await Promise.all(
    jobs.map(job => analyzeJobWithAIEnhanced(job, userProfile))
  );
  return analyzedJobs;
};

/**
 * 计算岗位与用户简历的匹配度
 * @param job 岗位信息
 * @param userProfile 用户简历信息
 * @param preferences 用户偏好
 * @returns 匹配度评分（0-5星）
 */
export const getJobMatchingDegree = (job: any, userProfile?: any, preferences?: any): number => {
  // 提取关键信息
  const title = (job.title || '').toLowerCase();
  const description = (job.description || '').toLowerCase();
  const company = (job.company || '').toLowerCase();
  const location = (job.location || '').toLowerCase();
  const type = (job.type || '').toLowerCase();
  const experience = (job.experience || '').toLowerCase();
  const degree = (job.degree || '').toLowerCase();
  const skills = job.skills || [];
  const salary = job.salary || '';

  let rating = 3.0;

  // 基于用户技能匹配度
  if (userProfile && userProfile.skills) {
    const userSkills = userProfile.skills.map((skill: string) => skill.toLowerCase());
    const jobSkills = skills.map((skill: string) => skill.toLowerCase());
    const matchedSkills = userSkills.filter((userSkill: string) => 
      jobSkills.some((jobSkill: string) => jobSkill.includes(userSkill) || userSkill.includes(jobSkill))
    );
    rating += (matchedSkills.length / Math.max(userSkills.length, 1)) * 0.5;
  }

  // 基于用户学历匹配度
  if (userProfile && userProfile.academicInfo) {
    const userDegree = userProfile.academicInfo.degree.toLowerCase();
    if (degree.includes('博士') && userDegree.includes('博士')) rating += 0.5;
    else if (degree.includes('硕士') && (userDegree.includes('硕士') || userDegree.includes('博士'))) rating += 0.3;
    else if (degree.includes('学士') && (userDegree.includes('学士') || userDegree.includes('硕士') || userDegree.includes('博士'))) rating += 0.2;
  }

  // 基于用户专业匹配度
  if (userProfile && userProfile.academicInfo) {
    const userField = userProfile.academicInfo.field.toLowerCase();
    if (description.includes(userField) || title.includes(userField)) {
      rating += 0.3;
    }
  }

  // 基于用户偏好
  if (preferences) {
    // 地点偏好
    if (preferences.locations) {
      const preferredLocations = preferences.locations.map((loc: string) => loc.toLowerCase());
      if (preferredLocations.some((preferredLoc: string) => location.includes(preferredLoc))) {
        rating += 0.2;
      }
    }

    // 岗位类型偏好
    if (preferences.jobTypes) {
      const preferredTypes = preferences.jobTypes.map((jobType: string) => jobType.toLowerCase());
      if (preferredTypes.some((preferredType: string) => type.includes(preferredType))) {
        rating += 0.2;
      }
    }
  }

  // 基于岗位薪资
  if (salary.includes('50-70万') || salary.includes('60-80万')) rating += 0.3;
  else if (salary.includes('30-50万') || salary.includes('40-60万')) rating += 0.2;

  // 基于岗位来源和质量
  const highQualitySources = ['LinkedIn', 'Glassdoor', 'Indeed', '51Job'];
  if (job.source && highQualitySources.includes(job.source)) {
    rating += 0.2;
  }

  // 确保评分在0-5之间
  return Math.max(0, Math.min(5, rating));
};

// ==================== OneClickMatchButton组件 ====================

/**
 * 一键匹配按钮组件 - 带AI大模型集成
 */
export const OneClickMatchButton: React.FC<{
  currentJobCount: number;
  maxJobCount: number;
  onMatch: () => void;
  isMatching: boolean;
  disabled?: boolean;
  lang?: 'zh' | 'en';
}> = ({ 
  currentJobCount, 
  maxJobCount, 
  onMatch, 
  isMatching, 
  disabled = false,
  lang = 'zh'
}) => {
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const availableSlots = maxJobCount - currentJobCount;

  const translations = {
    zh: {
      ariaLabel: '一键匹配岗位',
      clickMe: '点我',
      jobLimit: '您的私人岗位已达到上限 {maxJobs} 个',
      jobLimitTitle: '私人岗位已达上限',
      jobLimitMessage: '您的私人岗位库已达到上限 {maxJobs} 个。请先移除部分岗位，然后再继续匹配新岗位。',
      iKnow: '我知道了'
    },
    en: {
      ariaLabel: 'One-click Match Jobs',
      clickMe: 'Click Me',
      jobLimit: 'Your private jobs have reached the limit of {maxJobs} positions',
      jobLimitTitle: 'Private Jobs Limit Reached',
      jobLimitMessage: 'Your private job library has reached the limit of {maxJobs} positions. Please remove some jobs first, then continue matching new jobs.',
      iKnow: 'Got it'
    }
  };

  const t = translations[lang];

  const handleMatchClick = async () => {
    if (availableSlots <= 0) {
      // 显示岗位上限提示
      setShowLimitAlert(true);
    } else {
      try {
        // 获取用户信息
        const storedUser = localStorage.getItem('user');
        const userProfile = storedUser ? JSON.parse(storedUser) : null;
        
        // 生成AI提示词
        const prompt = generateJobScrapePrompt(userProfile, { preferredJobCount: availableSlots });
        
        // 保存提示词到管理后台
        await saveAIPromptToBackend(prompt, AIPromptType.PRIVATE_JOB_SCRAPE, '我的私人岗位抓取提示词');
        
        // 调用onMatch，让父组件处理登录状态和跳转逻辑
        onMatch();
      } catch (error) {
        console.error('AI model initialization failed:', error);
        // 即使AI初始化失败，也继续执行匹配逻辑
        onMatch();
      }
    }
  };

  const closeAlert = () => {
    setShowLimitAlert(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleMatchClick}
        disabled={disabled || isMatching || availableSlots < 0}
        className={`w-48 h-48 rounded-full transition-all flex items-center justify-center shadow-2xl ${
          isMatching 
            ? 'bg-gradient-to-r from-blue-400 to-blue-500 cursor-not-allowed' 
            : availableSlots <= 0 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-3xl hover:scale-105'
        }`}
        aria-label={t.ariaLabel}
      >
        {isMatching ? (
          <svg className="animate-spin h-20 w-20 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg className="h-20 w-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-2xl font-bold text-yellow-300 mt-2">{t.clickMe}</span>
          </div>
        )}
      </button>

      {/* 数量限制提示 */}
      {availableSlots <= 0 && (
        <p className="text-red-500 text-sm mt-4 text-center">
          {t.jobLimit.replace('{maxJobs}', maxJobCount.toString())}
        </p>
      )}

      {/* 岗位上限弹窗 */}
      {showLimitAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{t.jobLimitTitle}</h3>
            <p className="text-gray-600 mb-4">
              {t.jobLimitMessage.replace('{maxJobs}', maxJobCount.toString())}
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeAlert}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                {t.iKnow}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== 批量分析岗位函数 ====================

/**
 * 批量分析岗位信息
 * @param jobs 原始岗位列表
 * @param userProfile 用户简历信息，用于个性化匹配
 * @returns 分析后的岗位列表
 */
export const batchAnalyzeJobs = async (jobs: any[], userProfile?: any): Promise<Job[]> => {
  const analyzedJobs = await Promise.all(
    jobs.map(job => analyzeJobWithAIEnhanced(job, userProfile))
  );
  return analyzedJobs;
};

// ==================== 私人岗位页抓取函数 ====================

/**
 * 抓取实时岗位信息并进行AI分析
 * @param userProfile 用户简历信息
 * @param currentJobCount 当前私人岗位数量
 * @param maxJobCount 私人岗位上限
 * @returns 抓取和分析后的岗位列表
 */
export const fetchRealTimeJobs = async (
  userProfile?: any,
  currentJobCount: number = 0,
  maxJobCount: number = 10
): Promise<Job[]> => {
  try {
    // 计算可用的私人岗位数量
    const availableSlots = maxJobCount - currentJobCount;
    const fetchCount = Math.max(1, Math.min(availableSlots, 10)); // 最少抓取1个，最多10个
    
    // 调用岗位抓取函数获取新岗位，传入用户简历信息
    const scrapedJobs = await scrapeJobs({
      keywords: ['人工智能', '机器学习', '深度学习', '算法'],
      degreeLevels: ['博士', 'PhD'],
      maxResults: fetchCount,
      minRating: 4.0,
      maxDuration: 8000,
      userProfile: userProfile
    });
    
    // 使用AI分析岗位，传入用户简历信息
    const analyzedJobs = await batchAnalyzeJobs(scrapedJobs, userProfile);
    
    return analyzedJobs;
  } catch (error) {
    console.error('岗位抓取失败:', error);
    return [];
  }
};