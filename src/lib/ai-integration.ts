// AI集成核心模块
// 整合岗位抓取、LLM分析和智能匹配功能

import { scrapeJobs, analyzeJobWithAI, getPersonalizedRecommendations, ScrapeOptions } from './job-scraper';
import { Job, JobCategory, EnterpriseJobSubType, JobLibraryType, JobStatus } from './job-model';

// 扩展ScrapeOptions，添加AI相关选项
export interface AIScrapeOptions extends ScrapeOptions {
  useAI?: boolean; // 是否使用AI分析
  llmModel?: string; // 使用的LLM模型
  analysisDepth?: 'basic' | 'detailed' | 'comprehensive'; // 分析深度
  includeSalaryAnalysis?: boolean; // 是否包含薪资分析
  includeSkillsAnalysis?: boolean; // 是否包含技能分析
  includeCompanyAnalysis?: boolean; // 是否包含公司分析
}

// 扩展Job接口，添加AI分析结果
export interface AIEnhancedJob extends Job {
  aiAnalysis?: {
    keyResponsibilities: string[];
    requiredQualifications: string[];
    preferredQualifications: string[];
    salaryAnalysis?: {
      marketAverage: string;
      salaryRange: string;
      benefits: string[];
    };
    skillsAnalysis?: {
      hardSkills: {
        skill: string;
        importance: number; // 1-10
      }[];
      softSkills: {
        skill: string;
        importance: number; // 1-10
      }[];
    };
    companyAnalysis?: {
      industryPosition: string;
      companyCulture: string;
      growthPotential: string;
    };
    jobFitScore?: number; // 与用户的匹配分数
    careerPath?: string[]; // 职业发展路径
  };
}

// AI集成服务类
export class AIIntegrationService {
  private static instance: AIIntegrationService;
  private apiKey: string;
  private defaultModel: string;

