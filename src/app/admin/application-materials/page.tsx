'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/job-model';
import { ApplicationMaterialConfig } from '@/lib/admin-types';

// 从API获取所有岗位
const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch('/api/jobs');
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

// 从API获取所有申请材料配置
const fetchApplicationMaterials = async (): Promise<ApplicationMaterialConfig[]> => {
  try {
    const response = await fetch('/api/admin/application-materials');
    if (!response.ok) {
      throw new Error('Failed to fetch application materials');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching application materials:', error);
    return [];
  }
};

// 保存申请材料配置到API
const saveApplicationMaterials = async (configs: ApplicationMaterialConfig[]): Promise<boolean> => {
  try {
    const response = await fetch('/api/admin/application-materials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configs)
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving application materials:', error);
    return false;
  }
};

export default function ApplicationMaterialsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [materialsConfig, setMaterialsConfig] = useState<ApplicationMaterialConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // 初始化数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allJobs = await fetchJobs();
        setJobs(allJobs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 当选择岗位变化时，更新全选状态
  useEffect(() => {
    if (jobs.length > 0) {
      setSelectAllChecked(selectedJobIds.length === jobs.length);
    }
  }, [selectedJobIds, jobs.length]);

  // 当全选状态变化时，更新选择的岗位
  const handleSelectAllChange = () => {
    if (selectAllChecked) {
      setSelectedJobIds([]);
    } else {
      // 最多选择200个岗位
      const allJobIds = jobs.slice(0, 200).map(job => job.id);
      setSelectedJobIds(allJobIds);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  // 处理单个岗位选择
  const handleJobSelect = (jobId: string) => {
    if (selectedJobIds.includes(jobId)) {
      setSelectedJobIds(selectedJobIds.filter(id => id !== jobId));
    } else {
      // 最多选择200个岗位
      if (selectedJobIds.length < 200) {
        setSelectedJobIds([...selectedJobIds, jobId]);
      } else {
        alert('最多只能选择200个岗位');
      }
    }
  };

  // 添加新材料
  const addMaterial = () => {
    if (!materialsConfig) return;

    const newMaterial = {
      id: `mat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      required: true,
      type: 'file' as const,
    };

    const updatedConfig = {
      ...materialsConfig,
      materials: [...materialsConfig.materials, newMaterial],
      updatedAt: new Date().toISOString(),
    };

    setMaterialsConfig(updatedConfig);
  };

  // 更新材料
  const updateMaterial = (materialId: string, updates: any) => {
    if (!materialsConfig) return;

    const updatedConfig = {
      ...materialsConfig,
      materials: materialsConfig.materials.map(material => 
        material.id === materialId ? { ...material, ...updates } : material
      ),
      updatedAt: new Date().toISOString(),
    };

    setMaterialsConfig(updatedConfig);
  };

  // 删除材料
  const deleteMaterial = (materialId: string) => {
    if (!materialsConfig) return;

    const updatedConfig = {
      ...materialsConfig,
      materials: materialsConfig.materials.filter(material => material.id !== materialId),
      updatedAt: new Date().toISOString(),
    };

    setMaterialsConfig(updatedConfig);
  };

  // 保存配置
  const saveConfig = async () => {
    if (selectedJobIds.length === 0 || !materialsConfig) return;

    try {
      // 为每个选中的岗位创建或更新配置
      const jobConfigs = selectedJobIds.map(jobId => ({
        ...materialsConfig,
        id: `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        jobId: jobId,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }));

      const success = await saveApplicationMaterials(jobConfigs);
      if (success) {
        alert(`配置已成功应用到 ${selectedJobIds.length} 个岗位！`);
      } else {
        throw new Error('保存失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
      console.error('Error saving config:', err);
    }
  };

  // 创建新配置
  const createNewConfig = () => {
    if (selectedJobIds.length === 0) return;

    const newConfig: ApplicationMaterialConfig = {
      id: `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      jobId: selectedJobIds[0],
      materials: [
        {
          id: `mat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: '简历',
          required: true,
          type: 'file',
        },
        {
          id: `mat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: '求职信',
          required: false,
          type: 'text',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMaterialsConfig(newConfig);
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
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
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
              <h1 className="text-2xl font-bold text-gray-900">岗位申请材料配置</h1>
              <p className="text-gray-600">为每个岗位配置申请时需要提交的材料</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* 选择岗位 */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">选择岗位（已选择 {selectedJobIds.length}/200）</h2>
              <div className="mb-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="select-all" 
                    checked={selectAllChecked} 
                    onChange={handleSelectAllChange}
                    className="mr-2 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="select-all" className="text-gray-700">全选</label>
                  <span className="ml-4 text-sm text-gray-500">（最多可选择200个岗位）</span>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded-md overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        选择
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        岗位名称
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        公司
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map(job => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            checked={selectedJobIds.includes(job.id)} 
                            onChange={() => handleJobSelect(job.id)}
                            className="rounded text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {job.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.company}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4">
                {selectedJobIds.length > 0 && !materialsConfig && (
                  <button 
                    onClick={createNewConfig}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    创建配置
                  </button>
                )}
              </div>
            </div>
            
            {/* 材料配置 */}
            {materialsConfig && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    批量申请材料配置
                  </h2>
                  <button 
                    onClick={saveConfig}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    保存配置（应用到 {selectedJobIds.length} 个岗位）
                  </button>
                </div>
                
                {/* 材料列表 */}
                <div className="space-y-4">
                  {materialsConfig.materials.map(material => (
                    <div key={material.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-wrap gap-4 items-start">
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">材料名称</label>
                          <input
                            type="text"
                            value={material.name}
                            onChange={(e) => updateMaterial(material.id, { name: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="输入材料名称"
                          />
                        </div>
                        
                        <div className="min-w-[150px]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">材料类型</label>
                          <select
                            value={material.type}
                            onChange={(e) => updateMaterial(material.id, { type: e.target.value as any })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="file">文件</option>
                            <option value="text">文本</option>
                            <option value="dropdown">下拉选择</option>
                          </select>
                        </div>
                        
                        <div className="min-w-[150px]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">是否必填</label>
                          <select
                            value={material.required ? 'true' : 'false'}
                            onChange={(e) => updateMaterial(material.id, { required: e.target.value === 'true' })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="true">必填</option>
                            <option value="false">选填</option>
                          </select>
                        </div>
                        
                        <div className="flex items-end">
                          <button
                            onClick={() => deleteMaterial(material.id)}
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                      
                      {/* 下拉选项配置 */}
                      {material.type === 'dropdown' && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">选项列表（每行一个）</label>
                          <textarea
                            value={material.options?.join('\n') || ''}
                            onChange={(e) => updateMaterial(material.id, { 
                              options: e.target.value.split('\n').filter(option => option.trim() !== '') 
                            })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            placeholder="输入选项，每行一个"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* 添加新材料 */}
                <div className="mt-6">
                  <button
                    onClick={addMaterial}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                  >
                    添加新材料
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}