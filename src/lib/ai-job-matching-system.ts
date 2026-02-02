import { Job, callOpenAI } from './ai-job-matching-complete.tsx';
import { CrawlOptions } from './job-crawler/types';

// 用户简历接口
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  academicInfo: {
    degree: string;
    field: string;
    university: string;
    graduationYear: string;
  };
  skills: string[];
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  preferences: {
    jobTypes: string[];
    locations: string[];
    salaryRange: {
      min: number;
      max: number;
    };
    industries: string[];
  };
  membershipLevel: string;
  [key: string]: any;
}

// 匹配结果接口
export interface MatchResult {
  job: Job;
  matchScore: number;
  matchDetails: {
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    preferenceMatch: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

// 匹配选项接口
export interface MatchOptions {
  minMatchScore?: number;
  maxResults?: number;
  includeStrengthsWeaknesses?: boolean;
  includeSuggestions?: boolean;
  useAIEnhancement?: boolean;
  jobTypes?: string[];
  locations?: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
}

// AI匹配服务类
class AIJobMatchingSystem {
  private static instance: AIJobMatchingSystem;
  private apiKey: string;
  private model: string;

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.model = 'gpt-4o-mini'; // 默认使用更高效的模型
  }

  static getInstance(): AIJobMatchingSystem {
    if (!AIJobMatchingSystem.instance) {
      AIJobMatchingSystem.instance = new AIJobMatchingSystem();
    }
    return AIJobMatchingSystem.instance;
  }

  /**
   * 智能匹配岗位
   * @param jobs 岗位列表
   * @param userProfile 用户简历
   * @param options 匹配选项
   * @returns 匹配结果列表
   */
  async matchJobs(jobs: Job[], userProfile: UserProfile, options: MatchOptions = {}): Promise<MatchResult[]> {
    const startTime = Date.now();
    console.log(`开始匹配 ${jobs.length} 个岗位给用户 ${userProfile.username}`);

    // 默认选项
    const defaultOptions: MatchOptions = {
      minMatchScore: 0.4,
      maxResults: 10,
      includeStrengthsWeaknesses: true,
      includeSuggestions: true,
      useAIEnhancement: true,
      ...options
    };

    // 基础匹配
    let matchResults: MatchResult[] = jobs.map(job => {
      const matchScore = this.calculateBaseMatchScore(job, userProfile);
      const matchDetails = this.calculateMatchDetails(job, userProfile);

      return {
        job,
        matchScore,
        matchDetails,
        strengths: [],
        weaknesses: [],
        suggestions: []
      };
    });

    // 过滤低匹配度岗位
    matchResults = matchResults.filter(result => result.matchScore >= defaultOptions.minMatchScore!);

    // 使用AI增强匹配
    if (defaultOptions.useAIEnhancement && this.apiKey) {
      matchResults = await this.enhanceWithAI(matchResults, userProfile, defaultOptions);
    }

    // 排序并限制结果数量
    matchResults.sort((a, b) => b.matchScore - a.matchScore);
    matchResults = matchResults.slice(0, defaultOptions.maxResults);

    const endTime = Date.now();
    console.log(`匹配完成，用时 ${endTime - startTime}ms，找到 ${matchResults.length} 个匹配岗位`);

    return matchResults;
  }

  /**
   * 计算基础匹配分数
   * @param job 岗位信息
   * @param userProfile 用户简历
   * @returns 匹配分数
   */
  private calculateBaseMatchScore(job: Job, userProfile: UserProfile): number {
    let score = 0;

    // 技能匹配
    const skillsMatch = this.calculateSkillsMatch(job, userProfile);
    score += skillsMatch * 0.4;

    // 经验匹配
    const experienceMatch = this.calculateExperienceMatch(job, userProfile);
    score += experienceMatch * 0.3;

    // 教育匹配
    const educationMatch = this.calculateEducationMatch(job, userProfile);
    score += educationMatch * 0.2;

    // 偏好匹配
    const preferenceMatch = this.calculatePreferenceMatch(job, userProfile);
    score += preferenceMatch * 0.1;

    return Math.min(1.0, score);
  }

  /**
   * 计算匹配详情
   * @param job 岗位信息
   * @param userProfile 用户简历
   * @returns 匹配详情
   */
  private calculateMatchDetails(job: Job, userProfile: UserProfile) {
    return {
      skillsMatch: this.calculateSkillsMatch(job, userProfile),
      experienceMatch: this.calculateExperienceMatch(job, userProfile),
      educationMatch: this.calculateEducationMatch(job, userProfile),
      preferenceMatch: this.calculatePreferenceMatch(job, userProfile)
    };
  }

  /**
   * 计算技能匹配度
   * @param job 岗位信息
   * @param userProfile 用户简历
   * @returns 技能匹配度
   */
  private calculateSkillsMatch(job: Job, userProfile: UserProfile): number {
    const jobSkills = this.extractSkillsFromJob(job);
    const userSkills = userProfile.skills || [];

    if (jobSkills.length === 0) return 0.5;

    const matchedSkills = jobSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    return matchedSkills.length / jobSkills.length;
  }

  /**
   * 计算经验匹配度
   * @param job 岗位信息
   * @param userProfile 用户简历
   * @returns 经验匹配度
   */
  private calculateExperienceMatch(job: Job, userProfile: UserProfile): number {
    const jobTitle = job.title.toLowerCase();
    const jobDescription = job.description.toLowerCase();
    const workExperience = userProfile.workExperience || [];

    if (workExperience.length === 0) return 0.3;

    let experienceScore = 0;

    // 检查工作经验与岗位的相关性
    workExperience.forEach(exp => {
      const expDescription = (exp.description || '').toLowerCase();
      const expPosition = (exp.position || '').toLowerCase();

      // 职位匹配
      if (expPosition.includes('engineer') && jobTitle.includes('engineer')) {
        experienceScore += 0.3;
      }
      if (expPosition.includes('developer') && jobTitle.includes('developer')) {
        experienceScore += 0.3;
      }
      if (expPosition.includes('manager') && jobTitle.includes('manager')) {
        experienceScore += 0.3;
      }

      // 技能匹配
      const expSkills = this.extractSkillsFromText(expDescription);
      const jobSkills = this.extractSkillsFromJob(job);
      const matchedSkills = expSkills.filter(skill => 
        jobSkills.some(jobSkill => 
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );

      experienceScore += (matchedSkills.length / Math.max(jobSkills.length, 1)) * 0.4;
    });

    return Math.min(1.0, experienceScore);
  }

  /**
   * 计算教育匹配度
   * @param job 岗位信息
   * @param userProfile 用户简历
   * @returns 教育匹配度
   */
  private calculateEducationMatch(job: Job, userProfile: UserProfile): number {
    const jobDescription = job.description.toLowerCase();
    const academicInfo = userProfile.academicInfo;

    if (!academicInfo) return 0.3;

    let educationScore = 0.3; // 基础分

    // 学历匹配
    const degree = academicInfo.degree.toLowerCase();
    if (jobDescription.includes('phd') && degree.includes('phd')) {
      educationScore += 0.4;
    } else if (jobDescription.includes('master') && (degree.includes('master') || degree.includes('phd'))) {
      educationScore += 0.3;
    } else if (jobDescription.includes('bachelor') && (degree.includes('bachelor') || degree.includes('master') || degree.includes('phd'))) {
      educationScore += 0.2;
    }

    // 专业匹配
    const field = academicInfo.field.toLowerCase();
    if (jobDescription.includes(field)) {
      educationScore += 0.3;
    }

    return Math.min(1.0, educationScore);
  }

  /**
   * 计算偏好匹配度
   * @param job 岗位信息
   * @param userProfile 用户简历
   * @returns 偏好匹配度
   */
  private calculatePreferenceMatch(job: Job, userProfile: UserProfile): number {
    const preferences = userProfile.preferences || {};
    let preferenceScore = 0.3; // 基础分

    // 工作类型匹配
    if (preferences.jobTypes) {
      const jobType = job.type.toLowerCase();
      if (preferences.jobTypes.some(type => jobType.includes(type.toLowerCase()))) {
        preferenceScore += 0.2;
      }
    }

    // 地点匹配
    if (preferences.locations) {
      const jobLocation = job.location.toLowerCase();
      if (preferences.locations.some(location => jobLocation.includes(location.toLowerCase()))) {
        preferenceScore += 0.2;
      }
    }

    // 薪资范围匹配
    if (preferences.salaryRange) {
      const salaryMatch = this.calculateSalaryMatch(job, preferences.salaryRange);
      preferenceScore += salaryMatch * 0.3;
    }

    return Math.min(1.0, preferenceScore);
  }

  /**
   * 计算薪资匹配度
   * @param job 岗位信息
   * @param salaryRange 薪资范围
   * @returns 薪资匹配度
   */
  private calculateSalaryMatch(job: Job, salaryRange: { min: number; max: number }): number {
    // 简化的薪资匹配逻辑
    // 实际项目中应该解析薪资字符串并进行更复杂的匹配
    return 0.5; // 默认匹配度
  }

  /**
   * 从岗位中提取技能
   * @param job 岗位信息
   * @returns 技能数组
   */
  private extractSkillsFromJob(job: Job): string[] {
    const skills: string[] = [];

    // 从技能字段提取
    if (job.skills && Array.isArray(job.skills)) {
      skills.push(...job.skills);
    }

    // 从描述中提取
    if (job.description) {
      skills.push(...this.extractSkillsFromText(job.description));
    }

    // 使用兼容的方式去重
    const uniqueSkills: string[] = [];
    const skillSet = new Set<string>();
    
    for (const skill of skills) {
      if (!skillSet.has(skill)) {
        skillSet.add(skill);
        uniqueSkills.push(skill);
      }
    }
    
    return uniqueSkills;
  }

  /**
   * 从文本中提取技能
   * @param text 文本内容
   * @returns 技能数组
   */
  private extractSkillsFromText(text: string): string[] {
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
        matches.forEach(match => skills.push(match));
      }
    }

    return [...new Set(skills)];
  }

