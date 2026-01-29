'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Language, getTranslation } from '@/lib/i18n';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState<Language>('zh');
  const t = getTranslation(lang);

  // 当语言变化时，保存到localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language || 'zh';
    setLang(savedLang);
  }, []);

  const handleLanguageChange = (newLang: string) => {
    const language = newLang as Language;
    setLang(language);
    localStorage.setItem('lang', language);
  };

  const handlePersonalLogin = () => {
    router.push('/login/personal');
  };

  const handleEnterpriseLogin = () => {
    router.push('/login/enterprise');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={handleLanguageChange} 
      />

      {/* 主内容 */}
      <main className="flex-grow">
        {/* 英雄区 */}
        <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {lang === 'zh' ? '欢迎回来，继续您的职业之旅' : 'Welcome Back, Continue Your Professional Journey'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              {lang === 'zh' 
                ? '登录您的账户，访问个性化职业匹配服务和更多专业功能' 
                : 'Log in to your account to access personalized career matching services and more professional features'
              }
            </p>
          </div>
        </section>

        {/* 登录选项 */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* 标题 */}
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {lang === 'zh' ? '选择您的登录方式' : 'Choose Your Login Method'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {lang === 'zh' 
                    ? '根据您的用户类型选择合适的登录方式，快速访问您的账户' 
                    : 'Select the appropriate login method based on your user type to quickly access your account'
                  }
                </p>
              </div>

              {/* 登录按钮区域 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                {/* 个人用户登录 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {lang === 'zh' ? '个人用户登录' : 'Personal User Login'}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      {lang === 'zh' 
                        ? '博士人才登录账户，管理个人资料，查看推荐岗位，申请职位' 
                        : 'PhD talents log in to manage personal profiles, view recommended positions, and apply for jobs'
                      }
                    </p>
                    <button
                      onClick={handlePersonalLogin}
                      className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
                    >
                      {lang === 'zh' ? '个人登录' : 'Login as Personal'}
                    </button>
                  </div>
                </div>

                {/* 企业用户登录 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {lang === 'zh' ? '企业/机构登录' : 'Enterprise/Institution Login'}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      {lang === 'zh' 
                        ? '企业和机构登录账户，发布招聘信息，管理候选人，查看人才库' 
                        : 'Enterprises and institutions log in to post job listings, manage candidates, and view talent pool'
                      }
                    </p>
                    <button
                      onClick={handleEnterpriseLogin}
                      className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
                    >
                      {lang === 'zh' ? '企业登录' : 'Login as Enterprise'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 平台优势 */}
              <div className="mt-24">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
                  {lang === 'zh' ? '登录后您可以' : 'After Logging In, You Can'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* 功能1 */}
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {lang === 'zh' ? '管理个人资料' : 'Manage Personal Profile'}
                    </h4>
                    <p className="text-gray-600">
                      {lang === 'zh' 
                        ? '完善个人信息，上传简历，管理学历验证状态' 
                        : 'Complete personal information, upload resumes, and manage degree verification status'
                      }
                    </p>
                  </div>

                  {/* 功能2 */}
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {lang === 'zh' ? '查看推荐岗位' : 'View Recommended Jobs'}
                    </h4>
                    <p className="text-gray-600">
                      {lang === 'zh' 
                        ? '基于您的背景和偏好，获取精准的岗位推荐' 
                        : 'Get precise job recommendations based on your background and preferences'
                      }
                    </p>
                  </div>

                  {/* 功能3 */}
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {lang === 'zh' ? '使用站内邮箱' : 'Use Internal Email'}
                    </h4>
                    <p className="text-gray-600">
                      {lang === 'zh' 
                        ? '通过网站专属邮箱与企业沟通，跟踪邮件状态' 
                        : 'Communicate with enterprises through website-exclusive email and track email status'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <Footer lang={lang} />
    </div>
  );
};

export default LoginPage;