'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { scrapeJobs, analyzeJobWithAI, batchAnalyzeJobs } from '@/lib/job-scraper';

export default function DashboardPage() {
  // 从API获取的数据
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    todayNewUsers: 0,
    personalUsers: 0,
    enterpriseUsers: 0,
    totalFiles: 0,
    emailSent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 岗位抓取状态
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingResult, setScrapingResult] = useState({ university: 0, enterprise: 0 });

  // 从API获取仪表盘数据
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 获取用户数据
        const usersResponse = await fetch('/api/admin/users');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();
        const users = usersData.users || [];

        // 获取文件数据
        const filesResponse = await fetch('/api/admin/files');
        if (!filesResponse.ok) {
          throw new Error('Failed to fetch files');
        }
        const filesData = await filesResponse.json();
        const allFiles = filesData.files || [];

        // 计算仪表盘数据
        const totalUsers = users.length;
        const personalUsers = users.filter(user => user.userType === 'individual').length;
        const enterpriseUsers = users.filter(user => user.userType === 'enterprise').length;
        const totalFiles = allFiles.length;

        // 计算今日新增用户（根据createdAt字段计算）
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayNewUsers = users.filter(user => {
          const userCreatedAt = new Date(user.createdAt || 0);
          return userCreatedAt >= today;
        }).length;

        // 邮件发送量（从邮件API获取）
        let emailSent = 0;
        try {
          const emailResponse = await fetch('/api/emails');
          if (emailResponse.ok) {
            const emailData = await emailResponse.json();
            emailSent = emailData.emails ? emailData.emails.length : 0;
          }
        } catch (err) {
          console.error('Error fetching email data:', err);
          emailSent = 0;
        }

        // 更新仪表盘数据
        setDashboardData({
          totalUsers,
          todayNewUsers,
          personalUsers,
          enterpriseUsers,
          totalFiles,
          emailSent,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 抓取岗位的处理函数
  const handleJobScraping = async () => {
    setIsScraping(true);
    setScrapingResult({ university: 0, enterprise: 0 });
    
    try {
      // 调用岗位抓取函数
      const scrapedJobs = await scrapeJobs();
      
      // 使用AI分析岗位
      const analyzedJobs = await batchAnalyzeJobs(scrapedJobs);
      
      // 分类岗位
      const universityJobs = analyzedJobs.filter(job => job.type === 'university');
      const enterpriseJobs = analyzedJobs.filter(job => job.type === 'enterprise');
      
      // 存储抓取结果
      setScrapingResult({ 
        university: universityJobs.length, 
        enterprise: enterpriseJobs.length 
      });
      
      console.log('抓取到的大学科研岗位:', universityJobs.length);
      console.log('抓取到的企业高级岗位:', enterpriseJobs.length);
      
      // 这里可以添加将岗位数据存储到数据库的逻辑
      // 由于是模拟环境，我们只记录抓取结果
    } catch (error) {
      console.error('岗位抓取失败:', error);
    } finally {
      setIsScraping(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* 使用统一的侧边栏组件 */}
        <AdminSidebar />
        
        {/* 主内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
              <p className="text-gray-600">核心数据看板 - 实时统计</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* 核心数据看板 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {isLoading ? (
                // 加载状态
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-full p-3">
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : error ? (
                // 错误状态
                <div className="col-span-full bg-white rounded-lg shadow p-6">
                  <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      重试
                    </button>
                  </div>
                </div>
              ) : (
                // 正常状态
                [
                  {
                    title: '总用户数',
                    value: dashboardData.totalUsers,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ),
                    bgColor: 'bg-blue-100'
                  },
                  {
                    title: '今日新增用户',
                    value: dashboardData.todayNewUsers,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    bgColor: 'bg-green-100'
                  },
                  {
                    title: '个人用户',
                    value: dashboardData.personalUsers,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2zM9 9v2m0 4h.01M15 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    bgColor: 'bg-purple-100'
                  },
                  {
                    title: '企业用户',
                    value: dashboardData.enterpriseUsers,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    ),
                    bgColor: 'bg-blue-100'
                  },
                  {
                    title: '总上传文件数',
                    value: dashboardData.totalFiles,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ),
                    bgColor: 'bg-red-100'
                  },
                  {
                    title: '邮件发送量',
                    value: dashboardData.emailSent,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    bgColor: 'bg-indigo-100'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className={`${item.bgColor} rounded-full p-3`}>
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                        <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* 最近活动 */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">最近活动</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        详情
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* 从API获取真实活动数据 */}
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center">
                          <p className="text-gray-600">暂无活动记录</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 快捷操作 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Link href="/admin/users">
                <div className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">用户管理</h3>
                      <p className="text-gray-600">查看所有用户信息</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/data">
                <div className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="bg-purple-100 rounded-full p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">数据管理</h3>
                      <p className="text-gray-600">调取系统数据</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/settings">
                <div className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 rounded-full p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">系统设置</h3>
                      <p className="text-gray-600">配置系统参数</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className={`bg-white rounded-lg shadow p-6 ${isScraping ? 'cursor-not-allowed' : 'hover:bg-gray-50 transition-colors cursor-pointer'}`} onClick={isScraping ? undefined : handleJobScraping}>
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">岗位抓取</h3>
                    <p className="text-gray-600">抓取大学科研和企业高级岗位</p>
                  </div>
                </div>
                {isScraping && (
                  <div className="mt-4 flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-green-600 text-sm">抓取中...</span>
                  </div>
                )}
                {!isScraping && scrapingResult.university > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <p className="text-green-700 text-sm">
                      抓取完成：大学科研岗位 {scrapingResult.university} 个，企业高级岗位 {scrapingResult.enterprise} 个
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}