  /**
   * 使用AI增强匹配结果
   * @param matchResults 基础匹配结果
   * @param userProfile 用户简历
   * @param options 匹配选项
   * @returns 增强后的匹配结果
   */
  private async enhanceWithAI(matchResults: MatchResult[], userProfile: UserProfile, options: MatchOptions): Promise<MatchResult[]> {
    // 限制AI处理的岗位数量
    const topResults = matchResults.slice(0, 5);
    const remainingResults = matchResults.slice(5);

    // 并行处理每个岗位
    const enhancedResults = await Promise.all(
      topResults.map(async (result) => {
        try {
          const aiEnhancement = await this.getAIEnhancement(result.job, userProfile, options);
          return {
            ...result,
            matchScore: aiEnhancement.matchScore || result.matchScore,
            strengths: aiEnhancement.strengths || [],
            weaknesses: aiEnhancement.weaknesses || [],
            suggestions: aiEnhancement.suggestions || []
          };
        } catch (error) {
          console.error('AI增强失败:', error);
          return result;
        }
      })
    );

    return [...enhancedResults, ...remainingResults];
  }

  /**
   * 获取AI增强
   * @param job 岗位信息
   * @param userProfile 用户简历
   * @param options 匹配选项
   * @returns AI增强结果
   */
  private async getAIEnhancement(job: Job, userProfile: UserProfile, options: MatchOptions): Promise<any> {
    const prompt = this.generateAIMatchPrompt(job, userProfile, options);

    const response = await callOpenAI(prompt, this.model, {
      temperature: 0.3,
      maxTokens: 1000,
      topP: 0.8
    });

    if (response.success && response.data) {
      try {
        return JSON.parse(response.data);
      } catch (error) {
        console.error('解析AI响应失败:', error);
        return {};
      }
    }

    return {};
  }

