'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

// 系统设置类型定义
interface SystemSettings {
  id: string;
  websiteName: string;
  websiteDescription: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  copyrightInfo: string;
  defaultLanguage: string;
  timezone: string;
  paginationSize: number;
  createdAt: string;
  updatedAt: string;
}

// 本地存储键名
const SYSTEM_SETTINGS_KEY = 'systemSettings';

// 获取系统设置
const getSystemSettings = (): SystemSettings => {
  const settingsJson = localStorage.getItem(SYSTEM_SETTINGS_KEY);
  if (settingsJson) {
    return JSON.parse(settingsJson);
  } else {
    // 默认设置
       const defaultSettings: SystemSettings = {
         id: 'system-1',
         websiteName: 'PhD-G',
         websiteDescription: 'Global Gateway for PhD Opportunities',
         logoUrl: '/logos/logo1.png',
         contactEmail: 'contact@phd-g.com',
         contactPhone: '+86 123 4567 8910',
         copyrightInfo: '© 2026 PhD-G. All rights reserved.',
      defaultLanguage: 'zh',
      timezone: 'Asia/Shanghai',
      paginationSize: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(SYSTEM_SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
};

// 保存系统设置
const saveSystemSettings = (settings: SystemSettings) => {
  localStorage.setItem(SYSTEM_SETTINGS_KEY, JSON.stringify(settings));
};

export default function SettingsPage() {
  const [lang, setLang] = useState<'zh' | 'en'>(() => {
    // 从localStorage获取语言设置，如果没有则默认为中文
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      return (savedLang === 'zh' || savedLang === 'en') ? savedLang : 'zh';
    }
    return 'zh';
  });
  const [settings, setSettings] = useState<SystemSettings>({
    id: 'system-1',
    websiteName: '',
    websiteDescription: '',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    copyrightInfo: '',
    defaultLanguage: 'zh',
    timezone: 'Asia/Shanghai',
    paginationSize: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 当语言变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // 客户端加载系统设置
  useEffect(() => {
    setSettings(getSystemSettings());
  }, []);

  // 保存设置
  const handleSaveSettings = () => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedSettings: SystemSettings = {
        ...settings,
        updatedAt: new Date().toISOString()
      };
      
      saveSystemSettings(updatedSettings);
      setSettings(updatedSettings);
      setSuccessMessage('系统设置保存成功！');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存设置失败');
      console.error('Error saving system settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // 重置设置
   const handleResetSettings = () => {
     const defaultSettings: SystemSettings = {
       id: 'system-1',
       websiteName: 'PhD-G',
       websiteDescription: 'Global Gateway for PhD Opportunities',
       logoUrl: '/logos/logo1.png',
       contactEmail: 'contact@phd-g.com',
       contactPhone: '+86 123 4567 8910',
       copyrightInfo: '© 2026 PhD-G. All rights reserved.',
      defaultLanguage: 'zh',
      timezone: 'Asia/Shanghai',
      paginationSize: 10,
      createdAt: settings.createdAt,
      updatedAt: new Date().toISOString()
    };
    setSettings(defaultSettings);
  };

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
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
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
              <h1 className="text-2xl font-bold text-gray-900">{lang === 'zh' ? '系统设置' : 'System Settings'}</h1>
              <p className="text-gray-600">{lang === 'zh' ? '管理网站基本信息和全局参数' : 'Manage website basic information and global parameters'}</p>
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
            
            {/* 系统设置表单 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">网站基本信息</h2>
                
                {/* 网站名称 */}
                <div>
                  <label htmlFor="websiteName" className="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
                  <input
                    type="text"
                    id="websiteName"
                    value={settings.websiteName}
                    onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="输入网站名称"
                  />
                </div>
                
                {/* 网站描述 */}
                <div>
                  <label htmlFor="websiteDescription" className="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
                  <textarea
                    id="websiteDescription"
                    value={settings.websiteDescription}
                    onChange={(e) => setSettings({ ...settings, websiteDescription: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="输入网站描述"
                  ></textarea>
                </div>
                
                {/* Logo URL */}
                <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input
                    type="text"
                    id="logoUrl"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="输入Logo URL"
                  />
                </div>
                
                {/* 联系信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">联系邮箱</label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="输入联系邮箱"
                    />
                  </div>
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input
                      type="tel"
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="输入联系电话"
                    />
                  </div>
                </div>
                
                {/* 版权信息 */}
                <div>
                  <label htmlFor="copyrightInfo" className="block text-sm font-medium text-gray-700 mb-1">版权信息</label>
                  <input
                    type="text"
                    id="copyrightInfo"
                    value={settings.copyrightInfo}
                    onChange={(e) => setSettings({ ...settings, copyrightInfo: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="输入版权信息"
                  />
                </div>
                
                <hr className="border-gray-200" />
                
                <h2 className="text-xl font-semibold text-gray-900">全局参数</h2>
                
                {/* 默认语言 */}
                <div>
                  <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700 mb-1">默认语言</label>
                  <select
                    id="defaultLanguage"
                    value={settings.defaultLanguage}
                    onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                {/* 时区 */}
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">时区</label>
                  <select
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Asia/Shanghai">亚洲/上海</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">美国/纽约</option>
                    <option value="Europe/London">欧洲/伦敦</option>
                  </select>
                </div>
                
                {/* 分页大小 */}
                <div>
                  <label htmlFor="paginationSize" className="block text-sm font-medium text-gray-700 mb-1">默认分页大小</label>
                  <input
                    type="number"
                    id="paginationSize"
                    min="5"
                    max="50"
                    step="5"
                    value={settings.paginationSize}
                    onChange={(e) => setSettings({ ...settings, paginationSize: parseInt(e.target.value) || 10 })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={handleResetSettings}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    重置
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '保存中...' : '保存设置'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}