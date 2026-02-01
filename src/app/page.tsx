'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 多语言支持
const translations = {
  zh: {
    nav: {
      university: '大学科研岗位',
      enterprise: '企业高级岗位',
      resume: '我的简历中心',
      jobs: '我的私人岗位',
      login: '登录',
      register: '注册',
      lang: 'English',
      siteName: '博智匹配',
    },
    hero: {
      title: '博士岗位匹配平台',
      subtitle: '博士找岗，精准直达',
      description: '为海外博士提供精准的岗位匹配服务，连接全球顶尖人才与优质岗位',
      btn: '上传简历',
      browseJobs: '一键匹配岗位',
    },
    features: {
      title: '平台优势',
      items: [
        { title: '精准匹配', desc: '基于AI算法，根据您的背景和偏好智能推荐最合适的岗位' },
        { title: '全球机会', desc: '覆盖全球顶尖大学、科研机构和企业的高级岗位' },
        { title: '专属服务', desc: '为博士人才提供定制化的职业发展建议和支持' },
        { title: '安全可靠', desc: '严格保护您的个人信息和学术成果' },
      ],
    },
    jobs: {
      title: '热门岗位',
      viewDetails: '查看详情',
      viewMore: '查看更多岗位 →',
      academic: '学术',
      enterprise: '企业',
    },
  },
  en: {
    nav: {
      university: 'University Research Positions',
      enterprise: 'Enterprise Senior Positions',
      resume: 'My Resume Center',
      jobs: 'My Private Jobs',
      login: 'Login',
      register: 'Register',
      lang: '中文',
      siteName: 'PhDMap',
    },
    hero: {
      title: 'PhD Job Matching Platform',
      subtitle: 'Precise job matching for PhDs',
      description: 'Providing precise job matching services for overseas PhDs, connecting global top talents with quality positions',
      btn: 'Upload Resume',
      browseJobs: 'One-click Match Jobs',
    },
    features: {
      title: 'Platform Advantages',
      items: [
        { title: 'Precise Matching', desc: 'Based on AI algorithms, intelligently recommend the most suitable positions according to your background and preferences' },
        { title: 'Global Opportunities', desc: 'Covering senior positions in top universities, research institutions and enterprises worldwide' },
        { title: 'Exclusive Service', desc: 'Provide customized career development advice and support for PhD talents' },
        { title: 'Safe and Reliable', desc: 'Strictly protect your personal information and academic achievements' },
      ],
    },
    jobs: {
      title: 'Hot Positions',
      viewDetails: 'View Details',
      viewMore: 'View More Positions →',
      academic: 'Academic',
      enterprise: 'Enterprise',
    },
  },
};

// 岗位数据类型定义
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  tags?: {
    category: string;
    subType: string;
  };
}

