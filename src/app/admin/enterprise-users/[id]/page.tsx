'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
      title: '企业用户详情',
      basicInfo: '基本信息',
      contactInfo: '联系信息',
      companyDetails: '公司详情',
      recruitmentInfo: '招聘信息',
      operation: '操作',
      fields: {
        companyName: '企业名称',
        industry: '所属行业',
        companySize: '企业规模',
        established: '成立时间',
        location: '所在地区',
        website: '企业官网',
        email: '企业邮箱',
        phone: '联系电话',
        contactPerson: '联系人',
        companyType: '企业类型',
        description: '企业描述',
        status: '账户状态',
        registerDate: '注册时间',
        totalJobs: '发布岗位数',
        totalCandidates: '收到简历数',
        avgResponseTime: '平均响应时间',
      },
      status: {
        active: '正常',
        pending: '待审核',
        suspended: '已暂停',
        disabled: '已禁用',
      },
      actions: {
        edit: '编辑',
        suspend: '暂停账户',
        activate: '激活账户',
        delete: '删除账户',
        viewJobs: '查看发布岗位',
        viewCandidates: '查看收到简历',
        sendMessage: '发送消息',
        backToList: '返回列表',
      },
      confirm: {
        suspend: '确定要暂停该企业账户吗？',
        activate: '确定要激活该企业账户吗？',
        delete: '确定要删除该企业账户吗？此操作不可恢复！',
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
      title: 'Enterprise User Details',
      basicInfo: 'Basic Information',
      contactInfo: 'Contact Information',
      companyDetails: 'Company Details',
      recruitmentInfo: 'Recruitment Information',
      operation: 'Operations',
      fields: {
        companyName: 'Company Name',
        industry: 'Industry',
        companySize: 'Company Size',
        established: 'Established Year',
        location: 'Location',
        website: 'Company Website',
        email: 'Company Email',
        phone: 'Contact Phone',
        contactPerson: 'Contact Person',
        companyType: 'Company Type',
        description: 'Company Description',
        status: 'Account Status',
        registerDate: 'Registration Date',
        totalJobs: 'Total Jobs Posted',
        totalCandidates: 'Total Resumes Received',
        avgResponseTime: 'Average Response Time',
      },
      status: {
        active: 'Active',
        pending: 'Pending',
        suspended: 'Suspended',
        disabled: 'Disabled',
      },
      actions: {
        edit: 'Edit',
        suspend: 'Suspend Account',
        activate: 'Activate Account',
        delete: 'Delete Account',
        viewJobs: 'View Posted Jobs',
        viewCandidates: 'View Received Resumes',
        sendMessage: 'Send Message',
        backToList: 'Back to List',
      },
      confirm: {
        suspend: 'Are you sure you want to suspend this enterprise account?',
        activate: 'Are you sure you want to activate this enterprise account?',
        delete: 'Are you sure you want to delete this enterprise account? This action cannot be undone!',
      },
    },
  },
};

// 定义用户类型
interface User {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  contactPerson: string;
  description: string;
  status: 'active' | 'pending' | 'suspended' | 'disabled';
  registerDate: string;
  totalJobs: number;
  totalCandidates: number;
  avgResponseTime: string;
  type: 'enterprise' | 'university';
  // 企业特有字段
  companySize?: string;
  established?: string;
  companyType?: string;
  // 大学特有字段
  universityType?: string;
  foundingYear?: string;
  researchFields?: string[];
  ranking?: string;
}

