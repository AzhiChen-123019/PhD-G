'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JobCard, JobStatsCard, JobSatisfactionRating } from '../../components/JobUIComponents';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTitle from '@/components/PageTitle';
import { Job, JobLibraryType, JobStatus, UserPrivateJob } from '../../lib/job-model';
import { getJobStatistics } from '../../lib/job-management';
import { JobStorageManager } from '../../lib/job-storage';

const PrivateJobsPage: React.FC = () => {
  const router = useRouter();
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  // 组件挂载后从localStorage获取语言设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      if (savedLang === 'zh' || savedLang === 'en') {
        setLang(savedLang);
      }
    }
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  
  // 私人岗位管理状态
  const [currentUserId, setCurrentUserId] = useState<string>('user123'); // 临时用户ID，实际应从登录状态获取
  const [privateJobs, setPrivateJobs] = useState<Job[]>([]);
  const [userPrivateJobs, setUserPrivateJobs] = useState<UserPrivateJob[]>([]);
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    universityJobs: 0,
    enterpriseJobs: 0,
    avgRelevanceScore: 0,
    remainingSlots: 10 // 默认最大私人岗位数
  });

  // 当语言变化时，保存到localStorage
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
    }
  }, [lang]);

  // 当组件加载时，初始化数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 加载用户私人岗位并按匹配度排序
      const userPrivateJobsData = JobStorageManager.getUserPrivateJobs(currentUserId);
      setUserPrivateJobs(userPrivateJobsData);
      
      const sortedJobs = userPrivateJobsData
        .map(item => item.job)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
      setPrivateJobs(sortedJobs);
      
      // 更新岗位统计
      setJobStats(getJobStatistics(userPrivateJobsData));
    }
  }, [currentUserId]);

  // 当私人岗位变化时，更新统计信息
  useEffect(() => {
    const userPrivateJobsData = JobStorageManager.getUserPrivateJobs(currentUserId);
    setUserPrivateJobs(userPrivateJobsData);
    setJobStats(getJobStatistics(userPrivateJobsData));
  }, [privateJobs, currentUserId]);
  
  // 添加岗位移除功能
  const handleRemoveJob = (jobId: string) => {
    // 从私人岗位库移除岗位
    const success = JobStorageManager.removeJobFromPrivateLibrary(currentUserId, jobId);
    if (success) {
      // 更新本地状态，按匹配度排序
      const updatedPrivateJobs = JobStorageManager.getUserPrivateJobs(currentUserId);
      setUserPrivateJobs(updatedPrivateJobs);
      
      const sortedJobs = updatedPrivateJobs
        .map(item => item.job)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
      setPrivateJobs(sortedJobs);
      console.log('岗位已成功移除');
    }
  };

  // 处理满意度评分提交
  const handleRatingSubmit = (jobId: string, score: number, feedback?: string) => {
    // 提交评分
    const success = JobStorageManager.rateJobSatisfaction(currentUserId, jobId, score, feedback);
    if (success) {
      // 更新本地状态
      const updatedPrivateJobs = JobStorageManager.getUserPrivateJobs(currentUserId);
      setUserPrivateJobs(updatedPrivateJobs);
      console.log('评分提交成功');
    }
  };

  const translations = {
    zh: {
      pageTitle: '我的私人岗位列表',
      matchJobs: '一键匹配岗位',
      matchingJobsList: '匹配岗位列表',
      noMatchingJobs: '暂无匹配岗位',
      clickButtonToMatch: '点击上方按钮开始匹配高质量岗位',
      viewDetails: '查看详情',
    },
    en: {
      pageTitle: 'My Private Jobs List',
      matchJobs: 'One-click Match Jobs',
      matchingJobsList: 'Matching Jobs List',
      noMatchingJobs: 'No matching jobs yet',
      clickButtonToMatch: 'Click the button above to start matching high-quality jobs',
      viewDetails: 'View Details',
    },
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
      />

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.pageTitle}</h1>
        </div>

        {/* 返回按钮 - 固定浮动显示 */}
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => router.push('/private')}
            className="w-14 h-14 bg-primary text-white rounded-full hover:bg-primary/90 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
            aria-label={lang === 'zh' ? '返回我的私人岗位' : 'Return to My Private Positions'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* 友情提示：未上传简历 */}
        {!hasUploadedResume && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
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

        <div className="space-y-6">
          {/* 岗位统计卡片 */}
        <JobStatsCard
          totalJobs={jobStats.totalJobs}
          universityJobs={jobStats.universityJobs}
          enterpriseJobs={jobStats.enterpriseJobs}
          avgRelevanceScore={jobStats.avgRelevanceScore}
          remainingSlots={jobStats.remainingSlots}
          maxSlots={10}
          lang={lang}
        />
          
          {/* 匹配岗位列表 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{t.matchingJobsList}</h2>
            
            {privateJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {privateJobs.map((job) => {
                  // 获取当前岗位的用户私人岗位信息（包含评分）
                  const userPrivateJob = userPrivateJobs.find(item => item.jobId === job.id);
                  const currentRating = userPrivateJob?.satisfactionScore;
                  
                  return (
                    <div key={job.id} className="space-y-4">
                      <JobCard
                        job={job}
                        onRemove={handleRemoveJob}
                        showRemoveButton={true}
                        onViewDetails={(jobId) => {
                          router.push(`/job/${jobId}`);
                        }}
                        lang={lang}
                      />
                      <JobSatisfactionRating
                        jobId={job.id}
                        userId={currentUserId}
                        currentRating={currentRating}
                        onRatingSubmit={handleRatingSubmit}
                        lang={lang}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">{t.noMatchingJobs}</p>
                <p className="text-gray-500 text-sm">{t.clickButtonToMatch}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 页脚 */}
      {/* 共享页脚 */}
      <Footer lang={lang} />
    </div>
  );
};

export default PrivateJobsPage;