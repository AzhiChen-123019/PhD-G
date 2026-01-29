'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import { MembershipLevel } from '@/lib/membership';
import { Language, getTranslation } from '@/lib/i18n';

interface NavbarProps {
  lang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang = 'zh', onLanguageChange }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentLang, setCurrentLang] = useState<Language>(lang);

  // 模拟登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(parsedUser.username || 'User');
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

  const t = getTranslation(currentLang);

  // 获取会员等级对应的图标
  const getMembershipIcon = () => {
    if (!user || !user.membershipLevel) return null;

    switch (user.membershipLevel) {
      case MembershipLevel.VIP:
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold ml-1">
            VIP
          </span>
        );
      case MembershipLevel.SVIP:
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-xs font-bold ml-1">
            SVIP
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-gradient-to-r from-white to-gray-50 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <img 
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20tech%20logo%20for%20PhD-G%2C%20blue%20and%20cyan%20glowing%20text%2C%20digital%20font%2C%20earth%20globe%20element%2C%20tech%20sci-fi%20style%2C%20white%20background%2C%20vector%20design&image_size=square_hd" 
                alt={t.nav.siteName} 
                className="h-10 w-10 mr-2" 
              />
              <span className="text-xl font-bold text-primary font-mono tracking-wider">{t.nav.siteName}</span>
            </a>
          </div>
          
          {/* 桌面端导航 - 居中对齐 */}
          <div className="hidden md:flex items-center flex-grow justify-center space-x-12">
            <a href="/" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
              {t.nav.home}
            </a>
            <a 
              href="/university?aiCall=true" 
              className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center"
              onClick={(e) => {
                // 设置AI调用标志，用于页面加载时触发AI调用
                localStorage.setItem('triggerAICall', JSON.stringify({ type: 'university', timestamp: Date.now() }));
              }}
            >
              {t.nav.university}
            </a>
            <a 
              href="/enterprise?aiCall=true" 
              className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center"
              onClick={(e) => {
                // 设置AI调用标志，用于页面加载时触发AI调用
                localStorage.setItem('triggerAICall', JSON.stringify({ type: 'enterprise', timestamp: Date.now() }));
              }}
            >
              {t.nav.enterprise}
            </a>
            <a href="/private" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
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
                    <a href="/account" className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </a>
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
              <>
                <a href="/login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  {t.auth.login}
                </a>
                <a href="/register" className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  {t.auth.register}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;