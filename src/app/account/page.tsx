'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { JobManagementTabs, FavoritesPage, ApplicationsPage } from '../../components/AccountJobManagement';
import { JobStorageManager } from '../../lib/job-storage';
import { Job, JobFavorite, JobApplication } from '../../lib/job-model';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


// 多语言支持
const translations = {
  zh: {
    nav: {
      profile: '个人资料',
      resume: '简历管理',
      resumeAnalysis: '简历分析报告',
      jobs: '岗位管理',
      applications: '申请记录',
      settings: '账号设置',
      logout: '退出登录',
      siteName: '博智匹配',
    },
    profile: {
      title: '个人资料',
      basicInfo: '基本信息',
      academicInfo: '学术信息',
      updateBtn: '更新资料',
    },
    resume: {
      title: '简历管理',
      uploadNew: '上传新简历',
      originalResume: '原始简历',
      noResume: '暂未上传原始简历',
      viewAnalysisReport: '查看简历分析报告',
      analysisReportDescription: '获取您的简历分析报告，了解如何优化简历以提高匹配度',
    },
    applications: {
      title: '申请记录',
      noApplications: '暂无申请记录',
      status: {
        pending: '待处理',
        reviewed: '已审核',
        accepted: '已通过',
        rejected: '已拒绝',
      },
    },
    settings: {
      title: '账号设置',
      changePassword: '修改密码',
      notification: '通知设置',
      privacy: '隐私设置',
    },
    email: {
      emailCenter: '邮件中心',
    },
    welcome: '欢迎回来！',
  },
  en: {
    nav: {
      profile: 'Profile',
      resume: 'Resume',
      resumeAnalysis: 'Resume Analysis Report',
      jobs: 'Job Management',
      applications: 'Applications',
      settings: 'Settings',
      logout: 'Logout',
      siteName: 'PhDMap',
    },
    profile: {
      title: 'Profile',
      basicInfo: 'Basic Information',
      academicInfo: 'Academic Information',
      updateBtn: 'Update Profile',
    },
    resume: {
      title: 'Resume Management',
      uploadNew: 'Upload New Resume',
      originalResume: 'Original Resume',
      noResume: 'No original resume uploaded yet',
      viewAnalysisReport: 'View Resume Analysis Report',
      analysisReportDescription: 'Get your resume analysis report to learn how to optimize your resume for better matching',
    },
    applications: {
      title: 'Application Records',
      noApplications: 'No application records',
      status: {
        pending: 'Pending',
        reviewed: 'Reviewed',
        accepted: 'Accepted',
        rejected: 'Rejected',
      },
    },
    settings: {
      title: 'Account Settings',
      changePassword: 'Change Password',
      notification: 'Notification Settings',
      privacy: 'Privacy Settings',
    },
    email: {
      emailCenter: 'Email Center',
    },
    welcome: 'Welcome back!',
  },
};

// 定义用户数据类型
interface User {
  id: number;
  username: string;
  email: string;
  internalEmail?: string;
  phone: string;
  countryCode: string;
  identity: string;
  nationality: string;
  membershipLevel: string;
  membershipExpiresAt?: string;
  academicInfo: {
    degree: string;
    field: string;
    university: string;
    graduationYear: string;
  };
  resume: {
    id: number;
    fileName: string;
    uploadDate: string;
  } | null;
  degreeVerified?: boolean;
  applications: Array<{
    id: number;
    jobTitle: string;
    institution: string;
    applyDate: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  }>;
}

// 默认用户数据
const defaultUser: User = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  internalEmail: 'testuser@phdmap.com',
  phone: '+86 123 4567 8910',
  countryCode: '+86',
  identity: 'chinese',
  nationality: '中国',
  membershipLevel: 'free',
  academicInfo: {
    degree: 'PhD',
    field: 'Computer Science',
    university: 'Peking University',
    graduationYear: '2023',
  },
  resume: null,
  degreeVerified: true,
  applications: [
    {
      id: 1,
      jobTitle: 'Assistant Professor of Artificial Intelligence',
      institution: 'Peking University',
      applyDate: '2024-01-15',
      status: 'pending',
    },
    {
      id: 2,
      jobTitle: 'Senior Machine Learning Engineer',
      institution: 'Tencent Technology',
      applyDate: '2024-01-10',
      status: 'reviewed',
    },
  ],
};

