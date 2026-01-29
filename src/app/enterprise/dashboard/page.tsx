'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 多语言支持
const translations = {
  zh: {
    nav: {
      dashboard: '企业中心',
      jobs: '发布岗位',
      candidates: '人才库',
      messages: '消息中心',
      settings: '账户设置',
      logout: '退出登录',
      siteName: '博智匹配',
    },
    dashboard: {
      title: '欢迎回来',
      subtitle: '您的招聘管理中心',
      stats: {
        totalJobs: '发布岗位数',
        activeCandidates: '活跃人才',
        newMessages: '新消息',
        pendingInterviews: '待安排面试',
      },
      recentActivities: '最近动态',
      recommendedTalents: '推荐人才',
      quickActions: '快捷操作',
      postJob: '发布新岗位',
      viewTalents: '查看人才库',
      manageInterviews: '管理面试',
      updateCompany: '更新企业信息',
    },
    company: {
      info: '企业信息',
      name: '博智科技有限公司',
      industry: '科技互联网',
      size: '100-500人',
      location: '北京市海淀区',
      established: '2015年',
    },
  },
  en: {
    nav: {
      dashboard: 'Enterprise Center',
      jobs: 'Post Jobs',
      candidates: 'Talent Pool',
      messages: 'Messages',
      settings: 'Settings',
      logout: 'Logout',
      siteName: 'PhDMap',
    },
    dashboard: {
      title: 'Welcome Back',
      subtitle: 'Your Recruitment Management Center',
      stats: {
        totalJobs: 'Total Jobs',
        activeCandidates: 'Active Candidates',
        newMessages: 'New Messages',
        pendingInterviews: 'Pending Interviews',
      },
      recentActivities: 'Recent Activities',
      recommendedTalents: 'Recommended Talents',
      quickActions: 'Quick Actions',
      postJob: 'Post New Job',
      viewTalents: 'View Talent Pool',
      manageInterviews: 'Manage Interviews',
      updateCompany: 'Update Company Info',
    },
    company: {
      info: 'Company Information',
      name: 'PhDMap Technology Co., Ltd.',
      industry: 'Technology & Internet',
      size: '100-500 employees',
      location: 'Haidian District, Beijing',
      established: '2015',
    },
  },
};

export default function EnterpriseDashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const t = translations[lang];

  // 检查用户登录状态
  useEffect(() => {
    const checkLogin = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.isEnterprise) {
            setUserInfo(parsedUser);
          } else {
            // 如果不是企业用户，跳转到个人登录页
            router.push('/login');
          }
        } else {
          // 未登录，跳转到企业登录页
          router.push('/login/enterprise');
        }
      }
    };

    checkLogin();
  }, [router]);

  // 退出登录
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      router.push('/login/enterprise');
    }
  };

  // 统计数据
  const stats = [
    { label: t.dashboard.stats.totalJobs, value: 12, icon: '📋', color: 'bg-blue-500' },
    { label: t.dashboard.stats.activeCandidates, value: 89, icon: '👥', color: 'bg-green-500' },
    { label: t.dashboard.stats.newMessages, value: 15, icon: '💬', color: 'bg-purple-500' },
    { label: t.dashboard.stats.pendingInterviews, value: 7, icon: '🗓️', color: 'bg-orange-500' },
  ];

  // 推荐人才
  const recommendedTalents = [
    {
      id: 1,
      name: '张三',
      title: '计算机科学博士',
      field: '人工智能',
      experience: '3年相关经验',
      match: 92,
      avatar: '👨🔬',
    },
    {
      id: 2,
      name: '李四',
      title: '电子工程博士',
      field: '芯片设计',
      experience: '5年相关经验',
      match: 88,
      avatar: '👩💻',
    },
    {
      id: 3,
      name: '王五',
      title: '材料科学博士',
      field: '新能源材料',
      experience: '2年相关经验',
      match: 85,
      avatar: '🧪',
    },
  ];

  // 最近动态
  const recentActivities = [
    {
      id: 1,
      time: '今天 14:30',
      content: '新发布了岗位 "高级AI算法工程师"',
      type: 'job',
    },
    {
      id: 2,
      time: '昨天 09:15',
      content: '收到了5份新的简历投递',
      type: 'candidate',
    },
    {
      id: 3,
      time: '昨天 16:45',
      content: '候选人张三接受了面试邀请',
      type: 'interview',
    },
    {
      id: 4,
      time: '3天前',
      content: '企业资料已审核通过',
      type: 'system',
    },
  ];

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        <Header lang={lang} onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">正在加载企业中心...</p>
          </div>
        </main>
        <Footer lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
      />

      {/* 企业中心主体内容 */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 企业导航 */}
          <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
            <nav className="flex flex-wrap justify-center md:justify-start">
              {[
                { key: 'dashboard', label: t.nav.dashboard, icon: '📊' },
                { key: 'jobs', label: t.nav.jobs, icon: '📋' },
                { key: 'candidates', label: t.nav.candidates, icon: '👥' },
                { key: 'messages', label: t.nav.messages, icon: '💬' },
                { key: 'settings', label: t.nav.settings, icon: '⚙️' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 ${activeTab === item.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'}
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center px-6 py-4 text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-all duration-300 ml-auto"
              >
                <span className="mr-2">🚪</span>
                {t.nav.logout}
              </button>
            </nav>
          </div>

          {/* 企业信息卡片 */}
          <div className="bg-gradient-to-br from-primary via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">{t.dashboard.title}</h1>
                <p className="text-lg opacity-90">{t.dashboard.subtitle}</p>
              </div>
              <div className="mt-6 md:mt-0 bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{t.company.info}</h3>
                <p className="text-white font-bold text-2xl">{t.company.name}</p>
                <p className="opacity-90 mt-2">{t.company.industry} • {t.company.size}</p>
              </div>
            </div>
          </div>

          {/* 统计数据卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                  <div className={`w-16 h-16 rounded-full ${stat.color} flex items-center justify-center text-white text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 快捷操作和推荐人才 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 快捷操作 */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.dashboard.quickActions}</h2>
              <div className="space-y-3">
                {[
                  { label: t.dashboard.postJob, icon: '➕', color: 'bg-blue-500', path: '/enterprise/jobs/new' },
                  { label: t.dashboard.viewTalents, icon: '👀', color: 'bg-green-500', path: '/enterprise/candidates' },
                  { label: t.dashboard.manageInterviews, icon: '🗓️', color: 'bg-orange-500', path: '/enterprise/interviews' },
                  { label: t.dashboard.updateCompany, icon: '📝', color: 'bg-purple-500', path: '/enterprise/settings' },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(action.path)}
                    className="w-full flex items-center justify-start px-4 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white text-xl mr-4`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-gray-900 font-medium">{action.label}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* 推荐人才 */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.dashboard.recommendedTalents}</h2>
              <div className="space-y-4">
                {recommendedTalents.map((talent) => (
                  <div key={talent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl mr-4">
                        {talent.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{talent.name}</h3>
                        <p className="text-sm text-gray-600">{talent.title} • {talent.field}</p>
                        <p className="text-xs text-gray-500 mt-1">{talent.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">匹配度</div>
                        <div className="text-lg font-bold text-green-600">{talent.match}%</div>
                      </div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 text-sm">
                        查看详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 最近动态 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.dashboard.recentActivities}</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 mt-1">
                    {activity.type === 'job' && '📋'}
                    {activity.type === 'candidate' && '👥'}
                    {activity.type === 'interview' && '🗓️'}
                    {activity.type === 'system' && '📢'}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 共享页脚 */}
      <Footer lang={lang} />
    </div>
  );
}

