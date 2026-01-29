'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';

// 多语言支持
const translations = {
  zh: {
    nav: {
      admin: '后台管理',
      enterpriseUsers: '企业用户管理',
      dashboard: '仪表盘',
      users: '用户管理',
      jobs: '岗位管理',
      reports: '数据报表',
      settings: '系统设置',
      siteName: '博智匹配',
    },
    enterprise: {
      title: '企业用户管理',
      searchPlaceholder: '搜索企业名称、邮箱或联系人',
      filter: {
        status: '状态筛选',
        industry: '行业筛选',
        all: '全部',
        active: '正常',
        pending: '待审核',
        suspended: '已暂停',
        disabled: '已禁用',
      },
      table: {
        companyName: '企业名称',
        industry: '行业',
        location: '地区',
        contactPerson: '联系人',
        email: '邮箱',
        status: '状态',
        registerDate: '注册时间',
        actions: '操作',
      },
      actions: {
        view: '查看',
        edit: '编辑',
        suspend: '暂停',
        activate: '激活',
        delete: '删除',
        confirmDelete: '确定要删除该企业用户吗？此操作不可恢复！',
      },
      stats: {
        total: '总计企业用户',
        active: '正常',
        pending: '待审核',
        suspended: '已暂停',
        disabled: '已禁用',
      },
    },
  },
  en: {
    nav: {
      admin: 'Admin',
      enterpriseUsers: 'Enterprise Users',
      dashboard: 'Dashboard',
      users: 'User Management',
      jobs: 'Job Management',
      reports: 'Reports',
      settings: 'Settings',
      siteName: 'PhDMap',
    },
    enterprise: {
      title: 'Enterprise User Management',
      searchPlaceholder: 'Search company name, email or contact person',
      filter: {
        status: 'Status Filter',
        industry: 'Industry Filter',
        all: 'All',
        active: 'Active',
        pending: 'Pending',
        suspended: 'Suspended',
        disabled: 'Disabled',
      },
      table: {
        companyName: 'Company Name',
        industry: 'Industry',
        location: 'Location',
        contactPerson: 'Contact Person',
        email: 'Email',
        status: 'Status',
        registerDate: 'Register Date',
        actions: 'Actions',
      },
      actions: {
        view: 'View',
        edit: 'Edit',
        suspend: 'Suspend',
        activate: 'Activate',
        delete: 'Delete',
        confirmDelete: 'Are you sure you want to delete this enterprise user? This action cannot be undone!',
      },
      stats: {
        total: 'Total Enterprise Users',
        active: 'Active',
        pending: 'Pending',
        suspended: 'Suspended',
        disabled: 'Disabled',
      },
    },
  },
};

