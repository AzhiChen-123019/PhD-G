'use client';

import { useState, useEffect } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTitle from '@/components/PageTitle';

const ResumeAnalysisPage: React.FC = () => {
  const router = useRouter();
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobExpectations, setJobExpectations] = useState({
    salaryRange: '',
    location: '',
    industry: ''
  });
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [tempExpectations, setTempExpectations] = useState<{
    salaryRange: string[];
    location: string[];
    industry: string[];
  }>({
    salaryRange: [],
    location: [],
    industry: []
  });

  // 根据简历文件名生成个性化的分析报告
  const generatePersonalizedReport = (resumeInfo: any, userName: string) => {
    // 基于文件名生成不同的分析数据
    const fileName = resumeInfo?.fileName || '';
    const uploadDate = resumeInfo?.uploadDate || new Date().toISOString().split('T')[0];
    
    // 根据文件名中的关键词生成不同的技能和推荐
    let primarySkills = ['人工智能', '机器学习', '深度学习', '计算机视觉'];
    let secondarySkills = ['Python', 'TensorFlow', 'PyTorch', 'C++'];
    let strengths = [
      '丰富的AI研究经验',
      '多篇高水平论文发表',
      '扎实的数学基础',
      '良好的团队协作能力',
    ];
    let improvement = [
      '可增加更多项目实践经验',
      '可加强行业应用案例',
    ];
    let recommendations = [
      '适合申请人工智能研究员岗位',
      '可考虑高校AI实验室职位',
      '推荐申请大型科技公司AI部门',
    ];
    let major = '计算机科学';
    let experience = '5年';
    
    // 根据文件名关键词调整分析内容
    if (fileName.toLowerCase().includes('biology') || fileName.toLowerCase().includes('生物')) {
      primarySkills = ['生物信息学', '基因组学', '分子生物学', '生物统计学'];
      secondarySkills = ['Python', 'R', 'BLAST', 'CRISPR'];
      strengths = [
        '丰富的生物学研究经验',
        '多篇SCI论文发表',
        '扎实的实验技能',
        '良好的跨学科合作能力',
      ];
      improvement = [
        '可增加更多生物信息学项目经验',
        '可加强数据分析能力',
      ];
      recommendations = [
        '适合申请生物医学研究员岗位',
        '可考虑高校生命科学实验室职位',
        '推荐申请制药公司研发部门',
      ];
      major = '生物医学';
      experience = '4年';
    } else if (fileName.toLowerCase().includes('chemistry') || fileName.toLowerCase().includes('化学')) {
      primarySkills = ['有机化学', '材料科学', '纳米技术', '催化反应'];
      secondarySkills = ['Python', 'Gaussian', 'XRD', 'NMR'];
      strengths = [
        '丰富的化学研究经验',
        '多篇高水平论文发表',
        '扎实的实验设计能力',
        '良好的科学创新能力',
      ];
      improvement = [
        '可增加更多材料科学项目经验',
        '可加强计算化学技能',
      ];
      recommendations = [
        '适合申请化学研究员岗位',
        '可考虑高校化学系职位',
        '推荐申请材料科技公司',
      ];
      major = '化学';
      experience = '6年';
    } else if (fileName.toLowerCase().includes('physics') || fileName.toLowerCase().includes('物理')) {
      primarySkills = ['凝聚态物理', '量子力学', '粒子物理', '计算物理'];
      secondarySkills = ['Python', 'Matlab', 'Fortran', 'LabVIEW'];
      strengths = [
        '丰富的物理学研究经验',
        '多篇顶级期刊论文发表',
        '扎实的理论基础',
        '良好的实验设计能力',
      ];
      improvement = [
        '可增加更多跨学科合作经验',
        '可加强数据分析能力',
      ];
      recommendations = [
        '适合申请物理学研究员岗位',
        '可考虑高校物理系职位',
        '推荐申请国家实验室',
      ];
      major = '物理学';
      experience = '5年';
    }
    
    // 根据上传日期生成不同的匹配分数（增加随机性）
    const dateScore = uploadDate.split('-').reduce((sum: number, part: string) => sum + parseInt(part), 0);
    const matchScore = 75 + (dateScore % 20); // 75-95之间的随机分数
    
    return {
      basicInfo: {
        name: userName || '博士求职者',
        education: '博士',
        major: major,
        experience: experience,
        fileName: fileName,
        uploadDate: uploadDate,
      },
      analysis: {
        skills: {
          primary: primarySkills,
          secondary: secondarySkills,
          soft: ['团队合作', '沟通能力', '问题解决', '项目管理'],
        },
        strengths: strengths,
        improvement: improvement,
        matchScore: matchScore,
      },
      recommendations: recommendations,
    };
  };

  // 在客户端渲染后，从localStorage获取语言设置和用户信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 获取语言设置
      const savedLang = localStorage.getItem('lang');
      if (savedLang === 'zh' || savedLang === 'en') {
        setLang(savedLang);
      }

      // 获取用户信息
      const storedUser = localStorage.getItem('user');
      let user = null;
      if (storedUser) {
        user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(user.username || 'User');
      }
      
      // 获取最新的上传记录
      const uploadRecords = JSON.parse(localStorage.getItem('uploadRecords') || '[]');
      console.log('Upload records:', uploadRecords);
      
      // 按上传时间排序，获取最新的简历
      let latestUpload = null;
      if (uploadRecords.length > 0) {
        // 尝试按上传时间排序，如果失败则按ID排序
        try {
          latestUpload = [...uploadRecords].sort((a, b) => {
            const timeA = a.uploadTime ? new Date(a.uploadTime).getTime() : 0;
            const timeB = b.uploadTime ? new Date(b.uploadTime).getTime() : 0;
            return timeB - timeA;
          })[0];
        } catch (error) {
          console.error('Error sorting upload records by time:', error);
          // 如果时间排序失败，按ID排序
          latestUpload = [...uploadRecords].sort((a, b) => {
            const idA = a.id ? parseInt(a.id) : 0;
            const idB = b.id ? parseInt(b.id) : 0;
            return idB - idA;
          })[0];
        }
      }
      console.log('Latest upload:', latestUpload);
      
      // 获取用户简历信息
      const userResume = user?.resume || latestUpload;
      console.log('User resume:', userResume);

      // 生成个性化简历分析数据
      setTimeout(() => {
        const personalizedData = generatePersonalizedReport(userResume, user?.username || 'User');
        console.log('Generated report data:', personalizedData);
        setResumeData(personalizedData);
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  const translations = {
    zh: {
      pageTitle: '我的简历分析报告',
      pageDescription: '详细分析您的简历，提供个性化的岗位推荐和改进建议',
      basicInfo: '基本信息',
      name: '姓名',
      education: '学历',
      major: '专业',
      experience: '工作经验',
      analysis: '简历分析',
      skills: '技能评估',
      primarySkills: '核心技能',
      secondarySkills: '次要技能',
      softSkills: '软技能',
      strengths: '优势分析',
      improvement: '改进建议',
      matchScore: '简历综合评分',
      recommendations: '岗位推荐',
      backToHome: '返回首页',
      matchJobs: '去匹配岗位',
      loading: '正在加载简历分析报告...',
      jobExpectations: '求职期望',
      salaryRange: '薪资范围',
      location: '工作地',
      industry: '期望行业',
      notSet: '未设置',
     完善求职期望: '完善求职期望',
      完善求职期望提示: '为更好为您提供精准岗位，请完善您的求职期望，是否现在完善？',
      现在完善: 'Yes，现在完善',
      稍后完善: 'No, 稍后完善',
    },
    en: {
      pageTitle: 'My Resume Analysis Report',
      pageDescription: 'Detailed analysis of your resume with personalized job recommendations and improvement suggestions',
      basicInfo: 'Basic Information',
      name: 'Name',
      education: 'Education',
      major: 'Major',
      experience: 'Work Experience',
      analysis: 'Resume Analysis',
      skills: 'Skills Assessment',
      primarySkills: 'Primary Skills',
      secondarySkills: 'Secondary Skills',
      softSkills: 'Soft Skills',
      strengths: 'Strengths Analysis',
      improvement: 'Improvement Suggestions',
      matchScore: 'Match Score',
      recommendations: 'Job Recommendations',
      backToHome: 'Back to Home',
      matchJobs: 'Match Jobs',
      loading: 'Loading resume analysis report...',
      jobExpectations: 'Job Expectations',
      salaryRange: 'Salary Range',
      location: 'Location',
      industry: 'Expected Industry',
      notSet: 'Not Set',
      完善求职期望: 'Complete Job Expectations',
      完善求职期望提示: 'To provide you with more accurate job recommendations, please complete your job expectations. Would you like to complete them now?',
      现在完善: 'Yes, complete now',
      稍后完善: 'No, complete later',
    },
  };

  const t = translations[lang];

  // 检查求职期望是否完善
  const isJobExpectationsComplete = () => {
    return jobExpectations.salaryRange && jobExpectations.location && jobExpectations.industry;
  };

  // 处理匹配岗位按钮点击
  const handleMatchJobs = () => {
    if (isJobExpectationsComplete()) {
      // 求职期望已完善，直接跳转到一键匹配岗位页
      router.push('/private');
    } else {
      // 求职期望不完善，弹出提示框
      setShowPromptModal(true);
    }
  };

  // 处理提示框按钮点击
  const handlePromptAction = (completeNow: boolean) => {
    setShowPromptModal(false);
    if (completeNow) {
      // 用户选择现在完善，打开完善弹框
      setCurrentQuestion(0);
      setTempExpectations({
        salaryRange: [],
        location: [],
        industry: []
      });
      setShowCompleteModal(true);
    } else {
      // 用户选择稍后完善，直接跳转到一键匹配岗位页
      router.push('/private');
    }
  };

  // 处理选项选择
  const handleOptionSelect = (value: string, type: 'salaryRange' | 'location' | 'industry') => {
    // 薪资范围是单选的，其他是多选的
    if (type === 'salaryRange') {
      // 薪资范围直接替换为新值
      setTempExpectations(prev => ({
        ...prev,
        [type]: [value]
      }));
    } else {
      // 支持多选功能，限制最多选择3个
      setTempExpectations(prev => {
        const currentValues = prev[type];
        if (currentValues.includes(value)) {
          // 如果已选择，则移除
          return {
            ...prev,
            [type]: currentValues.filter(item => item !== value)
          };
        } else {
          // 如果未选择，则添加，但最多只能选择3个
          if (currentValues.length >= 3) {
            // 已达到选择上限，不添加新选项
            return prev;
          }
          return {
            ...prev,
            [type]: [...currentValues, value]
          };
        }
      });
    }
  };

  // 处理问题导航
  const handleQuestionNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentQuestion < 2) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // 处理完善求职期望完成
  const handleCompleteJobExpectations = () => {
    // 将临时选择转换为最终值
    const updatedExpectations = {
      salaryRange: tempExpectations.salaryRange.join(', '),
      location: tempExpectations.location.join(', '),
      industry: tempExpectations.industry.join(', ')
    };
    
    setJobExpectations(updatedExpectations);
    setShowCompleteModal(false);
    
    // 跳转到一键匹配岗位页
    router.push('/private');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 共享导航栏 */}
        <Header 
          lang={lang} 
          onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
        />

        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
      />

      <div className="container mx-auto px-4 py-8">
        {/* 共享页面标题 */}
        <PageTitle 
          title={t.pageTitle} 
          description={t.pageDescription} 
          lang={lang} 
        />

        {/* 返回按钮 - 固定浮动显示 */}
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => router.back()}
            className="w-14 h-14 bg-primary text-white rounded-full hover:bg-primary/90 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
            aria-label={lang === 'zh' ? '返回上一页' : 'Back to Previous Page'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            {t.backToHome}
          </button>
          <button 
            onClick={() => handleMatchJobs()}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {t.matchJobs}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：基本信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.basicInfo}</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">{t.name}</div>
                  <div className="text-gray-900 font-medium">{resumeData?.basicInfo?.name || 'Guest'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{t.education}</div>
                  <div className="text-gray-900 font-medium">{resumeData?.basicInfo?.education || '博士'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{t.major}</div>
                  <div className="text-gray-900 font-medium">{resumeData?.basicInfo?.major || '计算机科学'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{t.experience}</div>
                  <div className="text-gray-900 font-medium">{resumeData?.basicInfo?.experience || '5年'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{lang === 'zh' ? '简历文件名' : 'Resume File Name'}</div>
                  <div className="text-gray-900 font-medium truncate max-w-full">{resumeData?.basicInfo?.fileName || ''}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{lang === 'zh' ? '上传日期' : 'Upload Date'}</div>
                  <div className="text-gray-900 font-medium">{resumeData?.basicInfo?.uploadDate || new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>

              {/* 简历综合评分 */}
              <div className="mt-8">
                <div className="text-sm text-gray-500 mb-2">{t.matchScore}</div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-1000" 
                      style={{ width: `${resumeData?.analysis?.matchScore || 80}%` }}
                    ></div>
                  </div>
                  <div className="ml-4 text-2xl font-bold text-gray-900">{resumeData?.analysis?.matchScore || 80}</div>
                </div>
              </div>

              {/* 求职期望 */}
              <div className="mt-8">
                <div className="text-sm text-gray-500 mb-4">{t.jobExpectations}</div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{t.salaryRange}</div>
                    <div className="text-gray-900 font-medium">{jobExpectations.salaryRange || t.notSet}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{t.location}</div>
                    <div className="text-gray-900 font-medium">{jobExpectations.location || t.notSet}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{t.industry}</div>
                    <div className="text-gray-900 font-medium">{jobExpectations.industry || t.notSet}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：详细分析 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 技能评估 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.skills}</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">{t.primarySkills}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(resumeData?.analysis?.skills?.primary || ['人工智能', '机器学习', '深度学习', '计算机视觉']).map((skill: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">{t.secondarySkills}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(resumeData?.analysis?.skills?.secondary || ['Python', 'TensorFlow', 'PyTorch', 'C++']).map((skill: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">{t.softSkills}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(resumeData?.analysis?.skills?.soft || ['团队合作', '沟通能力', '问题解决', '项目管理']).map((skill: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 优势分析 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.strengths}</h2>
              <ul className="space-y-3">
                {(resumeData?.analysis?.strengths || ['丰富的AI研究经验', '多篇高水平论文发表', '扎实的数学基础', '良好的团队协作能力']).map((strength: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 改进建议 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.improvement}</h2>
              <ul className="space-y-3">
                {(resumeData?.analysis?.improvement || ['可增加更多项目实践经验', '可加强行业应用案例']).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-3 w-3 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 岗位推荐 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.recommendations}</h2>
              <ul className="space-y-3">
                {(resumeData?.recommendations || ['适合申请人工智能研究员岗位', '可考虑高校AI实验室职位', '推荐申请大型科技公司AI部门']).map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 提示框：是否完善求职期望 */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.完善求职期望}</h3>
            <p className="text-gray-600 mb-6">{t.完善求职期望提示}</p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => handlePromptAction(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                {t.稍后完善}
              </button>
              <button 
                onClick={() => handlePromptAction(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                {t.现在完善}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 完善求职期望弹框 */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">{t.完善求职期望}</h3>
            
            {/* 问题导航 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-500">
                {lang === 'zh' ? `问题 ${currentQuestion + 1}/3` : `Question ${currentQuestion + 1}/3`}
              </div>
              <div className="w-3/4 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* 薪资范围问题 */}
            {currentQuestion === 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">{t.salaryRange}</h4>
                <div className="space-y-3">
                  <select
                    value={tempExpectations.salaryRange[0] || ''}
                    onChange={(e) => handleOptionSelect(e.target.value, 'salaryRange')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">{lang === 'zh' ? '请选择薪资范围' : 'Please select salary range'}</option>
                    <option value="不限">{lang === 'zh' ? '不限' : 'No limitation'}</option>
                    <option value="$30,000-$50,000">$30,000-$50,000</option>
                    <option value="$50,000-$75,000">$50,000-$75,000</option>
                    <option value="$75,000-$100,000">$75,000-$100,000</option>
                    <option value="$100,000-$125,000">$100,000-$125,000</option>
                    <option value="$125,000-$150,000">$125,000-$150,000</option>
                    <option value="$150,000-">$150,000+</option>
                  </select>
                  <p className="text-sm text-gray-500">{lang === 'zh' ? '薪资范围以USD币种计算' : 'Salary range in USD currency'}</p>
                </div>
              </div>
            )}

            {/* 工作地问题 */}
            {currentQuestion === 1 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">{t.location}</h4>
                
                {/* 不限选项 */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600">{lang === 'zh' ? '选择范围' : 'Selection Range'}</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        // 切换不限选项
                        if (tempExpectations.location.includes('不限')) {
                          // 如果已选择不限，则清空所有选择
                          setTempExpectations(prev => ({
                            ...prev,
                            location: []
                          }));
                        } else {
                          // 如果未选择不限，则只选择不限
                          setTempExpectations(prev => ({
                            ...prev,
                            location: ['不限']
                          }));
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${tempExpectations.location.includes('不限') 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {lang === 'zh' ? '不限' : 'No limitation'}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">{lang === 'zh' ? '最多可选择3个工作地点' : 'You can select up to 3 locations'}</div>
                </div>
                
                {/* 全球热门城市 */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600">{lang === 'zh' ? '全球热门城市' : 'Global Popular Cities'}</div>
                  <div className="flex flex-wrap gap-2">
                    {['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '武汉', '西安', '纽约', '伦敦', '东京', '巴黎', '新加坡', '悉尼'].map(city => (
                      <button
                        key={city}
                        onClick={() => handleOptionSelect(city, 'location')}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${tempExpectations.location.includes(city) 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 热门国家 */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600">{lang === 'zh' ? '热门国家' : 'Popular Countries'}</div>
                  <div className="flex flex-wrap gap-2">
                    {['中国', '美国', '英国', '加拿大', '澳大利亚', '德国', '法国', '日本', '韩国', '新加坡'].map(country => (
                      <button
                        key={country}
                        onClick={() => handleOptionSelect(country, 'location')}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${tempExpectations.location.includes(country) 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 已选择的工作地 */}
                {tempExpectations.location.length > 0 && !tempExpectations.location.includes('不限') && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">
                      {lang === 'zh' ? '已选择' : 'Selected'} ({tempExpectations.location.length}/3)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tempExpectations.location.map((location: string) => (
                        <span
                          key={location}
                          className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary flex items-center gap-1"
                        >
                          {location}
                          <button
                            onClick={() => {
                              setTempExpectations(prev => ({
                                ...prev,
                                location: prev.location.filter((item: string) => item !== location)
                              }));
                            }}
                            className="hover:text-primary/80"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 期望行业问题 */}
            {currentQuestion === 2 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">{t.industry}</h4>
                
                {/* 不限选项 */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600">{lang === 'zh' ? '选择范围' : 'Selection Range'}</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        // 切换不限选项
                        if (tempExpectations.industry.includes('不限')) {
                          // 如果已选择不限，则清空所有选择
                          setTempExpectations(prev => ({
                            ...prev,
                            industry: []
                          }));
                        } else {
                          // 如果未选择不限，则只选择不限
                          setTempExpectations(prev => ({
                            ...prev,
                            industry: ['不限']
                          }));
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${tempExpectations.industry.includes('不限') 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {lang === 'zh' ? '不限' : 'No limitation'}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">{lang === 'zh' ? '最多可选择3个行业' : 'You can select up to 3 industries'}</div>
                </div>
                
                {/* 热门行业快速选择 */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600">{lang === 'zh' ? '热门行业' : 'Popular Industries'}</div>
                  <div className="flex flex-wrap gap-2">
                    {['互联网', '金融', '教育', '医疗健康', '人工智能', '大数据', '电商', '新能源', '半导体', '云计算'].map(industry => (
                      <button
                        key={industry}
                        onClick={() => handleOptionSelect(industry, 'industry')}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${tempExpectations.industry.includes(industry) 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 详细行业分类 */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-600">{lang === 'zh' ? '详细行业分类' : 'Detailed Industry Categories'}</div>
                  
                  {/* 互联网/科技 */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500">{lang === 'zh' ? '互联网/科技' : 'Internet/Technology'}</div>
                    <div className="flex flex-wrap gap-2">
                      {['互联网', '人工智能', '大数据', '云计算', '软件', '硬件', '半导体', '区块链', '游戏', '电商'].map(industry => (
                        <button
                          key={industry}
                          onClick={() => handleOptionSelect(industry, 'industry')}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${tempExpectations.industry.includes(industry) 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 金融/投资 */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500">{lang === 'zh' ? '金融/投资' : 'Finance/Investment'}</div>
                    <div className="flex flex-wrap gap-2">
                      {['银行', '证券', '基金', '保险', '信托', '期货', '金融科技', '投资银行', '资产管理', '融资租赁'].map(industry => (
                        <button
                          key={industry}
                          onClick={() => handleOptionSelect(industry, 'industry')}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${tempExpectations.industry.includes(industry) 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 医疗健康 */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500">{lang === 'zh' ? '医疗健康' : 'Healthcare'}</div>
                    <div className="flex flex-wrap gap-2">
                      {['医院', '制药', '生物科技', '医疗器械', '医疗健康IT', '健康管理', '医疗服务', '医药流通', '保健品', '医疗美容'].map(industry => (
                        <button
                          key={industry}
                          onClick={() => handleOptionSelect(industry, 'industry')}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${tempExpectations.industry.includes(industry) 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 教育 */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500">{lang === 'zh' ? '教育' : 'Education'}</div>
                    <div className="flex flex-wrap gap-2">
                      {['高等教育', 'K12教育', '在线教育', '教育科技', '语言培训', '职业教育', '留学服务', '教育出版', '教育咨询', '教育装备'].map(industry => (
                        <button
                          key={industry}
                          onClick={() => handleOptionSelect(industry, 'industry')}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${tempExpectations.industry.includes(industry) 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 其他行业 */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500">{lang === 'zh' ? '其他行业' : 'Other Industries'}</div>
                    <div className="flex flex-wrap gap-2">
                      {['制造业', '零售', '咨询', '房地产', '新能源', '能源', '传媒', '汽车', '航空航天', '化工'].map(industry => (
                        <button
                          key={industry}
                          onClick={() => handleOptionSelect(industry, 'industry')}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${tempExpectations.industry.includes(industry) 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 已选择的行业 */}
                {tempExpectations.industry.length > 0 && !tempExpectations.industry.includes('不限') && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">
                      {lang === 'zh' ? '已选择' : 'Selected'} ({tempExpectations.industry.length}/3)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tempExpectations.industry.map((industry: string) => (
                        <span
                          key={industry}
                          className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary flex items-center gap-1"
                        >
                          {industry}
                          <button
                            onClick={() => {
                              setTempExpectations(prev => ({
                                ...prev,
                                industry: prev.industry.filter((item: string) => item !== industry)
                              }));
                            }}
                            className="hover:text-primary/80"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 导航按钮 */}
            <div className="flex gap-4 justify-between mt-8">
              <button 
                onClick={() => handleQuestionNavigation('prev')}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-md transition-colors ${currentQuestion === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {lang === 'zh' ? '上一步' : 'Previous'}
              </button>
              
              {currentQuestion === 2 ? (
                <button 
                  onClick={handleCompleteJobExpectations}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {lang === 'zh' ? '完成' : 'Complete'}
                </button>
              ) : (
                <button 
                  onClick={() => handleQuestionNavigation('next')}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {lang === 'zh' ? '下一步' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 共享页脚 */}
      <Footer lang={lang} />
    </div>
  );
};

export default ResumeAnalysisPage;