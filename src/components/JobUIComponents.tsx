'use client';

import React, { useState } from 'react';
import { Job, JobTag, JobCategory, EnterpriseJobSubType } from '../lib/job-model';
import { TagManager, getTagColor } from '../lib/tag-management';
import { Language, getTranslation } from '../lib/i18n';

/**
 * 岗位卡片组件 - 用于显示岗位基本信息
 */
export const JobCard: React.FC<{
  job: Job;
  onRemove?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  showRemoveButton?: boolean;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (job: Job) => void;
  lang?: Language;
}> = ({ 
  job, 
  onRemove, 
  onViewDetails, 
  showRemoveButton = false, 
  showFavoriteButton = false,
  isFavorite = false,
  onToggleFavorite,
  lang = 'zh'
}) => {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const t = getTranslation(lang);
  
  // 组件特定翻译
  const componentTranslations = {
    matchScore: lang === 'zh' ? '匹配度' : 'Match Score',
    location: lang === 'zh' ? '地点:' : 'Location:',
    salary: lang === 'zh' ? '薪资:' : 'Salary:',
    degree: lang === 'zh' ? '学历:' : 'Degree:',
    experience: lang === 'zh' ? '经验:' : 'Experience:',
    moreSkills: lang === 'zh' ? `+{count} 更多技能` : `+{count} more skills`,
    viewDetails: t.jobs.viewDetails,
    removeJob: lang === 'zh' ? '移除岗位' : 'Remove Job',
    confirmRemove: lang === 'zh' ? '确认移除' : 'Confirm Remove',
    cancel: lang === 'zh' ? '取消' : 'Cancel',
    confirmRemoveMessage: lang === 'zh' ? `确定要将「{jobTitle}」从您的私人岗位库中移除吗？` : `Are you sure you want to remove "{jobTitle}" from your private job library?`,
    favorite: lang === 'zh' ? '收藏岗位' : 'Favorite Job',
    unfavorite: lang === 'zh' ? '取消收藏' : 'Unfavorite Job'
  };
  
  const ct = componentTranslations;

  const handleRemoveClick = () => {
    setShowRemoveConfirm(true);
  };

  // 取消移除
  const cancelRemove = () => {
    setShowRemoveConfirm(false);
  };
  
  // 确认移除
  const confirmRemove = () => {
    if (onRemove) {
      onRemove(job.id);
    }
    setShowRemoveConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col min-h-[350px]">
      {/* 标题区域 - 中文：1行，英文及其他：2行 */}
      <div className={`mb-3 ${lang !== 'zh' ? 'h-[52px] flex flex-col' : ''}`}>
        {/* 岗位标题 */}
        <h3 className={`text-lg font-semibold text-gray-800 ${lang === 'zh' ? 'line-clamp-1' : 'line-clamp-2'}`}>
          {job.title}
        </h3>
        
        {/* 英文及其他语言：确保标题区域始终占据2行空间 */}
        {lang !== 'zh' && (
          <div className="flex-grow"></div>
        )}
      </div>
      
      {/* 岗位简介 - 中文：2行，英文及其他：4行 */}
      <div className={`text-sm text-gray-600 mb-6 ${lang === 'zh' ? 'line-clamp-2' : 'line-clamp-4 h-[80px]'}`}>
        {job.description || (lang === 'zh' ? '暂无岗位简介' : 'No job description available')}
      </div>
      
      {/* 岗位基本信息 */}
      <div className="text-sm text-gray-600 mb-3 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{componentTranslations.location}</span>
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{componentTranslations.salary}</span>
          <span>{job.salary || (lang === 'zh' ? '面议' : 'Negotiable')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{componentTranslations.degree}</span>
          <span>{job.degree}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{componentTranslations.experience}</span>
          <span>{job.experience}</span>
        </div>
      </div>
      
      {/* 岗位标签 */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: `${getTagColor(job.tags || { category: JobCategory.ENTERPRISE, subType: EnterpriseJobSubType.AI_RESEARCHER })}20`,
            color: getTagColor(job.tags || { category: JobCategory.ENTERPRISE, subType: EnterpriseJobSubType.AI_RESEARCHER })
          }}
        >
          {TagManager.getTagDisplayName(job.tags || { category: JobCategory.ENTERPRISE, subType: EnterpriseJobSubType.AI_RESEARCHER }, lang)}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {componentTranslations.matchScore} {job.relevanceScore}%
        </span>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex justify-between items-center pt-4 mt-auto">
        <button
          onClick={() => onViewDetails?.(job.id)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
        >
          {componentTranslations.viewDetails}
        </button>
        
        {showRemoveButton && (
          <div>
            {/* 移除按钮 */}
            <button
              onClick={() => setShowRemoveConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-shadow transition-colors text-sm"
            >
              {componentTranslations.removeJob}
            </button>
            
            {/* 移除确认对话框 */}
            {showRemoveConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{componentTranslations.confirmRemove}</h3>
                  <p className="text-gray-600 mb-4">
                    {componentTranslations.confirmRemoveMessage.replace('{jobTitle}', job.title)}
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={cancelRemove}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      {componentTranslations.cancel}
                    </button>
                    <button
                      onClick={confirmRemove}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      {componentTranslations.confirmRemove}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 一键匹配按钮组件 - 带数量限制检查
 */
export const OneClickMatchButton: React.FC<{
  currentJobCount: number;
  maxJobCount: number;
  onMatch: () => void;
  isMatching: boolean;
  disabled?: boolean;
  lang?: 'zh' | 'en';
}> = ({ 
  currentJobCount, 
  maxJobCount, 
  onMatch, 
  isMatching, 
  disabled = false,
  lang = 'zh'
}) => {
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const availableSlots = maxJobCount - currentJobCount;

  const translations = {
    zh: {
      ariaLabel: '一键匹配岗位',
      clickMe: '点我',
      jobLimit: '您的私人岗位已达到上限 {maxJobs} 个',
      jobLimitTitle: '私人岗位已达上限',
      jobLimitMessage: '您的私人岗位库已达到上限 {maxJobs} 个。请先移除部分岗位，然后再继续匹配新岗位。',
      iKnow: '我知道了'
    },
    en: {
      ariaLabel: 'One-click Match Jobs',
      clickMe: 'Click Me',
      jobLimit: 'Your private jobs have reached the limit of {maxJobs} positions',
      jobLimitTitle: 'Private Jobs Limit Reached',
      jobLimitMessage: 'Your private job library has reached the limit of {maxJobs} positions. Please remove some jobs first, then continue matching new jobs.',
      iKnow: 'Got it'
    }
  };

  const t = translations[lang];

  const handleMatchClick = async () => {
    if (availableSlots <= 0) {
      // 显示岗位上限提示
      setShowLimitAlert(true);
    } else {
      try {
        // 导入AI服务
        const { generateJobScrapePrompt, AIPromptType, saveAIPromptToBackend } = await import('../lib/ai-service');
        
        // 获取用户信息
        const storedUser = localStorage.getItem('user');
        const userProfile = storedUser ? JSON.parse(storedUser) : null;
        
        // 生成AI提示词
        const prompt = generateJobScrapePrompt(userProfile, { preferredJobCount: availableSlots });
        
        // 保存提示词到管理后台
        await saveAIPromptToBackend(prompt, AIPromptType.PRIVATE_JOB_SCRAPE, '我的私人岗位抓取提示词');
        
        // 调用onMatch，让父组件处理登录状态和跳转逻辑
        onMatch();
      } catch (error) {
        console.error('AI model initialization failed:', error);
        // 即使AI初始化失败，也继续执行匹配逻辑
        onMatch();
      }
    }
  };

  const closeAlert = () => {
    setShowLimitAlert(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleMatchClick}
        disabled={disabled || isMatching || availableSlots < 0}
        className={`w-48 h-48 rounded-full transition-all flex items-center justify-center shadow-2xl ${
          isMatching 
            ? 'bg-gradient-to-r from-blue-400 to-blue-500 cursor-not-allowed' 
            : availableSlots <= 0 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-3xl hover:scale-105'
        }`}
        aria-label={t.ariaLabel}
      >
        {isMatching ? (
          <svg className="animate-spin h-20 w-20 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg className="h-20 w-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-2xl font-bold text-yellow-300 mt-2">{t.clickMe}</span>
          </div>
        )}
      </button>

      {/* 数量限制提示 */}
      {availableSlots <= 0 && (
        <p className="text-red-500 text-sm mt-4 text-center">
          {t.jobLimit.replace('{maxJobs}', maxJobCount.toString())}
        </p>
      )}

      {/* 岗位上限弹窗 */}
      {showLimitAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{t.jobLimitTitle}</h3>
            <p className="text-gray-600 mb-4">
              {t.jobLimitMessage.replace('{maxJobs}', maxJobCount.toString())}
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeAlert}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                {t.iKnow}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 岗位收藏按钮组件
 */
export const FavoriteButton: React.FC<{
  job: Job;
  isFavorite: boolean;
  onToggleFavorite: (job: Job) => void;
  lang?: 'zh' | 'en';
}> = ({ job, isFavorite, onToggleFavorite, lang = 'zh' }) => {
  const translations = {
    zh: {
      favorite: '收藏岗位',
      unfavorite: '取消收藏'
    },
    en: {
      favorite: 'Favorite Job',
      unfavorite: 'Unfavorite Job'
    }
  };

  const t = translations[lang];

  return (
    <button
      onClick={() => onToggleFavorite(job)}
      className={`p-3 rounded-full transition-all ${
        isFavorite 
          ? 'bg-red-100 text-red-600 hover:bg-red-200 scale-110' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
      }`}
      aria-label={isFavorite ? t.unfavorite : t.favorite}
    >
      <svg 
        className="h-6 w-6" 
        fill={isFavorite ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  );
};

/**
 * 岗位标签组件 - 用于显示岗位分类标签
 */
export const JobTagBadge: React.FC<{ tag: JobTag; lang?: 'zh' | 'en' }> = ({ tag, lang = 'zh' }) => {
  return (
    <span 
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
      style={{ 
        backgroundColor: `${getTagColor(tag)}20`,
        color: getTagColor(tag)
      }}
    >
      {TagManager.getTagDisplayName(tag, lang)}
    </span>
  );
};

/**
 * 岗位统计信息组件
 */
export const JobStatsCard: React.FC<{
  totalJobs: number;
  universityJobs: number;
  enterpriseJobs: number;
  avgRelevanceScore: number;
  remainingSlots: number;
  maxSlots: number;
  lang: Language;
}> = ({ 
  totalJobs, 
  universityJobs, 
  enterpriseJobs, 
  avgRelevanceScore, 
  remainingSlots, 
  maxSlots,
  lang
}) => {
  // 组件特定翻译
  const t = {
    title: lang === 'zh' ? '岗位匹配统计' : 'Job Matching Statistics',
    totalJobs: lang === 'zh' ? '总岗位数' : 'Total Jobs',
    universityJobs: lang === 'zh' ? '大学岗位' : 'University Jobs',
    enterpriseJobs: lang === 'zh' ? '企业岗位' : 'Enterprise Jobs',
    avgRelevanceScore: lang === 'zh' ? '平均匹配度' : 'Avg Match Score',
    privateJobCapacity: lang === 'zh' ? '私人岗位库容量' : 'Private Job Capacity',
    jobs: lang === 'zh' ? '个岗位' : 'positions',
    remainingSlots: lang === 'zh' ? '仅剩 {slots} 个空位' : '{slots} slots remaining'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">{totalJobs}</div>
          <div className="text-sm text-gray-600">{t.totalJobs}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{universityJobs}</div>
          <div className="text-sm text-gray-600">{t.universityJobs}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">{enterpriseJobs}</div>
          <div className="text-sm text-gray-600">{t.enterpriseJobs}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-1">{avgRelevanceScore}</div>
          <div className="text-sm text-gray-600">{t.avgRelevanceScore}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{t.privateJobCapacity}</span>
          <span>{totalJobs}/{maxSlots} {t.jobs}</span>
        </div>
        <div className="text-xs bg-yellow-100 text-yellow-800 p-1 rounded mb-1">
          {lang === 'zh' ? (
            <>
              <a href="/account/membership" className="underline hover:text-yellow-900 transition-colors">
                升级会员可扩容
              </a>
              / 移除现有岗位亦可获得新岗位
            </>
          ) : (
            <>
              <a href="/account/membership" className="underline hover:text-yellow-900 transition-colors">
                Upgrade membership for more slots
              </a>
              / Remove existing jobs to get new slots
            </>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all" 
            style={{ width: `${(totalJobs / maxSlots) * 100}%` }}
          ></div>
        </div>
        {remainingSlots <= 3 && (
          <p className="text-red-500 text-xs mt-1 text-right">
            {t.remainingSlots.replace('{slots}', remainingSlots.toString())}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * 岗位匹配结果提示组件
 */
export const MatchResultAlert: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  lang?: Language;
}> = ({ message, type, onClose, lang = 'zh' }) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  // 组件特定翻译
  const t = {
    success: lang === 'zh' ? '匹配成功' : 'Match Success',
    error: lang === 'zh' ? '匹配失败' : 'Match Failed',
    info: lang === 'zh' ? '提示' : 'Info',
    close: lang === 'zh' ? '关闭提示' : 'Close Alert'
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${typeStyles[type]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">
            {type === 'success' ? t.success : type === 'error' ? t.error : t.info}
          </p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label={t.close}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * 岗位满意度评分组件
 */
export const JobSatisfactionRating: React.FC<{
  jobId: string;
  userId: string;
  currentRating?: number;
  onRatingSubmit: (jobId: string, score: number, feedback?: string) => void;
  lang?: Language;
}> = ({ 
  jobId, 
  userId, 
  currentRating, 
  onRatingSubmit, 
  lang = 'zh' 
}) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(!!currentRating);

  // 组件特定翻译
  const t = {
    title: lang === 'zh' ? '满意度评分' : 'Satisfaction Rating',
    description: lang === 'zh' ? '请对这个岗位的匹配度和质量进行评分' : 'Please rate the match quality and relevance of this job',
    stars: lang === 'zh' ? '星级评分' : 'Star Rating',
    feedback: lang === 'zh' ? '详细反馈（可选）' : 'Detailed Feedback (Optional)',
    submit: lang === 'zh' ? '提交评分' : 'Submit Rating',
    submitted: lang === 'zh' ? '已评分' : 'Rated',
    thankYou: lang === 'zh' ? '感谢您的反馈！' : 'Thank you for your feedback!',
    veryPoor: lang === 'zh' ? '很差' : 'Very Poor',
    poor: lang === 'zh' ? '较差' : 'Poor',
    average: lang === 'zh' ? '一般' : 'Average',
    good: lang === 'zh' ? '良好' : 'Good',
    excellent: lang === 'zh' ? '优秀' : 'Excellent'
  };

  const handleStarClick = (score: number) => {
    if (!isSubmitted) {
      setRating(score);
    }
  };

  const handleSubmit = async () => {
    if (rating > 0 && !isSubmitting && !isSubmitted) {
      setIsSubmitting(true);
      try {
        onRatingSubmit(jobId, rating, feedback);
        setIsSubmitted(true);
      } catch (error) {
        console.error('Error submitting rating:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStarLabel = (score: number) => {
    switch (score) {
      case 1: return t.veryPoor;
      case 2: return t.poor;
      case 3: return t.average;
      case 4: return t.good;
      case 5: return t.excellent;
      default: return '';
    }
  };

  return (
    <div className="mt-4">
      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-green-800">{getStarLabel(rating)}</span>
          </div>
          <p className="mt-2 text-sm text-green-700">{t.thankYou}</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">{t.title}</h4>
          <p className="text-xs text-gray-500 mb-4">{t.description}</p>
          
          {/* 星级评分 */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">{t.stars}</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="focus:outline-none"
                  aria-label={`${getStarLabel(star)} - ${star} star${star === 1 ? '' : 's'}`}
                >
                  <svg
                    className={`h-6 w-6 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-gray-700">{getStarLabel(rating)}</span>
              )}
            </div>
          </div>
          
          {/* 详细反馈 */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">{t.feedback}</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
              rows={3}
              placeholder={lang === 'zh' ? '请输入您的详细反馈...' : 'Please enter your detailed feedback...'}
            />
          </div>
          
          {/* 提交按钮 */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${rating === 0 || isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {lang === 'zh' ? '提交中...' : 'Submitting...'}
              </div>
            ) : (
              t.submit
            )}
          </button>
        </div>
      )}
    </div>
  );
};