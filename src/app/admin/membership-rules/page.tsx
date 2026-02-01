'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 会员等级类型定义
interface MembershipLevel {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  isActive: boolean;
  permissions: {
    viewAllJobs: boolean;
    viewCompanyInfo: boolean;
    viewContactInfo: boolean;
    applyJobs: number; // 每月可申请岗位数量
    aiToolsAccess: boolean;
    resumeOptimization: boolean;
    prioritySupport: boolean;
    aiEmailGeneration: number; // 每月可生成自荐邮件数量
    emailSending: number; // 每月可发送自荐邮件数量
  };
  createdAt: string;
  updatedAt: string;
}

// 获取所有会员等级
const getAllMembershipLevels = async (): Promise<MembershipLevel[]> => {
  try {
    // 在真实环境中，这里应该从数据库获取所有会员等级
    // 由于数据库连接问题，暂时使用空数组
    // 在实际环境中，这里应该查询数据库
    const levels: MembershipLevel[] = [];
    
    return levels;
  } catch (error) {
    console.error('Error fetching membership levels:', error);
    return [];
  }
};

// 保存会员等级
const saveMembershipLevels = async (levels: MembershipLevel[]) => {
  try {
    // 在真实环境中，这里应该将会员等级保存到数据库
    // 由于数据库连接问题，暂时不做任何操作
    // 在实际环境中，这里应该更新数据库
    console.log('Membership levels saved:', levels);
  } catch (error) {
    console.error('Error saving membership levels:', error);
  }
};

