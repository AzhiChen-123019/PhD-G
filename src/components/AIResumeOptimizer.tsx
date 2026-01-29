'use client';

import React, { useState, useEffect } from 'react';
import { Job } from '../lib/job-model';
import { ResumeTemplate } from '../lib/resume-templates';
import ResumeTemplateSelector from './ResumeTemplateSelector';

interface ResumeSection {
  title: string;
  content: string;
  originalContent: string;
  isOptimized: boolean;
}

interface AIResumeOptimizerProps {
  job: Job;
  resumeContent: string;
  onOptimizeComplete?: (optimizedResume: string, coverLetter: string) => void;
}

export const AIResumeOptimizer: React.FC<AIResumeOptimizerProps> = ({ 
  job, 
  resumeContent, 
  onOptimizeComplete 
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedSections, setOptimizedSections] = useState<ResumeSection[]>([]);
  const [resumeMatchScore, setResumeMatchScore] = useState(0);
  const [optimizationExplanations, setOptimizationExplanations] = useState<Record<string, string>>({});
  const [showOriginal, setShowOriginal] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);

  // 模拟简历分段
  const mockResumeSections: ResumeSection[] = [
    {
      title: '个人信息',
      content: resumeContent.split('\n')[0] || '张三 | 计算机科学博士 | 13800138000 | zhangsan@example.com',
      originalContent: resumeContent.split('\n')[0] || '张三 | 计算机科学博士 | 13800138000 | zhangsan@example.com',
      isOptimized: true
    },
    {
      title: '教育背景',
      content: resumeContent.split('\n')[1] || '清华大学 | 计算机科学与技术 | 博士学位 | 2020-2025',
      originalContent: resumeContent.split('\n')[1] || '清华大学 | 计算机科学与技术 | 博士学位 | 2020-2025',
      isOptimized: true
    },
    {
      title: '专业技能',
      content: resumeContent.split('\n')[2] || 'Python, Java, 机器学习, 深度学习, 计算机视觉',
      originalContent: resumeContent.split('\n')[2] || 'Python, Java, 机器学习, 深度学习, 计算机视觉',
      isOptimized: true
    },
    {
      title: '项目经验',
      content: resumeContent.split('\n')[3] || 'AI图像识别系统开发 | 负责人 | 2023-2024',
      originalContent: resumeContent.split('\n')[3] || 'AI图像识别系统开发 | 负责人 | 2023-2024',
      isOptimized: true
    },
    {
      title: '科研成果',
      content: resumeContent.split('\n')[4] || '发表SCI论文5篇，EI论文3篇',
      originalContent: resumeContent.split('\n')[4] || '发表SCI论文5篇，EI论文3篇',
      isOptimized: true
    }
  ];

  useEffect(() => {
    setOptimizedSections(mockResumeSections);
  }, [resumeContent]);

  // 模拟AI优化逻辑
  const mockAIOptimization = (section: ResumeSection, job: Job): string => {
    const optimizedContents: Record<string, string> = {
      '个人信息': `${section.content} | ${job.tags.subType}专家`,
      '教育背景': section.content + ` | 研究方向：${job.tags.subType}`,
      '专业技能': `${section.content}, ${job.skills.slice(0, 3).join(', ')}`,
      '项目经验': `${section.content} | 核心技术：${job.skills.slice(0, 2).join(', ')} | 与${job.title}岗位高度匹配`,
      '科研成果': section.content + ` | 研究领域与${job.company}需求契合`
    };
    return optimizedContents[section.title] || section.content;
  };

  // 模拟生成自荐信
  const mockGenerateCoverLetter = (job: Job): string => {
    // 从岗位技能中提取关键技能
    const keySkills = job.skills.slice(0, 3);
    
    return `尊敬的${job.company}招聘负责人：

您好！

我是${mockResumeSections[0].content.split(' | ')[0]}，一名${mockResumeSections[0].content.split(' | ')[1]}，在${job.tags.subType}领域拥有丰富的研究和实践经验。

看到贵公司发布的${job.title}岗位，我非常感兴趣。通过仔细研究岗位要求，我发现我的专业背景和技能与该岗位高度匹配，具体匹配点如下：

1. 【教育背景匹配】我拥有${mockResumeSections[1].content}的教育背景，研究方向与贵公司招聘的${job.tags.subType}岗位完全契合
2. 【核心技能匹配】熟练掌握${mockResumeSections[2].content}等技能，其中${keySkills.join('、')}正是贵岗位要求的核心技能
3. 【项目经验匹配】曾负责${mockResumeSections[3].content}等项目，项目中应用的核心技术与贵岗位需求高度一致
4. 【科研成果匹配】在相关领域发表了多篇高水平学术论文，研究领域与${job.company}的业务方向契合

我相信，凭借我的专业知识、实践经验和研究能力，我能够为贵公司在${job.tags.subType}领域的发展带来价值。期待有机会与您进一步交流，详细介绍我的能力和经验。

此致
敬礼！

${mockResumeSections[0].content.split(' | ')[0]}
${mockResumeSections[0].content.split(' | ')[3]}`;
  };

  // 执行AI优化
  const handleOptimize = async () => {
    setIsOptimizing(true);

    // 模拟AI处理延迟
    setTimeout(() => {
      const optimized = mockResumeSections.map(section => ({
        ...section,
        content: mockAIOptimization(section, job),
        isOptimized: true
      }));
      
      // 计算匹配度评分（85-95之间的随机数）
      const matchScore = Math.floor(Math.random() * 11) + 85;
      
      // 生成优化说明
      const explanations: Record<string, string> = {
        '个人信息': `添加了"${job.tags.subType}专家"标签，突出与岗位的专业匹配度，便于招聘方快速识别`,
        '教育背景': `补充了"研究方向：${job.tags.subType}"，明确展示与岗位需求的研究领域一致性`,
        '专业技能': `添加了岗位要求的核心技能：${job.skills.slice(0, 3).join(', ')}，强化技能匹配度`,
        '项目经验': `突出了"核心技术：${job.skills.slice(0, 2).join(', ')}"，并明确标注"与${job.title}岗位高度匹配"，增强项目与岗位的关联性`,
        '科研成果': `补充了"研究领域与${job.company}需求契合"，强调科研背景与企业需求的匹配性`
      };
      
      setOptimizedSections(optimized);
      setResumeMatchScore(matchScore);
      setOptimizationExplanations(explanations);
      setIsOptimizing(false);
      
      if (onOptimizeComplete) {
        const optimizedResume = optimized.map(s => `${s.title}: ${s.content}`).join('\n');
        onOptimizeComplete(optimizedResume, '');
      }
    }, 1500);
  };

  // 重置为原始简历
  const handleReset = () => {
    setOptimizedSections(mockResumeSections.map(section => ({
      ...section,
      content: section.originalContent,
      isOptimized: false
    })));
    setResumeMatchScore(0);
    setOptimizationExplanations({});
    setSelectedTemplate(null);
  };

  // 处理生成简历
  const handleGenerateResume = async (template: ResumeTemplate, format: 'word' | 'pdf') => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    setIsOptimizing(true);

    try {
      // 生成简历内容
      const resumeContent = optimizedSections.map(s => `${s.title}: ${s.content}`).join('\n');
      const userName = mockResumeSections[0].content.split(' | ')[0];
      
      // 调用API生成并保存简历
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeContent,
          jobTitle: job.title,
          format,
          templateId: template.id,
          userName
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 显示成功消息和文件保存路径
        alert(`已生成${format.toUpperCase()}格式简历，保存在：${result.filePath}，使用模板：${template.name}`);
        console.log(`生成简历：${result.filename}，路径：${result.filePath}，模板：${template.name}，格式：${format}`);
        console.log('简历内容：', resumeContent);
        
        // 可以提供下载链接
        const downloadUrl = `${window.location.origin}${result.filePath}`;
        console.log('下载链接：', downloadUrl);
      } else {
        alert(`生成简历失败：${result.message}`);
      }
    } catch (error) {
      console.error('生成简历时发生错误：', error);
      alert('生成简历时发生错误，请重试');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          智能优化简历 - {job.title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
          >
            {showOriginal ? '显示优化后' : '显示原始内容'}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
          >
            重置
          </button>
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className={`px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md text-sm hover:from-blue-700 hover:to-indigo-700 transition-all ${isOptimizing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isOptimizing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                优化中...
              </div>
            ) : (
              'AI优化简历'
            )}
          </button>
          {resumeMatchScore > 0 && (
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="px-4 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md text-sm hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              生成简历
            </button>
          )}
        </div>
      </div>

      {/* 优化结果预览 */}
      <div className="space-y-4">
        {optimizedSections.map((section, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-gray-200">
              <h3 className="font-medium text-gray-800">{section.title}</h3>
              {section.isOptimized && (
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  已优化
                </span>
              )}
            </div>
            <div className="p-4 bg-white">
              <p className={`text-sm ${showOriginal ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                {showOriginal ? section.originalContent : section.content}
              </p>
              {!showOriginal && section.isOptimized && (
                <p className="text-xs text-gray-500 mt-2">
                  原始内容：{section.originalContent}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 本岗位简历优化说明 */}
      {resumeMatchScore > 0 && (
        <div className="space-y-4">
          {/* 匹配度评分 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">简历与岗位匹配度</h3>
            </div>
            <div className="p-4 bg-white flex items-center">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">匹配度评分</span>
                  <span className="text-xl font-bold text-blue-600">{resumeMatchScore}分</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${resumeMatchScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  您的简历经过AI优化后，与{job.title}岗位的匹配度为{resumeMatchScore}分（满分100分），
                  符合岗位要求，具有较强的竞争力。
                </p>
              </div>
            </div>
          </div>
          
          {/* 优化说明 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">本岗位简历优化说明</h3>
            </div>
            <div className="p-4 bg-white">
              <ul className="space-y-3">
                {optimizedSections.map((section, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">{section.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {optimizationExplanations[section.title] || ''}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          优化后: {section.content}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {resumeMatchScore > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-md hover:from-green-700 hover:to-emerald-700 transition-all"
          >
            生成简历
          </button>
        </div>
      )}

      {/* 模板选择器 */}
      {showTemplateSelector && (
        <ResumeTemplateSelector
          onTemplateSelect={handleGenerateResume}
          onCancel={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
};