// 模拟企业用户数据
const mockEnterpriseUsers = [
  {
    id: '1',
    companyName: '博智科技有限公司',
    industry: '科技互联网',
    location: '北京市海淀区',
    contactPerson: '张经理',
    email: 'contact@phdmap.com',
    status: 'active',
    registerDate: '2024-01-15',
    type: 'enterprise',
  },
  {
    id: '2',
    companyName: '创新电子有限公司',
    industry: '电子信息',
    location: '上海市浦东新区',
    contactPerson: '李总监',
    email: 'hr@innovation.com',
    status: 'active',
    registerDate: '2024-02-20',
    type: 'enterprise',
  },
  {
    id: '3',
    companyName: '北京大学',
    industry: '教育科研',
    location: '北京市海淀区',
    contactPerson: '王教授',
    email: 'recruit@pku.edu.cn',
    status: 'active',
    registerDate: '2024-01-10',
    type: 'university',
  },
  {
    id: '4',
    companyName: '清华大学',
    industry: '教育科研',
    location: '北京市海淀区',
    contactPerson: '李教授',
    email: 'jobs@tsinghua.edu.cn',
    status: 'active',
    registerDate: '2024-01-12',
    type: 'university',
  },
  {
    id: '5',
    companyName: '绿色能源研究院',
    industry: '新能源',
    location: '深圳市南山区',
    contactPerson: '王博士',
    email: 'info@greenenergy.com',
    status: 'pending',
    registerDate: '2024-03-10',
    type: 'enterprise',
  },
  {
    id: '6',
    companyName: '生物医药研究所',
    industry: '生物医药',
    location: '广州市天河区',
    contactPerson: '赵研究员',
    email: 'hr@biomed.com',
    status: 'suspended',
    registerDate: '2024-01-25',
    type: 'enterprise',
  },
  {
    id: '7',
    companyName: '智能制造有限公司',
    industry: '制造业',
    location: '苏州市工业园区',
    contactPerson: '刘厂长',
    email: 'contact@smartmanu.com',
    status: 'active',
    registerDate: '2024-03-05',
    type: 'enterprise',
  },
  {
    id: '8',
    companyName: '数字金融科技公司',
    industry: '金融科技',
    location: '杭州市西湖区',
    contactPerson: '陈总监',
    email: 'hr@fintech.com',
    status: 'pending',
    registerDate: '2024-03-15',
    type: 'enterprise',
  },
  {
    id: '9',
    companyName: '复旦大学',
    industry: '教育科研',
    location: '上海市杨浦区',
    contactPerson: '张教授',
    email: 'recruit@fudan.edu.cn',
    status: 'active',
    registerDate: '2024-01-15',
    type: 'university',
  },
  {
    id: '10',
    companyName: '上海交通大学',
    industry: '教育科研',
    location: '上海市闵行区',
    contactPerson: '刘教授',
    email: 'jobs@sjtu.edu.cn',
    status: 'active',
    registerDate: '2024-01-18',
    type: 'university',
  },
];

