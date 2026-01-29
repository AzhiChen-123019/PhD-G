'use client';

import React, { useState, useEffect } from 'react';
import { scrapeJobs, batchAnalyzeJobs } from '../../lib/ai-job-matching-complete';
import { useRouter } from 'next/navigation';
import { JobCard, OneClickMatchButton, JobStatsCard } from '../../components/JobUIComponents';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Job, JobLibraryType, JobStatus } from '../../lib/job-model';
import { JobManager, JOB_MANAGEMENT_CONSTANTS, getJobStatistics } from '../../lib/job-management';
import { JobStorageManager, createSampleJobs } from '../../lib/job-storage';
import { TagManager } from '../../lib/tag-management';

const PrivatePositionsPage: React.FC = () => {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [lang, setLang] = useState<'zh' | 'en'>(() => {
    // 从localStorage获取语言设置，如果没有则默认为中文
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      return (savedLang === 'zh' || savedLang === 'en') ? savedLang : 'zh';
    }
    return 'zh';
  });
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  
  // 私人岗位管理状态
  const [currentUserId, setCurrentUserId] = useState<string>('user123'); // 临时用户ID，实际应从登录状态获取
  const [privateJobs, setPrivateJobs] = useState<Job[]>([]);
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    universityJobs: 0,
    enterpriseJobs: 0,
    avgRelevanceScore: 0,
    remainingSlots: JOB_MANAGEMENT_CONSTANTS.MAX_PRIVATE_JOBS
  });

  // 当语言变化时，保存到localStorage并更新示例数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
      
      // 从localStorage获取用户信息
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(user.username || 'User');
        setHasUploadedResume(user.hasUploadedResume || false);
        // 设置当前用户ID
        setCurrentUserId(user.id || 'user123');
      }

      // 当语言变化时，重新初始化示例数据
      JobStorageManager.initializeSampleData(createSampleJobs(lang));
    }
  }, [lang]);

  // 当组件加载时，初始化数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 初始化示例数据
      JobStorageManager.initializeSampleData(createSampleJobs(lang));
      
      // 加载用户私人岗位
      const userPrivateJobs = JobStorageManager.getUserPrivateJobs(currentUserId);
      setPrivateJobs(userPrivateJobs.map(item => item.job));
      
      // 更新岗位统计
      setJobStats(getJobStatistics(userPrivateJobs));
      
      // 检查上传简历状态和登录状态
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(user.username || 'User');
        setHasUploadedResume(user.hasUploadedResume || false);
        // 设置当前用户ID
        setCurrentUserId(user.id || 'user123');
      } else {
        // 用户未登录
        setIsLoggedIn(false);
        setHasUploadedResume(false);
      }
    }
  }, [currentUserId, lang]);

  // 当私人岗位变化时，更新统计信息
  useEffect(() => {
    const userPrivateJobs = JobStorageManager.getUserPrivateJobs(currentUserId);
    setJobStats(getJobStatistics(userPrivateJobs));
  }, [privateJobs, currentUserId]);

  const translations = {
    zh: {
      buttons: {
        oneClickMatch: '一键匹配岗位',
      },
      pageTitle: '我的私人岗位',
      viewDetails: '查看详情',
      matchScore: '匹配度',
      postedTime: '发布时间',
      jobStats: '职位匹配统计',
      overallMatch: '总体匹配度',
      skillMatch: '技能匹配度',
      educationMatch: '学历匹配度',
      experienceMatch: '经验匹配度',
      hotSkills: '热门技能需求',
      matchingButtonLabel: '一键匹配岗位',
      matchingRules: {
        title: '智能匹配优势',
        rule1: '精选高质量岗位：只匹配推荐4星级以上岗位，帮您节省筛选时间',
        rule2: 'AI精准匹配：基于您的求职期望、核心竞争力全网实时精准匹配',
        rule3: '实时更新：随时点击按钮获取最新岗位，不错过任何机会',
        rule4: '增值服务：支持智能简历优化、可邮件直达雇主'
      }
    },
    en: {
      buttons: {
        oneClickMatch: 'One-click Match Jobs',
      },
      pageTitle: 'My Private Positions',
      viewDetails: 'View Details',
      matchScore: 'Match Score',
      postedTime: 'Posted Time',
      jobStats: 'Job Matching Statistics',
      overallMatch: 'Overall Match',
      skillMatch: 'Skill Match',
      educationMatch: 'Education Match',
      experienceMatch: 'Experience Match',
      hotSkills: 'Hot Skills Demand',
      matchingButtonLabel: 'One-click Match Jobs',
      matchingRules: {
        title: 'Smart Matching Advantages',
        rule1: 'High-quality Positions: Only match and recommend 4-star and above positions, saving you screening time',
        rule2: 'AI Precise Matching: Real-time precise matching across the entire network based on your job expectations and core competitiveness',
        rule3: 'Real-time Updates: Click anytime to get the latest positions, never miss an opportunity',
        rule4: 'Value-added Services: Support AI resume optimization, direct email to employers'
      }
    }
  };

  // 修改后的岗位匹配函数
  const fetchRealTimeJobs = async () => {
    setIsFetching(true);
    
    try {
      // 获取可匹配的公共岗位
      const matchableJobs = JobStorageManager.getMatchablePublicJobs(currentUserId);
      
      // 获取用户简历信息（这里使用模拟数据，实际应从API或localStorage获取）
      // 从localStorage获取用户信息和简历
      const storedUser = localStorage.getItem('user');
      const userProfile = storedUser ? JSON.parse(storedUser) : null;
      
      // 获取用户级别，确定可抓取的岗位数量上限
      let maxResults = JOB_MANAGEMENT_CONSTANTS.MATCH_BATCH_SIZE;
      
      if (userProfile && userProfile.membershipLevel) {
        // 导入会员配置
        const { getMembershipPlan } = await import('../../lib/membership');
        const membershipPlan = getMembershipPlan(userProfile.membershipLevel);
        
        // 计算可用的私人岗位数量
        const availableSlots = membershipPlan.services.privateJobLimit - privateJobs.length;
        
        // 设置抓取数量为可用槽位和默认批次大小的较小值
        maxResults = Math.min(availableSlots, JOB_MANAGEMENT_CONSTANTS.MATCH_BATCH_SIZE);
      }
      
      // 调用岗位抓取函数获取新岗位，传入用户简历信息
      const scrapedJobs = await scrapeJobs({
        keywords: ['人工智能', '机器学习', '深度学习', '算法'],
        degreeLevels: ['博士', 'PhD'],
        maxResults: maxResults,
        minRating: 4.0,
        maxDuration: 8000,
        userProfile: userProfile // 传递用户简历信息
      });
      
      // 使用AI分析岗位，传入用户简历信息
      const analyzedJobs = await batchAnalyzeJobs(scrapedJobs, userProfile);
      
      // 将新抓取的岗位添加到公共岗位库，去重处理
      const allJobs = JobStorageManager.getAllJobs();
      const existingJobIds = new Set(allJobs.map(j => j.id));
      
      analyzedJobs.forEach(job => {
        // 检查岗位是否已存在
        if (!existingJobIds.has(job.id)) {
          // 为岗位分配标签
          const tag = TagManager.autoAssignTag(job);
          
          // 添加到公共岗位库
          JobStorageManager.addJob({
            ...job,
            tags: tag,
            libraryType: JobLibraryType.PUBLIC,
            status: JobStatus.ACTIVE,
            isMatched: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 默认30天后过期
            requirements: [], // 直接设置为空数组
            benefits: [] // 直接设置为空数组
          });
          
          // 更新已存在岗位ID集合
          existingJobIds.add(job.id);
        }
      });
      
      // 获取最新的可匹配岗位
      const updatedMatchableJobs = JobStorageManager.getMatchablePublicJobs(currentUserId);
      
      // 获取当前私人岗位
      const currentPrivateJobs = JobStorageManager.getUserPrivateJobs(currentUserId);
      
      // 检查匹配可行性
      const feasibility = JobManager.checkMatchFeasibility(currentPrivateJobs.length);
      
      if (feasibility.canMatch) {
        // 过滤4星级以上的岗位
        const highQualityJobs = updatedMatchableJobs.filter(job => (job.rating || 0) >= 4);
        
        // 执行岗位匹配
        const matchResult = JobManager.performJobMatching(
          {
            userId: currentUserId,
            resumeId: userProfile?.resume?.id || '',
            matchCount: feasibility.availableSlots
          },
          currentPrivateJobs,
          highQualityJobs
        );
        
        // 将匹配到的岗位添加到私人岗位库
        matchResult.matchedJobs.forEach(job => {
          JobStorageManager.addJobToPrivateLibrary(currentUserId, job);
        });
        
        // 更新本地状态
        const updatedPrivateJobs = JobStorageManager.getUserPrivateJobs(currentUserId);
        setPrivateJobs(updatedPrivateJobs.map(item => item.job));
        
        console.log(matchResult.message);
      }
    } catch (error) {
      console.error('岗位抓取失败:', error);
    } finally {
      setIsFetching(false);
      // 匹配完成后跳转到私人岗位列表页面
      router.push('/private-jobs');
    }
  };

  // 添加岗位移除功能
  const handleRemoveJob = (jobId: string) => {
    // 从私人岗位库移除岗位
    const success = JobStorageManager.removeJobFromPrivateLibrary(currentUserId, jobId);
    if (success) {
      // 更新本地状态
      const updatedPrivateJobs = JobStorageManager.getUserPrivateJobs(currentUserId);
      setPrivateJobs(updatedPrivateJobs.map(item => item.job));
      console.log('岗位已成功移除');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
      />



      <div className="container mx-auto px-4 py-8">
        {/* 突出显示的操作按钮区域 - 页面中心 */}
        <div className="text-center mb-16 mt-4">
          {/* 一键匹配按钮 */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-12 mt-4">
              {translations[lang].matchingButtonLabel}
            </h3>
            
            <div className="mb-16">
              <OneClickMatchButton
                    currentJobCount={jobStats.totalJobs}
                    maxJobCount={JOB_MANAGEMENT_CONSTANTS.MAX_PRIVATE_JOBS}
                    onMatch={() => {
                      // 检查用户登录状态
                      if (!isLoggedIn) {
                        // 未登录用户，跳转到注册页
                        window.location.href = '/register';
                        return;
                      }
                      
                      // 已登录用户检查是否上传简历
                      if (!hasUploadedResume) {
                        // 已注册但未上传简历，跳转到首页上传区域
                        window.location.href = '/#upload-resume';
                        return;
                      }
                      
                      // 已登录且已上传简历，执行匹配逻辑
                      console.log('One-click match jobs button clicked');
                      fetchRealTimeJobs();
                    }}
                    isMatching={isFetching}
                    disabled={isFetching}
                    lang={lang}
                  />
            </div>
            
            {/* 智能匹配优势 */}
            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-10 text-left leading-tight">
                {translations[lang].matchingRules.title}
              </h3>
              
              {/* 精致列表设计 */}
              <div className="relative">
                {/* 垂直分隔线 */}
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* 优势项 */}
                <div className="relative pl-12 pb-8 last:pb-0">
                  {/* 数字徽章 */}
                  <div className="absolute left-0 top-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm z-10">1</div>
                  
                  {/* 内容卡片 */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <span className="mr-3 text-lg">✨</span>
                      <p className="text-base text-gray-800 leading-relaxed">
                        {translations[lang].matchingRules.rule1}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative pl-12 pb-8 last:pb-0">
                  <div className="absolute left-0 top-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm z-10">2</div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <span className="mr-3 text-lg">🎯</span>
                      <p className="text-base text-gray-800 leading-relaxed">
                        {translations[lang].matchingRules.rule2}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative pl-12 pb-8 last:pb-0">
                  <div className="absolute left-0 top-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm z-10">3</div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <span className="mr-3 text-lg">🚀</span>
                      <p className="text-base text-gray-800 leading-relaxed">
                        {translations[lang].matchingRules.rule3}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative pl-12 pb-8 last:pb-0">
                  <div className="absolute left-0 top-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm z-10">4</div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <span className="mr-3 text-lg">💡</span>
                      <p className="text-base text-gray-800 leading-relaxed">
                        {translations[lang].matchingRules.rule4}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 友情提示：未上传简历 */}
        {!hasUploadedResume && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {lang === 'zh' ? '友情提示：仅上传完整简历后可订阅私人岗位。上传简历后，系统将为您提供更精准的岗位推荐。' : 'Friendly reminder: You can subscribe to private positions only after uploading a complete resume. After uploading your resume, the system will provide you with more accurate job recommendations.'}
                </p>
                <button 
                  onClick={() => {
                    // 导航到首页上传区域
                    window.location.href = '/#upload-resume';
                  }}
                  className="mt-2 text-sm text-yellow-800 hover:text-yellow-600 font-medium"
                >
                  {lang === 'zh' ? '立即上传简历' : 'Upload resume now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 查看匹配结果按钮 */}
        {hasUploadedResume && privateJobs.length > 0 && (
          <div className="text-center mt-12 mb-20">
            <button 
              onClick={() => {
                router.push('/private-jobs');
              }}
              className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {lang === 'zh' ? '查看匹配结果' : 'View Matching Results'}
            </button>
          </div>
        )}
      </div>

      {/* 共享页脚 */}
      <Footer lang={lang} />
    </div>
  );
};

export default PrivatePositionsPage;