'use client';

import React, { useState, useEffect } from 'react';
import { Job } from '../lib/job-model';

interface EmailDirectEmployerProps {
  job: Job;
  optimizedResume: string;
  originalResume: string;
  coverLetter: string;
  onSendComplete?: (emailId: string) => void;
  lang?: 'zh' | 'en';
}

interface EmailStatus {
  id: string;
  status: 'draft' | 'sending' | 'sent' | 'delivered' | 'opened' | 'replied';
  sentAt: Date;
  openedAt?: Date;
  replyAt?: Date;
  recipientEmail: string;
  subject: string;
}

export const EmailDirectEmployer: React.FC<EmailDirectEmployerProps> = ({ 
  job, 
  optimizedResume, 
  originalResume,
  coverLetter: initialCoverLetter,
  onSendComplete,
  lang = 'zh'
}) => {
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState(initialCoverLetter);
  // 简历选择状态：'original' 或 'optimized'
  const [selectedResumeType, setSelectedResumeType] = useState<'original' | 'optimized'>('optimized');
  
  // 多语言支持
  const translations = {
    zh: {
      emailSubject: `申请：${job.title} - ${new Date().toLocaleDateString('zh-CN')}`,
      recipientEmail: '收件人邮箱',
      emailSubjectLabel: '邮件主题',
      sendEmail: '发送邮件',
      sending: '发送中...',
      sentSuccessfully: '邮件已成功发送！',
      sendEmailInfo: '我们将使用您选择的简历和自动生成的求职信发送邮件。',
      noEmailFound: '未找到该企业的邮箱地址，请手动输入。',
      emailStatus: '邮件状态',
      sentAt: '发送时间',
      delivered: '已送达',
      opened: '已打开',
      replied: '已回复',
      trackEmail: '追踪邮件',
      draft: '草稿',
      sendingStatus: '发送中',
      sent: '已发送',
      pleaseFillEmail: '请填写完整的邮件信息',
      generateCoverLetter: '生成本岗位自荐邮件',
      generatingCoverLetter: '生成中...',
      generatedSuccessfully: '自荐信已生成！',
      resumeSelection: '简历选择',
      originalResume: '原始简历',
      optimizedResume: '优化后的简历',
      originalResumeDescription: '使用您上传的原始简历',
      optimizedResumeDescription: '使用AI优化后的简历',
    },
    en: {
      emailSubject: `Application: ${job.title} - ${new Date().toLocaleDateString('en-US')}`,
      recipientEmail: 'Recipient Email',
      emailSubjectLabel: 'Email Subject',
      sendEmail: 'Send Email',
      sending: 'Sending...',
      sentSuccessfully: 'Email sent successfully!',
      sendEmailInfo: 'We will send the email with your selected resume and automatically generated cover letter.',
      noEmailFound: 'No email address found for this company. Please enter manually.',
      emailStatus: 'Email Status',
      sentAt: 'Sent At',
      delivered: 'Delivered',
      opened: 'Opened',
      replied: 'Replied',
      trackEmail: 'Track Email',
      draft: 'Draft',
      sendingStatus: 'Sending',
      sent: 'Sent',
      pleaseFillEmail: 'Please fill in complete email information',
      generateCoverLetter: 'Generate Cover Letter for This Position',
      generatingCoverLetter: 'Generating...',
      generatedSuccessfully: 'Cover letter generated!',
      resumeSelection: 'Resume Selection',
      originalResume: 'Original Resume',
      optimizedResume: 'Optimized Resume',
      originalResumeDescription: 'Use your uploaded original resume',
      optimizedResumeDescription: 'Use AI-optimized resume',
    }
  };
  
  const t = translations[lang];
  const [emailSubject, setEmailSubject] = useState(t.emailSubject);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [showTracking, setShowTracking] = useState(false);
  
  // 模拟AI生成自荐邮件
  const generateCoverLetterWithAI = async () => {
    setIsGeneratingCoverLetter(true);
    
    // 模拟AI生成过程
    setTimeout(() => {
      // 从简历中提取姓名
      const name = optimizedResume.split('\n')[0]?.split(' | ')[0] || (lang === 'zh' ? '求职者' : 'Applicant');
      // 从简历中提取专业
      const major = optimizedResume.split('\n')[2]?.split(',')[0] || (lang === 'zh' ? '相关专业' : 'Related Major');
      
      // 生成针对该岗位的自荐邮件
      const generatedCoverLetter = lang === 'zh' ? `尊敬的${job.company}招聘负责人：

您好！

我是${name}，一名拥有${major}专业背景的${job.tags.subType}领域研究人员，看到贵公司发布的${job.title}岗位，我非常感兴趣。

通过仔细研究贵公司的岗位要求，我发现我的专业背景和技能与该岗位高度匹配：
1. 我拥有${major}的教育背景，研究方向与贵公司招聘的${job.tags.subType}岗位完全契合
2. 熟练掌握${optimizedResume.split('\n')[2] || '相关技能'}等技能，其中${job.skills.slice(0, 3).join('、')}正是贵岗位要求的核心技能
3. 曾负责${optimizedResume.split('\n')[3]?.split(' | ')[0] || '相关项目'}等项目，项目中应用的核心技术与贵岗位需求高度一致

我相信，凭借我的专业知识、实践经验和研究能力，我能够为贵公司在${job.tags.subType}领域的发展带来价值。期待有机会与您进一步交流，详细介绍我的能力和经验。

此致
敬礼！

${name}
${new Date().toLocaleDateString('zh-CN')}` : `Dear Hiring Manager at ${job.company},

I hope this email finds you well. My name is ${name}, a ${major} professional with extensive experience in ${job.tags.subType}, and I am writing to express my strong interest in the ${job.title} position you have posted.

After carefully reviewing the job requirements, I believe my background and skills align perfectly with what you are looking for:
1. I hold a ${major} degree, with a research focus that directly matches the ${job.tags.subType} position you are recruiting for
2. I am proficient in ${optimizedResume.split('\n')[2] || 'related skills'}, including ${job.skills.slice(0, 3).join(', ')} which are the core skills required for this position
3. I have led ${optimizedResume.split('\n')[3]?.split(' | ')[0] || 'related projects'}, where I applied core technologies that are highly relevant to your job requirements

I am confident that my professional knowledge, practical experience, and research capabilities can bring value to your company's development in the ${job.tags.subType} field. I look forward to the opportunity to further discuss my qualifications with you.

Sincerely,
${name}
${new Date().toLocaleDateString('en-US')}`;
      
      setCoverLetter(generatedCoverLetter);
      setIsGeneratingCoverLetter(false);
    }, 2000);
  };

  // 模拟企业邮箱数据库
  const mockCompanyEmails: Record<string, string> = {
    '北京大学': 'hr@pku.edu.cn',
    '清华大学': 'recruit@tsinghua.edu.cn',
    '腾讯科技': 'ai-recruit@tencent.com',
    '阿里巴巴集团': 'tech-recruit@alibaba.com',
    '百度': 'research-jobs@baidu.com',
    '字节跳动': 'ai-research@bytedance.com'
  };

  // 获取招聘邮箱的状态
  const [isFetchingEmail, setIsFetchingEmail] = useState(false);
  // 是否已经尝试获取过邮箱
  const [emailFetched, setEmailFetched] = useState(false);
  // 咨询窗口显示状态
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // 重置获取状态
  useEffect(() => {
    setEmailFetched(false);
    setRecipientEmail('');
  }, [job]);

  // 从localStorage获取用户的网站邮箱地址
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.internalEmail) {
        setSenderEmail(user.internalEmail);
      } else {
        // 如果没有网站邮箱，显示提示信息
        console.warn('用户尚未生成网站邮箱，请先完成学历验证');
      }
    }
  }, []);

  // 从岗位数据库获取招聘邮箱
  const fetchRecruitmentEmail = () => {
    setIsFetchingEmail(true);
    
    // 模拟从数据库获取邮箱的异步过程
    setTimeout(() => {
      const company = job.company;
      let foundEmail = '';
      
      // 尝试从模拟数据库中获取邮箱
      if (company && mockCompanyEmails[company]) {
        foundEmail = mockCompanyEmails[company];
        setRecipientEmail(foundEmail);
      } else {
        setRecipientEmail('');
      }
      
      // 标记已尝试获取邮箱
      setEmailFetched(true);
      setIsFetchingEmail(false);
    }, 1000);
  };

  // 模拟邮件发送
  const handleSendEmail = async () => {
    if (!recipientEmail || !emailSubject) {
      alert(t.pleaseFillEmail);
      return;
    }

    setIsSending(true);

    // 模拟发送过程
    setTimeout(() => {
      const newEmail: EmailStatus = {
        id: `email-${Date.now()}`,
        status: 'sent',
        sentAt: new Date(),
        recipientEmail,
        subject: emailSubject
      };

      setEmailStatus(newEmail);
      setIsSending(false);

      if (onSendComplete) {
        onSendComplete(newEmail.id);
      }

      // 模拟邮件状态变化
      simulateEmailStatusUpdates(newEmail.id);
    }, 2000);
  };

  // 模拟邮件状态更新
  const simulateEmailStatusUpdates = (emailId: string) => {
    // 模拟邮件送达
    setTimeout(() => {
      setEmailStatus(prev => prev && {
        ...prev,
        status: 'delivered'
      });

      // 模拟邮件被打开
      setTimeout(() => {
        setEmailStatus(prev => prev && {
          ...prev,
          status: 'opened',
          openedAt: new Date()
        });

        // 模拟邮件回复（随机概率）
        if (Math.random() > 0.5) {
          setTimeout(() => {
            setEmailStatus(prev => prev && {
              ...prev,
              status: 'replied',
              replyAt: new Date()
            });
          }, 5000);
        }
      }, 3000);
    }, 1500);
  };

  // 获取状态显示文本和样式
  const getStatusInfo = (status: EmailStatus['status']) => {
    const statusMap = {
      draft: { text: t.draft, color: 'bg-gray-100 text-gray-800', icon: '📝' },
      sending: { text: t.sendingStatus, color: 'bg-blue-100 text-blue-800', icon: '📤' },
      sent: { text: t.sent, color: 'bg-purple-100 text-purple-800', icon: '✅' },
      delivered: { text: t.delivered, color: 'bg-green-100 text-green-800', icon: '📥' },
      opened: { text: t.opened, color: 'bg-yellow-100 text-yellow-800', icon: '👁️' },
      replied: { text: t.replied, color: 'bg-indigo-100 text-indigo-800', icon: '💬' }
    };
    return statusMap[status];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {lang === 'zh' ? `邮件直达雇主 - ${job.title}` : `Email to Employer - ${job.title}`}
        </h2>
        {emailStatus && (
          <button
            onClick={() => setShowTracking(!showTracking)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
          >
            {showTracking ? (lang === 'zh' ? '隐藏跟踪' : 'Hide Tracking') : (lang === 'zh' ? '显示邮件跟踪' : 'Track Email')}
          </button>
        )}
      </div>

      {/* 邮件发送表单 */}
      {!emailStatus && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.recipientEmail}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={lang === 'zh' ? '请输入企业招聘邮箱' : 'Please enter company recruitment email'}
                />
                <button
                  onClick={fetchRecruitmentEmail}
                  disabled={isFetchingEmail}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isFetchingEmail ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {isFetchingEmail ? (lang === 'zh' ? '获取中...' : 'Fetching...') : (lang === 'zh' ? '获取招聘邮箱' : 'Get Recruitment Email')}
                </button>
              </div>
              {emailFetched && !recipientEmail && (
                <p className="mt-1 text-xs text-yellow-600 flex items-center gap-2">
                  {lang === 'zh' ? '企业未提供招聘邮箱，请联系您的' : 'The company has not provided recruitment email, please contact your'}
                  <button
                    onClick={() => setShowConsultationModal(true)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                    aria-label={lang === 'zh' ? '联系猎头顾问' : 'Contact headhunting consultant'}
                  >
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="underline">{lang === 'zh' ? '猎头顾问' : 'headhunting consultant'}</span>
                  </button>
                  .
                </p>
              )}
              {!emailFetched && !recipientEmail && (
                <p className="mt-1 text-xs text-yellow-600">
                  {lang === 'zh' ? '您可以点击按钮获取企业招聘邮箱，或手动输入。' : 'You can click the button to get the company recruitment email, or enter it manually.'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.emailSubjectLabel}
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={lang === 'zh' ? '请输入邮件主题' : 'Please enter email subject'}
              />
            </div>
          </div>

          {/* 发件人邮箱显示 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'zh' ? '发件人邮箱' : 'Sender Email'}
            </label>
            <input
              type="email"
              value={senderEmail}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              placeholder={lang === 'zh' ? '您的网站邮箱' : 'Your website email'}
            />
            {!senderEmail && (
              <p className="mt-1 text-xs text-yellow-600">
                {lang === 'zh' ? '您尚未生成网站邮箱，请先完成学历验证。' : 'You have not generated a website email yet, please complete your degree verification first.'}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                {lang === 'zh' ? '自荐信' : 'Cover Letter'}
              </label>
              <button
                onClick={generateCoverLetterWithAI}
                disabled={isGeneratingCoverLetter}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                aria-label={t.generateCoverLetter}
              >
                {isGeneratingCoverLetter ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>{t.generatingCoverLetter}</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{t.generateCoverLetter}</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              value={coverLetter}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-40"
              placeholder={lang === 'zh' ? '系统自动生成的自荐信' : 'System-generated cover letter'}
            ></textarea>
          </div>

          {/* 简历选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t.resumeSelection}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 原始简历选项 */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedResumeType === 'original' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => setSelectedResumeType('original')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    id="originalResume"
                    name="resumeType"
                    checked={selectedResumeType === 'original'}
                    onChange={() => setSelectedResumeType('original')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="originalResume" className="text-sm font-medium text-gray-800">
                    {t.originalResume}
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  {t.originalResumeDescription}
                </p>
              </div>

              {/* 优化后的简历选项 */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedResumeType === 'optimized' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => setSelectedResumeType('optimized')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    id="optimizedResume"
                    name="resumeType"
                    checked={selectedResumeType === 'optimized'}
                    onChange={() => setSelectedResumeType('optimized')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="optimizedResume" className="text-sm font-medium text-gray-800">
                    {t.optimizedResume}
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  {t.optimizedResumeDescription}
                </p>
              </div>
            </div>
          </div>

          {/* 附件：简历 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'zh' ? '附件：简历' : 'Attachment: Resume'}
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  {/* 生成合适的附件名称：姓名-岗位名称-申请日期 */}
                    <span className="text-sm text-gray-700">
                      {(() => {
                        // 根据选择的简历类型获取简历内容
                        const resumeToUse = selectedResumeType === 'original' ? originalResume : optimizedResume;
                        // 从简历中提取姓名
                        const name = resumeToUse.split('\n')[0]?.split(' | ')[0] || (lang === 'zh' ? '求职者' : 'Applicant');
                        // 生成日期格式：YYYY-MM-DD
                        const date = new Date().toISOString().split('T')[0];
                        // 清理岗位名称中的特殊字符
                        const jobTitle = job.title.replace(/[^\w\u4e00-\u9fa5]/g, '-');
                        // 默认使用PDF格式，实际应用中应从用户选择获取
                        return `${name}-${jobTitle}-${date}.pdf`;
                      })()}
                    </span>
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  {/* 根据选择的简历类型显示大小 */}
                  {Math.ceil((selectedResumeType === 'original' ? originalResume : optimizedResume).length / 1024)} KB
                </span>
              </div>
              {/* 显示当前选择的简历类型 */}
              <div className="mt-2 text-xs text-blue-600">
                {selectedResumeType === 'original' ? t.originalResume : t.optimizedResume}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className={`px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-md hover:from-green-700 hover:to-emerald-700 transition-all ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {t.sending}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t.sendEmail}
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 邮件发送成功和跟踪 */}
      {emailStatus && (
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-green-800">{t.sentSuccessfully}</h3>
                <p className="text-sm text-green-700 mt-1">
                  {lang === 'zh' ? '您的申请邮件已成功发送至' : 'Your application email has been successfully sent to'} {emailStatus.recipientEmail}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {lang === 'zh' ? '发送时间：' : 'Sent at: '}{emailStatus.sentAt.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}
                </p>
              </div>
            </div>
          </div>

          {/* 邮件状态卡片 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800">{t.emailStatus}</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusInfo(emailStatus.status).color}`}>
                  {getStatusInfo(emailStatus.status).icon} {getStatusInfo(emailStatus.status).text}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'zh' ? '收件人' : 'Recipient'}</p>
                  <p className="text-sm font-medium text-gray-800">{emailStatus.recipientEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'zh' ? '邮件主题' : 'Email Subject'}</p>
                  <p className="text-sm font-medium text-gray-800">{emailStatus.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'zh' ? '发送时间' : 'Sent At'}</p>
                  <p className="text-sm font-medium text-gray-800">{emailStatus.sentAt.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</p>
                </div>
                {emailStatus.openedAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{lang === 'zh' ? '打开时间' : 'Opened At'}</p>
                    <p className="text-sm font-medium text-gray-800">{emailStatus.openedAt.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</p>
                  </div>
                )}
                {emailStatus.replyAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{lang === 'zh' ? '回复时间' : 'Replied At'}</p>
                    <p className="text-sm font-medium text-gray-800">{emailStatus.replyAt.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 邮件跟踪详情 */}
          {showTracking && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">{lang === 'zh' ? '邮件跟踪详情' : 'Email Tracking Details'}</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{lang === 'zh' ? '邮件创建' : 'Email Created'}</p>
                    <p className="text-xs text-gray-500">{emailStatus.sentAt.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{lang === 'zh' ? '邮件发送' : 'Email Sent'}</p>
                    <p className="text-xs text-gray-500">{emailStatus.sentAt.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</p>
                  </div>
                </div>
                {emailStatus.status !== 'sent' && (
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">3</div>
                      <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{lang === 'zh' ? '邮件送达' : 'Email Delivered'}</p>
                      <p className="text-xs text-gray-500">{new Date(emailStatus.sentAt.getTime() + 1500).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</p>
                    </div>
                  </div>
                )}
                {['opened', 'replied'].includes(emailStatus.status) && (
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">4</div>
                      <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{lang === 'zh' ? '邮件打开' : 'Email Opened'}</p>
                      <p className="text-xs text-gray-500">{emailStatus.openedAt?.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US') || new Date(emailStatus.sentAt.getTime() + 4500).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</p>
                    </div>
                  </div>
                )}
                {emailStatus.status === 'replied' && (
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">5</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{lang === 'zh' ? '邮件回复' : 'Email Replied'}</p>
                      <p className="text-xs text-gray-500">{emailStatus.replyAt?.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US') || new Date(emailStatus.sentAt.getTime() + 9500).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEmailStatus(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              {lang === 'zh' ? '发送另一封邮件' : 'Send Another Email'}
            </button>
          </div>
        </div>
      )}
      
      {/* 在线岗位咨询窗口 */}
      {showConsultationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {lang === 'zh' ? '在线岗位咨询' : 'Online Job Consultation'}
              </h3>
              <button
                onClick={() => setShowConsultationModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={lang === 'zh' ? '关闭' : 'Close'}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'zh' ? '您的姓名' : 'Your Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={lang === 'zh' ? '请输入您的姓名' : 'Please enter your name'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'zh' ? '联系方式' : 'Contact Information'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={lang === 'zh' ? '请输入您的手机号或邮箱' : 'Please enter your phone or email'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'zh' ? '咨询内容' : 'Consultation Content'}
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                  placeholder={lang === 'zh' ? '请描述您的问题或需求' : 'Please describe your question or requirement'}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConsultationModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    // 处理咨询提交
                    setShowConsultationModal(false);
                    alert(lang === 'zh' ? '咨询已提交，我们将尽快与您联系！' : 'Consultation submitted, we will contact you as soon as possible!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {lang === 'zh' ? '提交咨询' : 'Submit Consultation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};