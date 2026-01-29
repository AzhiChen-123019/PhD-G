'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Language, getTranslation } from '@/lib/i18n';

const RegisterPage: React.FC = () => {
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

  const handlePersonalRegister = () => {
    router.push('/register/personal');
  };

  const handleEnterpriseRegister = () => {
    router.push('/register/enterprise');
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
              {lang === 'zh' ? '加入博智匹配，开启职业新篇章' : 'Join PhDMap, Start Your Professional Journey'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              {lang === 'zh' 
                ? '连接全球顶尖博士人才与优质机构，实现精准职业匹配' 
                : 'Connect top PhD talents worldwide with excellent institutions for precise career matching'
              }
            </p>
          </div>
        </section>

        {/* 注册选项 */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* 标题 */}
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {lang === 'zh' ? '选择您的注册类型' : 'Choose Your Registration Type'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {lang === 'zh' 
                    ? '根据您的身份选择合适的注册方式，我们将为您提供个性化的服务' 
                    : 'Select the appropriate registration method based on your identity, and we will provide you with personalized services'
                  }
                </p>
              </div>

              {/* 注册按钮区域 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                {/* 个人用户注册 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {lang === 'zh' ? '个人用户注册' : 'Personal User Registration'}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      {lang === 'zh' 
                        ? '为全球博士人才提供高效精准的职业发展机会，智能匹配理想岗位，开启精彩职业生涯，享受简历优化、企业直达等专业求职助手服务' 
                        : 'Provide efficient and precise career development opportunities for global PhD talents, intelligently match ideal positions, start a brilliant career, and enjoy professional job search assistant services including resume optimization and direct enterprise access'
                      }
                    </p>
                    <button
                      onClick={handlePersonalRegister}
                      className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
                    >
                      {lang === 'zh' ? '个人注册' : 'Register as Personal'}
                    </button>
                  </div>
                </div>

                {/* 企业用户注册 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {lang === 'zh' ? '企业/机构注册' : 'Enterprise/Institution Registration'}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      {lang === 'zh' 
                        ? '为企业和机构提供高端博士人才招聘服务，依托智能匹配系统精准对接优质博士，快速填补核心岗位空缺，提升人才招聘效率和质量' 
                        : 'Provide high-end PhD talent recruitment services for enterprises and institutions, precisely connect with quality PhDs through intelligent matching systems, quickly fill core position vacancies, and improve talent recruitment efficiency and quality'
                      }
                    </p>
                    <button
                      onClick={handleEnterpriseRegister}
                      className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
                    >
                      {lang === 'zh' ? '企业注册' : 'Register as Enterprise'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 平台优势 */}
              <div className="mt-24">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
                  {lang === 'zh' ? '平台优势' : 'Platform Advantages'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* 优势1 */}
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {lang === 'zh' ? '精准匹配' : 'Precise Matching'}
                    </h4>
                    <p className="text-gray-600">
                      {lang === 'zh' 
                        ? '基于AI算法的智能匹配系统，确保人才与岗位高度契合' 
                        : 'AI-based intelligent matching system to ensure high compatibility between talents and positions'
                      }
                    </p>
                  </div>

                  {/* 优势2 */}
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {lang === 'zh' ? '全球资源' : 'Global Resources'}
                    </h4>
                    <p className="text-gray-600">
                      {lang === 'zh' 
                        ? '连接全球顶尖高校和研究机构，覆盖多学科领域' 
                        : 'Connect with top universities and research institutions worldwide, covering multiple disciplines'
                      }
                    </p>
                  </div>

                  {/* 优势3 */}
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {lang === 'zh' ? '专业服务' : 'Professional Services'}
                    </h4>
                    <p className="text-gray-600">
                      {lang === 'zh' 
                        ? '提供简历优化、面试指导等专业服务，助力职业发展' 
                        : 'Provide professional services such as resume optimization and interview guidance to support career development'
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

export default RegisterPage;