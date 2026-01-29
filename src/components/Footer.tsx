'use client';

import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from '@/lib/i18n';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = getTranslation(lang);
  const [websiteName, setWebsiteName] = useState('PhD-G');
  const [logoUrl, setLogoUrl] = useState('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20tech%20logo%20for%20PhD-G%2C%20blue%20and%20cyan%20glowing%20text%2C%20digital%20font%2C%20earth%20globe%20element%2C%20tech%20sci-fi%20style%2C%20white%20background%2C%20vector%20design&image_size=square_hd');
  
  // 获取系统设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadSettings = () => {
        try {
          const settingsJson = localStorage.getItem('systemSettings');
          if (settingsJson) {
            const settings = JSON.parse(settingsJson);
            setWebsiteName(settings.websiteName || 'PhD-G');
            setLogoUrl(settings.logoUrl || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20tech%20logo%20for%20PhD-G%2C%20blue%20and%20cyan%20glowing%20text%2C%20digital%20font%2C%20earth%20globe%20element%2C%20tech%20sci-fi%20style%2C%20white%20background%2C%20vector%20design&image_size=square_hd');
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

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Unique%20tech%20logo%20for%20PhD%20job%20platform%2C%20futuristic%20design%20with%20hexagon%20and%20upward%20arrow%2C%20purple%20and%20blue%20gradient%2C%20minimalist%20style%2C%20not%20similar%20to%20Baidu%20Netdisk%20logo%2C%20clean%20white%20background%2C%20professional%20and%20distinctive&image_size=square_hd" alt={t.nav.siteName} className="h-10 w-10 mr-2" />
              <h3 className="text-xl font-bold">{t.nav.siteName}</h3>
            </div>
            <p className="text-gray-400">
              {t.hero.description}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">{t.nav.home}</a></li>
              <li><a href="/university" className="text-gray-400 hover:text-white">{t.nav.university}</a></li>
              <li><a href="/enterprise" className="text-gray-400 hover:text-white">{t.nav.enterprise}</a></li>
              <li><a href="/private" className="text-gray-400 hover:text-white">{t.nav.private}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.footer.aboutUs}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">{t.footer.platformIntro}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t.footer.partners}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t.footer.contactUs}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.footer.contact}</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">email@example.com</li>
              <li className="text-gray-400">+86 123 4567 8910</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;