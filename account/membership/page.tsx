'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSelector from '@/components/LanguageSelector';
import { MembershipPlan, MEMBERSHIP_PLANS, MembershipLevel } from '@/lib/membership';

// 多语言支持
const translations = {
  zh: {
    nav: {
      profile: '个人资料',
      resume: '简历管理',
      jobs: '岗位管理',
      applications: '申请记录',
      membership: '会员中心',
      settings: '账号设置',
      logout: '退出登录',
      siteName: '博智匹配',
    },
    membership: {
      title: '会员中心',
      currentLevel: '当前会员等级',
      upgradeNow: '立即升级',
      free: '免费会员',
      vip: 'VIP会员',
      svip: 'SVIP会员',
      monthly: '月费',
      lifetime: '终身',
      features: '会员特权',
      description: '会员服务描述',
      upgradeToVip: '升级到VIP会员',
      upgradeToSvip: '升级到SVIP会员',
      viewDetails: '查看详情',
      benefit: '会员权益',
      privateJobLimit: '私人岗位库容量',
      resumeOptimization: '智能简历优化',
      resumeTemplates: '简历模板',
      companyEmails: '企业招聘邮箱',
      selfRecommendation: '自荐邮件生成',
      unlimited: '无限次',
      goToMemberCenter: '前往会员中心',
    },
    welcome: '欢迎回来！',
  },
  en: {
    nav: {
      profile: 'Profile',
      resume: 'Resume Management',
      jobs: 'Job Management',
      applications: 'Applications',
      membership: 'Membership Center',
      settings: 'Account Settings',
      logout: 'Logout',
      siteName: 'PhDMap',
    },
    membership: {
      title: 'Membership Center',
      currentLevel: 'Current Membership Level',
      upgradeNow: 'Upgrade Now',
      free: 'Free Member',
      vip: 'VIP Member',
      svip: 'SVIP Member',
      monthly: 'Monthly',
      lifetime: 'Lifetime',
      features: 'Membership Features',
      description: 'Membership Description',
      upgradeToVip: 'Upgrade to VIP',
      upgradeToSvip: 'Upgrade to SVIP',
      viewDetails: 'View Details',
      benefit: 'Membership Benefits',
      privateJobLimit: 'Private Job Library Limit',
      resumeOptimization: 'Smart Resume Optimization',
      resumeTemplates: 'Resume Templates',
      companyEmails: 'Company Recruitment Emails',
      selfRecommendation: 'Self Recommendation Emails',
      unlimited: 'Unlimited',
      goToMemberCenter: 'Go to Member Center',
    },
    welcome: 'Welcome back!',
  },
};

// 默认用户数据
const defaultUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  membershipLevel: MembershipLevel.FREE,
  hasUploadedResume: true,
};

