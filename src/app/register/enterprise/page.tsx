'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Language, getTranslation } from '@/lib/i18n';

const EnterpriseRegisterPage: React.FC = () => {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('zh');
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+86',
    companyType: '',
    industry: '',
    scale: '',
    address: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    // 验证公司名称
    if (!formData.companyName.trim()) {
      newErrors.companyName = lang === 'zh' ? '请输入公司名称' : 'Please enter company name';
    }

    // 验证联系人
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = lang === 'zh' ? '请输入联系人姓名' : 'Please enter contact person name';
    }

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = lang === 'zh' ? '请输入邮箱地址' : 'Please enter email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = lang === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address';
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = lang === 'zh' ? '请输入密码' : 'Please enter password';
    } else if (formData.password.length < 6) {
      newErrors.password = lang === 'zh' ? '密码长度至少为6位' : 'Password must be at least 6 characters';
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = lang === 'zh' ? '请确认密码' : 'Please confirm password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = lang === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match';
    }

    // 验证手机号
    if (!formData.phone.trim()) {
      newErrors.phone = lang === 'zh' ? '请输入手机号' : 'Please enter phone number';
    }

    // 验证公司类型
    if (!formData.companyType.trim()) {
      newErrors.companyType = lang === 'zh' ? '请选择公司类型' : 'Please select company type';
    }

    // 验证行业
    if (!formData.industry.trim()) {
      newErrors.industry = lang === 'zh' ? '请选择行业' : 'Please select industry';
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
      // 模拟注册请求
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 生成企业用户信息
      const enterpriseUser = {
        id: Date.now(),
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
        companyType: formData.companyType,
        industry: formData.industry,
        scale: formData.scale,
        address: formData.address,
        isEnterprise: true,
        role: 'admin', // 企业主管理员
        subAdmins: [],
        createdAt: new Date().toISOString()
      };

      // 保存企业用户信息到localStorage
      localStorage.setItem('user', JSON.stringify(enterpriseUser));
      setSubmitSuccess(true);

      // 3秒后跳转到企业管理后台
      setTimeout(() => {
        router.push('/enterprise/dashboard');
      }, 3000);
    } catch (error) {
      console.error('注册失败:', error);
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {lang === 'zh' ? '企业/机构注册' : 'Enterprise/Institution Registration'}
                </h1>
                <p className="text-gray-600">
                  {lang === 'zh' ? '创建企业账户，发布招聘信息，寻找顶尖博士人才' : 'Create enterprise account, post job listings, find top PhD talents'}
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {lang === 'zh' ? '注册成功！' : 'Registration Successful!'}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {lang === 'zh' ? '您的企业账户已创建成功，正在跳转到企业管理后台...' : 'Your enterprise account has been created successfully, redirecting to enterprise dashboard...'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* 公司基本信息 */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {lang === 'zh' ? '公司基本信息' : 'Company Basic Information'}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="companyName" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '公司名称' : 'Company Name'}
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请输入公司名称' : 'Please enter company name'}
                        />
                        {errors.companyName && (
                          <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="contactPerson" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '联系人姓名' : 'Contact Person'}
                        </label>
                        <input
                          type="text"
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请输入联系人姓名' : 'Please enter contact person name'}
                        />
                        {errors.contactPerson && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="countryCode" className="block text-gray-700 text-sm font-medium mb-2">
                            {lang === 'zh' ? '国家区号' : 'Country Code'}
                          </label>
                          <select
                            id="countryCode"
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="+86">+86 (中国)</option>
                            <option value="+1">+1 (美国)</option>
                            <option value="+44">+44 (英国)</option>
                            <option value="+61">+61 (澳大利亚)</option>
                            <option value="+81">+81 (日本)</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                            {lang === 'zh' ? '手机号' : 'Phone Number'}
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                            placeholder={lang === 'zh' ? '请输入手机号' : 'Please enter phone number'}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 账户信息 */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {lang === 'zh' ? '账户信息' : 'Account Information'}
                    </h2>
                    <div className="space-y-4">
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

                      <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '确认密码' : 'Confirm Password'}
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请确认密码' : 'Please confirm password'}
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 公司详细信息 */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {lang === 'zh' ? '公司详细信息' : 'Company Detailed Information'}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="companyType" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '公司类型' : 'Company Type'}
                        </label>
                        <select
                          id="companyType"
                          name="companyType"
                          value={formData.companyType}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.companyType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        >
                          <option value="">{lang === 'zh' ? '请选择公司类型' : 'Please select company type'}</option>
                          <option value="enterprise">{lang === 'zh' ? '企业' : 'Enterprise'}</option>
                          <option value="university">{lang === 'zh' ? '高校' : 'University'}</option>
                          <option value="research">{lang === 'zh' ? '科研机构' : 'Research Institution'}</option>
                          <option value="other">{lang === 'zh' ? '其他' : 'Other'}</option>
                        </select>
                        {errors.companyType && (
                          <p className="text-red-500 text-sm mt-1">{errors.companyType}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="industry" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '行业' : 'Industry'}
                        </label>
                        <select
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.industry ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        >
                          <option value="">{lang === 'zh' ? '请选择行业' : 'Please select industry'}</option>
                          <option value="it">{lang === 'zh' ? '信息技术' : 'Information Technology'}</option>
                          <option value="education">{lang === 'zh' ? '教育' : 'Education'}</option>
                          <option value="healthcare">{lang === 'zh' ? '医疗健康' : 'Healthcare'}</option>
                          <option value="finance">{lang === 'zh' ? '金融' : 'Finance'}</option>
                          <option value="manufacturing">{lang === 'zh' ? '制造业' : 'Manufacturing'}</option>
                          <option value="other">{lang === 'zh' ? '其他' : 'Other'}</option>
                        </select>
                        {errors.industry && (
                          <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="scale" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '公司规模' : 'Company Scale'}
                        </label>
                        <select
                          id="scale"
                          name="scale"
                          value={formData.scale}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">{lang === 'zh' ? '请选择公司规模' : 'Please select company scale'}</option>
                          <option value="1-50">{lang === 'zh' ? '1-50人' : '1-50 employees'}</option>
                          <option value="51-200">{lang === 'zh' ? '51-200人' : '51-200 employees'}</option>
                          <option value="201-500">{lang === 'zh' ? '201-500人' : '201-500 employees'}</option>
                          <option value="501-1000">{lang === 'zh' ? '501-1000人' : '501-1000 employees'}</option>
                          <option value="1000+">{lang === 'zh' ? '1000人以上' : '1000+ employees'}</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '公司地址' : 'Company Address'}
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder={lang === 'zh' ? '请输入公司地址' : 'Please enter company address'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 提交按钮 */}
                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isSubmitting 
                        ? (lang === 'zh' ? '注册中...' : 'Registering...') 
                        : (lang === 'zh' ? '注册' : 'Register')
                      }
                    </button>
                  </div>

                  {/* 登录链接 */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      {lang === 'zh' ? '已有企业账户？' : 'Already have an enterprise account?'} 
                      <a 
                        href="/login/enterprise" 
                        className="text-primary hover:underline font-medium"
                      >
                        {lang === 'zh' ? '立即登录' : 'Log in now'}
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <Footer lang={lang} />
    </div>
  );
};

export default EnterpriseRegisterPage;