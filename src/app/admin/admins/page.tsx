'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserData } from '@/lib/admin-types';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    realName: string;
    countryCode: string;
    phone: string;
    nationality: string;
    role: 'superadmin' | 'admin' | 'customer_service' | 'enterprise_admin' | 'user';
    permissions: string[];
  }>({
    username: '',
    email: '',
    password: '',
    realName: '',
    countryCode: '+86',
    phone: '',
    nationality: '中国',
    role: 'admin',
    permissions: []
  });
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  // 获取管理员列表
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        
        // 在真实环境中，这里应该从数据库获取所有管理员
        // 由于数据库连接问题，暂时使用空数组
        // 在实际环境中，这里应该查询数据库
        const admins: UserData[] = [];
        
        setAdmins(admins);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // 打开添加管理员模态框
  const handleAddAdmin = () => {
    setIsEditMode(false);
    setFormData({
      username: '',
      email: '',
      password: '',
      realName: '',
      countryCode: '+86',
      phone: '',
      nationality: '中国',
      role: 'admin',
      permissions: []
    });
    setIsModalOpen(true);
  };

  // 打开编辑管理员模态框
  const handleEditAdmin = (admin: UserData) => {
    setIsEditMode(true);
    setSelectedAdminId(admin._id);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '', // 不显示现有密码
      realName: admin.realName,
      countryCode: admin.countryCode,
      phone: admin.phone,
      nationality: admin.nationality,
      role: admin.role,
      permissions: admin.permissions
    });
    setIsModalOpen(true);
  };

  // 删除管理员
  const handleDeleteAdmin = async (adminId: string) => {
    if (confirm('确定要删除这个管理员吗？')) {
      try {
        // 在真实环境中，这里应该调用API删除管理员
        // 目前只更新本地状态
        setAdmins(admins.filter(admin => admin._id !== adminId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理权限选择变化
  const handlePermissionChange = (permission: string) => {
    setFormData(prev => {
      if (prev.permissions.includes(permission)) {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== permission)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permission]
        };
      }
    });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 在真实环境中，这里应该调用API添加或更新管理员
      // 目前只更新本地状态
      if (isEditMode && selectedAdminId) {
        // 更新现有管理员
        setAdmins(prev => prev.map(admin => 
          admin._id === selectedAdminId ? {
            ...admin,
            ...formData,
            updatedAt: new Date().toISOString()
          } : admin
        ));
      } else {
        // 添加新管理员
        const newAdmin: UserData = {
          _id: `admin-${Date.now()}`,
          ...formData,
          degreeVerified: true,
          fileId: '',
          userType: 'individual',
          isAdmin: true,
          isEnterprise: false,
          enterpriseName: '',
          enterpriseIndustry: '',
          enterpriseDescription: '',
          enterpriseSize: '',
          enterpriseWebsite: '',
          enterpriseLogo: '',
          contactPerson: '',
          cooperationStatus: 'pending',
          cooperationStartDate: null,
          cooperationEndDate: null,
          createdAt: new Date().toISOString(),
          files: [],
          education: {
            highestDegree: '硕士',
            graduationSchool: '清华大学',
            graduationDate: '2020-06-30',
            major: '计算机科学与技术'
          }
        };
        setAdmins(prev => [...prev, newAdmin]);
      }

      // 关闭模态框
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
                <Link href="/admin/admins">
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>管理员管理</span>
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
              <h1 className="text-2xl font-bold text-gray-900">管理员管理</h1>
              <p className="text-gray-600">查看和管理系统管理员</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-6">
              {/* 操作栏 */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">管理员列表</h2>
                <button 
                  onClick={handleAddAdmin}
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  添加管理员
                </button>
              </div>
              
              {/* 管理员列表 */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        邮箱
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        真实姓名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        角色
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        权限
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{admin.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{admin.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{admin.realName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : admin.role === 'admin' ? 'bg-blue-100 text-blue-800' : admin.role === 'customer_service' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {admin.role === 'superadmin' ? '超级管理员' : admin.role === 'admin' ? '管理员' : admin.role === 'customer_service' ? '客服' : '企业管理员'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {admin.permissions.length > 0 ? admin.permissions.join(', ') : '无'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditAdmin(admin)}
                              className="text-primary hover:text-primary/80"
                            >
                              编辑
                            </button>
                            <button 
                              onClick={() => handleDeleteAdmin(admin._id)}
                              className="text-red-600 hover:text-red-800"
                              disabled={admin.role === 'superadmin'}
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* 添加/编辑管理员模态框 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditMode ? '编辑管理员' : '添加管理员'}
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* 用户名 */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        用户名
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* 邮箱 */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        邮箱
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* 密码 */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        {isEditMode ? '新密码（可选）' : '密码'}
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required={!isEditMode}
                      />
                    </div>
                    
                    {/* 真实姓名 */}
                    <div>
                      <label htmlFor="realName" className="block text-sm font-medium text-gray-700">
                        真实姓名
                      </label>
                      <input
                        type="text"
                        id="realName"
                        name="realName"
                        value={formData.realName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* 国家代码和手机号 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">
                          国家代码
                        </label>
                        <input
                          type="text"
                          id="countryCode"
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          手机号
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* 国籍 */}
                    <div>
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                        国籍
                      </label>
                      <input
                        type="text"
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* 角色 */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        角色
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      >
                        <option value="admin">管理员</option>
                        <option value="customer_service">客服</option>
                        <option value="enterprise_admin">企业管理员</option>
                        {!isEditMode && <option value="superadmin">超级管理员</option>}
                      </select>
                    </div>
                    
                    {/* 权限 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        权限
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['user_management', 'job_management', 'api_costs', 'ai_prompts', 'membership_rules'].map((permission) => (
                          <label key={permission} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission)}
                              onChange={() => handlePermissionChange(permission)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {permission === 'user_management' ? '用户管理' : permission === 'job_management' ? '岗位管理' : permission === 'api_costs' ? 'API费用' : permission === 'ai_prompts' ? 'AI提示词' : '会员规则'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* 模态框操作按钮 */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      {isEditMode ? '更新' : '添加'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