const MembershipPage = () => {
  const router = useRouter();
  const [lang, setLang] = useState<'zh' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      return (savedLang === 'zh' || savedLang === 'en') ? savedLang : 'zh';
    }
    return 'zh';
  });
  const [activeTab, setActiveTab] = useState('membership');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState({
    ...defaultUser,
    membershipLevel: MembershipLevel.FREE,
  });
  
  // 当语言变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);
  
  // 模拟登录状态
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserName(user.username || 'User');
      setUser({
        ...defaultUser,
        username: user.username,
        email: user.email,
        membershipLevel: user.membershipLevel || MembershipLevel.FREE,
      });
    }
  }, []);
  
  const t = translations[lang];
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };
  
  const handleUpgrade = (plan: MembershipPlan) => {
    // 模拟升级逻辑
    alert(`${lang === 'zh' ? '升级到' : 'Upgrade to '}${plan.name} ${lang === 'zh' ? '成功！' : 'successful!'}`);
    
    // 更新用户会员等级
    const updatedUser = {
      ...user,
      membershipLevel: plan.level,
    };
    setUser(updatedUser);
    
    // 更新localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.membershipLevel = plan.level;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };
  
  // 获取当前会员等级的显示名称
  const getCurrentMembershipName = () => {
    switch (user.membershipLevel) {
      case MembershipLevel.FREE:
        return t.membership.free;
      case MembershipLevel.VIP:
        return t.membership.vip;
      case MembershipLevel.SVIP:
        return t.membership.svip;
      default:
        return t.membership.free;
    }
  };
  
  // 获取会员等级对应的颜色
  const getMembershipColor = (level: MembershipLevel) => {
    switch (level) {
      case MembershipLevel.FREE:
        return 'bg-gray-500';
      case MembershipLevel.VIP:
        return 'bg-blue-500';
      case MembershipLevel.SVIP:
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-gradient-to-r from-white to-gray-50 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0 flex items-center">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Unique%20tech%20logo%20for%20PhD%20job%20platform%2C%20futuristic%20design%20with%20hexagon%20and%20upward%20arrow%2C%20purple%20and%20blue%20gradient%2C%20minimalist%20style%2C%20not%20similar%20to%20Baidu%20Netdisk%20logo%2C%20clean%20white%20background%2C%20professional%20and%20distinctive&image_size=square_hd" alt={t.nav.siteName} className="h-10 w-10 mr-2" />
                <span className="text-xl font-bold text-primary">{t.nav.siteName}</span>
              </a>
            </div>
            
            {/* 桌面端导航 - 居中对齐 */}
            <div className="hidden md:flex items-center flex-grow justify-center space-x-12">
              <a href="/" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
                {lang === 'zh' ? '首页' : 'Home'}
              </a>
              <a href="/university" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
                {lang === 'zh' ? '大学科研岗位' : 'University Research Positions'}
              </a>
              <a href="/enterprise" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
                {lang === 'zh' ? '企业高级岗位' : 'Enterprise Senior Positions'}
              </a>
              <a href="/private" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
                {lang === 'zh' ? '我的私人岗位' : 'My Private Positions'}
              </a>
            </div>
            
            {/* 右侧区域：语言切换 + 登录注册/用户信息 */}
            <div className="hidden md:flex items-center space-x-4">
              {/* 语言切换 */}
              <LanguageSelector 
                currentLang={lang} 
                onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
              />
              
              {/* 登录注册按钮或用户信息 */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      {lang === 'zh' ? '欢迎，' : 'Welcome, '}{userName}
                    </span>
                    <a href="/account" className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </a>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {lang === 'zh' ? '退出登录' : 'Logout'}
                  </button>
                </div>
              ) : (
                <>
                  <a href="/login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                    {lang === 'zh' ? '登录' : 'Login'}
                  </a>
                  <a href="/register" className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    {lang === 'zh' ? '注册' : 'Register'}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 侧边导航 */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 mt-4">{t.welcome}</h3>
              <nav className="space-y-2">
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => router.push('/account')}
                >
                  {t.nav.profile}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'resume' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => router.push('/account/resume')}
                >
                  {t.nav.resume}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'jobs' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => router.push('/account/jobs')}
                >
                  {t.nav.jobs}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'applications' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => router.push('/account/applications')}
                >
                  {t.nav.applications}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'membership' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('membership')}
                >
                  {t.nav.membership}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => router.push('/account/settings')}
                >
                  {t.nav.settings}
                </button>
                <button
                  className="w-full text-left px-4 py-2 rounded-md transition-colors text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  {t.nav.logout}
                </button>
              </nav>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6 mt-4">
                <h2 className="text-2xl font-bold text-gray-900">{t.membership.title}</h2>
              </div>
              
              {/* 当前会员等级 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.membership.currentLevel}</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {getCurrentMembershipName()}
                      </h4>
                      <p className="text-gray-500 mt-1">
                        {lang === 'zh' ? '享受基本会员权益' : 'Enjoy basic membership benefits'}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-white font-medium ${getMembershipColor(user.membershipLevel)}`}>
                      {getCurrentMembershipName()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 会员套餐 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.membership.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {MEMBERSHIP_PLANS.map((plan) => (
                    <div 
                      key={plan.level} 
                      className={`rounded-lg overflow-hidden shadow-md border-2 transition-all duration-300 hover:shadow-lg ${user.membershipLevel === plan.level ? 'border-primary bg-primary/5' : plan.level === MembershipLevel.VIP ? 'border-blue-200 hover:border-blue-400' : 'border-purple-200 hover:border-purple-400'}`}
                    >
                      <div className={`p-4 text-white ${plan.level === MembershipLevel.FREE ? 'bg-gray-500' : plan.level === MembershipLevel.VIP ? 'bg-blue-500' : 'bg-purple-600'}`}>
                        <h4 className="text-lg font-bold">{plan.name}</h4>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">¥{plan.price}</span>
                          <span className="text-sm ml-2">
                            {plan.duration === 'monthly' ? t.membership.monthly : t.membership.lifetime}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
                        
                        <h5 className="font-semibold text-gray-900 mb-3">{t.membership.features}</h5>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {user.membershipLevel === plan.level ? (
                          <button 
                            className="w-full py-2 bg-gray-200 text-gray-700 rounded-md cursor-not-allowed"
                            disabled
                          >
                            {lang === 'zh' ? '当前等级' : 'Current Level'}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUpgrade(plan)}
                            className={`w-full py-2 rounded-md text-white font-medium transition-colors ${plan.level === MembershipLevel.VIP ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                          >
                            {lang === 'zh' ? '立即升级' : 'Upgrade Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 会员权益详情 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.membership.benefit}</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.membership.benefit}
                        </th>
                        {MEMBERSHIP_PLANS.map((plan) => (
                          <th key={plan.level} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {plan.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* 私人岗位库容量 */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {t.membership.privateJobLimit}
                        </td>
                        {MEMBERSHIP_PLANS.map((plan) => (
                          <td key={plan.level} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            {plan.services.privateJobLimit} {lang === 'zh' ? '个' : ''}
                          </td>
                        ))}
                      </tr>
                      
                      {/* 智能简历优化 */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {t.membership.resumeOptimization}
                        </td>
                        {MEMBERSHIP_PLANS.map((plan) => (
                          <td key={plan.level} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            {plan.services.resumeOptimization === 'unlimited' ? t.membership.unlimited : `${plan.services.resumeOptimization} ${lang === 'zh' ? '次' : 'times'}`}
                          </td>
                        ))}
                      </tr>
                      
                      {/* 简历模板 */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {t.membership.resumeTemplates}
                        </td>
                        {MEMBERSHIP_PLANS.map((plan) => (
                          <td key={plan.level} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            {plan.services.resumeTemplates === 'unlimited' ? t.membership.unlimited : `${plan.services.resumeTemplates} ${lang === 'zh' ? '次' : 'times'}`}
                          </td>
                        ))}
                      </tr>
                      
                      {/* 企业招聘邮箱 */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {t.membership.companyEmails}
                        </td>
                        {MEMBERSHIP_PLANS.map((plan) => (
                          <td key={plan.level} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            {plan.services.companyEmails === 'unlimited' ? t.membership.unlimited : `${plan.services.companyEmails} ${lang === 'zh' ? '个' : ''}`}
                          </td>
                        ))}
                      </tr>
                      
                      {/* 自荐邮件生成 */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {t.membership.selfRecommendation}
                        </td>
                        {MEMBERSHIP_PLANS.map((plan) => (
                          <td key={plan.level} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            {plan.services.selfRecommendationEmails === 'unlimited' ? t.membership.unlimited : `${plan.services.selfRecommendationEmails} ${lang === 'zh' ? '次' : 'times'}`}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;