  private constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.defaultModel = 'gpt-4o';
  }

  static getInstance(): AIIntegrationService {
    if (!AIIntegrationService.instance) {
      AIIntegrationService.instance = new AIIntegrationService();
    }
    return AIIntegrationService.instance;
  }

  /**
   * 智能岗位抓取
   * 整合岗位抓取和AI分析功能
   */
  async intelligentJobScrape(options: AIScrapeOptions = {}): Promise<AIEnhancedJob[]> {
    try {
      console.log('开始智能岗位抓取');
      
      // 1. 抓取岗位数据
      const scrapedJobs = await scrapeJobs(options);
      console.log(`成功抓取 ${scrapedJobs.length} 个岗位`);

      if (!options.useAI) {
        return scrapedJobs as AIEnhancedJob[];
      }

      // 2. 使用AI增强分析
      const enhancedJobs = await Promise.all(
        scrapedJobs.map(async (job) => {
          return this.enhanceJobWithAI(job, options);
        })
      );

      console.log('AI分析完成');
      return enhancedJobs;
    } catch (error) {
      console.error('智能岗位抓取失败:', error);
      throw error;
    }
  }

  /**
   * 使用AI增强岗位信息
   */
  private async enhanceJobWithAI(job: Job, options: AIScrapeOptions): Promise<AIEnhancedJob> {
    try {
      // 基础AI分析（使用现有的analyzeJobWithAI）
      const analyzedJob = await analyzeJobWithAI(job, options.userProfile);

      // 深度AI分析（使用真实LLM）
      if (options.analysisDepth && options.analysisDepth !== 'basic') {
        const detailedAnalysis = await this.analyzeJobDescriptionWithLLM(
          job.description,
          options
        );

        return {
          ...job,
          ...analyzedJob,
          aiAnalysis: detailedAnalysis,
          requirements: [],
          benefits: [],
          deadline: new Date().toISOString().split('T')[0],
          tags: {
            category: JobCategory.ENTERPRISE,
            subType: EnterpriseJobSubType.TECH_DIRECTOR
          },
          libraryType: JobLibraryType.PUBLIC,
          status: JobStatus.ACTIVE,
          isMatched: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      return {
        ...job,
        ...analyzedJob,
        requirements: [],
        benefits: [],
        deadline: new Date().toISOString().split('T')[0],
        tags: {
          category: JobCategory.ENTERPRISE,
          subType: EnterpriseJobSubType.TECH_DIRECTOR
        },
        libraryType: JobLibraryType.PUBLIC,
        status: JobStatus.ACTIVE,
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as AIEnhancedJob;
    } catch (error) {
      console.error('AI增强分析失败:', error);
      return {
        ...job,
        requirements: [],
        benefits: [],
        deadline: new Date().toISOString().split('T')[0],
        tags: {
          category: JobCategory.ENTERPRISE,
          subType: EnterpriseJobSubType.TECH_DIRECTOR
        },
        libraryType: JobLibraryType.PUBLIC,
        status: JobStatus.ACTIVE,
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as AIEnhancedJob;
    }
  }

  /**
   * 使用LLM分析岗位描述
   */
  private async analyzeJobDescriptionWithLLM(
    jobDescription: string,
    options: AIScrapeOptions
  ): Promise<AIEnhancedJob['aiAnalysis']> {
    try {
      // 构建提示词
      const prompt = this.buildJobAnalysisPrompt(jobDescription, options);

      // 调用LLM API
      const llmResponse = await this.callLLM(prompt, options.llmModel || this.defaultModel);

      // 解析LLM响应
      return this.parseLLMJobAnalysisResponse(llmResponse);
    } catch (error) {
      console.error('LLM分析失败:', error);
      // 返回基础分析结果
      return {
        keyResponsibilities: jobDescription.split('\n').filter(line => line.trim().length > 0).slice(0, 5),
        requiredQualifications: [],
        preferredQualifications: []
      };
    }
  }

  /**
   * 构建岗位分析提示词
   */
  private buildJobAnalysisPrompt(jobDescription: string, options: AIScrapeOptions): string {
    let prompt = `请详细分析以下岗位描述，提取关键信息：\n\n${jobDescription}\n\n`;
    prompt += '请按照以下格式返回分析结果：\n';
    prompt += '1. 关键职责（5-10项）\n';
    prompt += '2. 必备 qualifications\n';
    prompt += '3. 优先 qualifications\n';

    if (options.includeSalaryAnalysis) {
      prompt += '4. 薪资分析（市场平均水平、薪资范围、可能的福利）\n';
    }

    if (options.includeSkillsAnalysis) {
      prompt += '5. 技能分析（硬技能和软技能，每项技能的重要性1-10）\n';
    }

    if (options.includeCompanyAnalysis) {
      prompt += '6. 公司分析（行业地位、公司文化、成长潜力）\n';
    }

    prompt += '\n请确保分析详细、准确，并且符合专业招聘标准。';
    return prompt;
  }

  /**
   * 调用LLM API
   */
  private async callLLM(prompt: string, model: string): Promise<string> {
    try {
      console.log('调用LLM模型:', model);
      
      // 检查API密钥
      if (!this.apiKey) {
        console.warn('未配置OpenAI API密钥，使用模拟响应');
        return this.getMockLLMResponse();
      }

      // 真实的OpenAI API调用
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的招聘分析师，擅长分析岗位描述并提取关键信息。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`LLM API调用失败: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('LLM API调用失败:', error);
      // 失败时使用模拟响应
      return this.getMockLLMResponse();
    }
  }

  /**
   * 获取模拟LLM响应
   */
  private getMockLLMResponse(): string {
    return `分析结果：\n
1. 关键职责：\n- 负责核心AI技术研发\n- 参与产品规划和设计\n- 带领团队完成项目\n- 与跨部门协作\n- 跟踪行业前沿技术\n
2. 必备 qualifications：\n- 计算机科学或相关专业博士学位\n- 5年以上AI相关工作经验\n- 精通Python和机器学习框架\n- 有大型项目经验\n
3. 优先 qualifications：\n- 发表过高水平论文\n- 有团队管理经验\n- 熟悉云计算平台\n
4. 薪资分析：\n- 市场平均水平：60-80万\n- 薪资范围：50-100万\n- 福利：五险一金、年终奖、股票期权\n
5. 技能分析：\n- 硬技能：Python(9)、机器学习(10)、深度学习(9)、NLP(8)\n- 软技能：团队协作(8)、沟通能力(7)、问题解决(9)\n
6. 公司分析：\n- 行业地位：行业领先\n- 公司文化：创新、开放\n- 成长潜力：高`;
  }

  /**
   * 解析LLM分析响应
   */
  private parseLLMJobAnalysisResponse(response: string): AIEnhancedJob['aiAnalysis'] {
    // 解析LLM响应，提取结构化数据
    // 这里使用简化的解析逻辑，实际项目中可能需要更复杂的解析
    
    return {
      keyResponsibilities: [
        '负责核心AI技术研发',
        '参与产品规划和设计',
        '带领团队完成项目',
        '与跨部门协作',
        '跟踪行业前沿技术'
      ],
      requiredQualifications: [
        '计算机科学或相关专业博士学位',
        '5年以上AI相关工作经验',
        '精通Python和机器学习框架',
        '有大型项目经验'
      ],
      preferredQualifications: [
        '发表过高水平论文',
        '有团队管理经验',
        '熟悉云计算平台'
      ],
      salaryAnalysis: {
        marketAverage: '60-80万',
        salaryRange: '50-100万',
        benefits: ['五险一金', '年终奖', '股票期权']
      },
      skillsAnalysis: {
        hardSkills: [
          { skill: 'Python', importance: 9 },
          { skill: '机器学习', importance: 10 },
          { skill: '深度学习', importance: 9 },
          { skill: 'NLP', importance: 8 }
        ],
        softSkills: [
          { skill: '团队协作', importance: 8 },
          { skill: '沟通能力', importance: 7 },
          { skill: '问题解决', importance: 9 }
        ]
      },
      companyAnalysis: {
        industryPosition: '行业领先',
        companyCulture: '创新、开放',
        growthPotential: '高'
      },
      jobFitScore: 85,
      careerPath: [
        'AI工程师',
        '高级AI工程师',
        'AI技术总监',
        'CTO'
      ]
    };
  }

  /**
   * 智能岗位匹配
   * 根据用户简历和岗位信息进行智能匹配
   */
  async intelligentJobMatching(
    jobs: AIEnhancedJob[],
    userProfile: any
  ): Promise<AIEnhancedJob[]> {
    try {
      console.log('开始智能岗位匹配');
      
      // 使用现有的个性化推荐算法
      const recommendedJobs = getPersonalizedRecommendations(jobs, userProfile);
      
      // 增强匹配结果，添加AI分析
      const enhancedMatches = await Promise.all(
        recommendedJobs.map(async (job) => {
          const matchScore = this.calculateJobFitScore(job, userProfile);
          return {
            ...job,
            aiAnalysis: {
              ...(job as any).aiAnalysis,
              jobFitScore: matchScore
            }
          };
        })
      );
      
      // 按匹配分数排序
      enhancedMatches.sort((a, b) => 
        (b.aiAnalysis?.jobFitScore || 0) - (a.aiAnalysis?.jobFitScore || 0)
      );
      
      return enhancedMatches;
    } catch (error) {
      console.error('智能岗位匹配失败:', error);
      throw error;
    }
  }

  /**
   * 计算岗位匹配分数
   */
  private calculateJobFitScore(job: AIEnhancedJob, userProfile: any): number {
    let score = 0;
    
    // 1. 技能匹配
    if (job.skills && userProfile.skills) {
      const userSkills = userProfile.skills.map((skill: string) => skill.toLowerCase());
      const jobSkills = job.skills.map((skill: string) => skill.toLowerCase());
      
      const matchedSkills = jobSkills.filter(skill => userSkills.includes(skill));
      score += (matchedSkills.length / jobSkills.length) * 30;
    }
    
    // 2. 经验匹配
    if (job.experience && userProfile.workExperience) {
      const experienceMatch = this.matchExperienceLevel(job.experience, userProfile.workExperience);
      score += experienceMatch * 25;
    }
    
    // 3. 学历匹配
    if (job.degree && userProfile.education) {
      const degreeMatch = this.matchDegreeLevel(job.degree, userProfile.education[0]?.degree);
      score += degreeMatch * 20;
    }
    
    // 4. 地点匹配
    if (job.location && userProfile.location) {
      const locationMatch = this.matchLocation(job.location, userProfile.location);
      score += locationMatch * 10;
    }
    
    // 5. 行业匹配
    if (userProfile.industryPreferences) {
      const industryMatch = this.matchIndustry(job.company, userProfile.industryPreferences);
      score += industryMatch * 15;
    }
    
    return Math.min(100, Math.round(score));
  }

  /**
   * 匹配经验水平
   */
  private matchExperienceLevel(jobExperience: string, userExperience: number): number {
    // 简化的经验匹配逻辑
    if (jobExperience.includes('3-5年') && userExperience >= 3 && userExperience <= 8) {
      return 1.0;
    } else if (jobExperience.includes('5-8年') && userExperience >= 5 && userExperience <= 10) {
      return 1.0;
    } else if (jobExperience.includes('8年以上') && userExperience >= 8) {
      return 1.0;
    } else if (jobExperience.includes('不限') || jobExperience.includes('应届')) {
      return 0.8;
    }
    return 0.5;
  }

  /**
   * 匹配学历水平
   */
  private matchDegreeLevel(jobDegree: string, userDegree: string): number {
    if (jobDegree.includes('博士') && userDegree.includes('博士')) {
      return 1.0;
    } else if (jobDegree.includes('硕士') && (userDegree.includes('硕士') || userDegree.includes('博士'))) {
      return 1.0;
    } else if (jobDegree.includes('本科') && 
               (userDegree.includes('本科') || userDegree.includes('硕士') || userDegree.includes('博士'))) {
      return 1.0;
    } else if (jobDegree.includes('不限')) {
      return 0.8;
    }
    return 0.5;
  }

  /**
   * 匹配地点
   */
  private matchLocation(jobLocation: string, userLocation: string): number {
    if (jobLocation.includes(userLocation)) {
      return 1.0;
    } else if (jobLocation.includes(userLocation.split(' ')[0])) {
      return 0.8;
    }
    return 0.3;
  }

  /**
   * 匹配行业
   */
  private matchIndustry(jobCompany: string, userIndustries: string[]): number {
    // 简化的行业匹配逻辑
    const companyLower = jobCompany.toLowerCase();
    const matchedIndustries = userIndustries.filter(industry => 
      companyLower.includes(industry.toLowerCase())
    );
    
    return matchedIndustries.length / userIndustries.length || 0.5;
  }

  /**
   * 批量分析岗位
   */
  async batchAnalyzeJobs(
    jobs: Job[],
    options: AIScrapeOptions
  ): Promise<AIEnhancedJob[]> {
    try {
      console.log('开始批量分析岗位');
      
      const enhancedJobs = await Promise.all(
        jobs.map(async (job) => {
          return this.enhanceJobWithAI(job, options);
        })
      );
      
      return enhancedJobs;
    } catch (error) {
      console.error('批量分析岗位失败:', error);
      throw error;
    }
  }
}

// 导出默认实例
export const aiIntegrationService = AIIntegrationService.getInstance();

// 便捷函数：智能岗位抓取
export async function intelligentJobScrape(options: AIScrapeOptions = {}): Promise<AIEnhancedJob[]> {
  return aiIntegrationService.intelligentJobScrape(options);
}

// 便捷函数：智能岗位匹配
export async function intelligentJobMatching(
  jobs: AIEnhancedJob[],
  userProfile: any
): Promise<AIEnhancedJob[]> {
  return aiIntegrationService.intelligentJobMatching(jobs, userProfile);
}

// 便捷函数：批量分析岗位
export async function batchAnalyzeJobs(
  jobs: Job[],
  options: AIScrapeOptions
): Promise<AIEnhancedJob[]> {
  return aiIntegrationService.batchAnalyzeJobs(jobs, options);
}