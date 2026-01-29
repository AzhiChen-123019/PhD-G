'use client';

import { useState, useEffect } from 'react';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentLanguages, setRecentLanguages] = useState<LanguageOption[]>([]);

  // 加载最近使用的语言
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const recentLangCodes = JSON.parse(localStorage.getItem('recentLanguages') || '[]');
      const recentLangObjects = recentLangCodes
        .map((code: string) => languages.find(lang => lang.code === code))
        .filter(Boolean) as LanguageOption[];
      setRecentLanguages(recentLangObjects);
    }
  }, []);

  // 保存最近使用的语言
  const saveRecentLanguage = (langCode: string) => {
    if (typeof window !== 'undefined') {
      const recentLangCodes = JSON.parse(localStorage.getItem('recentLanguages') || '[]');
      // 移除已存在的相同语言
      const updatedCodes = recentLangCodes.filter((code: string) => code !== langCode);
      // 添加到开头
      updatedCodes.unshift(langCode);
      // 只保留最近3种语言
      const limitedCodes = updatedCodes.slice(0, 3);
      localStorage.setItem('recentLanguages', JSON.stringify(limitedCodes));
      
      // 更新本地状态
      const recentLangObjects = limitedCodes
        .map((code: string) => languages.find(lang => lang.code === code))
        .filter(Boolean) as LanguageOption[];
      setRecentLanguages(recentLangObjects);
    }
  };

  const handleLanguageChange = (langCode: string) => {
    onLanguageChange(langCode);
    saveRecentLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className="relative inline-block">
      {/* 语言选择按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
      >
        <span>{currentLanguage.nativeName}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 语言下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          {/* 最近使用的语言 */}
          {recentLanguages.length > 0 && (
            <div className="px-2 py-1 border-b border-gray-100">
              <p className="px-3 py-1 text-xs text-gray-500">Recent</p>
              {recentLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${currentLang === lang.code ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                >
                  {lang.nativeName} ({lang.name})
                </button>
              ))}
            </div>
          )}

          {/* 所有语言 */}
          <div className="max-h-60 overflow-y-auto">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${currentLang === lang.code ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                {lang.nativeName} ({lang.name})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
export type { LanguageOption };
export { languages };