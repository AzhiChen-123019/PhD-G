'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Language, getTranslation } from '@/lib/i18n';

const PersonalLoginPage: React.FC = () => {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('zh');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = lang === 'zh' ? '请输入邮箱地址' : 'Please enter email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = lang === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address';
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = lang === 'zh' ? '请输入密码' : 'Please enter password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟用户数据
      const userData = {
        id: Date.now(),
        username: formData.email.split('@')[0],
        email: formData.email,
        internalEmail: `${formData.email.split('@')[0]}@phdmap.com`,
        phone: '+86 123 4567 8910',
        countryCode: '+86',
        identity: 'chinese',
        degreeVerified: true,
        membershipLevel: 'free',
        academicInfo: {
          degree: 'PhD',
          field: 'Computer Science',
          university: 'Peking University',
          graduationYear: '2023'
        }
      };

      // 保存用户信息到localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // 跳转到个人中心
      router.push('/account');
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={handleLanguageChange} 
      />

      {/* 主内容 */}
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {lang === 'zh' ? '个人用户登录' : 'Personal User Login'}
                </h1>
                <p className="text-gray-600">
                  {lang === 'zh' ? '登录您的账户，继续您的职业之旅' : 'Log in to your account, continue your professional journey'}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                      {lang === 'zh' ? '邮箱地址' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder={lang === 'zh' ? '请输入邮箱地址' : 'Please enter email address'}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                      {lang === 'zh' ? '密码' : 'Password'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder={lang === 'zh' ? '请输入密码' : 'Please enter password'}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        {lang === 'zh' ? '记住我' : 'Remember me'}
                      </label>
                    </div>

                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-primary hover:text-primary/80"
                      >
                        {lang === 'zh' ? '忘记密码？' : 'Forgot password?'}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting 
                      ? (lang === 'zh' ? '登录中...' : 'Logging in...') 
                      : (lang === 'zh' ? '登录' : 'Log in')
                    }
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-gray-600">
                    {lang === 'zh' ? '还没有账户？' : 'Don\'t have an account?'} 
                    <a 
                      href="/register/personal" 
                      className="text-primary hover:underline font-medium"
                    >
                      {lang === 'zh' ? '立即注册' : 'Register now'}
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <Footer lang={lang} />
    </div>
  );
};

export default PersonalLoginPage;