export default function Home() {
  // 初始化状态为默认值，确保服务器端和客户端渲染一致
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 登录状态管理
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  
  // 岗位数据状态管理
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // 上传简历状态管理
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [saveType, setSaveType] = useState<'original' | 'optimized'>('original');
  const [saveTypeModalOpen, setSaveTypeModalOpen] = useState(false);
  
  // 在客户端渲染后，从localStorage获取语言设置，如果没有则检测浏览器语言
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      // 支持的语言列表
      const supportedLanguages = ['zh', 'en', 'ja', 'ko', 'es', 'fr', 'de', 'ru', 'ar', 'pt'];
      
      if (supportedLanguages.includes(savedLang || '')) {
        setLang(savedLang as 'zh' | 'en');
      } else {
        // 检测浏览器语言
        const browserLang = navigator.language.split('-')[0];
        // 如果浏览器语言是支持的语言，则使用该语言，否则默认使用英文
        if (supportedLanguages.includes(browserLang)) {
          setLang(browserLang as 'zh' | 'en');
        } else {
          setLang('en');
        }
      }
    }
  }, []);
  
  // 当语言变化时，保存到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  }, [lang]);
  
  // 模拟登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(user.username || 'User');
      }
    }
  }, []);
  
  // 从API获取岗位数据
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        // 限制只显示前4个岗位
        setJobs(data.slice(0, 4));
      } catch (error) {
        setJobsError(error instanceof Error ? error.message : 'An error occurred');
        console.error('Error fetching jobs:', error);
      } finally {
        setJobsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setIsLoggedIn(false);
    setUserName('');
  };
  
  // 文件上传处理函数
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadStatus('idle');
      setUploadProgress(0);
    }
  };
  
  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setUploadStatus('idle');
      setUploadProgress(0);
    }
  };
  
  // 显示保存选项 modal
  const handleShowSaveTypeModal = () => {
    if (!selectedFile) {
      alert(lang === 'zh' ? '请先选择文件' : 'Please select a file first');
      return;
    }
    setSaveTypeModalOpen(true);
  };
  
  // 执行文件上传
  const handleUploadWithSaveType = () => {
    if (!selectedFile) {
      alert(lang === 'zh' ? '请先选择文件' : 'Please select a file first');
      return;
    }
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    setSaveTypeModalOpen(false);
    
    // 模拟文件上传过程
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadStatus('success');
          
          // 标记用户已上传简历并保存上传记录
          if (typeof window !== 'undefined') {
            // 创建简历信息
            const resumeInfo = {
              id: Date.now(),
              fileName: selectedFile.name,
              uploadDate: new Date().toISOString().split('T')[0]
            };
            
            // 更新用户信息
            const storedUser = localStorage.getItem('user');
            let userData;
            
            if (storedUser) {
              userData = JSON.parse(storedUser);
              if (saveType === 'original') {
                // 原始简历限1份，直接替换
                userData.resume = resumeInfo;
              }
              userData.hasUploadedResume = true;
            } else {
              // 如果用户未登录，创建一个临时用户信息
              userData = {
                username: 'Guest',
                hasUploadedResume: true,
                resume: saveType === 'original' ? resumeInfo : null
              };
            }
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 创建上传记录并存储到localStorage
            const uploadRecord = {
              id: resumeInfo.id.toString(),
              fileName: resumeInfo.fileName,
              uploadTime: new Date().toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US'),
              filePath: `/uploads/${resumeInfo.fileName}`,
              type: saveType
            };
            
            const uploadRecords = JSON.parse(localStorage.getItem('uploadRecords') || '[]');
            
            if (saveType === 'original') {
              // 原始简历限1份，替换已有原始简历
              const existingOriginalIndex = uploadRecords.findIndex((record: any) => record.type === 'original');
              if (existingOriginalIndex > -1) {
                uploadRecords[existingOriginalIndex] = uploadRecord;
              } else {
                uploadRecords.push(uploadRecord);
              }
            } else {
              // 优化简历可多份，直接添加
              uploadRecords.push(uploadRecord);
            }
            
            localStorage.setItem('uploadRecords', JSON.stringify(uploadRecords));
          }
          
          // 模拟上传成功后跳转到简历分析页面
          setTimeout(() => {
            window.location.href = '/resume-analysis';
          }, 1000);
        }, 500);
      }
    }, 100);
  };
  
  // 轮播图数据
  const slides = [
    {
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20research%20laboratory%20interior%2C%20futuristic%20design%2C%20blue%20lighting%2C%20high-tech%20equipment%2C%20clean%20professional%20atmosphere%2C%20no%20text%2C%20no%20logos%2C%20wide%20angle%20view&image_size=landscape_16_9",
      title: lang === 'zh' ? "连接全球顶尖科研人才" : "Connecting Global Top Research Talents",
      subtitle: lang === 'zh' ? "博士岗位，精准匹配" : "Precise PhD Job Matching"
    },
    {
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Futuristic%20university%20campus%20exterior%2C%20modern%20architectural%20design%2C%20green%20spaces%2C%20academic%20atmosphere%2C%20no%20text%2C%20no%20logos%2C%20wide%20angle%20view&image_size=landscape_16_9",
      title: lang === 'zh' ? "开启学术生涯新篇章" : "Start a New Chapter in Academic Career",
      subtitle: lang === 'zh' ? "为博士人才提供优质岗位" : "Providing Quality Positions for PhD Talents"
    },
    {
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=High-tech%20corporate%20office%20space%2C%20modern%20minimalist%20design%2C%20data%20visualization%20screens%2C%20innovation%20atmosphere%2C%20no%20text%2C%20no%20logos%2C%20wide%20angle%20view&image_size=landscape_16_9",
      title: lang === 'zh' ? "融入企业创新生态" : "Integrate into Corporate Innovation Ecosystem",
      subtitle: lang === 'zh' ? "发挥博士专业优势" : "Leverage PhD Professional Advantages"
    }
  ];
  
  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
      />

      {/* 英雄区域 - 轮播图 */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden mt-4">
        {/* 轮播图 */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* 轮播内容 */}
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{slides[currentSlide].title}</h1>
          <p className="text-xl md:text-2xl mb-8">{slides[currentSlide].subtitle}</p>
          <p className="max-w-2xl mx-auto mb-10 text-gray-100">{t.hero.description}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={(e) => {
                e.preventDefault();
                // 滚动到上传简历区域
                const uploadSection = document.getElementById('upload-resume');
                if (uploadSection) {
                  uploadSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-3 bg-white text-primary rounded-md hover:bg-gray-100 transition-colors"
            >
              {t.hero.btn}
            </button>
            <a href="/private" className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-primary transition-colors">
              {t.hero.browseJobs}
            </a>
          </div>
        </div>
        
        {/* 轮播指示器 */}
        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-10' : 'bg-white bg-opacity-50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 平台优势 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 热门岗位 */}
      <section id="jobs" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.jobs.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobsLoading ? (
              // 加载状态
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 flex flex-col h-full">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    </div>
                    <div className="mt-auto">
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : jobsError ? (
              // 错误状态
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">{t.jobs.title} {lang === 'zh' ? '加载失败' : 'loading failed'}: {jobsError}</p>
              </div>
            ) : jobs.length === 0 ? (
              // 无数据状态
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">{lang === 'zh' ? '暂无岗位数据' : 'No job data available'}</p>
              </div>
            ) : (
              // 正常状态
              jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 flex flex-col h-full">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          job.tags?.category === 'university' || job.type === 'university' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {(job.tags?.category === 'university' || job.type === 'university') 
                            ? t.jobs.academic 
                            : t.jobs.enterprise}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{job.company}</p>
                      <div className="flex items-center text-gray-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-500 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.salary}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button onClick={(e) => {
                        e.preventDefault();
                        console.log('View details clicked for job:', job.id);
                        // 跳转到岗位详情页
                        window.location.href = `/job/${job.id}`;
                      }} className="inline-block w-full py-2 px-4 bg-primary text-white rounded-md text-center hover:bg-primary/90 transition-colors">
                        {t.jobs.viewDetails}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-10">
            <button onClick={(e) => {
              e.preventDefault();
              console.log('View more jobs clicked');
              // 这里可以添加查看更多岗位的逻辑
            }} className="text-primary hover:underline font-medium">
              {t.jobs.viewMore}
            </button>
          </div>
        </div>
      </section>

      {/* 上传简历区域 */}
      <section id="upload-resume" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{lang === 'zh' ? '上传简历' : 'Upload Resume'}</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-4">
                  {lang === 'zh' ? '上传您的简历，我们将为您匹配最合适的岗位' : 'Upload your resume and we will match you with the most suitable positions'}
                </p>
              </div>
              <div 
                className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${dragActive ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="hidden"
                  id="resumeFile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <label htmlFor="resumeFile" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {lang === 'zh' ? '点击或拖拽文件到此处上传' : 'Click or drag file here to upload'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {lang === 'zh' ? '支持 PDF, DOC, DOCX 格式，最大 10MB' : 'Supports PDF, DOC, DOCX, up to 10MB'}
                    </p>
                  </div>
                </label>
                
                {/* 选中文件显示 */}
                {selectedFile && uploadStatus === 'idle' && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-md text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{Math.round(selectedFile.size / 1024 / 1024 * 100) / 100} MB</p>
                      </div>
                      <button 
                        onClick={() => setSelectedFile(null)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* 上传进度条 */}
                {uploadStatus === 'uploading' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{lang === 'zh' ? '上传中...' : 'Uploading...'}</span>
                      <span className="text-sm text-gray-700">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* 上传成功 */}
                {uploadStatus === 'success' && (
                  <div className="mt-4 p-3 bg-green-100 rounded-md text-center">
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-green-800">{lang === 'zh' ? '上传成功！' : 'Upload successful!'}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">{lang === 'zh' ? '正在跳转到职位匹配页面...' : 'Redirecting to job matching page...'}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 text-center">
                <button 
                  onClick={handleShowSaveTypeModal}
                  disabled={!selectedFile || uploadStatus === 'uploading'}
                  className={`inline-block px-6 py-3 rounded-md transition-colors ${(!selectedFile || uploadStatus === 'uploading') ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}
                >
                  {uploadStatus === 'uploading' ? (lang === 'zh' ? '上传中...' : 'Uploading...') : (lang === 'zh' ? '上传并分析简历' : 'Upload and Analyze Resume')}
                </button>
              </div>
              
              {/* 保存类型选择模态框 */}
              {saveTypeModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-8 max-w-md w-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      {lang === 'zh' ? '选择保存类型' : 'Select Save Type'}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors" onClick={() => setSaveType('original')}>
                        <input 
                          type="radio" 
                          id="original" 
                          name="saveType" 
                          checked={saveType === 'original'} 
                          onChange={() => setSaveType('original')} 
                          className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                        />
                        <label htmlFor="original" className="ml-3 text-lg font-medium text-gray-900 cursor-pointer">
                          {lang === 'zh' ? '原始简历' : 'Original Resume'}
                        </label>
                        <p className="ml-4 text-sm text-gray-500 flex-1">
                          {lang === 'zh' ? '(只能保存1份，将替换现有原始简历)' : '(Only 1 copy allowed, will replace existing original resume)'}
                        </p>
                      </div>
                      <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors" onClick={() => setSaveType('optimized')}>
                        <input 
                          type="radio" 
                          id="optimized" 
                          name="saveType" 
                          checked={saveType === 'optimized'} 
                          onChange={() => setSaveType('optimized')} 
                          className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                        />
                        <label htmlFor="optimized" className="ml-3 text-lg font-medium text-gray-900 cursor-pointer">
                          {lang === 'zh' ? '优化简历' : 'Optimized Resume'}
                        </label>
                        <p className="ml-4 text-sm text-gray-500 flex-1">
                          {lang === 'zh' ? '(可以保存多份，用于不同岗位申请)' : '(Multiple copies allowed, for different job applications)'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-center space-x-4">
                      <button 
                        onClick={() => setSaveTypeModalOpen(false)} 
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {lang === 'zh' ? '取消' : 'Cancel'}
                      </button>
                      <button 
                        onClick={handleUploadWithSaveType} 
                        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      >
                        {lang === 'zh' ? '确定' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* 共享页脚 */}
      <Footer lang={lang} />
    </div>
  );
}
