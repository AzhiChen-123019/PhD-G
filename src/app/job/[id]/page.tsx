'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LanguageSelector from '../../../components/LanguageSelector';
import { FavoriteButton } from '../../../components/JobUIComponents';
import { JobStorageManager } from '../../../lib/job-storage';
import { Job } from '../../../lib/job-model';

// 多语言支持
const translations = {
  zh: {
    nav: {
      home: '首页',
      university: '大学科研岗位',
      enterprise: '企业高级岗位',
      jobs: '我的私人岗位',
      login: '登录',
      register: '注册',
      lang: 'English',
      siteName: '博智匹配',
    },
    jobDetail: {
      title: '岗位详情',
      applyNow: '立即申请',
      shareJob: '分享岗位',
      jobInfo: '岗位信息',
      companyInfo: '公司信息',
      jobDescription: '岗位描述',
      requirements: '任职要求',
      responsibilities: '工作职责',
      skills: '技能要求',
      education: '学历要求',
      experience: '经验要求',
      location: '工作地点',
      salary: '薪资待遇',
      type: '岗位类型',
      deadline: '截止日期',
      relatedJobs: '相关岗位',
      backToPrevious: '返回上一页',
    },
    footer: {
      copyright: '© 2026 博士岗位匹配平台. 保留所有权利.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      university: 'University Research Positions',
      enterprise: 'Enterprise Senior Positions',
      jobs: 'My Private Jobs',
      login: 'Login',
      register: 'Register',
      lang: '中文',
      siteName: 'PhDMap',
    },
    jobDetail: {
      title: 'Job Details',
      applyNow: 'Apply Now',
      shareJob: 'Share Job',
      jobInfo: 'Job Information',
      companyInfo: 'Company Information',
      jobDescription: 'Job Description',
      requirements: 'Requirements',
      responsibilities: 'Responsibilities',
      skills: 'Skills',
      education: 'Education',
      experience: 'Experience',
      location: 'Location',
      salary: 'Salary',
      type: 'Job Type',
      deadline: 'Deadline',
      relatedJobs: 'Related Jobs',
      backToPrevious: 'Back to Previous Page',
    },
    footer: {
      copyright: '© 2026 PhD Job Matching Platform. All rights reserved.',
    },
  },
};

