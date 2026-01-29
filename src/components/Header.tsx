'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import { Language, getTranslation } from '@/lib/i18n';

interface HeaderProps {
  lang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang = 'zh', onLanguageChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentLang, setCurrentLang] = useState<Language>(lang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [websiteName, setWebsiteName] = useState('PhD-G');
  const [logoUrl, setLogoUrl] = useState('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20tech%20logo%20for%20PhD-G%2C%20blue%20and%20cyan%20glowing%20text%2C%20digital%20font%2C%20earth%20globe%20element%2C%20tech%20sci-fi%20style%2C%20white%20background%2C%20vector%20design&image_size=square_hd');
  const t = getTranslation(currentLang);
  
  // 获取系统设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadSettings = () => {
        try {
          const settingsJson = localStorage.getItem('systemSettings');
          if (settingsJson) {
            const settings = JSON.parse(settingsJson);
            setWebsiteName(settings.websiteName || 'PhD-G');
            setLogoUrl(settings.logoUrl || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Clean%20modern%20logo%20design%20for%20PhD-G%2C%20global%20gateway%20for%20PhD%20opportunities.%20Minimalist%20design%20with%20PG%20monogram%2C%20blue%20color%20scheme%2C%20professional%20and%20academic%20feel.%20Vector%20style%2C%20transparent%20background.&image_size=square_hd');
          } else {
            // 如果没有设置，创建默认设置
            const defaultSettings = {
              id: 'system-1',
              websiteName: 'PhD-G',
              websiteDescription: 'Global Gateway for PhD Opportunities',
              logoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20tech%20logo%20for%20PhD-G%2C%20blue%20and%20cyan%20glowing%20text%2C%20digital%20font%2C%20earth%20globe%20element%2C%20tech%20sci-fi%20style%2C%20white%20background%2C%20vector%20design&image_size=square_hd',
              contactEmail: 'contact@phd-g.com',
              contactPhone: '+86 123 4567 8910',
              copyrightInfo: '© 2026 PhD-G. All rights reserved.',
              defaultLanguage: 'zh',
              timezone: 'Asia/Shanghai',
              paginationSize: 10,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            localStorage.setItem('systemSettings', JSON.stringify(defaultSettings));
            setWebsiteName(defaultSettings.websiteName);
            setLogoUrl(defaultSettings.logoUrl);
          }
        } catch (error) {
          console.error('Error loading system settings:', error);
        }
      };
      
      // 初始加载
      loadSettings();
      
      // 监听localStorage变化
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'systemSettings') {
          loadSettings();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);
  
  // 检查当前链接是否为活跃链接
  const isActiveLink = (path: string) => {
    // 处理pathname可能为null的情况
    if (!pathname) {
      return false;
    }
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // 模拟登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(parsedUser.username || parsedUser.email.split('@')[0] || 'User');
      }
    }
  }, [user]);

  // 当语言变化时，保存到localStorage并通知父组件
  const handleLanguageChange = (newLang: string) => {
    const lang = newLang as Language;
    setCurrentLang(lang);
    localStorage.setItem('lang', lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    logout();
    router.push('/');
  };

  // 获取会员等级对应的图标
  const getMembershipIcon = () => {
    if (!user || !user.membershipLevel) return null;

    // 使用类型断言将membershipLevel转换为string
    const membershipLevel = user.membershipLevel as string;

    if (membershipLevel === 'VIP') {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold ml-1">
          VIP
        </span>
      );
    } else if (membershipLevel === 'SVIP') {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-xs font-bold ml-1">
          SVIP
        </span>
      );
    }
    return null;
  };

  return (
    <>
      {/* 桌面端导航 */}
      <nav className="bg-gradient-to-r from-white to-gray-50 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0 flex items-center">
                <img 
                  src={logoUrl} 
                  alt={websiteName} 
                  className="h-10 w-10 mr-2" 
                />
                <span className="text-2xl font-bold text-primary font-mono tracking-wider">{websiteName}</span>
              </a>
            </div>
            
            {/* 桌面端导航 - 居中对齐 */}
            <div className="hidden md:flex items-center flex-grow justify-center space-x-12">
              <a href="/" className={`px-4 py-2 rounded-md text-sm font-medium text-center transition-colors ${isActiveLink('/') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`}>
                {t.nav.home}
              </a>
              <a href="/university" className={`px-4 py-2 rounded-md text-sm font-medium text-center transition-colors ${isActiveLink('/university') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`}>
                {t.nav.university}
              </a>
              <a href="/enterprise" className={`px-4 py-2 rounded-md text-sm font-medium text-center transition-colors ${isActiveLink('/enterprise') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`}>
                {t.nav.enterprise}
              </a>
              <a href="/private" className={`px-4 py-2 rounded-md text-sm font-medium text-center transition-colors ${isActiveLink('/private') || isActiveLink('/private-jobs') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`}>
                {t.nav.private}
              </a>
            </div>
            
            {/* 右侧区域：语言切换 + 登录注册/用户信息 */}
            <div className="hidden md:flex items-center space-x-4">
              {/* 语言切换 */}
              <LanguageSelector 
                currentLang={currentLang} 
                onLanguageChange={handleLanguageChange} 
              />
              
              {/* 登录注册按钮或用户信息 */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      {t.auth.welcome}{userName}
                    </span>
                    <div className="relative">
                      {/* 根据用户类型显示不同的账户链接 */}
                      {(() => {
                        if (typeof window !== 'undefined') {
                          const storedUser = localStorage.getItem('user');
                          if (storedUser) {
                            const parsedUser = JSON.parse(storedUser);
                            if (parsedUser.isEnterprise) {
                              // 企业用户
                              return (
                                <a href="/enterprise/dashboard" className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </a>
                              );
                            }
                          }
                        }
                        // 个人用户
                        return (
                          <a href="/account" className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </a>
                        );
                      })()}
                      {/* 会员图标 */}
                      {getMembershipIcon()}
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t.nav.logout}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* 个人用户登录注册 */}
                  <div className="flex items-center space-x-2">
                    <a href="/login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                      {t.auth.login}
                    </a>
                    <a href="/register" className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                      {t.auth.register}
                    </a>
                  </div>

                </div>
              )}
            </div>
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="/" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActiveLink('/') ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary hover:bg-gray-100'}`}>
                {t.nav.home}
              </a>
              <a href="/university" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActiveLink('/university') ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary hover:bg-gray-100'}`}>
                {t.nav.university}
              </a>
              <a href="/enterprise" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActiveLink('/enterprise') ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary hover:bg-gray-100'}`}>
                {t.nav.enterprise}
              </a>
              <a href="/private" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActiveLink('/private') || isActiveLink('/private-jobs') ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary hover:bg-gray-100'}`}>
                {t.nav.private}
              </a>
              <a href="/account" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActiveLink('/account') ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary hover:bg-gray-100'}`}>
                {t.nav.profile}
              </a>
              <div className="flex space-x-2 px-3 py-2">
                <button 
                  onClick={() => handleLanguageChange('zh')}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${currentLang === 'zh' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  中文
                </button>
                <button 
                  onClick={() => handleLanguageChange('en')}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${currentLang === 'en' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  English
                </button>
              </div>
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                >
                  {t.nav.logout}
                </button>
              ) : (
                <div className="space-y-4 px-3 py-2">
                  {/* 个人用户登录注册 */}
                  <div className="flex flex-col space-y-2">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase">个人用户</h4>
                    <div className="flex flex-col space-y-2">
                      <a href="/login" className="block py-2 text-center rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                        {t.auth.login}
                      </a>
                      <a href="/register" className="block py-2 text-center rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90 transition-colors">
                        {t.auth.register}
                      </a>
                    </div>
                  </div>
                  

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;