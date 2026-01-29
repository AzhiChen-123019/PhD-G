// AI服务模块 - 处理OpenAI API调用

import { AIPromptConfig } from './admin-types';

// OpenAI API配置
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * AI提示词类型
 */
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

/**
 * AI服务响应接口
 */
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
 * 批量分析岗位信息
 * @param jobs 岗位列表
 * @param userProfile 用户简历信息
 * @returns 分析结果列表
 */
export const batchAnalyzeJobs = async (
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
