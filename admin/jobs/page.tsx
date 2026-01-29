'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Job, JobStatus } from '@/lib/job-model';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ category: 'all', status: 'all' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 检查点击的元素是否在下拉菜单或按钮内部
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // 处理按钮点击
  const handleButtonClick = (event: React.MouseEvent) => {
    // 阻止事件冒泡，避免触发外部点击事件
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 从API获取所有岗位数据
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // 调用API获取所有岗位
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const allJobs = await response.json();
        setJobs(allJobs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      // 调用API更新岗位状态
      const jobToUpdate = jobs.find(job => job.id === jobId);
      if (!jobToUpdate) return;
      
      const updatedJobData = {
        ...jobToUpdate,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch(`/api/jobs?id=${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedJobData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update job status');
      }
      
      const updatedJob = await response.json();
      
      // 更新本地状态
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          return updatedJob;
        }
        return job;
      });
      
      setJobs(updatedJobs);
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = filter.category === 'all' || job.tags.category === filter.category;
    const matchesStatus = filter.status === 'all' || job.status === filter.status;
    return matchesCategory && matchesStatus;
  });

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
                <Link href="/admin/dashboard" className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>仪表盘</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/users" className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>用户管理</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/jobs" className="flex items-center p-3 rounded-md bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>岗位管理</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/application-materials" className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>申请材料配置</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/api-costs" className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>API费用跟踪</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/membership-revenue" className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>会员与收入管理</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/ai-prompts" className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>AI提示词管理</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>系统设置</span>
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
              <h1 className="text-2xl font-bold text-gray-900">岗位管理</h1>
              <p className="text-gray-600">管理所有岗位信息和权限设置</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* 筛选器 */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">岗位类型</label>
                  <select 
                    value={filter.category} 
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })} 
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部</option>
                    <option value="university">大学科研岗位</option>
                    <option value="enterprise">企业高级岗位</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">岗位状态</label>
                  <select 
                    value={filter.status} 
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })} 
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部</option>
                    <option value="active">活跃</option>
                    <option value="inactive">非活跃</option>
                    <option value="expired">已过期</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* 岗位列表 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">岗位列表</h2>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={handleButtonClick} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2">
                    <span>创建新岗位</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link href="/admin/jobs/new/manual" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        手动录入
                      </Link>
                      <Link href="/admin/jobs/new/link" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        链接提取
                      </Link>
                      <Link href="/admin/jobs/new/ai" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        AI抓取
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">加载岗位数据中...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-600">
                  <p>加载岗位数据失败: {error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          岗位标题
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          公司/机构
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          地点
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          类型
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          薪资
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          浏览/申请
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-xs text-gray-500">
                              {job.tags.subType === 'professor' ? '教授/副教授' :
                               job.tags.subType === 'postdoc' ? '博士后研究员' :
                               job.tags.subType === 'researchAssistant' ? '研究助理教授' :
                               job.tags.subType === 'researchScientist' ? '研究员' :
                               job.tags.subType === 'techDirector' ? '技术总监' :
                               job.tags.subType === 'chiefScientist' ? '首席科学家' :
                               job.tags.subType === 'rManager' ? '研发经理' :
                               job.tags.subType === 'aiResearcher' ? 'AI研究员' :
                               job.tags.subType === 'dataScientist' ? '数据科学家' :
                               job.tags.subType === 'algorithmEngineer' ? '算法工程师' : job.tags.subType}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{job.company}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.tags.category === 'university' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                              {job.tags.category === 'university' ? '大学科研' : '企业高级'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{job.salary}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-800' : job.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                              {job.status === 'active' ? '活跃' : job.status === 'inactive' ? '非活跃' : '已过期'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {job.viewCount} 浏览 / {job.applyCount} 申请
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUpdateJobStatus(job.id, job.status === 'active' ? 'inactive' : 'active')}
                                className={`px-3 py-1 rounded-md text-sm ${job.status === 'active' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'} transition-colors`}
                              >
                                {job.status === 'active' ? '停用' : '激活'}
                              </button>
                              <Link href={`/admin/jobs/${job.id}`} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors">
                                编辑
                              </Link>
                              <Link href={`/admin/jobs/${job.id}/permissions`} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm hover:bg-purple-200 transition-colors">
                                权限
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {filteredJobs.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-600">没有符合条件的岗位</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}