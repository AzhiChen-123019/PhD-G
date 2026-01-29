'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function HelpCenterPage() {
  const [lang, setLang] = useState<'zh' | 'en'>(() => {
    // 从localStorage获取语言设置，如果没有则默认为中文
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      return (savedLang === 'zh' || savedLang === 'en') ? savedLang : 'zh';
    }
    return 'zh';
  });

  // 当语言变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
      />
      
      <div className="flex h-screen overflow-hidden pt-16">
        {/* 侧边栏导航 */}
        <div className="w-64 bg-secondary text-white flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold">{lang === 'zh' ? '管理控制面板' : 'Admin Control Panel'}</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{lang === 'zh' ? '仪表盘' : 'Dashboard'}</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/users">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{lang === 'zh' ? '用户管理' : 'User Management'}</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/jobs">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{lang === 'zh' ? '岗位管理' : 'Job Management'}</span>
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
                    <span>{lang === 'zh' ? '系统设置' : 'System Settings'}</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/help">
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{lang === 'zh' ? '帮助中心' : 'Help Center'}</span>
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
                <p className="text-sm font-medium">{lang === 'zh' ? '超级管理员' : 'Super Admin'}</p>
                <p className="text-xs text-gray-300">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 主内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">{lang === 'zh' ? '帮助中心' : 'Help Center'}</h1>
              <p className="text-gray-600">{lang === 'zh' ? '获取使用指南和常见问题解答' : 'Get usage guides and frequently asked questions'}</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 常见问题 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{lang === 'zh' ? '常见问题' : 'Frequently Asked Questions'}</h2>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-gray-900 mb-2">{lang === 'zh' ? '如何创建新岗位？' : 'How to create a new job?'}</h3>
                    <p className="text-gray-600">{lang === 'zh' ? '在岗位管理页面点击"创建新岗位"按钮，选择创建方式（手动录入、链接提取或AI抓取），然后按照提示填写相关信息。' : 'Click the "Create New Job" button on the job management page, select the creation method (manual entry, link extraction, or AI scraping), then follow the prompts to fill in the relevant information.'}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-gray-900 mb-2">{lang === 'zh' ? '如何修改系统设置？' : 'How to modify system settings?'}</h3>
                    <p className="text-gray-600">{lang === 'zh' ? '在左侧导航栏中点击"系统设置"，修改相应的设置项，然后点击"保存设置"按钮。' : 'Click "System Settings" in the left navigation bar, modify the corresponding settings, then click the "Save Settings" button.'}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-gray-900 mb-2">{lang === 'zh' ? '如何切换语言？' : 'How to switch language?'}</h3>
                    <p className="text-gray-600">{lang === 'zh' ? '在页面顶部的导航栏中，点击语言切换按钮，选择您需要的语言（中文或英文）。' : 'In the navigation bar at the top of the page, click the language switch button and select the language you need (Chinese or English).'}</p>
                  </div>
                </div>
              </div>
              
              {/* 使用指南 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{lang === 'zh' ? '使用指南' : 'Usage Guides'}</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 mb-1">{lang === 'zh' ? '岗位管理指南' : 'Job Management Guide'}</h3>
                      <p className="text-gray-600 text-sm">{lang === 'zh' ? '学习如何创建、编辑和管理岗位信息' : 'Learn how to create, edit, and manage job information'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 mb-1">{lang === 'zh' ? '用户管理指南' : 'User Management Guide'}</h3>
                      <p className="text-gray-600 text-sm">{lang === 'zh' ? '了解如何管理用户账户和权限' : 'Learn how to manage user accounts and permissions'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 mb-1">{lang === 'zh' ? '系统设置指南' : 'System Settings Guide'}</h3>
                      <p className="text-gray-600 text-sm">{lang === 'zh' ? '掌握系统配置和个性化设置' : 'Master system configuration and personalized settings'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 联系支持 */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{lang === 'zh' ? '联系支持' : 'Contact Support'}</h2>
              <p className="text-gray-600 mb-6">{lang === 'zh' ? '如果您有任何问题或需要帮助，请通过以下方式联系我们的支持团队：' : 'If you have any questions or need help, please contact our support team through the following methods:'}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-medium text-gray-900 mb-1">{lang === 'zh' ? '邮箱' : 'Email'}</h3>
                  <p className="text-gray-600 text-center">support@ctalents-t.com</p>
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h3 className="font-medium text-gray-900 mb-1">{lang === 'zh' ? '电话' : 'Phone'}</h3>
                  <p className="text-gray-600 text-center">+86 123 4567 8910</p>
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="font-medium text-gray-900 mb-1">{lang === 'zh' ? '在线聊天' : 'Online Chat'}</h3>
                  <p className="text-gray-600 text-center">{lang === 'zh' ? '工作时间内在线' : 'Online during working hours'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