// 相关岗位数据类型定义
interface RelatedJob {
  id: string;
  title: string;
  company?: string;
  institution?: string;
  location: string;
  salary: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  // 初始化状态为默认值，确保服务器端和客户端渲染一致
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userIdentity, setUserIdentity] = useState<'chinese' | 'foreign' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});
  const [relatedJobs, setRelatedJobs] = useState<RelatedJob[]>([]);
  const [relatedJobsLoading, setRelatedJobsLoading] = useState(true);
  
  // 收藏相关状态
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('user123');

  // 在客户端渲染后，从localStorage获取语言设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      if (savedLang === 'zh' || savedLang === 'en') {
        setLang(savedLang);
      }
    }
  }, []);

  // 模拟登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(user.username || 'User');
        setUserIdentity(user.identity === 'chinese' ? 'chinese' : 'foreign');
        setCurrentUserId(user.id || 'user123');
      }
    }
  }, []);
  
  // 检查岗位是否已被收藏
  useEffect(() => {
    if (isLoggedIn && jobId) {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id || 'user123';
      setCurrentUserId(userId);
      const isFavorited = JobStorageManager.isJobFavorited(userId, jobId);
      setIsFavorite(isFavorited);
    }
  }, [isLoggedIn, jobId]);

  // 当语言变化时，保存到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  }, [lang]);

  // 获取岗位详情
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setIsLoading(true);
        // 从API获取岗位详情
        const response = await fetch(`/api/jobs?id=${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const jobData = await response.json();
        // 由于API返回的是数组，我们需要找到匹配的岗位
        const matchedJob = Array.isArray(jobData) ? jobData.find((j: any) => j.id === jobId) : jobData;
        setJob(matchedJob);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchRelatedJobs = async () => {
      try {
        setRelatedJobsLoading(true);
        // 从API获取所有岗位，然后过滤出相关岗位
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch related jobs');
        }
        const allJobs = await response.json();
        // 过滤出与当前岗位类型相同但ID不同的岗位，作为相关岗位
        const filteredJobs = Array.isArray(allJobs) ? allJobs
          .filter((j: any) => j.id !== jobId && j.type === job?.type)
          .slice(0, 3) : [];
        setRelatedJobs(filteredJobs);
      } catch (error) {
        console.error('Error fetching related jobs:', error);
        setRelatedJobs([]);
      } finally {
        setRelatedJobsLoading(false);
      }
    };
    
    fetchJobDetail();
    fetchRelatedJobs();
  }, [jobId, lang, job?.type]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };

  // 模拟获取岗位附件要求
  const getAttachmentRequirements = (jobType: string) => {
    // 所有可能的附件类型定义
    const allAttachmentTypes = {
      resume: {
        id: 'resume',
        name: lang === 'zh' ? '个人简历' : 'Resume',
        description: lang === 'zh' ? '详细的个人简历，包含教育背景、工作经历、科研成果等' : 'Detailed resume including education background, work experience, research achievements, etc.',
        required: true,
        allowedTypes: ['.pdf', '.doc', '.docx'],
        maxSize: 10 * 1024 * 1024, // 10MB
      },
      'degree-certificate': {
        id: 'degree-certificate',
        name: lang === 'zh' ? '学位证书' : 'Degree Certificate',
        description: lang === 'zh' ? '海外博士学位证书及认证文件' : 'Overseas PhD degree certificate and authentication documents',
        required: true,
        allowedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSize: 15 * 1024 * 1024, // 15MB
      },
      'research-plan': {
        id: 'research-plan',
        name: lang === 'zh' ? '研究计划' : 'Research Plan',
        description: lang === 'zh' ? '针对申请岗位的研究计划' : 'Research plan for the applied position',
        required: true,
        allowedTypes: ['.pdf', '.doc', '.docx'],
        maxSize: 10 * 1024 * 1024, // 10MB
      },
      'publications': {
        id: 'publications',
        name: lang === 'zh' ? '发表论文' : 'Publications',
        description: lang === 'zh' ? '代表性学术论文列表及全文' : 'List of representative academic papers and full texts',
        required: true,
        allowedTypes: ['.pdf', '.doc', '.docx', '.txt'],
        maxSize: 20 * 1024 * 1024, // 20MB
      },
      'reference-letters': {
        id: 'reference-letters',
        name: lang === 'zh' ? '推荐信' : 'Reference Letters',
        description: lang === 'zh' ? '2-3封学术或工作推荐信' : '2-3 academic or work reference letters',
        required: true,
        allowedTypes: ['.pdf', '.doc', '.docx'],
        maxSize: 10 * 1024 * 1024, // 10MB
      },
      'work-permit': {
        id: 'work-permit',
        name: lang === 'zh' ? '工作许可' : 'Work Permit',
        description: lang === 'zh' ? '海外人才工作许可相关材料' : 'Overseas talent work permit related materials',
        required: true,
        allowedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSize: 15 * 1024 * 1024, // 15MB
      }
    };

    // 根据用户身份和岗位配置返回材料要求
    if (userIdentity === 'chinese' && job?.attachmentRequirements?.chinese) {
      // 华人博士：根据岗位配置返回材料要求
      return job.attachmentRequirements.chinese.map((attachmentId: keyof typeof allAttachmentTypes) => allAttachmentTypes[attachmentId]); 
    } else if (userIdentity === 'foreign' && job?.attachmentRequirements?.foreign) {
      // 外籍博士：根据岗位配置返回材料要求
      return job.attachmentRequirements.foreign.map((attachmentId: keyof typeof allAttachmentTypes) => allAttachmentTypes[attachmentId]); 
    } else {
      // 默认要求（未登录或身份未知）
      return [allAttachmentTypes.resume];
    }
  };

  // 处理文件选择
  const handleFileSelect = (attachmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(prev => ({
        ...prev,
        [attachmentId]: e.target.files ? Array.from(e.target.files) : [],
      }));
      setUploadStatus(prev => ({
        ...prev,
        [attachmentId]: 'idle',
      }));
      setUploadProgress(prev => ({
        ...prev,
        [attachmentId]: 0,
      }));
    }
  };

  // 处理文件上传
  const handleFileUpload = (attachmentId: string) => {
    const files = uploadedFiles[attachmentId];
    if (!files || files.length === 0) return;

    setUploadStatus(prev => ({
      ...prev,
      [attachmentId]: 'uploading',
    }));
    setUploadProgress(prev => ({
      ...prev,
      [attachmentId]: 0,
    }));

    // 模拟文件上传过程
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(prev => ({
        ...prev,
        [attachmentId]: progress,
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadStatus(prev => ({
            ...prev,
            [attachmentId]: 'success',
          }));
        }, 500);
      }
    }, 100);
  };

  // 移除上传的文件
  const removeFile = (attachmentId: string, index: number) => {
    setUploadedFiles(prev => {
      const files = [...(prev[attachmentId] || [])];
      files.splice(index, 1);
      return {
        ...prev,
        [attachmentId]: files,
      };
    });
    if ((uploadedFiles[attachmentId]?.length || 0) === 1) {
      setUploadStatus(prev => ({
        ...prev,
        [attachmentId]: 'idle',
      }));
      setUploadProgress(prev => ({
        ...prev,
        [attachmentId]: 0,
      }));
    }
  };

  // 提交申请
  const handleSubmitApplication = () => {
    // 检查必传附件是否已上传
    const attachmentRequirements = getAttachmentRequirements(job?.type || 'enterprise');
    const requiredAttachments = attachmentRequirements.filter((attach: any) => attach.required);
    const missingRequired = requiredAttachments.some((attach: any) => {
      const files = uploadedFiles[attach.id];
      return !files || files.length === 0;
    });

    if (missingRequired) {
      alert(lang === 'zh' ? '请上传所有必选附件' : 'Please upload all required attachments');
      return;
    }

    // 检查上传状态
    const uploadingAttachments = Object.values(uploadStatus).some(status => status === 'uploading');
    if (uploadingAttachments) {
      alert(lang === 'zh' ? '有文件正在上传，请等待上传完成' : 'Some files are being uploaded, please wait for upload to complete');
      return;
    }

    // 创建申请记录
    if (job && isLoggedIn) {
      const application = {
        id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUserId,
        jobId: job.id,
        job: job,
        resumeId: `resume-${Date.now()}`, // 添加resumeId属性
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending' as const,
        files: Object.entries(uploadedFiles).map(([type, files]) => ({
          type,
          fileName: files[0]?.name || '',
          fileSize: files[0]?.size || 0,
          uploadedAt: new Date().toISOString()
        }))
      };

      // 保存申请记录到本地存储
      JobStorageManager.addJobApplication(currentUserId, application);

      // 模拟提交申请
      alert(lang === 'zh' ? `申请已提交，岗位：${job?.title || ''}` : `Application submitted for job: ${job?.title || ''}`);
      setShowApplyModal(false);
      // 重置上传状态
      setUploadedFiles({});
      setUploadProgress({});
      setUploadStatus({});
    }
  };
  
  // 切换收藏状态
  const handleToggleFavorite = (job: Job) => {
    if (!isLoggedIn) {
      alert(lang === 'zh' ? '请先登录再收藏岗位' : 'Please login first to favorite the job');
      router.push('/login');
      return;
    }
    
    setIsFavoriting(true);
    
    try {
      if (isFavorite) {
        // 取消收藏
        JobStorageManager.removeJobFavorite(currentUserId, job.id);
        setIsFavorite(false);
      } else {
        // 添加收藏
        const favoriteJob: any = {
          id: `favorite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: currentUserId,
          jobId: job.id,
          job: job,
          createdAt: new Date().toISOString()
        };
        JobStorageManager.addJobFavorite(currentUserId, favoriteJob);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert(lang === 'zh' ? '操作失败，请重试' : 'Operation failed, please try again');
    } finally {
      setIsFavoriting(false);
    }
  };

  const t = translations[lang];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">{lang === 'zh' ? '加载中...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{lang === 'zh' ? '岗位不存在' : 'Job Not Found'}</h2>
            <p className="text-gray-600 mb-8">{lang === 'zh' ? '您访问的岗位不存在或已被删除' : 'The job you are looking for does not exist or has been deleted'}</p>
            <button 
              onClick={() => router.back()}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {t.jobDetail.backToPrevious}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-gradient-to-r from-white to-gray-50 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0 flex items-center">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Unique%20tech%20logo%20for%20PhD%20job%20platform%2C%20futuristic%20design%20with%20hexagon%20and%20upward%20arrow%2C%20purple%20and%20blue%20gradient%2C%20minimalist%20style%2C%20not%20similar%20to%20Baidu%20Netdisk%20logo%2C%20clean%20white%20background%2C%20professional%20and%20distinctive&image_size=square_hd" alt={t.nav.siteName} className="h-10 w-10 mr-2" />
                <span className="text-xl font-bold text-primary">{t.nav.siteName}</span>
              </a>
            </div>
            
            {/* 桌面端导航 - 居中对齐 */}
            <div className="hidden md:flex items-center flex-grow justify-center space-x-12">
              <a href="/" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
                {t.nav.home}
              </a>
              <a href="/university" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
                {t.nav.university}
              </a>
              <a href="/enterprise" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
                {t.nav.enterprise}
              </a>
              <a href="/private" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium text-center">
                {lang === 'zh' ? '我的私人岗位' : 'My Private Positions'}
              </a>
            </div>
            
            {/* 右侧区域：语言切换 + 登录注册/用户信息 */}
            <div className="hidden md:flex items-center space-x-4">
              {/* 语言切换 */}
              <LanguageSelector 
                currentLang={lang} 
                onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
              />
              
              {/* 登录注册按钮或用户信息 */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      {lang === 'zh' ? '欢迎，' : 'Welcome, '}{userName}
                    </span>
                    <a href="/account" className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </a>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {lang === 'zh' ? '退出登录' : 'Logout'}
                  </button>
                </div>
              ) : (
                <>
                  <a href="/login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                    {t.nav.login}
                  </a>
                  <a href="/register" className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    {t.nav.register}
                  </a>
                </>
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

      {/* 导航栏移动端菜单 */}
      <nav className="md:hidden bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* 移动端菜单按钮 */}
            <div>
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
          
          {/* 移动端导航菜单 */}
          {mobileMenuOpen && (
            <div>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                  {t.nav.home}
                </a>
                <a href="/university" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                  {t.nav.university}
                </a>
                <a href="/enterprise" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                  {t.nav.enterprise}
                </a>
                <a href="/private" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                  {lang === 'zh' ? '我的私人岗位' : 'My Private Positions'}
                </a>
                <div className="flex space-x-2 px-3 py-2">
                  <button 
                    onClick={() => setLang('zh')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${lang === 'zh' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    中文
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    English
                  </button>
                </div>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                {isLoggedIn ? (
                  <div className="px-5 space-y-2">
                    <div className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      {lang === 'zh' ? '欢迎，' : 'Welcome, '}{userName}
                    </div>
                    <a href="/account" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                      {lang === 'zh' ? '个人中心' : 'Account'}
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                    >
                      {lang === 'zh' ? '退出登录' : 'Logout'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center px-5">
                    <a href="/login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                      {t.nav.login}
                    </a>
                    <a href="/register" className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors ml-3">
                      {t.nav.register}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 页面内容 */}
      <div className="container mx-auto px-4 py-16">
        {/* 面包屑导航 */}
        <div className="mb-8 mt-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-primary">{t.nav.home}</a>
            <span>/</span>
            <a href={job.type === 'university' ? '/university' : '/enterprise'} className="hover:text-primary">
              {job.type === 'university' ? t.nav.university : t.nav.enterprise}
            </a>
            <span>/</span>
            <span className="text-gray-700">{job.title}</span>
          </div>
        </div>

        {/* 岗位详情卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          {/* 岗位标题和基本信息 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.title}</h1>
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">{job.location}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">{job.salary}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">{lang === 'zh' ? '截止日期：' : 'Deadline: '}{job.deadline}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => {
                  console.log('Apply now clicked');
                  // 申请岗位的逻辑
                  if (isLoggedIn && job) {
                    // 已登录用户显示申请表单模态框
                    setShowApplyModal(true);
                  } else if (!isLoggedIn) {
                    // 未登录用户跳转到登录页
                    alert(lang === 'zh' ? '请先登录再申请岗位' : 'Please login first to apply for the job');
                    router.push('/login');
                  }
                }}
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center min-w-[120px]"
              >
                {t.jobDetail.applyNow}
              </button>
              
              {/* 智能优化简历按钮 */}
              {job && (
                <button
                  onClick={() => window.location.href = `/ai-tools/optimize-resume?jobId=${job.id}`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[120px]"
                >
                  {lang === 'zh' ? '智能优化简历' : 'AI Resume Optimization'}
                </button>
              )}
              
              {job && (
                <FavoriteButton
                  job={job as Job}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
              <button 
                onClick={() => {
                  console.log('Share job clicked');
                  // 分享岗位的逻辑
                  if (typeof window !== 'undefined' && navigator.share && job) {
                    // 使用Web Share API
                    navigator.share({
                      title: job.title,
                      text: job.description.substring(0, 100) + '...',
                      url: window.location.href
                    })
                    .then(() => console.log('Job shared successfully'))
                    .catch((error) => console.error('Error sharing job:', error));
                  } else if (typeof window !== 'undefined') {
                    // 复制链接到剪贴板
                    navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                      alert(lang === 'zh' ? '岗位链接已复制到剪贴板' : 'Job link copied to clipboard');
                    })
                    .catch((error) => {
                      console.error('Error copying job link:', error);
                      alert(lang === 'zh' ? '复制链接失败，请手动复制' : 'Failed to copy link, please copy manually');
                    });
                  }
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center min-w-[120px]"
              >
                {t.jobDetail.shareJob}
              </button>
            </div>
          </div>

          {/* 岗位描述 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.jobDetail.jobDescription}</h2>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </div>

          {/* 工作职责 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.jobDetail.responsibilities}</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {(job.responsibilities || []).map((responsibility: string, index: number) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </div>

          {/* 任职要求 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.jobDetail.requirements}</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {(job.requirements || []).map((requirement: string, index: number) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>

          {/* 技能要求 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.jobDetail.skills}</h2>
            <div className="flex flex-wrap gap-2">
              {(job.skills || []).map((skill: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 公司/机构信息 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.jobDetail.companyInfo}</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {lang === 'zh' ? '企业/大学名称已隐藏' : 'Company/University name hidden'}
              </h3>
              <p className="text-gray-600 mb-4">
                {job.type === 'university' 
                  ? lang === 'zh' ? '知名高等学府，致力于培养高层次人才和开展前沿科学研究' : 'Well-known institution of higher education, dedicated to cultivating high-level talents and conducting cutting-edge scientific research'
                  : lang === 'zh' ? '行业领先企业，专注于技术创新和产品研发' : 'Industry-leading enterprise, focusing on technological innovation and product development'
                }
              </p>
              <div className="flex items-center">
                <a href="#" className="text-primary hover:underline">
                  {lang === 'zh' ? '了解更多' : 'Learn More'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 相关岗位推荐 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{t.jobDetail.relatedJobs}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedJobsLoading ? (
              // 加载状态
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : relatedJobs.length === 0 ? (
              // 无相关岗位
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">{lang === 'zh' ? '暂无相关岗位' : 'No related jobs available'}</p>
              </div>
            ) : (
              // 正常状态
              relatedJobs.map((relatedJob) => (
                <div key={relatedJob.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    <a href={`/job/${relatedJob.id}`} className="hover:text-primary">{relatedJob.title}</a>
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {relatedJob.company || relatedJob.institution || (lang === 'zh' ? '企业/大学名称已隐藏' : 'Company/University name hidden')}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {relatedJob.location}
                  </div>
                  <p className="text-gray-700 font-medium">{relatedJob.salary}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 申请表单模态框 */}
      {showApplyModal && job && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {lang === 'zh' ? `申请岗位：${job.title}` : `Apply for Job: ${job.title}`}
              </h2>
              <button 
                onClick={() => {
                  setShowApplyModal(false);
                  // 重置上传状态
                  setUploadedFiles({});
                  setUploadProgress({});
                  setUploadStatus({});
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* 申请说明 */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {lang === 'zh' ? '申请说明' : 'Application Instructions'}
                </h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {lang === 'zh' ? '请仔细阅读岗位要求，确保您符合基本条件' : 'Please carefully read the job requirements to ensure you meet the basic criteria'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {lang === 'zh' ? '上传附件时，请确保文件格式和大小符合要求' : 'When uploading attachments, please ensure the file format and size meet the requirements'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {lang === 'zh' ? '标有 * 的附件为必选项，必须上传' : 'Attachments marked with * are required and must be uploaded'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {lang === 'zh' ? '申请提交后，我们将在3-5个工作日内与您联系' : 'After submitting your application, we will contact you within 3-5 business days'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* 上传附件材料 */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {lang === 'zh' ? '上传附件材料' : 'Upload Attachment Materials'}
                </h3>
                <div className="space-y-6">
                  {getAttachmentRequirements(job.type).map((attachment: any) => (
                    <div key={attachment.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {attachment.name}
                            {attachment.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{attachment.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {lang === 'zh' ? '支持格式：' : 'Supported formats: '}{attachment.allowedTypes.join(', ')}
                            {' | '}
                            {lang === 'zh' ? '最大大小：' : 'Max size: '}{(attachment.maxSize / (1024 * 1024)).toFixed(0)}MB
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${attachment.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {attachment.required ? (lang === 'zh' ? '必选' : 'Required') : (lang === 'zh' ? '可选' : 'Optional')}
                        </span>
                      </div>
                      
                      {/* 文件上传区域 */}
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-primary transition-colors">
                        <div className="text-center">
                          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="flex justify-center space-x-2">
                            <label 
                              htmlFor={`file-upload-${attachment.id}`}
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none"
                            >
                              <span>{lang === 'zh' ? '上传文件' : 'Upload Files'}</span>
                              <input 
                                id={`file-upload-${attachment.id}`}
                                name="file-upload" 
                                type="file" 
                                className="sr-only"
                                multiple
                                onChange={(e) => handleFileSelect(attachment.id, e)}
                                accept={attachment.allowedTypes.join(',')}
                              />
                            </label>
                            <p className="text-sm text-gray-500">
                              {lang === 'zh' ? '或拖放文件到此处' : 'or drag and drop files here'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 已上传文件列表 */}
                      {uploadedFiles[attachment.id] && uploadedFiles[attachment.id].length > 0 && (
                        <div className="mt-4 space-y-2">
                          {uploadedFiles[attachment.id].map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <div className="flex items-center">
                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / (1024 * 1024)).toFixed(2)}MB
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {uploadStatus[attachment.id] === 'uploading' && (
                                  <div className="w-24">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress[attachment.id] || 0}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                                {uploadStatus[attachment.id] === 'success' && (
                                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {uploadStatus[attachment.id] === 'error' && (
                                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                <button 
                                  onClick={() => removeFile(attachment.id, index)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {/* 上传按钮 */}
                          {uploadedFiles[attachment.id] && uploadedFiles[attachment.id].length > 0 && uploadStatus[attachment.id] !== 'uploading' && (
                            <div className="mt-3">
                              <button 
                                onClick={() => handleFileUpload(attachment.id)}
                                className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                              >
                                {lang === 'zh' ? '开始上传' : 'Start Upload'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 提交按钮 */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setShowApplyModal(false);
                    // 重置上传状态
                    setUploadedFiles({});
                    setUploadProgress({});
                    setUploadStatus({});
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button 
                  onClick={handleSubmitApplication}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {lang === 'zh' ? '提交申请' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Unique%20tech%20logo%20for%20PhD%20job%20platform%2C%20futuristic%20design%20with%20hexagon%20and%20upward%20arrow%2C%20purple%20and%20blue%20gradient%2C%20minimalist%20style%2C%20not%20similar%20to%20Baidu%20Netdisk%20logo%2C%20clean%20white%20background%2C%20professional%20and%20distinctive&image_size=square_hd" alt={t.nav.siteName} className="h-10 w-10 mr-2" />
                <h3 className="text-xl font-bold">{t.nav.siteName}</h3>
              </div>
              <p className="text-gray-400">
                {lang === 'zh' ? '为博士人才提供精准的岗位匹配服务' : 'Providing precise job matching services for PhD talents'}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{lang === 'zh' ? '快速链接' : 'Quick Links'}</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">{t.nav.home}</a></li>
                <li><a href="/university" className="text-gray-400 hover:text-white">{t.nav.university}</a></li>
                <li><a href="/enterprise" className="text-gray-400 hover:text-white">{t.nav.enterprise}</a></li>
                <li><a href="/private" className="text-gray-400 hover:text-white">{lang === 'zh' ? '我的私人岗位' : 'My Private Positions'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{lang === 'zh' ? '关于我们' : 'About Us'}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">{lang === 'zh' ? '平台介绍' : 'Platform Introduction'}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{lang === 'zh' ? '合作伙伴' : 'Partners'}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{lang === 'zh' ? '联系我们' : 'Contact Us'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{lang === 'zh' ? '联系方式' : 'Contact'}</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">email@example.com</li>
                <li className="text-gray-400">+86 123 4567 8910</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
