'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AIResumeOptimizer } from '../../../components/AIResumeOptimizer';
import { EmailDirectEmployer } from '../../../components/EmailDirectEmployer';
import { JobStorageManager } from '../../../lib/job-storage';
import { Job } from '../../../lib/job-model';

// 模拟简历内容
const mockResumeContent = `张三 | 计算机科学博士 | 13800138000 | zhangsan@example.com
清华大学 | 计算机科学与技术 | 博士学位 | 2020-2025
Python, Java, 机器学习, 深度学习, 计算机视觉
AI图像识别系统开发 | 负责人 | 2023-2024
发表SCI论文5篇，EI论文3篇`;

export default function OptimizeResumePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams ? searchParams.get('jobId') || '' : '';
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [optimizedResume, setOptimizedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [step, setStep] = useState(1); // 1: 简历优化, 2: 邮件发送

  // 加载岗位数据
  useEffect(() => {
    console.log('优化简历页面：jobId =', jobId);
    
    if (jobId) {
      setIsLoading(true);
      
      try {
        // 从本地存储获取岗位数据
        const allJobs = JobStorageManager.getAllJobs();
        console.log('优化简历页面：获取到所有岗位数量 =', allJobs.length);
        
        const foundJob = allJobs.find(j => j.id === jobId);
        
        if (foundJob) {
          console.log('优化简历页面：找到岗位 =', foundJob.title);
          setJob(foundJob);
        } else {
          // 检查私人岗位
          const privateJobs = JobStorageManager.getUserPrivateJobs('user123');
          console.log('优化简历页面：私人岗位数量 =', privateJobs.length);
          const privateJob = privateJobs.find(item => item.job.id === jobId);
          
          if (privateJob) {
            console.log('优化简历页面：从私人岗位找到 =', privateJob.job.title);
            setJob(privateJob.job);
          } else {
            console.log('优化简历页面：未找到岗位，跳回私人岗位页面');
            // 如果找不到岗位，跳回私人岗位页面
            router.push('/private');
          }
        }
      } catch (error) {
        console.error('优化简历页面：加载岗位数据出错:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('优化简历页面：jobId为空，跳回私人岗位页面');
      router.push('/private');
    }
  }, [jobId, router]);

  // 处理简历优化完成
  const handleOptimizeComplete = (optimized: string, letter: string) => {
    setOptimizedResume(optimized);
    setCoverLetter(letter);
  };

  // 处理邮件发送完成
  const handleSendComplete = (emailId: string) => {
    // 可以在这里添加成功处理逻辑
    console.log('邮件发送成功，ID:', emailId);
  };

  // 下一步
  const handleNextStep = () => {
    setStep(2);
  };

  // 上一步
  const handlePrevStep = () => {
    setStep(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">加载岗位信息中...</p>
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
            <p className="text-gray-600 mb-4">未找到指定岗位</p>
            <button 
              onClick={() => router.push('/private')}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              返回私人岗位
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0 flex items-center">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Unique%20tech%20logo%20for%20PhD%20job%20platform%2C%20futuristic%20design%20with%20hexagon%20and%20upward%20arrow%2C%20purple%20and%20blue%20gradient%2C%20minimalist%20style%2C%20not%20similar%20to%20Baidu%20Netdisk%20logo%2C%20clean%20white%20background%2C%20professional%20and%20distinctive&image_size=square_hd" alt="博智匹配" className="h-10 w-10 mr-2" />
                <span className="text-xl font-bold text-primary">博智匹配</span>
              </a>
            </div>
            <div className="flex items-center">
              <a 
                href="/private" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
              >
                返回私人岗位
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* 步骤导航 */}
          <div className="mb-8">
            <div className="flex justify-center items-center space-x-8">
              <div className={`flex flex-col items-center ${step === 1 ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="mt-2 text-sm font-medium">AI优化简历</span>
              </div>
              <div className={`w-20 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`flex flex-col items-center ${step === 2 ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="mt-2 text-sm font-medium">邮件直达雇主</span>
              </div>
            </div>
          </div>

          {/* 岗位信息卡片 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h1>
            <div className="text-gray-600 mb-4">
              {job.company} | {job.location} | 匹配度 {job.relevanceScore}%
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {skill}
                </span>
              ))}
              {job.skills.length > 5 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  +{job.skills.length - 5} 更多
                </span>
              )}
            </div>
          </div>

          {/* 主要内容 */}
          <div className="space-y-6">
            {/* 步骤1：AI优化简历 */}
            {step === 1 && (
              <div className="space-y-6">
                <AIResumeOptimizer 
                  job={job} 
                  resumeContent={mockResumeContent}
                  onOptimizeComplete={handleOptimizeComplete}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleNextStep}
                    disabled={!optimizedResume}
                    className={`px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-all ${!optimizedResume ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    下一步：发送邮件
                  </button>
                </div>
              </div>
            )}

            {/* 步骤2：邮件直达雇主 */}
            {step === 2 && (
              <div className="space-y-6 pb-12">
                <EmailDirectEmployer 
                  job={job} 
                  optimizedResume={optimizedResume}
                  originalResume={mockResumeContent}
                  coverLetter={coverLetter}
                  onSendComplete={handleSendComplete}
                />
                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
                  >
                    返回优化简历
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}