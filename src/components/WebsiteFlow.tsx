'use client';

import { useState } from 'react';

interface WebsiteFlowProps {
  lang: 'zh' | 'en';
}

const translations = {
  zh: {
    title: '网站核心优势',
    subtitle: '四大核心功能，助您快速找到理想岗位',
    features: [
      {
        title: '精选高质量岗位',
        description: '只匹配推荐4星级以上岗位，帮您节省筛选时间',
        icon: '⭐',
        color: 'from-yellow-500 to-amber-500',
      },
      {
        title: 'AI精准匹配',
        description: '基于您的求职期望、核心竞争力全网实时精准匹配',
        icon: '🎯',
        color: 'from-indigo-500 to-purple-500',
      },
      {
        title: '实时更新',
        description: '随时点击按钮获取最新岗位，不错过任何机会',
        icon: '🚀',
        color: 'from-blue-500 to-cyan-500',
      },
      {
        title: '增值服务',
        description: '支持智能简历优化、可邮件直达雇主',
        icon: '💡',
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },
  en: {
    title: 'Core Website Advantages',
    subtitle: 'Four core features to help you find your ideal job quickly',
    features: [
      {
        title: 'High-Quality Job Selection',
        description: 'Only recommends 4-star+ jobs, saving you time in screening',
        icon: '⭐',
        color: 'from-yellow-500 to-amber-500',
      },
      {
        title: 'AI Precise Matching',
        description: 'Based on your job expectations and core competencies, real-time precise matching across the network',
        icon: '🎯',
        color: 'from-indigo-500 to-purple-500',
      },
      {
        title: 'Real-time Updates',
        description: 'Click the button anytime to get the latest jobs, never miss any opportunity',
        icon: '🚀',
        color: 'from-blue-500 to-cyan-500',
      },
      {
        title: 'Value-Added Services',
        description: 'Supports intelligent resume optimization and direct email to employers',
        icon: '💡',
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },
};

export default function WebsiteFlow({ lang }: WebsiteFlowProps) {
  const [activeFeature, setActiveFeature] = useState(0);
  const t = translations[lang];

  return (
    <div className="w-full">
      {/* 标题 */}
      <div className="text-center mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.title}</h3>
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">{t.subtitle}</p>
      </div>

      {/* 核心功能 */}
      <div className="grid grid-cols-1 gap-8">
        {t.features.map((feature, index) => (
          <div 
            key={index}
            className={`relative flex items-start gap-6 bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 overflow-hidden ${activeFeature === index ? 'scale-[1.02] shadow-xl' : ''}`}
            onMouseEnter={() => setActiveFeature(index)}
          >
            {/* 序号 */}
            <div className="absolute top-6 left-6 text-6xl font-bold text-gray-100 z-0">{index + 1}</div>
            
            {/* 功能图标 */}
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-2xl z-10 flex-shrink-0`}>
              {feature.icon}
            </div>
            
            {/* 功能内容 */}
            <div className="flex-1 z-10">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
            </div>
            
            {/* 装饰元素 */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${activeFeature === index ? 'scale-150' : 'scale-100'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
