'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Job } from '@/lib/job-model';

export default function JobPermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = (params?.id || '') as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState({
    canApply: true,
    requireApproval: false,
    visibility: 'public', // public, members_only, private
    allowAnonymousView: true,
    allowSharing: true
  });

  // 获取岗位数据和权限设置
  useEffect(() => {
    const fetchJob = () => {
      try {
        const allJobsJson = localStorage.getItem('allJobs');
        const allJobs = allJobsJson ? JSON.parse(allJobsJson) : [];
        const foundJob = allJobs.find((j: Job) => j.id === jobId);
        
        if (foundJob) {
          setJob(foundJob);
          
          // 尝试从本地存储获取权限设置，如果不存在则使用默认值
          const permissionsJson = localStorage.getItem(`jobPermissions_${jobId}`);
          if (permissionsJson) {
            setPermissions(JSON.parse(permissionsJson));
          }
          setError(null);
        } else {
          setError('岗位不存在');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handlePermissionChange = (permission: string, value: any) => {
    setPermissions(prev => ({ ...prev, [permission]: value }));
  };

  const handleSavePermissions = () => {
    try {
      // 保存权限设置到本地存储
      localStorage.setItem(`jobPermissions_${jobId}`, JSON.stringify(permissions));
      router.push('/admin/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error saving permissions:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">岗位不存在</div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">岗位权限管理</h1>
              <p className="text-gray-600">管理岗位的访问和申请权限</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">岗位信息</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">{job.title}</p>
                  <p className="text-gray-600 text-sm">{job.company} - {job.location}</p>
                </div>
              </div>
              
              <form className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900">权限设置</h2>
                  
                  <div className="flex items-center">
                    <input
                      id="canApply"
                      name="canApply"
                      type="checkbox"
                      checked={permissions.canApply}
                      onChange={(e) => handlePermissionChange('canApply', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="canApply" className="ml-2 block text-sm text-gray-700">
                      允许用户申请此岗位
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="requireApproval"
                      name="requireApproval"
                      type="checkbox"
                      checked={permissions.requireApproval}
                      onChange={(e) => handlePermissionChange('requireApproval', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="requireApproval" className="ml-2 block text-sm text-gray-700">
                      申请需要管理员批准
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="allowAnonymousView"
                      name="allowAnonymousView"
                      type="checkbox"
                      checked={permissions.allowAnonymousView}
                      onChange={(e) => handlePermissionChange('allowAnonymousView', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="allowAnonymousView" className="ml-2 block text-sm text-gray-700">
                      允许匿名用户查看岗位信息
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="allowSharing"
                      name="allowSharing"
                      type="checkbox"
                      checked={permissions.allowSharing}
                      onChange={(e) => handlePermissionChange('allowSharing', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="allowSharing" className="ml-2 block text-sm text-gray-700">
                      允许分享岗位链接
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                      岗位可见性
                    </label>
                    <select
                      id="visibility"
                      name="visibility"
                      value={permissions.visibility}
                      onChange={(e) => handlePermissionChange('visibility', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                      <option value="public">公开 (所有人可见)</option>
                      <option value="members_only">仅会员可见</option>
                      <option value="private">私有 (仅管理员可见)</option>
                    </select>
                  </div>
                </div>
                
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
                    type="button"
                    onClick={handleSavePermissions}
                    className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
                  >
                    保存权限设置
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}