// 模拟用户数据
const mockUsers: Record<string, User> = {
  '1': {
    id: '1',
    companyName: '博智科技有限公司',
    industry: '科技互联网',
    companySize: '100-500人',
    established: '2015-03',
    location: '北京市海淀区',
    website: 'www.phdmap.com',
    email: 'contact@phdmap.com',
    phone: '010-12345678',
    contactPerson: '张经理',
    companyType: '有限责任公司',
    description: '博智匹配是一家专注于博士人才与企业精准匹配的招聘平台，致力于连接全球顶尖博士人才与优秀企业。',
    status: 'active',
    registerDate: '2024-01-15',
    totalJobs: 12,
    totalCandidates: 235,
    avgResponseTime: '8小时',
    type: 'enterprise',
  },
  '2': {
    id: '2',
    companyName: '创新电子有限公司',
    industry: '电子信息',
    companySize: '500-1000人',
    established: '2010-08',
    location: '上海市浦东新区',
    website: 'www.innovation.com',
    email: 'hr@innovation.com',
    phone: '021-87654321',
    contactPerson: '李总监',
    companyType: '股份有限公司',
    description: '创新电子是一家专注于半导体芯片研发与生产的高科技企业，产品广泛应用于人工智能、物联网等领域。',
    status: 'active',
    registerDate: '2024-02-20',
    totalJobs: 8,
    totalCandidates: 189,
    avgResponseTime: '12小时',
    type: 'enterprise',
  },
  '3': {
    id: '3',
    companyName: '北京大学',
    industry: '教育科研',
    location: '北京市海淀区',
    website: 'www.pku.edu.cn',
    email: 'recruit@pku.edu.cn',
    phone: '010-62751234',
    contactPerson: '王教授',
    description: '北京大学是中国顶尖的综合性研究型大学，拥有悠久的历史和卓越的学术声誉，在多个学科领域处于国际领先水平。',
    status: 'active',
    registerDate: '2024-01-10',
    totalJobs: 15,
    totalCandidates: 320,
    avgResponseTime: '48小时',
    type: 'university',
    universityType: '综合性研究型大学',
    foundingYear: '1898',
    researchFields: ['人工智能', '计算机科学', '物理学', '化学', '生物学', '经济学', '法学'],
    ranking: '全国第1',
  },
  '4': {
    id: '4',
    companyName: '清华大学',
    industry: '教育科研',
    location: '北京市海淀区',
    website: 'www.tsinghua.edu.cn',
    email: 'jobs@tsinghua.edu.cn',
    phone: '010-62781234',
    contactPerson: '李教授',
    description: '清华大学是中国著名的高等学府，以工科见长，同时在理科、文科、医学等领域也有显著成就，培养了大批杰出人才。',
    status: 'active',
    registerDate: '2024-01-12',
    totalJobs: 12,
    totalCandidates: 280,
    avgResponseTime: '36小时',
    type: 'university',
    universityType: '综合性研究型大学',
    foundingYear: '1911',
    researchFields: ['人工智能', '计算机科学', '机械工程', '电气工程', '材料科学', '环境科学', '建筑设计'],
    ranking: '全国第2',
  },
  '5': {
    id: '5',
    companyName: '复旦大学',
    industry: '教育科研',
    location: '上海市杨浦区',
    website: 'www.fudan.edu.cn',
    email: 'recruit@fudan.edu.cn',
    phone: '021-65641234',
    contactPerson: '张教授',
    description: '复旦大学是中国东部地区的顶尖大学，在人文社科、医学、理学等领域具有深厚的学术底蕴和广泛的国际影响力。',
    status: 'active',
    registerDate: '2024-01-15',
    totalJobs: 10,
    totalCandidates: 210,
    avgResponseTime: '48小时',
    type: 'university',
    universityType: '综合性研究型大学',
    foundingYear: '1905',
    researchFields: ['经济学', '法学', '新闻学', '医学', '生物学', '化学', '物理学'],
    ranking: '全国第3',
  },
  '6': {
    id: '6',
    companyName: '上海交通大学',
    industry: '教育科研',
    location: '上海市闵行区',
    website: 'www.sjtu.edu.cn',
    email: 'jobs@sjtu.edu.cn',
    phone: '021-54741234',
    contactPerson: '刘教授',
    description: '上海交通大学是中国著名的综合性大学，以工科和医学为特色，在船舶海洋、机械动力、电子信息等领域具有优势。',
    status: 'active',
    registerDate: '2024-01-18',
    totalJobs: 11,
    totalCandidates: 240,
    avgResponseTime: '42小时',
    type: 'university',
    universityType: '综合性研究型大学',
    foundingYear: '1896',
    researchFields: ['船舶与海洋工程', '机械工程', '电子信息', '医学', '经济学', '管理学'],
    ranking: '全国第4',
  },
  '7': {
    id: '7',
    companyName: '绿色能源研究院',
    industry: '新能源',
    companySize: '50-100人',
    established: '2018-11',
    location: '深圳市南山区',
    website: 'www.greenenergy.com',
    email: 'info@greenenergy.com',
    phone: '0755-13579246',
    contactPerson: '王博士',
    companyType: '科研机构',
    description: '绿色能源研究院致力于新能源技术的研发与应用，专注于太阳能、风能等可再生能源的创新研究。',
    status: 'pending',
    registerDate: '2024-03-10',
    totalJobs: 5,
    totalCandidates: 98,
    avgResponseTime: '24小时',
    type: 'enterprise',
  },
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const t = translations[lang];

  // 获取用户数据
  useEffect(() => {
    if (userId) {
      const fetchUser = () => {
        // 模拟API请求
        setTimeout(() => {
          const userData = mockUsers[userId] || null;
          setUser(userData);
          setLoading(false);
        }, 500);
      };

      fetchUser();
    } else {
      setLoading(false);
    }
  }, [userId]);
  
  // 如果没有用户ID，返回404或重定向
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        <Header 
          lang={lang} 
          onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">用户ID无效</p>
            <button
              onClick={() => router.push('/admin/enterprise-users')}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300"
            >
              返回用户列表
            </button>
          </div>
        </main>
        <Footer lang={lang} />
      </div>
    );
  }

  // 处理状态变更
  const handleStatusChange = (newStatus: 'active' | 'pending' | 'suspended' | 'disabled' | 'delete') => {
    if (window.confirm(
      newStatus === 'suspended' ? t.enterprise.confirm.suspend :
      newStatus === 'active' ? t.enterprise.confirm.activate :
      t.enterprise.confirm.delete
    )) {
      // 模拟API请求
      setLoading(true);
      setTimeout(() => {
        if (newStatus === 'delete') {
          // 删除成功，返回列表
          router.push('/admin/enterprise-users');
        } else {
          // 更新状态
          setUser((prev: User | null) => {
            if (!prev) return null;
            return {
              ...prev,
              status: newStatus,
            };
          });
          setLoading(false);
        }
      }, 500);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        <Header lang={lang} onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">正在加载用户详情...</p>
          </div>
        </main>
        <Footer lang={lang} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        <Header lang={lang} onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">未找到该用户</p>
            <button
              onClick={() => router.push('/admin/enterprise-users')}
              className="mt-4 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300"
            >
              {t.enterprise.actions.backToList}
            </button>
          </div>
        </main>
        <Footer lang={lang} />
      </div>
    );
  }

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
                <span>{t.nav.enterpriseUsers}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-primary font-medium">{user.companyName}</span>
              </div>
            </div>

            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{user.type === 'enterprise' ? t.enterprise.title : '大学用户详情'}</h1>
            </div>

            {/* 返回按钮 */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/admin/enterprise-users')}
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t.enterprise.actions.backToList}
              </button>
            </div>

            {/* 用户详情卡片 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 左侧：基本信息和联系信息 */}
              <div className="lg:col-span-1 space-y-6">
                {/* 基本信息卡片 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {t.enterprise.basicInfo}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 w-1/3">{t.enterprise.fields.companyName}</span>
                      <span className="font-semibold text-gray-900 w-2/3">{user.companyName}</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 w-1/3">{t.enterprise.fields.industry}</span>
                      <span className="text-gray-800 w-2/3">{user.industry}</span>
                    </div>
                    
                    {user.type === 'enterprise' && user.companySize && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 w-1/3">{t.enterprise.fields.companySize}</span>
                        <span className="text-gray-800 w-2/3">{user.companySize}</span>
                      </div>
                    )}
                    
                    {user.type === 'enterprise' && user.established && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 w-1/3">{t.enterprise.fields.established}</span>
                        <span className="text-gray-800 w-2/3">{user.established}</span>
                      </div>
                    )}
                    
                    {user.type === 'university' && user.universityType && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 w-1/3">大学类型</span>
                        <span className="text-gray-800 w-2/3">{user.universityType}</span>
                      </div>
                    )}
                    
                    {user.type === 'university' && user.foundingYear && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 w-1/3">建校年份</span>
                        <span className="text-gray-800 w-2/3">{user.foundingYear}</span>
                      </div>
                    )}
                    
                    {user.type === 'university' && user.ranking && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 w-1/3">排名</span>
                        <span className="text-gray-800 w-2/3">{user.ranking}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 w-1/3">{t.enterprise.fields.location}</span>
                      <span className="text-gray-800 w-2/3">{user.location}</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 w-1/3">{t.enterprise.fields.status}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(user.status)}`}>
                        {t.enterprise.status[user.status as keyof typeof t.enterprise.status]}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 w-1/3">{t.enterprise.fields.registerDate}</span>
                      <span className="text-gray-800 w-2/3">{user.registerDate}</span>
                    </div>
                  </div>
                </div>

                {/* 联系信息卡片 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {t.enterprise.contactInfo}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 w-1/3">{t.enterprise.fields.contactPerson}</span>
                      <span className="font-semibold text-gray-900 w-2/3">{user.contactPerson}</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 w-1/3">{t.enterprise.fields.email}</span>
                      <a href={`mailto:${user.email}`} className="text-primary hover:underline w-2/3">
                        {user.email}
                      </a>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 w-1/3">{t.enterprise.fields.phone}</span>
                      <a href={`tel:${user.phone}`} className="text-primary hover:underline w-2/3">
                        {user.phone}
                      </a>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 w-1/3">{t.enterprise.fields.website}</span>
                      <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline w-2/3 truncate">
                        {user.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t.enterprise.operation}
                  </h2>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        // 编辑功能：跳转到编辑页面
                        alert('编辑功能开发中');
                      }}
                      className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t.enterprise.actions.edit}
                    </button>
                    
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange('suspended')}
                        className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.enterprise.actions.suspend}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange('active')}
                        className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t.enterprise.actions.activate}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleStatusChange('delete')}
                      className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {t.enterprise.actions.delete}
                    </button>
                    
                    <button
                      onClick={() => {
                        // 查看岗位功能：跳转到该企业的岗位列表
                        alert(`查看${user.companyName}的发布岗位`);
                      }}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {user.type === 'enterprise' ? t.enterprise.actions.viewJobs : '查看发布岗位'}
                    </button>
                    
                    <button
                      onClick={() => {
                        // 查看简历功能：跳转到该企业收到的简历列表
                        alert(`查看${user.companyName}收到的简历`);
                      }}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {user.type === 'enterprise' ? t.enterprise.actions.viewCandidates : '查看收到简历'}
                    </button>
                    
                    <button
                      onClick={() => {
                        // 发送消息功能：打开消息发送界面
                        alert(`向${user.companyName}发送消息`);
                      }}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {t.enterprise.actions.sendMessage}
                    </button>
                  </div>
                </div>
              </div>

              {/* 右侧：详情和招聘信息 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 详情卡片 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    {user.type === 'enterprise' ? t.enterprise.companyDetails : '大学详情'}
                  </h2>
                  
                  <div className="space-y-4">
                    {user.type === 'enterprise' && user.companyType && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 w-1/4">{t.enterprise.fields.companyType}</span>
                        <span className="text-gray-800 w-3/4">{user.companyType}</span>
                      </div>
                    )}
                    
                    {user.type === 'university' && user.researchFields && (
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">研究领域</h3>
                        <div className="flex flex-wrap gap-2">
                          {user.researchFields.map((field, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.enterprise.fields.description}</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {user.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 招聘信息卡片 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    {user.type === 'enterprise' ? t.enterprise.recruitmentInfo : '招聘信息'}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{user.totalJobs}</div>
                      <div className="text-gray-600">{t.enterprise.fields.totalJobs}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{user.totalCandidates}</div>
                      <div className="text-gray-600">{t.enterprise.fields.totalCandidates}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{user.avgResponseTime}</div>
                      <div className="text-gray-600">{t.enterprise.fields.avgResponseTime}</div>
                    </div>
                  </div>
                  
                  {/* 岗位列表预览 */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">最近发布的岗位</h3>
                    
                    {/* 模拟岗位列表 */}
                    <div className="space-y-3">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                          <div className="font-semibold text-gray-900">{user.type === 'enterprise' ? '高级AI算法工程师' : '助理教授'} #{index}</div>
                          <div className="text-sm text-gray-600 mt-1">{user.companyName} • {user.location}</div>
                          <div className="text-sm text-primary mt-2">发布于 2024-03-{10 + index}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <button className="text-primary hover:underline text-sm font-medium">
                        查看全部岗位 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 共享页脚 */}
      <Footer lang={lang} />
    </div>
  );
}

