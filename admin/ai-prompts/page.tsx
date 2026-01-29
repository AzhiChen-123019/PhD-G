'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AIPromptConfig } from '@/lib/admin-types';

// 本地存储键名
const AI_PROMPTS_KEY = 'aiPromptConfigs';

// 生成默认AI提示词配置
const generateDefaultAiPrompts = (): AIPromptConfig[] => {
  return [
    // 分类1：岗位相关
    {
      id: 'university-job-scrape-1',
      type: 'universityJobScrape',
      name: '大学科研岗位抓取提示词',
      prompt: `你是一位专业的岗位爬虫专家，请根据以下要求抓取全球范围内的实时真实招聘岗位：

1. 抓取目标：全球知名大学和科研机构的学术岗位
2. 岗位类型：教授/副教授、博士后研究员、研究助理教授等
3. 学历要求：博士及以上
4. 岗位特点：
   - 提供详细的岗位描述
   - 明确的薪资范围
   - 清晰的申请截止日期
   - 完整的联系方式
5. 抓取限制：
   - 单批次抓取时长不超过10秒
   - 单批次最多返回15个高质量岗位
   - 优先返回最近发布的岗位（30天内）
   - 避免重复抓取同一岗位
6. 输出格式：JSON格式，包含以下字段：
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

请确保抓取的岗位真实有效，覆盖全球主要国家和地区，符合我们网站的用户群体需求。`,
      parameters: {
        temperature: 0.2,
        maxTokens: 2000,
        topP: 0.7
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'enterprise-job-scrape-1',
      type: 'enterpriseJobScrape',
      name: '企业高级岗位抓取提示词',
      prompt: `你是一位专业的岗位爬虫专家，请根据以下要求抓取全球范围内的实时真实高级招聘岗位：

1. 抓取目标：全球企业的高级管理和技术岗位
2. 岗位类型：技术总监、首席科学家、研发经理、高级工程师等
3. 学历要求：硕士及以上，优先考虑博士
4. 岗位特点：
   - 提供详细的岗位描述
   - 明确的薪资范围
   - 清晰的申请截止日期
   - 完整的联系方式
5. 抓取限制：
   - 单批次抓取时长不超过10秒
   - 单批次最多返回25个高质量岗位
   - 优先返回最近发布的岗位（30天内）
   - 避免重复抓取同一岗位
6. 输出格式：JSON格式，包含以下字段：
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

请确保抓取的岗位真实有效，覆盖全球主要国家和地区，符合我们网站的用户群体需求。`,
      parameters: {
        temperature: 0.2,
        maxTokens: 2000,
        topP: 0.7
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'private-job-scrape-1',
      type: 'privateJobScrape',
      name: '我的私人岗位抓取提示词',
      prompt: `你是一位专业的岗位爬虫专家，请根据用户简历信息和偏好，抓取个性化的私人岗位：

用户简历信息：
{resumeInfo}

用户偏好：
{userPreferences}

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

请确保抓取的岗位真实有效，符合用户的个性化需求。`,
      parameters: {
        temperature: 0.3,
        maxTokens: 1500,
        topP: 0.8
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    
    // 分类2：简历相关
    {
      id: 'upload-analyze-resume-1',
      type: 'uploadAnalyzeResume',
      name: '上传并分析简历提示词',
      prompt: `你是一位专业的简历分析专家，请根据用户上传的简历内容，进行全面的分析：

用户简历内容：
{resumeContent}

请从以下几个方面进行分析：
1. 简历完整性评估
2. 技能匹配度分析
3. 经验与学历匹配
4. 职业发展连贯性
5. 简历亮点识别

请按照结构化格式输出分析结果，清晰明了。`,
      parameters: {
        temperature: 0.4,
        maxTokens: 1000,
        topP: 0.8
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'resume-report-generate-1',
      type: 'resumeReportGenerate',
      name: '简历分析报告生成提示词',
      prompt: `你是一位专业的职业顾问，请根据简历分析结果，生成详细的简历分析报告：

简历分析结果：
{analysisResults}

报告要求：
1. 包含个人信息摘要
2. 分项评分（教育背景、工作经验、技能水平、成就荣誉、职业目标）
3. 市场分析
4. 职业路径建议
5. 推荐建议
6. 改进建议

请按照正式报告格式输出，结构清晰，语言专业。`,
      parameters: {
        temperature: 0.3,
        maxTokens: 1500,
        topP: 0.8
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'resume-optimize-1',
      type: 'resumeOptimize',
      name: '智能优化简历提示词',
      prompt: `你是一位专业的简历优化专家，请根据用户的原始简历和目标岗位描述，优化用户的简历，使其更符合岗位要求。

原始简历：
{originalResume}

目标岗位描述：
{jobDescription}

优化要求：
1. 突出与岗位相关的技能和经验
2. 使用更专业、更有吸引力的语言
3. 调整简历结构，使其更清晰、易读
4. 增加与岗位相关的关键词
5. 保持简历的真实性和完整性

请按照优化后的简历格式输出，不要包含任何额外的解释或说明。`,
      parameters: {
        temperature: 0.5,
        maxTokens: 1000,
        topP: 0.9
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    
    // 分类3：邮件相关
    {
      id: 'get-recruit-email-1',
      type: 'getRecruitEmail',
      name: '获取招聘邮箱提示词',
      prompt: `你是一位专业的信息获取专家，请根据以下岗位信息，获取招聘邮箱或联系方式：

岗位信息：
{jobInfo}

1. 获取目标：招聘负责人邮箱或官方招聘邮箱
2. 获取方式：从岗位描述、公司官网或其他可信渠道提取
3. 输出格式：JSON格式，包含以下字段：
   - email: 招聘邮箱
   - name: 联系人姓名（如有）
   - position: 联系人职位（如有）
   - source: 信息来源

请确保获取的邮箱真实有效。`,
      parameters: {
        temperature: 0.2,
        maxTokens: 500,
        topP: 0.7
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'generate-cover-email-1',
      type: 'generateCoverEmail',
      name: '生成本岗位自荐邮件提示词',
      prompt: `你是一位专业的求职信撰写专家，请根据用户简历和岗位信息，生成本岗位的自荐邮件：

用户简历信息：
{resumeInfo}

岗位信息：
{jobInfo}

邮件要求：
1. 包含主题、称呼、正文、结尾和签名
2. 突出用户与岗位的匹配点
3. 语言专业、简洁、有吸引力
4. 体现用户对岗位的兴趣和诚意
5. 引导招聘方进一步联系

请按照正式邮件格式输出，内容个性化，避免模板化。`,
      parameters: {
        temperature: 0.4,
        maxTokens: 1000,
        topP: 0.8
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    
    // 分类4：用户验证
    {
      id: 'education-verification-1',
      type: 'educationVerification',
      name: '学历验证AI提示词',
      prompt: `你是一位专业的学历验证专家，请根据用户上传的学历证明文件（支持PDF、Word、图片等格式，以及多种语言），提取以下学历信息：

1. 最高学历
2. 毕业院校
3. 毕业时间
4. 学科专业

请确保提取的信息准确完整，支持识别多种语言的学历证明文件。如果某些信息无法提取，请返回空字符串。

输出格式：JSON格式，包含以下字段：
{
  "highestDegree": "",
  "graduationSchool": "",
  "graduationDate": "",
  "major": ""
}

注意：
1. 支持中文、英文、日文、韩文等多种语言
2. 能够处理不同国家的学历证明格式
3. 提取结果必须准确无误
4. 无法提取的信息请返回空字符串
5. 确保输出是有效的JSON格式`,
      parameters: {
        temperature: 0.2,
        maxTokens: 1000,
        topP: 0.7
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

// 获取所有AI提示词配置
const getAllAiPrompts = (): AIPromptConfig[] => {
  const promptsJson = localStorage.getItem(AI_PROMPTS_KEY);
  if (promptsJson) {
    try {
      const parsedPrompts = JSON.parse(promptsJson);
      // 如果解析后的数据为空数组或无效，生成默认数据
      if (!Array.isArray(parsedPrompts) || parsedPrompts.length === 0) {
        const defaultPrompts = generateDefaultAiPrompts();
        localStorage.setItem(AI_PROMPTS_KEY, JSON.stringify(defaultPrompts));
        return defaultPrompts;
      }
      
      // 检查是否包含新添加的用户验证分类提示词
      const hasEducationVerification = parsedPrompts.some(prompt => prompt.type === 'educationVerification');
      if (!hasEducationVerification) {
        // 如果没有，添加缺失的提示词
        const defaultPrompts = generateDefaultAiPrompts();
        const educationVerificationPrompt = defaultPrompts.find(prompt => prompt.type === 'educationVerification');
        if (educationVerificationPrompt) {
          const updatedPrompts = [...parsedPrompts, educationVerificationPrompt];
          localStorage.setItem(AI_PROMPTS_KEY, JSON.stringify(updatedPrompts));
          return updatedPrompts;
        }
      }
      
      return parsedPrompts;
    } catch (error) {
      console.error('解析AI提示词数据失败，使用默认配置:', error);
      const defaultPrompts = generateDefaultAiPrompts();
      localStorage.setItem(AI_PROMPTS_KEY, JSON.stringify(defaultPrompts));
      return defaultPrompts;
    }
  } else {
    // 生成并保存默认数据
    const defaultPrompts = generateDefaultAiPrompts();
    localStorage.setItem(AI_PROMPTS_KEY, JSON.stringify(defaultPrompts));
    return defaultPrompts;
  }
};

// 保存AI提示词配置
const saveAiPrompts = (prompts: AIPromptConfig[]) => {
  localStorage.setItem(AI_PROMPTS_KEY, JSON.stringify(prompts));
};

export default function AiPromptsPage() {
  const [prompts, setPrompts] = useState<AIPromptConfig[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<AIPromptConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [filteredPrompts, setFilteredPrompts] = useState<AIPromptConfig[]>([]);

  // 按类别分组的类型映射
  const categoryTypeMap: Record<string, string[]> = {
    '岗位相关': ['universityJobScrape', 'enterpriseJobScrape', 'privateJobScrape'],
    '简历相关': ['uploadAnalyzeResume', 'resumeReportGenerate', 'resumeOptimize'],
    '邮件相关': ['getRecruitEmail', 'generateCoverEmail'],
    '用户验证': ['educationVerification']
  };

  // 初始化数据
  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        const allPrompts = getAllAiPrompts();
        setPrompts(allPrompts);
        setFilteredPrompts(allPrompts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching AI prompts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 过滤提示词
  useEffect(() => {
    if (filter === 'all') {
      setFilteredPrompts(prompts);
    } else {
      const types = categoryTypeMap[filter] || [];
      const filtered = prompts.filter(prompt => types.includes(prompt.type));
      setFilteredPrompts(filtered);
    }
  }, [filter, prompts]);

  // 编辑提示词
  const handleEditPrompt = (prompt: AIPromptConfig) => {
    setEditingPrompt({ ...prompt });
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingPrompt(null);
  };

  // 保存提示词修改
  const handleSavePrompt = () => {
    if (!editingPrompt) return;

    try {
      const updatedPrompts = prompts.map(prompt => 
        prompt.id === editingPrompt.id ? {
          ...editingPrompt,
          updatedAt: new Date().toISOString()
        } : prompt
      );
      
      setPrompts(updatedPrompts);
      saveAiPrompts(updatedPrompts);
      setEditingPrompt(null);
      alert('提示词保存成功！');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
      console.error('Error saving AI prompt:', err);
      alert('保存失败：' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  // 切换提示词状态
  const togglePromptStatus = (promptId: string) => {
    try {
      const updatedPrompts = prompts.map(prompt => 
        prompt.id === promptId ? {
          ...prompt,
          isActive: !prompt.isActive,
          updatedAt: new Date().toISOString()
        } : prompt
      );
      
      setPrompts(updatedPrompts);
      saveAiPrompts(updatedPrompts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
      console.error('Error toggling prompt status:', err);
      alert('操作失败：' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* 侧边栏导航 */}
        <div className="w-64 bg-secondary text-white flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold">管理控制面板</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>仪表盘</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/users">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>用户管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/jobs">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>岗位管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/application-materials">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>申请材料配置</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/api-costs">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>API费用跟踪</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/membership-revenue">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>会员与收入管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/ai-prompts">
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>AI提示词管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/membership-rules">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>会员规则配置</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/pages">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>页面管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/navigation">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>导航管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/content-blocks">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <span>内容区块管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/media">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>媒体库管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/data">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>数据管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/settings">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>系统设置</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                AD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">超级管理员</p>
                <p className="text-xs text-gray-300">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 主内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">AI提示词管理</h1>
              <p className="text-gray-600">管理岗位匹配度分析、简历优化和岗位抓取的AI提示词</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* 筛选器 */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">筛选条件</h2>
              <div className="flex gap-4">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)} 
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">所有类型</option>
                  <option value="岗位相关">岗位相关</option>
                  <option value="简历相关">简历相关</option>
                  <option value="邮件相关">邮件相关</option>
                  <option value="用户验证">用户验证</option>
                </select>
              </div>
            </div>
            
            {/* 提示词列表 */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI提示词列表</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">加载提示词数据中...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-600">
                  <p>加载提示词数据失败: {error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPrompts.length > 0 ? (
                  filteredPrompts.map(prompt => (
                    <div key={prompt.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{prompt.name}</h3>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${categoryTypeMap['岗位相关'].includes(prompt.type) ? 'bg-blue-100 text-blue-800' : 
                                  categoryTypeMap['简历相关'].includes(prompt.type) ? 'bg-green-100 text-green-800' : 
                                  categoryTypeMap['邮件相关'].includes(prompt.type) ? 'bg-purple-100 text-purple-800' : 
                                  categoryTypeMap['用户验证'].includes(prompt.type) ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}
                              >
                                {categoryTypeMap['岗位相关'].includes(prompt.type) ? '岗位相关' : 
                                  categoryTypeMap['简历相关'].includes(prompt.type) ? '简历相关' : 
                                  categoryTypeMap['邮件相关'].includes(prompt.type) ? '邮件相关' : 
                                  categoryTypeMap['用户验证'].includes(prompt.type) ? '用户验证' : '其他'}
                              </span>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prompt.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {prompt.isActive ? '启用' : '禁用'}
                              </span>
                            </div>
                          <div className="text-sm text-gray-600 mb-3">
                            创建时间: {new Date(prompt.createdAt).toLocaleString()} | 更新时间: {new Date(prompt.updatedAt).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-800 mb-4">
                            {prompt.prompt.substring(0, 200)}...
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => togglePromptStatus(prompt.id)}
                              className={`px-3 py-1 rounded-md text-sm ${prompt.isActive ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-green-100 text-green-800 hover:bg-green-200'} transition-colors`}
                            >
                              {prompt.isActive ? '禁用' : '启用'}
                            </button>
                            <button
                              onClick={() => handleEditPrompt(prompt)}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors"
                            >
                              编辑
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <p>未找到匹配的AI提示词</p>
                    <p className="text-sm mt-2">请尝试更改筛选条件或添加新的提示词</p>
                  </div>
                )}
                </div>
              )}
            </div>
            
            {/* 编辑提示词 */}
            {editingPrompt && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    编辑AI提示词: {editingPrompt.name}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSavePrompt}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* 提示词名称 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">提示词名称</label>
                    <input
                      type="text"
                      value={editingPrompt.name}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="输入提示词名称"
                    />
                  </div>
                  
                  {/* 提示词类型 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">提示词类型</label>
                    <select
                      value={editingPrompt.type}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, type: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {/* 岗位相关 */}
                      <optgroup label="岗位相关">
                        <option value="universityJobScrape">大学科研岗位抓取提示词</option>
                        <option value="enterpriseJobScrape">企业高级岗位抓取提示词</option>
                        <option value="privateJobScrape">我的私人岗位抓取提示词</option>
                      </optgroup>
                      
                      {/* 简历相关 */}
                      <optgroup label="简历相关">
                        <option value="uploadAnalyzeResume">上传并分析简历提示词</option>
                        <option value="resumeReportGenerate">简历分析报告生成提示词</option>
                        <option value="resumeOptimize">智能优化简历提示词</option>
                      </optgroup>
                      
                      {/* 邮件相关 */}
                      <optgroup label="邮件相关">
                        <option value="getRecruitEmail">获取招聘邮箱提示词</option>
                        <option value="generateCoverEmail">生成本岗位自荐邮件提示词</option>
                      </optgroup>
                      
                      {/* 用户验证 */}
                      <optgroup label="用户验证">
                        <option value="educationVerification">学历验证AI提示词</option>
                      </optgroup>
                    </select>
                  </div>
                  
                  {/* 提示词内容 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">提示词内容</label>
                    <textarea
                      value={editingPrompt.prompt}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={10}
                      placeholder="输入提示词内容"
                    ></textarea>
                  </div>
                  
                  {/* 参数配置 */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">参数配置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (0-2)</label>
                        <input
                          type="number"
                          min="0"
                          max="2"
                          step="0.1"
                          value={editingPrompt.parameters.temperature}
                          onChange={(e) => setEditingPrompt({
                            ...editingPrompt,
                            parameters: {
                              ...editingPrompt.parameters,
                              temperature: parseFloat(e.target.value) || 0
                            }
                          })}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={editingPrompt.parameters.maxTokens}
                          onChange={(e) => setEditingPrompt({
                            ...editingPrompt,
                            parameters: {
                              ...editingPrompt.parameters,
                              maxTokens: parseInt(e.target.value) || 1
                            }
                          })}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Top P (0-1)</label>
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={editingPrompt.parameters.topP}
                          onChange={(e) => setEditingPrompt({
                            ...editingPrompt,
                            parameters: {
                              ...editingPrompt.parameters,
                              topP: parseFloat(e.target.value) || 0
                            }
                          })}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}