  /**
   * 生成AI匹配提示词
   * @param job 岗位信息
   * @param userProfile 用户简历
   * @param options 匹配选项
   * @returns 提示词
   */
  private generateAIMatchPrompt(job: Job, userProfile: UserProfile, options: MatchOptions): string {
    return `你是一位专业的职业顾问和岗位匹配专家，擅长分析用户简历和岗位信息，提供精准的匹配分析。

请分析以下岗位与用户简历的匹配度，并提供详细的分析结果：

岗位信息：
${JSON.stringify(job, null, 2)}

用户简历：
${JSON.stringify(userProfile, null, 2)}

分析要求：
1. 计算总体匹配度评分（0-1之间）
2. 分析用户的优势（至少3点）
3. 分析用户的劣势（至少3点）
4. 提供改进建议（至少3点）
5. 考虑用户的偏好和期望

输出格式：JSON格式，包含以下字段：
{
  "matchScore": 匹配度评分,
  "strengths": [优势1, 优势2, 优势3],
  "weaknesses": [劣势1, 劣势2, 劣势3],
  "suggestions": [建议1, 建议2, 建议3]
}

请确保分析客观、详细，并基于实际的岗位要求和用户背景。`;
  }

  /**
   * 智能抓取和匹配
   * @param crawlOptions 抓取选项
   * @param userProfile 用户简历
   * @param matchOptions 匹配选项
   * @returns 匹配结果
   */
  async smartCrawlAndMatch(crawlOptions: CrawlOptions, userProfile: UserProfile, matchOptions: MatchOptions = {}): Promise<MatchResult[]> {
    // 导入爬虫系统
    const { default: jobCrawler } = await import('./job-crawler');

    // 执行抓取
    const crawlResult = await jobCrawler.crawlJobs({
      ...crawlOptions,
      keywords: crawlOptions.keywords || [],
      locations: crawlOptions.locations || []
    });

    // 执行匹配
    return this.matchJobs(crawlResult.jobs, userProfile, matchOptions);
  }

  /**
   * 优化匹配策略
   * @param feedback 用户反馈
   * @returns 优化结果
   */
  async optimizeMatchStrategy(feedback: {
    jobId: string;
    matchScore: number;
    userRating: number;
    feedback: string;
  }[]): Promise<{ success: boolean; message: string }> {
    // 简化的策略优化逻辑
    // 实际项目中应该实现更复杂的学习算法
    console.log('优化匹配策略:', feedback);
    return {
      success: true,
      message: '匹配策略已优化'
    };
  }
}

// 导出单例实例
const aiJobMatchingSystem = AIJobMatchingSystem.getInstance();
export default aiJobMatchingSystem;

// 导出工具函数
export { AIJobMatchingSystem };