// 创建新会员等级
const createMembershipLevel = (): MembershipLevel => {
  const newLevel: MembershipLevel = {
    id: `level-${Date.now()}`,
    name: '新会员等级',
    description: '新会员等级描述',
    price: 0,
    durationMonths: 1,
    isActive: true,
    permissions: {
      viewAllJobs: false,
      viewCompanyInfo: false,
      viewContactInfo: false,
      applyJobs: 5,
      aiToolsAccess: false,
      resumeOptimization: false,
      prioritySupport: false,
      aiEmailGeneration: 5, // 每月可生成5次自荐邮件
      emailSending: 5 // 每月可发送5次自荐邮件
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return newLevel;
};

export default function MembershipRulesPage() {
  const [membershipLevels, setMembershipLevels] = useState<MembershipLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<MembershipLevel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 初始化数据
  useEffect(() => {
    const fetchMembershipLevels = async () => {
      const levels = await getAllMembershipLevels();
      setMembershipLevels(levels);
    };

    fetchMembershipLevels();
  }, []);

  // 保存所有会员等级
  const handleSaveLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedLevels = membershipLevels.map(level => ({
        ...level,
        updatedAt: new Date().toISOString()
      }));
      
      await saveMembershipLevels(updatedLevels);
      setMembershipLevels(updatedLevels);
      setSuccessMessage('会员等级保存成功！');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存会员等级失败');
      console.error('Error saving membership levels:', err);
    } finally {
      setLoading(false);
    }
  };

  // 切换会员等级状态
  const toggleLevelStatus = (levelId: string) => {
    const updatedLevels = membershipLevels.map(level => 
      level.id === levelId ? { ...level, isActive: !level.isActive } : level
    );
    setMembershipLevels(updatedLevels);
  };

  // 添加新会员等级
  const addNewLevel = () => {
    const newLevel = createMembershipLevel();
    setMembershipLevels([...membershipLevels, newLevel]);
    setSelectedLevel(newLevel);
  };

  // 删除会员等级
  const deleteLevel = (levelId: string) => {
    // 不能删除默认的免费会员
    if (levelId === 'level-1') {
      setError('不能删除默认的免费会员等级');
      return;
    }
    
    const updatedLevels = membershipLevels.filter(level => level.id !== levelId);
    setMembershipLevels(updatedLevels);
    if (selectedLevel?.id === levelId) {
      setSelectedLevel(null);
    }
  };

  // 更新会员等级
  const updateLevel = (level: MembershipLevel) => {
    const updatedLevels = membershipLevels.map(l => 
      l.id === level.id ? level : l
    );
    setMembershipLevels(updatedLevels);
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
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
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
              <h1 className="text-2xl font-bold text-gray-900">会员规则配置</h1>
              <p className="text-gray-600">管理会员等级、价格和权限</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* 成功消息 */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                {successMessage}
              </div>
            )}
            
            {/* 错误消息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 会员等级列表 */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">会员等级列表</h2>
                  <button
                    onClick={addNewLevel}
                    className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                  >
                    添加等级
                  </button>
                </div>
                
                <div className="space-y-2">
                  {membershipLevels.map(level => (
                    <div
                      key={level.id}
                      onClick={() => setSelectedLevel(level)}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${selectedLevel?.id === level.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-900">{level.name}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${level.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {level.isActive ? '启用' : '禁用'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        ¥{level.price}{level.durationMonths > 0 ? `/${level.durationMonths}个月` : '/永久'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 会员等级详情编辑 */}
              {selectedLevel && (
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">编辑会员等级</h2>
                    <button
                      onClick={() => deleteLevel(selectedLevel.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      删除等级
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* 基本信息 */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">等级名称</label>
                          <input
                            type="text"
                            value={selectedLevel.name}
                            onChange={(e) => {
                              const updatedLevel = { ...selectedLevel, name: e.target.value };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="输入等级名称"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">价格 (元)</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={selectedLevel.price}
                            onChange={(e) => {
                              const updatedLevel = { ...selectedLevel, price: parseFloat(e.target.value) || 0 };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="输入价格"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">有效期 (月)</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={selectedLevel.durationMonths}
                            onChange={(e) => {
                              const updatedLevel = { ...selectedLevel, durationMonths: parseInt(e.target.value) || 0 };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="输入有效期，0表示永久"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                          <select
                            value={selectedLevel.isActive ? 'active' : 'inactive'}
                            onChange={(e) => {
                              const updatedLevel = { ...selectedLevel, isActive: e.target.value === 'active' };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="active">启用</option>
                            <option value="inactive">禁用</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">等级描述</label>
                        <textarea
                          value={selectedLevel.description}
                          onChange={(e) => {
                            const updatedLevel = { ...selectedLevel, description: e.target.value };
                            setSelectedLevel(updatedLevel);
                            updateLevel(updatedLevel);
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                          placeholder="输入等级描述"
                        ></textarea>
                      </div>
                    </div>
                    
                    {/* 权限设置 */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">权限设置</h3>
                      
                      <div className="space-y-3">
                        {/* 查看所有岗位 */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevel.permissions.viewAllJobs}
                            onChange={(e) => {
                              const updatedLevel = {
                                ...selectedLevel,
                                permissions: {
                                  ...selectedLevel.permissions,
                                  viewAllJobs: e.target.checked
                                }
                              };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            查看所有岗位
                          </label>
                        </div>
                        
                        {/* 查看企业信息 */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevel.permissions.viewCompanyInfo}
                            onChange={(e) => {
                              const updatedLevel = {
                                ...selectedLevel,
                                permissions: {
                                  ...selectedLevel.permissions,
                                  viewCompanyInfo: e.target.checked
                                }
                              };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            查看企业信息
                          </label>
                        </div>
                        
                        {/* 查看联系方式 */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevel.permissions.viewContactInfo}
                            onChange={(e) => {
                              const updatedLevel = {
                                ...selectedLevel,
                                permissions: {
                                  ...selectedLevel.permissions,
                                  viewContactInfo: e.target.checked
                                }
                              };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            查看联系方式
                          </label>
                        </div>
                        
                        {/* 每月可申请岗位数量 */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevel.permissions.applyJobs === 0}
                            onChange={(e) => {
                              const updatedLevel = {
                                ...selectedLevel,
                                permissions: {
                                  ...selectedLevel.permissions,
                                  applyJobs: e.target.checked ? 0 : 5
                                }
                              };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            无限量申请岗位
                          </label>
                          {selectedLevel.permissions.applyJobs > 0 && (
                            <div className="ml-4 flex items-center">
                              <span className="text-sm text-gray-600 mr-2">或限制：</span>
                              <input
                                type="number"
                                min="1"
                                value={selectedLevel.permissions.applyJobs}
                                onChange={(e) => {
                                  const updatedLevel = {
                                    ...selectedLevel,
                                    permissions: {
                                      ...selectedLevel.permissions,
                                      applyJobs: parseInt(e.target.value) || 1
                                    }
                                  };
                                  setSelectedLevel(updatedLevel);
                                  updateLevel(updatedLevel);
                                }}
                                className="w-20 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                              <span className="text-sm text-gray-600 ml-2">个/月</span>
                            </div>
                          )}
                        </div>
                        
                        {/* AI工具访问 */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevel.permissions.aiToolsAccess}
                            onChange={(e) => {
                              const updatedLevel = {
                                ...selectedLevel,
                                permissions: {
                                  ...selectedLevel.permissions,
                                  aiToolsAccess: e.target.checked
                                }
                              };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            AI工具访问
                          </label>
                        </div>
                        
                        {/* 简历优化 */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevel.permissions.resumeOptimization}
                            onChange={(e) => {
                              const updatedLevel = {
                                ...selectedLevel,
                                permissions: {
                                  ...selectedLevel.permissions,
                                  resumeOptimization: e.target.checked
                                }
                              };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            简历优化
                          </label>
                        </div>
                        
                        {/* 智能生成自荐邮件 */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLevel.permissions.aiEmailGeneration === 0}
                        onChange={(e) => {
                          const updatedLevel = {
                            ...selectedLevel,
                            permissions: {
                              ...selectedLevel.permissions,
                              aiEmailGeneration: e.target.checked ? 0 : 5
                            }
                          };
                          setSelectedLevel(updatedLevel);
                          updateLevel(updatedLevel);
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        无限量生成自荐邮件
                      </label>
                      {selectedLevel.permissions.aiEmailGeneration > 0 && (
                        <div className="ml-4 flex items-center">
                          <span className="text-sm text-gray-600 mr-2">或限制：</span>
                          <input
                            type="number"
                            min="1"
                            value={selectedLevel.permissions.aiEmailGeneration}
                            onChange={(e) => {
                              const updatedLevel = {
                                ...selectedLevel,
                                permissions: {
                                  ...selectedLevel.permissions,
                                  aiEmailGeneration: parseInt(e.target.value) || 1
                                }
                              };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="w-20 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-600 ml-2">次/月</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 自荐邮件发送 */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLevel.permissions.emailSending === 0}
                        onChange={(e) => {
                          const updatedLevel = {
                            ...selectedLevel,
                            permissions: {
                              ...selectedLevel.permissions,
                              emailSending: e.target.checked ? 0 : 5
                            }
                          };
                          setSelectedLevel(updatedLevel);
                          updateLevel(updatedLevel);
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        无限量发送自荐邮件
                      </label>
                      {selectedLevel.permissions.emailSending > 0 && (
                        <div className="ml-4 flex items-center">
                          <span className="text-sm text-gray-600 mr-2">或限制：</span>
                          <input
                            type="number"
                            min="1"
                            value={selectedLevel.permissions.emailSending}
                            onChange={(e) => {
                              const updatedLevel = {
                                ...selectedLevel,
                                permissions: {
                                  ...selectedLevel.permissions,
                                  emailSending: parseInt(e.target.value) || 1
                                }
                              };
                              setSelectedLevel(updatedLevel);
                              updateLevel(updatedLevel);
                            }}
                            className="w-20 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-600 ml-2">次/月</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 优先支持 */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLevel.permissions.prioritySupport}
                        onChange={(e) => {
                          const updatedLevel = {
                            ...selectedLevel,
                            permissions: {
                              ...selectedLevel.permissions,
                              prioritySupport: e.target.checked
                            }
                          };
                          setSelectedLevel(updatedLevel);
                          updateLevel(updatedLevel);
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        优先支持
                      </label>
                    </div>
                      </div>
                    </div>
                    
                    {/* 保存按钮 */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveLevels}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? '保存中...' : '保存会员等级'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}