export default function AccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState<'zh' | 'en'>(() => {
    // 从localStorage获取语言设置，如果没有则默认为中文
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      return (savedLang === 'zh' || savedLang === 'en') ? savedLang : 'zh';
    }
    return 'zh';
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<User>(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // 岗位管理相关状态
  const [currentUserId, setCurrentUserId] = useState<string>('user123');
  const [activeJobManagementTab, setActiveJobManagementTab] = useState<'favorites' | 'applications'>('favorites');
  const [favorites, setFavorites] = useState<JobFavorite[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // 当语言变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // 当用户访问账户页面时，重新加载岗位管理数据
  useEffect(() => {
    if (pathname === '/account') {
      // 确保使用最新的userId
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id || 'user123';
      // 只在userId不同时才更新，避免无限循环
      if (userId !== currentUserId) {
        setCurrentUserId(userId);
      }
      // 重新加载岗位管理数据
      setFavorites(JobStorageManager.getUserJobFavorites(userId));
      setApplications(JobStorageManager.getUserJobApplications(userId));
    }
  }, [pathname, currentUserId]);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    phone: '',
    countryCode: '+86',
    academicInfo: {
      degree: '',
      field: '',
      university: '',
      graduationYear: ''
    }
  });
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [saveType, setSaveType] = useState<'original' | 'optimized'>('original');
  const [saveTypeModalOpen, setSaveTypeModalOpen] = useState(false);
  // 从localStorage加载已优化简历数据
  const [optimizedResumes, setOptimizedResumes] = useState<any[]>([]);

  // 模拟登录状态和加载优化简历
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserName(user.username || 'User');
      // 更新用户信息，使用defaultUser作为基础，合并localStorage中的数据
      const updatedUser = {
        ...defaultUser,
        username: user.username,
        email: user.email,
        internalEmail: user.internalEmail || '',
        phone: user.phone || '',
        countryCode: user.countryCode || '+86',
        identity: user.identity || 'chinese',
        nationality: user.nationality || '',
        degreeVerified: user.degreeVerified || false,
        // 保留localStorage中的resume信息，如果有的话
        resume: user.resume || null,
        // 如果localStorage中有hasUploadedResume标志，根据它来决定resume是否存在
        ...(user.hasUploadedResume === false && { resume: null })
      };
      setUser(updatedUser);
      // 更新编辑表单数据
      setEditFormData({
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        countryCode: updatedUser.countryCode,
        academicInfo: updatedUser.academicInfo
      });
      
      // 设置当前用户ID
      setCurrentUserId(user.id || 'user123');
    }
    
    // 加载优化简历数据
    const uploadRecordsStr = localStorage.getItem('uploadRecords');
    if (uploadRecordsStr) {
      const uploadRecords = JSON.parse(uploadRecordsStr);
      // 过滤出优化简历
      const optimized = uploadRecords
        .filter((record: any) => record.type === 'optimized')
        // 转换为优化简历列表所需的格式
        .map((record: any) => ({
          id: parseInt(record.id),
          fileName: record.fileName,
          jobTitle: '未知岗位', // 实际项目中应该从简历内容提取
          company: '未知公司', // 实际项目中应该从简历内容提取
          uploadDate: new Date(record.uploadTime).toISOString().split('T')[0],
          score: 85 // 模拟匹配度分数
        }));
      setOptimizedResumes(optimized);
    }
    
    // 加载岗位管理数据
    setFavorites(JobStorageManager.getUserJobFavorites(currentUserId));
    setApplications(JobStorageManager.getUserJobApplications(currentUserId));
  }, [isLoggedIn, currentUserId]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };

  const t = translations[lang];



  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // 处理学术信息字段
      const [parent, child] = name.split('.');
      setEditFormData(prev => {
        const parentValue = prev[parent as keyof typeof prev];
        // 确保parentValue是一个对象，然后再进行解构
        const updatedParentValue = typeof parentValue === 'object' && parentValue !== null
          ? { ...parentValue, [child]: value }
          : { [child]: value };
        
        return {
          ...prev,
          [parent]: updatedParentValue
        };
      });
    } else {
      // 处理基本信息字段
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStartEdit = () => {
    setEditFormData({
      username: user.username,
      email: user.email,
      phone: user.phone,
      countryCode: user.countryCode,
      academicInfo: user.academicInfo
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    // 检查学历信息完整性
    const academicInfo = editFormData.academicInfo;
    const degreeVerified = !!(academicInfo.degree && academicInfo.field && academicInfo.university && academicInfo.graduationYear);
    
    // 检查是否需要生成网站邮箱
    let internalEmail = user.internalEmail;
    if (degreeVerified && !internalEmail) {
      try {
        // 调用API生成唯一的网站邮箱地址
        const response = await fetch('/api/generate-internal-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: editFormData.username }),
        });
        
        if (response.ok) {
          const data = await response.json();
          internalEmail = data.internalEmail;
          console.log('生成的网站邮箱:', internalEmail);
        } else {
          console.error('生成网站邮箱失败:', await response.text());
        }
      } catch (error) {
        console.error('生成网站邮箱失败:', error);
      }
    }
    
    // 保存编辑后的信息
    const updatedUser = {
      ...user,
      username: editFormData.username,
      email: editFormData.email,
      internalEmail: internalEmail,
      phone: editFormData.phone,
      countryCode: editFormData.countryCode,
      identity: editFormData.countryCode === '+86' ? 'chinese' : 'foreign',
      nationality: user.nationality,
      academicInfo: editFormData.academicInfo,
      degreeVerified: degreeVerified
    };
    setUser(updatedUser);
    
    // 更新localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const updatedUserData = {
        ...userData,
        username: editFormData.username,
        email: editFormData.email,
        internalEmail: internalEmail,
        phone: editFormData.phone,
        countryCode: editFormData.countryCode,
        identity: editFormData.countryCode === '+86' ? 'chinese' : 'foreign',
        nationality: userData.nationality,
        degreeVerified: degreeVerified
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUserName(updatedUserData.username || 'User');
    }
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedResumeFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  // 显示保存选项模态框
  const showSaveTypeModal = () => {
    if (!selectedResumeFile) return;
    setSaveTypeModalOpen(true);
  };
  
  // 执行简历上传
  const handleResumeUploadWithType = async () => {
    if (!selectedResumeFile) return;

    setIsUploading(true);
    setSaveTypeModalOpen(false);
    setUploadSuccess(false);

    try {
      // 模拟文件上传
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 上传成功，更新用户简历信息
      const resumeInfo = {
        id: Date.now(),
        fileName: selectedResumeFile.name,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      // 根据保存类型更新用户信息
      const updatedUser = {
        ...user,
        resume: saveType === 'original' ? resumeInfo : user.resume
      };
      
      setUser(updatedUser);
      setUploadSuccess(true);
      setSelectedResumeFile(null);
      
      // 更新localStorage中的用户信息
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (saveType === 'original') {
          userData.resume = resumeInfo;
        }
        userData.hasUploadedResume = true;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
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
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleResumeUpload = () => {
    // 显示保存类型选择模态框
    showSaveTypeModal();
  };

  const handleResumeDelete = () => {
    if (window.confirm(lang === 'zh' ? '确定要删除当前简历吗？' : 'Are you sure you want to delete the current resume?')) {
      const updatedUser = {
        ...user,
        resume: null
      };
      setUser(updatedUser);
      
      // 更新localStorage中的用户数据
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.resume = null;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // 清除uploadRecords，防止简历分析时再次使用已删除的简历
      localStorage.removeItem('uploadRecords');
    }
  };

  const handleOptimizedResumeDelete = (id: number) => {
    if (window.confirm(lang === 'zh' ? '确定要删除这个优化简历吗？' : 'Are you sure you want to delete this optimized resume?')) {
      // 更新组件状态
      setOptimizedResumes(prev => prev.filter(resume => resume.id !== id));
      
      // 更新localStorage
      const uploadRecordsStr = localStorage.getItem('uploadRecords');
      if (uploadRecordsStr) {
        let uploadRecords = JSON.parse(uploadRecordsStr);
        // 过滤掉要删除的优化简历
        uploadRecords = uploadRecords.filter((record: any) => 
          !(record.type === 'optimized' && parseInt(record.id) === id)
        );
        localStorage.setItem('uploadRecords', JSON.stringify(uploadRecords));
      }
    }
  };
  
  // 岗位管理相关函数
  const handleRemoveFavorite = (jobId: string) => {
    JobStorageManager.removeJobFavorite(currentUserId, jobId);
    setFavorites(JobStorageManager.getUserJobFavorites(currentUserId));
  };
  
  const handleViewJobDetails = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
      />

      {/* 主内容 */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 侧边导航 */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 mt-4">{t.welcome}</h3>
              <nav className="space-y-2">
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  {t.nav.profile}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'resume' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('resume')}
                >
                  {t.nav.resume}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'jobs' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('jobs')}
                >
                  {t.nav.jobs}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'applications' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('applications')}
                >
                  {t.nav.applications}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'email' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => {
                    window.location.href = '/email';
                  }}
                >
                  {lang === 'zh' ? '邮件中心' : 'Email Center'}
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  {t.nav.settings}
                </button>
                <button
                  className="w-full text-left px-4 py-2 rounded-md transition-colors text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  {t.nav.logout}
                </button>
              </nav>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="md:w-3/4">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6 mt-4">
                  <h2 className="text-2xl font-bold text-gray-900">{t.profile.title}</h2>
                  {!isEditing && (
                    <button 
                      onClick={handleStartEdit}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {lang === 'zh' ? '编辑资料' : 'Edit Profile'}
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <>
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.profile.basicInfo}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '用户名' : 'Username'}</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="username"
                            type="text"
                            value={editFormData.username}
                            onChange={handleEditInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '邮箱地址' : 'Email'}</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="email"
                            type="email"
                            value={editFormData.email}
                            onChange={handleEditInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '网站邮箱' : 'Website Email'}</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 cursor-not-allowed"
                            type="text"
                            value={user.internalEmail || (lang === 'zh' ? '暂未生成' : 'Not generated yet')}
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '国家区号' : 'Country Code'}</label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="countryCode"
                            value={editFormData.countryCode}
                            onChange={handleEditInputChange}
                          >
                            <option value="+86">+86 (中国)</option>
                            <option value="+1">+1 (美国)</option>
                            <option value="+44">+44 (英国)</option>
                            <option value="+61">+61 (澳大利亚)</option>
                            <option value="+81">+81 (日本)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '手机号' : 'Phone Number'}</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="phone"
                            type="tel"
                            value={editFormData.phone}
                            onChange={handleEditInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.profile.academicInfo}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '学位' : 'Degree'}</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="academicInfo.degree"
                            type="text"
                            value={editFormData.academicInfo.degree}
                            onChange={handleEditInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '专业领域' : 'Field'}</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="academicInfo.field"
                            type="text"
                            value={editFormData.academicInfo.field}
                            onChange={handleEditInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '毕业院校' : 'University'}</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="academicInfo.university"
                            type="text"
                            value={editFormData.academicInfo.university}
                            onChange={handleEditInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '毕业年份' : 'Graduation Year'}</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="academicInfo.graduationYear"
                            type="text"
                            value={editFormData.academicInfo.graduationYear}
                            onChange={handleEditInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button 
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {lang === 'zh' ? '取消' : 'Cancel'}
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      >
                        {lang === 'zh' ? '保存修改' : 'Save Changes'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.profile.basicInfo}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '用户名' : 'Username'}</label>
                          <p className="text-gray-900">{user.username}</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '邮箱地址' : 'Email'}</label>
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '网站邮箱' : 'Website Email'}</label>
                          <p className="text-gray-900">{user.internalEmail || lang === 'zh' ? '暂未生成' : 'Not generated yet'}</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '手机号' : 'Phone Number'}</label>
                          <p className="text-gray-900">{user.countryCode} {user.phone}</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '身份' : 'Identity'}</label>
                          <p className="text-gray-900">
                            {user.nationality ? (
                              lang === 'zh' ? `${user.nationality}博士` : `${user.nationality} PhD`
                            ) : (
                              user.identity === 'chinese' ? (lang === 'zh' ? '中国博士' : 'Chinese PhD') : (lang === 'zh' ? '海外博士' : 'Foreign PhD')
                            )}
                          </p>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '学历验证状态' : 'Degree Verification Status'}</label>
                          <p className={`text-gray-900 font-medium ${user.degreeVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                            {user.degreeVerified ? (lang === 'zh' ? '已验证' : 'Verified') : (lang === 'zh' ? '未验证' : 'Not Verified')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 会员等级信息 */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{lang === 'zh' ? '会员等级' : 'Membership Level'}</h3>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {user.membershipLevel === 'free' ? (lang === 'zh' ? '免费会员' : 'Free Member') : 
                               user.membershipLevel === 'vip' ? (lang === 'zh' ? 'VIP会员' : 'VIP Member') : 
                               (lang === 'zh' ? 'SVIP会员' : 'SVIP Member')}
                            </h4>
                            <p className="text-gray-500 mt-1">
                              {lang === 'zh' ? '享受基本会员权益' : 'Enjoy basic membership benefits'}
                            </p>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-white font-medium ${user.membershipLevel === 'free' ? 'bg-gray-500' : 
                                                                                   user.membershipLevel === 'vip' ? 'bg-blue-500' : 
                                                                                   'bg-purple-600'}`}>
                            {user.membershipLevel === 'free' ? (lang === 'zh' ? '免费' : 'Free') : 
                             user.membershipLevel === 'vip' ? 'VIP' : 'SVIP'}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <a 
                            href="/account/membership" 
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                          >
                            {lang === 'zh' ? '升级会员' : 'Upgrade Membership'}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.profile.academicInfo}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '学位' : 'Degree'}</label>
                          <p className="text-gray-900">{user.academicInfo.degree}</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '专业领域' : 'Field'}</label>
                          <p className="text-gray-900">{user.academicInfo.field}</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '毕业院校' : 'University'}</label>
                          <p className="text-gray-900">{user.academicInfo.university}</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '毕业年份' : 'Graduation Year'}</label>
                          <p className="text-gray-900">{user.academicInfo.graduationYear}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-4">{t.resume.title}</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.resume.originalResume}</h3>
                  {user.resume ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-900 font-medium">{user.resume.fileName}</p>
                          <p className="text-gray-500 text-sm">{lang === 'zh' ? '上传时间：' : 'Upload date: '}{user.resume.uploadDate}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                            {lang === 'zh' ? '下载' : 'Download'}
                          </button>
                          <button 
                            onClick={handleResumeDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            {lang === 'zh' ? '删除' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">{t.resume.noResume}</p>
                  )}
                </div>

                {/* 简历分析报告入口 */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.nav.resumeAnalysis}</h3>
                  <p className="text-gray-600 mb-4">{t.resume.analysisReportDescription}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push('/resume-analysis')}
                      className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {t.resume.viewAnalysisReport}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.resume.uploadNew}</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <input
                      type="file"
                      className="hidden"
                      id="resumeFile"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeFileChange}
                    />
                    <label htmlFor="resumeFile" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {selectedResumeFile ? (
                          <div className="text-center">
                            <p className="text-lg font-medium text-gray-700 mb-2">
                              {lang === 'zh' ? '已选择文件：' : 'Selected file: '}{selectedResumeFile.name}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                              {lang === 'zh' ? '文件大小：' : 'File size: '}{(selectedResumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="text-lg font-medium text-gray-700 mb-2">
                              {lang === 'zh' ? '点击或拖拽文件到此处上传' : 'Click or drag file here to upload'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {lang === 'zh' ? '支持 PDF, DOC, DOCX 格式，最大 10MB' : 'Supports PDF, DOC, DOCX, up to 10MB'}
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                    {selectedResumeFile && (
                      <div className="mt-6">
                        <button
                          onClick={handleResumeUpload}
                          disabled={isUploading}
                          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploading ? (lang === 'zh' ? '上传中...' : 'Uploading...') : (lang === 'zh' ? '开始上传' : 'Start Upload')}
                        </button>
                      </div>
                    )}
                    {uploadSuccess && (
                      <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                        {lang === 'zh' ? '上传成功！' : 'Upload successful!'}
                      </div>
                    )}
                  </div>
                </div>

                {/* 已优化简历列表 */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{lang === 'zh' ? '已优化简历列表' : 'Optimized Resumes'}</h3>
                    <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                      {lang === 'zh' ? '智能优化简历' : 'Smart Resume Optimization'}
                    </button>
                  </div>
                  {optimizedResumes.length > 0 ? (
                    <div className="space-y-4">
                      {optimizedResumes.map((resume) => (
                        <div key={resume.id} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div className="mb-4 md:mb-0">
                              <p className="text-gray-900 font-medium">{resume.fileName}</p>
                              <div className="flex flex-wrap gap-4 mt-2">
                                <div>
                                  <span className="text-gray-500 text-sm">{lang === 'zh' ? '目标岗位：' : 'Target Position: '}</span>
                                  <span className="text-gray-700">{resume.jobTitle}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-sm">{lang === 'zh' ? '目标公司：' : 'Target Company: '}</span>
                                  <span className="text-gray-700">{resume.company}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-sm">{lang === 'zh' ? '优化日期：' : 'Optimization Date: '}</span>
                                  <span className="text-gray-700">{resume.uploadDate}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-sm">{lang === 'zh' ? '匹配度：' : 'Match Score: '}</span>
                                  <span className="text-green-600 font-medium">{resume.score}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                                {lang === 'zh' ? '下载' : 'Download'}
                              </button>
                              <button 
                                onClick={() => handleOptimizedResumeDelete(resume.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                              >
                                {lang === 'zh' ? '删除' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-md text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">{lang === 'zh' ? '暂无优化简历，点击上方按钮开始智能优化' : 'No optimized resumes yet, click the button above to start smart optimization'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-4">{t.nav.jobs}</h2>
                
                <JobManagementTabs
                  activeTab={activeJobManagementTab}
                  onTabChange={setActiveJobManagementTab}
                />
                
                {activeJobManagementTab === 'favorites' ? (
                  <FavoritesPage
                    favorites={favorites}
                    onRemoveFavorite={handleRemoveFavorite}
                    onViewDetails={handleViewJobDetails}
                  />
                ) : (
                  <ApplicationsPage
                    applications={applications}
                    onViewDetails={handleViewJobDetails}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'applications' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-4">{t.applications.title}</h2>
                
                {applications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {lang === 'zh' ? '职位' : 'Position'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {lang === 'zh' ? '机构' : 'Institution'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {lang === 'zh' ? '申请日期' : 'Apply Date'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {lang === 'zh' ? '状态' : 'Status'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => {
                          // 根据申请状态获取样式类名
                          const statusClass = app.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : app.status === 'reviewed' 
                            ? 'bg-blue-100 text-blue-800' 
                            : app.status === 'accepted' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800';
                          
                          return (
                            <tr key={app.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {app.job.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {app.job.company}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(app.appliedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                                  {t.applications.status[app.status as keyof typeof t.applications.status]}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">{t.applications.noApplications}</p>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-4">{t.settings.title}</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.settings.changePassword}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '当前密码' : 'Current Password'}</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        type="password"
                        placeholder={lang === 'zh' ? '请输入当前密码' : 'Enter current password'}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '新密码' : 'New Password'}</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        type="password"
                        placeholder={lang === 'zh' ? '请输入新密码' : 'Enter new password'}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">{lang === 'zh' ? '确认新密码' : 'Confirm New Password'}</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        type="password"
                        placeholder={lang === 'zh' ? '请再次输入新密码' : 'Confirm new password'}
                      />
                    </div>
                    <div className="text-right">
                      <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                        {lang === 'zh' ? '修改密码' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.settings.notification}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotification"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="emailNotification" className="ml-2 block text-sm text-gray-900">
                        {lang === 'zh' ? '接收邮件通知' : 'Receive email notifications'}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="smsNotification"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="smsNotification" className="ml-2 block text-sm text-gray-900">
                        {lang === 'zh' ? '接收短信通知' : 'Receive SMS notifications'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
                  id="original-account" 
                  name="saveType-account" 
                  checked={saveType === 'original'} 
                  onChange={() => setSaveType('original')} 
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="original-account" className="ml-3 text-lg font-medium text-gray-900 cursor-pointer">
                  {lang === 'zh' ? '原始简历' : 'Original Resume'}
                </label>
                <p className="ml-4 text-sm text-gray-500 flex-1">
                  {lang === 'zh' ? '(只能保存1份，将替换现有原始简历)' : '(Only 1 copy allowed, will replace existing original resume)'}
                </p>
              </div>
              <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors" onClick={() => setSaveType('optimized')}>
                <input 
                  type="radio" 
                  id="optimized-account" 
                  name="saveType-account" 
                  checked={saveType === 'optimized'} 
                  onChange={() => setSaveType('optimized')} 
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="optimized-account" className="ml-3 text-lg font-medium text-gray-900 cursor-pointer">
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
                onClick={handleResumeUploadWithType} 
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                {lang === 'zh' ? '确定' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 共享页脚 */}
      <Footer lang={lang} />
    </div>
  );
}
