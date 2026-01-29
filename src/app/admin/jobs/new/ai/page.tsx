'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Job, JobCategory, JobStatus, JobLibraryType, EnterpriseJobSubType, UniversityJobSubType } from '@/lib/job-model';

export default function AIJobPage() {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'university' | 'enterprise'>('university');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keywords) {
      setError('请输入关键词');
      return;
    }

    setError(null);
    setShowModal(true);
  };

  const handleScrapeWithCategory = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      // 调用真实的AI抓取API
      const response = await fetch('/api/ai-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'scrapeJobs',
          data: {
            options: {
              keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
              locations: location ? location.split(',').map(l => l.trim()) : [],
              jobTypes: [selectedCategory === 'university' ? 'university' : 'enterprise'],
              maxResults: 10,
              useAI: true,
              analysisDepth: 'comprehensive',
              includeSalaryAnalysis: true,
              includeSkillsAnalysis: true,
              includeCompanyAnalysis: true
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('API调用失败');
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || '抓取失败');
      }

      // 转换API返回的数据格式以匹配前端期望的格式
      const formattedResults = result.data.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        description: job.description,
        requirements: job.aiAnalysis?.requiredQualifications?.join('\n') || job.requirements?.join('\n') || '',
        benefits: job.aiAnalysis?.salaryAnalysis?.benefits?.join('\n') || job.benefits?.join('\n') || '',
        aiAnalysis: job.aiAnalysis
      }));

      setResults(formattedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI抓取失败，请稍后重试');
      console.error('Error AI scraping:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData: any) => {
    setLoading(true);
    setError(null);

    try {
      // 准备新岗位数据
      const newJob: Job = {
        id: Date.now().toString(),
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        salary: jobData.salary,
        type: '全职', // 默认全职
        experience: '', // 默认为空，可后续编辑
        degree: '', // 默认为空，可后续编辑
        skills: [], // 默认空数组，可后续编辑
        description: jobData.description,
        requirements: jobData.requirements.split('\n').filter((item: string) => item.trim() !== ''),
        benefits: jobData.benefits.split('\n').filter((item: string) => item.trim() !== ''),
        postedTime: new Date().toISOString(),
        relevanceScore: 0,
        url: '',
        source: 'ai',
        viewCount: 0,
        applyCount: 0,
        rating: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: {
        category: selectedCategory === 'university' ? JobCategory.UNIVERSITY : JobCategory.ENTERPRISE, 
        subType: selectedCategory === 'university' ? UniversityJobSubType.PROFESSOR : EnterpriseJobSubType.AI_RESEARCHER  
      },
        libraryType: JobLibraryType.PUBLIC,
        status: JobStatus.ACTIVE,
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 调用API创建新岗位
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newJob)
      });

      if (!response.ok) {
        throw new Error('创建岗位失败');
      }

      // 显示成功消息并跳转到岗位列表
      alert('岗位创建成功！');
      window.location.href = '/admin/jobs';
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建岗位失败');
      console.error('Error creating job:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* 侧边栏导航 - 与仪表盘共享相同的结构 */}
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
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
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
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>会员规则配置</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/pages">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <span>页面管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/navigation">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6l8-4m0 0l8 4m-8-4v12m0 0l-8 4m8-4l8-4" />
                    </svg>
                    <span>导航管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/content-blocks">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
              <h1 className="text-2xl font-bold text-gray-900">AI抓取新岗位</h1>
              <p className="text-gray-600">使用AI抓取职位信息</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">关键词</label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    required
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="例如：AI研究员，机器学习工程师"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">地点（可选）</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="例如：北京，上海"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <Link href="/admin/jobs">
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
                    >
                      取消
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
                    disabled={loading}
                  >
                    {loading ? '抓取中...' : 'AI抓取职位'}
                  </button>
                </div>
              </form>
              
              {results.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">抓取结果</h2>
                  <div className="space-y-6">
                    {results.map((job) => (
                      <div key={job.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{job.company} · {job.location}</p>
                            <p className="text-sm font-medium text-gray-700 mt-1">{job.salary}</p>
                          </div>
                          <button
                            onClick={() => handleCreateJob(job)}
                            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md text-sm"
                            disabled={loading}
                          >
                            {loading ? '创建中...' : '创建岗位'}
                          </button>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <p className="mb-2"><strong>岗位描述：</strong>{job.description.substring(0, 100)}...</p>
                          <p><strong>岗位要求：</strong>{job.requirements.substring(0, 100)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI抓取类别选择模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">选择岗位类别</h2>
            <p className="text-gray-600 mb-6">请选择要抓取的岗位类别，系统将使用AI大模型驱动爬虫模块进行针对性抓取</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="university"
                  name="jobCategory"
                  value="university"
                  checked={selectedCategory === 'university'}
                  onChange={(e) => setSelectedCategory(e.target.value as 'university' | 'enterprise')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="university" className="ml-2 block text-sm font-medium text-gray-700">
                  大学科研岗位
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="enterprise"
                  name="jobCategory"
                  value="enterprise"
                  checked={selectedCategory === 'enterprise'}
                  onChange={(e) => setSelectedCategory(e.target.value as 'university' | 'enterprise')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="enterprise" className="ml-2 block text-sm font-medium text-gray-700">
                  企业高级岗位
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
              >
                取消
              </button>
              <button
                onClick={handleScrapeWithCategory}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
                disabled={loading}
              >
                {loading ? '抓取中...' : '开始AI抓取'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
