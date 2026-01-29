'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Language, getTranslation } from '@/lib/i18n';

const PersonalRegisterPage: React.FC = () => {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('zh');
  const [formData, setFormData] = useState({
    username: '',
    realName: '',
    email: '',
    password: '',
    confirmPassword: '',
    nationality: '',
    phone: '',
    countryCode: '+86',
    academicInfo: {
      highestDegree: '',
      graduationSchool: '',
      graduationDate: '',
      major: ''
    },
    degreeFile: null as File | null
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
    if (name.includes('.')) {
      // 处理学术信息字段
      const [parent, child] = name.split('.');
      if (parent === 'academicInfo') {
        setFormData(prev => ({
          ...prev,
          academicInfo: {
            ...prev.academicInfo,
            [child]: value
          }
        }));
      }
    } else {
      // 处理基本信息字段
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        degreeFile: file
      }));
      // 清除文件字段的错误
      if (errors.degreeFile) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.degreeFile;
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 验证用户名
    if (!formData.username.trim()) {
      newErrors.username = lang === 'zh' ? '请输入用户名' : 'Please enter username';
    }

    // 验证真实姓名
    if (!formData.realName.trim()) {
      newErrors.realName = lang === 'zh' ? '请输入真实姓名' : 'Please enter real name';
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

    // 验证国籍
    if (!formData.nationality.trim()) {
      newErrors.nationality = lang === 'zh' ? '请输入国籍' : 'Please enter nationality';
    }

    // 验证手机号
    if (!formData.phone.trim()) {
      newErrors.phone = lang === 'zh' ? '请输入手机号' : 'Please enter phone number';
    }

    // 验证学术信息
    const academicInfo = formData.academicInfo;
    if (!academicInfo.highestDegree.trim()) {
      newErrors.highestDegree = lang === 'zh' ? '请输入最高学历' : 'Please enter highest degree';
    }
    if (!academicInfo.graduationSchool.trim()) {
      newErrors.graduationSchool = lang === 'zh' ? '请输入毕业院校' : 'Please enter graduation school';
    }
    if (!academicInfo.graduationDate.trim()) {
      newErrors.graduationDate = lang === 'zh' ? '请输入毕业时间' : 'Please enter graduation date';
    }
    if (!academicInfo.major.trim()) {
      newErrors.major = lang === 'zh' ? '请输入学科专业' : 'Please enter major';
    }

    // 验证学历证明文件
    if (!formData.degreeFile) {
      newErrors.degreeFile = lang === 'zh' ? '请上传博士学历证明' : 'Please upload PhD degree certificate';
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

      // 检查学术信息完整性，判断学历验证状态
      const academicInfo = formData.academicInfo;
      const degreeVerified = !!(academicInfo.highestDegree && academicInfo.graduationSchool && academicInfo.graduationDate && academicInfo.major && formData.degreeFile);

      // 生成网站邮箱（如果学历验证通过）
      let internalEmail = '';
      if (degreeVerified) {
        // 模拟生成网站邮箱
        internalEmail = `${formData.username.toLowerCase().replace(/\s+/g, '')}@phdmap.com`;
      }

      // 保存用户信息到localStorage
      const userData = {
        id: Date.now(),
        username: formData.username,
        realName: formData.realName,
        email: formData.email,
        internalEmail: internalEmail,
        nationality: formData.nationality,
        phone: formData.phone,
        countryCode: formData.countryCode,
        identity: formData.countryCode === '+86' ? 'chinese' : 'foreign',
        degreeVerified: degreeVerified,
        membershipLevel: 'free',
        academicInfo: formData.academicInfo,
        files: formData.degreeFile ? [{ 
          _id: Date.now(), 
          fileName: formData.degreeFile.name, 
          fileType: 'degree', 
          fileSize: formData.degreeFile.size,
          uploadedAt: new Date().toISOString()
        }] : [],
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setSubmitSuccess(true);

      // 3秒后跳转到个人中心
      setTimeout(() => {
        router.push('/account');
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
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {lang === 'zh' ? '个人用户注册' : 'Personal User Registration'}
                </h1>
                <p className="text-gray-600">
                  {lang === 'zh' ? '创建您的个人账户，开始职业匹配之旅' : 'Create your personal account to start your career matching journey'}
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
                    {lang === 'zh' ? '您的账户已创建成功，正在跳转到个人中心...' : 'Your account has been created successfully, redirecting to personal center...'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* 基本信息 */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {lang === 'zh' ? '基本信息' : 'Basic Information'}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '用户名' : 'Username'}
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请输入用户名' : 'Please enter username'}
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="realName" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '真实姓名' : 'Real Name'}
                        </label>
                        <input
                          type="text"
                          id="realName"
                          name="realName"
                          value={formData.realName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.realName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请输入真实姓名' : 'Please enter real name'}
                        />
                        {errors.realName && (
                          <p className="text-red-500 text-sm mt-1">{errors.realName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '个人邮箱' : 'Personal Email'}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请输入个人邮箱' : 'Please enter personal email'}
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

                      <div>
                        <label htmlFor="nationality" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '国籍' : 'Nationality'}
                        </label>
                        <input
                          type="text"
                          id="nationality"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.nationality ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请输入国籍' : 'Please enter nationality'}
                        />
                        {errors.nationality && (
                          <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
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

                  {/* 学术信息 */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {lang === 'zh' ? '学术信息' : 'Academic Information'}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {lang === 'zh' ? '完善学术信息，完成学历验证后将生成网站专属邮箱' : 'Complete academic information, website-exclusive email will be generated after degree verification'}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="academicInfo.highestDegree" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '最高学历' : 'Highest Degree'}
                        </label>
                        <input
                          type="text"
                          id="academicInfo.highestDegree"
                          name="academicInfo.highestDegree"
                          value={formData.academicInfo.highestDegree}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.highestDegree ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请输入最高学历' : 'Please enter highest degree'}
                        />
                        {errors.highestDegree && (
                          <p className="text-red-500 text-sm mt-1">{errors.highestDegree}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="academicInfo.graduationSchool" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '毕业院校' : 'Graduation School'}
                        </label>
                        <input
                          type="text"
                          id="academicInfo.graduationSchool"
                          name="academicInfo.graduationSchool"
                          value={formData.academicInfo.graduationSchool}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.graduationSchool ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请输入毕业院校' : 'Please enter graduation school'}
                        />
                        {errors.graduationSchool && (
                          <p className="text-red-500 text-sm mt-1">{errors.graduationSchool}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="academicInfo.graduationDate" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '毕业时间' : 'Graduation Date'}
                        </label>
                        <input
                          type="date"
                          id="academicInfo.graduationDate"
                          name="academicInfo.graduationDate"
                          value={formData.academicInfo.graduationDate}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.graduationDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        />
                        {errors.graduationDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.graduationDate}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="academicInfo.major" className="block text-gray-700 text-sm font-medium mb-2">
                          {lang === 'zh' ? '学科专业' : 'Major'}
                        </label>
                        <input
                          type="text"
                          id="academicInfo.major"
                          name="academicInfo.major"
                          value={formData.academicInfo.major}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${errors.major ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder={lang === 'zh' ? '请输入学科专业' : 'Please enter major'}
                        />
                        {errors.major && (
                          <p className="text-red-500 text-sm mt-1">{errors.major}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 学历证明文件上传 */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {lang === 'zh' ? '学历证明' : 'Degree Certificate'}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {lang === 'zh' ? '请上传博士学历证明文件，用于学历验证' : 'Please upload PhD degree certificate for degree verification'}
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <input
                        type="file"
                        id="degreeFile"
                        name="degreeFile"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <label htmlFor="degreeFile" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          {formData.degreeFile ? (
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900 mb-1">{formData.degreeFile.name}</p>
                              <p className="text-xs text-gray-500">{Math.round(formData.degreeFile.size / 1024)} KB</p>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-gray-700 mb-1">{lang === 'zh' ? '点击或拖拽文件到此处上传' : 'Click or drag file here to upload'}</p>
                              <p className="text-xs text-gray-500">{lang === 'zh' ? '支持 PDF, JPG, JPEG, PNG 格式' : 'Supports PDF, JPG, JPEG, PNG'}</p>
                            </>
                          )}
                        </div>
                      </label>
                      {errors.degreeFile && (
                        <p className="text-red-500 text-sm mt-2">{errors.degreeFile}</p>
                      )}
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
                      {lang === 'zh' ? '已有账户？' : 'Already have an account?'} 
                      <a 
                        href="/login/personal" 
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

export default PersonalRegisterPage;