export default function EnterpriseUsersPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filteredEnterprises, setFilteredEnterprises] = useState(mockEnterpriseUsers);

  const t = translations[lang];

  // 筛选企业用户
  const filterEnterprises = (type?: string) => {
    let result = mockEnterpriseUsers;

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(enterprise => 
        enterprise.companyName.toLowerCase().includes(query) ||
        enterprise.email.toLowerCase().includes(query) ||
        enterprise.contactPerson.toLowerCase().includes(query)
      );
    }

    // 状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(enterprise => enterprise.status === statusFilter);
    }

    // 类型筛选（大学/企业）
    const currentTypeFilter = type || typeFilter;
    if (currentTypeFilter !== 'all') {
      result = result.filter(enterprise => enterprise.type === currentTypeFilter);
    }

    setFilteredEnterprises(result);
  };

  // 处理搜索变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterEnterprises();
  };

  // 处理状态筛选变化
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    filterEnterprises();
  };

  // 处理类型筛选变化
  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    filterEnterprises(type);
  };

  // 获取状态标签样式
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'disabled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t.enterprise.filter.active;
      case 'pending':
        return t.enterprise.filter.pending;
      case 'suspended':
        return t.enterprise.filter.suspended;
      case 'disabled':
        return t.enterprise.filter.disabled;
      default:
        return status;
    }
  };

  // 统计数据
  const stats = {
    total: mockEnterpriseUsers.length,
    active: mockEnterpriseUsers.filter(e => e.status === 'active').length,
    pending: mockEnterpriseUsers.filter(e => e.status === 'pending').length,
    suspended: mockEnterpriseUsers.filter(e => e.status === 'suspended').length,
    disabled: mockEnterpriseUsers.filter(e => e.status === 'disabled').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
      />

      {/* 后台管理主体内容 - 侧边栏 + 主内容 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 侧边栏 */}
        <AdminSidebar 
          lang={lang} 
          collapsed={sidebarCollapsed} 
          onToggle={(collapsed) => setSidebarCollapsed(collapsed)} 
        />

        {/* 主内容区域 */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="max-w-7xl mx-auto p-8">
            {/* 面包屑导航 */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{t.nav.admin}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-primary font-medium">{t.nav.enterpriseUsers}</span>
              </div>
            </div>

            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{t.enterprise.title}</h1>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {/* 总计 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm text-gray-600 mb-1">{t.enterprise.stats.total}</div>
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
              </div>
              {/* 正常 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm text-gray-600 mb-1">{t.enterprise.stats.active}</div>
                <div className="text-3xl font-bold text-green-600">{stats.active}</div>
              </div>
              {/* 待审核 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm text-gray-600 mb-1">{t.enterprise.stats.pending}</div>
                <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              </div>
              {/* 已暂停 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm text-gray-600 mb-1">{t.enterprise.stats.suspended}</div>
                <div className="text-3xl font-bold text-orange-600">{stats.suspended}</div>
              </div>
              {/* 已禁用 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm text-gray-600 mb-1">{t.enterprise.stats.disabled}</div>
                <div className="text-3xl font-bold text-red-600">{stats.disabled}</div>
              </div>
            </div>

            {/* 搜索和筛选区域 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                {/* 搜索框 */}
                <form onSubmit={handleSearchSubmit} className="flex-1 md:mr-4 w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t.enterprise.searchPlaceholder}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 px-4 py-3 bg-primary text-white rounded-r-lg hover:bg-primary/90 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>

                {/* 状态筛选 */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">{t.enterprise.filter.status}:</span>
                  <div className="flex flex-wrap gap-2">
                    {
                      [
                        { value: 'all', label: t.enterprise.filter.all },
                        { value: 'active', label: t.enterprise.filter.active },
                        { value: 'pending', label: t.enterprise.filter.pending },
                        { value: 'suspended', label: t.enterprise.filter.suspended },
                        { value: 'disabled', label: t.enterprise.filter.disabled },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusFilterChange(option.value)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            statusFilter === option.value
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                          `}
                        >
                          {option.label}
                        </button>
                      ))
                    }
                  </div>
                </div>
                
                {/* 类型筛选（大学/企业） */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">类型筛选:</span>
                  <div className="flex flex-wrap gap-2">
                    {
                      [
                        { value: 'all', label: '全部' },
                        { value: 'university', label: '大学' },
                        { value: 'enterprise', label: '企业' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleTypeFilterChange(option.value)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            typeFilter === option.value
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                          `}
                        >
                          {option.label}
                        </button>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* 企业用户列表 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.enterprise.table.companyName}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.enterprise.table.industry}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.enterprise.table.location}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.enterprise.table.contactPerson}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.enterprise.table.email}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.enterprise.table.status}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.enterprise.table.registerDate}
                      </th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.enterprise.table.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEnterprises.map((enterprise) => (
                      <tr key={enterprise.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{enterprise.companyName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            enterprise.type === 'university' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {enterprise.type === 'university' ? '大学' : '企业'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {enterprise.industry}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {enterprise.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {enterprise.contactPerson}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {enterprise.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(enterprise.status)}`}>
                            {getStatusText(enterprise.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {enterprise.registerDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {/* 查看按钮 */}
                            <button
                              onClick={() => router.push(`/admin/enterprise-users/${enterprise.id}`)}
                              className="text-primary hover:text-primary/80 transition-colors duration-200"
                            >
                              {t.enterprise.actions.view}
                            </button>
                            {/* 编辑按钮 */}
                            <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                              {t.enterprise.actions.edit}
                            </button>
                            {/* 状态按钮 */}
                            {enterprise.status === 'active' ? (
                              <button className="text-orange-600 hover:text-orange-800 transition-colors duration-200">
                                {t.enterprise.actions.suspend}
                              </button>
                            ) : (
                              <button className="text-green-600 hover:text-green-800 transition-colors duration-200">
                                {t.enterprise.actions.activate}
                              </button>
                            )}
                            {/* 删除按钮 */}
                            <button
                              onClick={() => {
                                if (window.confirm(t.enterprise.actions.confirmDelete)) {
                                  // 这里添加删除逻辑
                                  console.log('删除企业用户:', enterprise.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                              {t.enterprise.actions.delete}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 空状态 */}
              {filteredEnterprises.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">未找到企业用户</h3>
                  <p className="text-gray-500">请调整搜索条件或筛选条件重试</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 共享页脚 */}
      <Footer lang={lang} />
    </div>
  );
}

