'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobCard from '@/components/JobCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTitle from '@/components/PageTitle';
import { intelligentJobScrape, AIEnhancedJob, AIScrapeOptions } from '@/lib/ai-integration';
import { scrapeJobs } from '@/lib/job-scraper';
import { Job } from '@/lib/job-model';

// 扩展Job接口以兼容企业岗位数据结构
interface EnterpriseJob extends AIEnhancedJob {
  // 企业岗位可能需要的额外字段
  expireTime?: number;
}

// 多语言支持
const translations = {
  zh: {
    nav: {
      home: '首页',
      university: '大学科研岗位',
      enterprise: '企业高级岗位',
      account: '个人中心',
      jobs: '热门岗位',
      login: '登录',
      register: '注册',
      lang: 'English',
      siteName: '博智匹配',
    },
    enterprise: {
      title: '企业高级岗位',
      description: '为博士人才提供企业高级管理和技术岗位，实现职业价值最大化',
      positions: {
        techDirector: '技术总监',
        techDirectorDesc: '引领企业技术创新和研发方向',
        chiefScientist: '首席科学家',
        chiefScientistDesc: '负责企业核心技术研发和战略规划',
        rManager: '研发经理',
        rManagerDesc: '管理研发团队，推动产品创新',
        viewPositions: '查看岗位 →',
      },
    },
    footer: {
      copyright: '© 2026 博士岗位匹配平台. 保留所有权利.',
      quickLinks: '快速链接',
      aboutUs: '关于我们',
      contact: '联系方式',
      platformIntro: '平台介绍',
      partners: '合作伙伴',
      contactUs: '联系我们',
    },
  },
  en: {
    nav: {
      home: 'Home',
      university: 'University Research Positions',
      enterprise: 'Enterprise Senior Positions',
      account: 'Account',
      jobs: 'Hot Positions',
      login: 'Login',
      register: 'Register',
      lang: '中文',
      siteName: 'PhDMap',
    },
    enterprise: {
      title: 'Enterprise Senior Positions',
      description: 'Providing senior management and technical positions in enterprises for PhD talents, maximizing career value',
      positions: {
        techDirector: 'Technical Director',
        techDirectorDesc: 'Leading enterprise technological innovation and R&D direction',
        chiefScientist: 'Chief Scientist',
        chiefScientistDesc: 'Responsible for enterprise core technology R&D and strategic planning',
        rManager: 'R&D Manager',
        rManagerDesc: 'Managing R&D teams and driving product innovation',
        viewPositions: 'View Positions →',
      },
    },
    footer: {
      copyright: '© 2026 PhD Job Matching Platform. All rights reserved.',
      quickLinks: 'Quick Links',
      aboutUs: 'About Us',
      contact: 'Contact',
      platformIntro: 'Platform Introduction',
      partners: 'Partners',
      contactUs: 'Contact Us',
    },
  },
};

// 模拟岗位数据
const enterpriseJobs = {
  zh: [
    {
      id: 1,
      title: '人工智能技术总监',
      company: '腾讯科技',
      location: '深圳',
      salary: '年薪80-120万',
      type: 'techDirector',
      deadline: '2026-06-30',
      experience: '8-10年',
      degree: '博士',
      skills: ['人工智能', '技术管理', '团队领导'],
      description: '负责人工智能技术团队的管理和技术方向规划',
      postedTime: '2026-01-20',
      relevanceScore: 96,
      url: 'https://example.com/job/enterprise-1',
      source: 'enterprise',
      viewCount: 150,
      applyCount: 30,
      rating: 4.9,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 2,
      title: '生物医药首席科学家',
      company: '百济神州',
      location: '北京',
      salary: '年薪100-150万',
      type: 'chiefScientist',
      deadline: '2026-05-15',
      experience: '10-15年',
      degree: '博士',
      skills: ['生物医药', '药物研发', '临床研究'],
      description: '负责生物医药领域的技术研发和创新',
      postedTime: '2026-01-18',
      relevanceScore: 94,
      url: 'https://example.com/job/enterprise-2',
      source: 'enterprise',
      viewCount: 130,
      applyCount: 25,
      rating: 4.8,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 3,
      title: 'AI Research Director',
      company: 'Google DeepMind',
      location: '伦敦, 英国',
      salary: '年薪15-25万英镑',
      type: 'techDirector',
      deadline: '2026-07-31',
      experience: '10-15年',
      degree: '博士',
      skills: ['人工智能', '深度学习', '研究管理'],
      description: '领导DeepMind的AI研究团队，推动前沿AI技术发展',
      postedTime: '2026-01-16',
      relevanceScore: 98,
      url: 'https://example.com/job/google-deepmind',
      source: 'enterprise',
      viewCount: 250,
      applyCount: 50,
      rating: 4.9,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 4,
      title: '机器学习工程总监',
      company: 'Meta',
      location: '门洛帕克, 美国',
      salary: '年薪20-30万美元',
      type: 'techDirector',
      deadline: '2026-08-15',
      experience: '8-12年',
      degree: '博士',
      skills: ['机器学习', '工程管理', '大规模系统'],
      description: '负责Meta的机器学习工程团队，构建大规模AI系统',
      postedTime: '2026-01-14',
      relevanceScore: 97,
      url: 'https://example.com/job/meta-ml',
      source: 'enterprise',
      viewCount: 220,
      applyCount: 45,
      rating: 4.9,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 5,
      title: '新能源首席科学家',
      company: '宁德时代',
      location: '宁德',
      salary: '年薪120-180万',
      type: 'chiefScientist',
      deadline: '2026-04-30',
      experience: '10-15年',
      degree: '博士',
      skills: ['新能源', '电池技术', '材料科学'],
      description: '负责新能源领域的技术研发和创新',
      postedTime: '2026-01-10',
      relevanceScore: 88,
      url: 'https://example.com/job/enterprise-5',
      source: 'enterprise',
      viewCount: 100,
      applyCount: 18,
      rating: 4.5,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 6,
      title: '芯片设计研发经理',
      company: '华为技术',
      location: '深圳',
      salary: '年薪85-110万',
      type: 'rManager',
      deadline: '2026-07-30',
      experience: '7-10年',
      degree: '硕士及以上',
      skills: ['芯片设计', '集成电路', '团队管理'],
      description: '负责芯片设计团队的管理和技术研发',
      postedTime: '2026-01-08',
      relevanceScore: 86,
      url: 'https://example.com/job/enterprise-6',
      source: 'enterprise',
      viewCount: 90,
      applyCount: 15,
      rating: 4.4,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 7,
      title: '自动驾驶技术总监',
      company: 'Tesla',
      location: '奥斯汀, 美国',
      salary: '年薪25-35万美元',
      type: 'techDirector',
      deadline: '2026-09-30',
      experience: '10-15年',
      degree: '博士',
      skills: ['自动驾驶', '计算机视觉', '机器学习'],
      description: '负责Tesla自动驾驶技术的研发和团队管理',
      postedTime: '2026-01-19',
      relevanceScore: 99,
      url: 'https://example.com/job/tesla-av',
      source: 'enterprise',
      viewCount: 300,
      applyCount: 60,
      rating: 5.0,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 8,
      title: '生物医药研发总监',
      company: 'Pfizer',
      location: '纽约, 美国',
      salary: '年薪18-28万美元',
      type: 'rManager',
      deadline: '2026-07-15',
      experience: '12-18年',
      degree: '博士',
      skills: ['生物医药', '药物研发', '临床试验'],
      description: '负责Pfizer的新药研发项目管理',
      postedTime: '2026-01-17',
      relevanceScore: 95,
      url: 'https://example.com/job/pfizer-rd',
      source: 'enterprise',
      viewCount: 180,
      applyCount: 35,
      rating: 4.8,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 9,
      title: '量子计算首席科学家',
      company: 'IBM',
      location: '约克敦高地, 美国',
      salary: '年薪22-32万美元',
      type: 'chiefScientist',
      deadline: '2026-10-31',
      experience: '10-15年',
      degree: '博士',
      skills: ['量子计算', '物理学', '计算机科学'],
      description: '领导IBM量子计算研究团队，推动量子技术商业化',
      postedTime: '2026-01-15',
      relevanceScore: 97,
      url: 'https://example.com/job/ibm-quantum',
      source: 'enterprise',
      viewCount: 200,
      applyCount: 40,
      rating: 4.9,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 10,
      title: '云计算研发经理',
      company: '亚马逊AWS',
      location: '西雅图, 美国',
      salary: '年薪16-26万美元',
      type: 'rManager',
      deadline: '2026-08-30',
      experience: '8-12年',
      degree: '硕士及以上',
      skills: ['云计算', '分布式系统', '技术管理'],
      description: '负责AWS云计算服务的研发和团队管理',
      postedTime: '2026-01-13',
      relevanceScore: 94,
      url: 'https://example.com/job/aws-cloud',
      source: 'enterprise',
      viewCount: 190,
      applyCount: 38,
      rating: 4.8,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
    {
      id: 11,
      title: '产业研究岗',
      company: '四川省产业技术研究院（四川省工程科技发展战略研究院）',
      location: '成都',
      salary: '8千-1.3万',
      type: 'researchScientist',
      deadline: '2026-06-30',
      experience: '3年及以上',
      degree: '博士',
      skills: ['产业规划', '产业研究', '公文写作'],
      description: '博士研究生学历；3年及以上政府机关、事业单位、国有企业工作经验，具有较强的公文写作能力，从事过产业规划、产业研究等工作经验者优先；年龄在40岁以下。',
      postedTime: '2026-01-27',
      relevanceScore: 92,
      url: 'https://jobs.51job.com/chengdu/170140178.html?s=sou_sou_soulb&t=0_0&req=5314778a6fbeea0d52b4a0df278e46fc&timestamp__1258=n4Rx0DuDBi0%3DfxWqGNueeTq7qxiqxiIqwmKQx',
      source: '51Job',
      viewCount: 0,
      applyCount: 0,
      rating: 4.5,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    },
  ],
  en: [
    {
      id: 1,
      title: 'AI Technical Director',
      company: 'Google DeepMind',
      location: 'London, UK',
      salary: 'Annual Salary: £150,000-250,000',
      type: 'techDirector',
      deadline: '2026-07-31',
      experience: '10-15 years',
      degree: 'PhD',
      skills: ['Artificial Intelligence', 'Deep Learning', 'Research Management'],
      description: 'Lead DeepMind\'s AI research team, driving cutting-edge AI technology development',
      postedTime: '2026-01-16',
      relevanceScore: 98,
      url: 'https://example.com/job/google-deepmind',
      source: 'enterprise',
      viewCount: 250,
      applyCount: 50,
      rating: 4.9,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days expire
    },
    {
      id: 2,
      title: 'Machine Learning Engineering Director',
      company: 'Meta',
      location: 'Menlo Park, USA',
      salary: 'Annual Salary: $200,000-300,000',
      type: 'techDirector',
      deadline: '2026-08-15',
      experience: '8-12 years',
      degree: 'PhD',
      skills: ['Machine Learning', 'Engineering Management', 'Large-scale Systems'],
      description: 'Lead Meta\'s machine learning engineering team, building large-scale AI systems',
      postedTime: '2026-01-14',
      relevanceScore: 97,
      url: 'https://example.com/job/meta-ml',
      source: 'enterprise',
      viewCount: 220,
      applyCount: 45,
      rating: 4.9,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days expire
    },
    {
      id: 3,
      title: 'Autonomous Driving Technical Director',
      company: 'Tesla',
      location: 'Austin, USA',
      salary: 'Annual Salary: $250,000-350,000',
      type: 'techDirector',
      deadline: '2026-09-30',
      experience: '10-15 years',
      degree: 'PhD',
      skills: ['Autonomous Driving', 'Computer Vision', 'Machine Learning'],
      description: 'Lead Tesla\'s autonomous driving technology research and team management',
      postedTime: '2026-01-19',
      relevanceScore: 99,
      url: 'https://example.com/job/tesla-av',
      source: 'enterprise',
      viewCount: 300,
      applyCount: 60,
      rating: 5.0,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days expire
    },
    {
      id: 4,
      title: 'Biomedical R&D Director',
      company: 'Pfizer',
      location: 'New York, USA',
      salary: 'Annual Salary: $180,000-280,000',
      type: 'rManager',
      deadline: '2026-07-15',
      experience: '12-18 years',
      degree: 'PhD',
      skills: ['Biomedical Science', 'Drug Development', 'Clinical Trials'],
      description: 'Lead Pfizer\'s new drug development project management',
      postedTime: '2026-01-17',
      relevanceScore: 95,
      url: 'https://example.com/job/pfizer-rd',
      source: 'enterprise',
      viewCount: 180,
      applyCount: 35,
      rating: 4.8,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days expire
    },
    {
      id: 5,
      title: 'Quantum Computing Chief Scientist',
      company: 'IBM',
      location: 'Yorktown Heights, USA',
      salary: 'Annual Salary: $220,000-320,000',
      type: 'chiefScientist',
      deadline: '2026-10-31',
      experience: '10-15 years',
      degree: 'PhD',
      skills: ['Quantum Computing', 'Physics', 'Computer Science'],
      description: 'Lead IBM\'s quantum computing research team, driving quantum technology commercialization',
      postedTime: '2026-01-15',
      relevanceScore: 97,
      url: 'https://example.com/job/ibm-quantum',
      source: 'enterprise',
      viewCount: 200,
      applyCount: 40,
      rating: 4.9,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days expire
    },
    {
      id: 6,
      title: 'Cloud Computing R&D Manager',
      company: 'Amazon AWS',
      location: 'Seattle, USA',
      salary: 'Annual Salary: $160,000-260,000',
      type: 'rManager',
      deadline: '2026-08-30',
      experience: '8-12 years',
      degree: 'Master or PhD',
      skills: ['Cloud Computing', 'Distributed Systems', 'Technical Management'],
      description: 'Lead AWS cloud computing service research and team management',
      postedTime: '2026-01-13',
      relevanceScore: 94,
      url: 'https://example.com/job/aws-cloud',
      source: 'enterprise',
      viewCount: 190,
      applyCount: 38,
      rating: 4.8,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days expire
    },
    {
      id: 7,
      title: 'AI Ethics Research Director',
      company: 'Microsoft',
      location: 'Redmond, USA',
      salary: 'Annual Salary: $170,000-270,000',
      type: 'techDirector',
      deadline: '2026-07-30',
      experience: '10-15 years',
      degree: 'PhD',
      skills: ['AI Ethics', 'Machine Learning', 'Policy Development'],
      description: 'Lead Microsoft\'s AI ethics research, ensuring responsible AI development',
      postedTime: '2026-01-12',
      relevanceScore: 93,
      url: 'https://example.com/job/microsoft-ai-ethics',
      source: 'enterprise',
      viewCount: 170,
      applyCount: 32,
      rating: 4.7,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days expire
    },
    {
      id: 8,
      title: 'Robotics Engineering Director',
      company: 'Boston Dynamics',
      location: 'Waltham, USA',
      salary: 'Annual Salary: $190,000-290,000',
      type: 'techDirector',
      deadline: '2026-09-15',
      experience: '10-15 years',
      degree: 'PhD',
      skills: ['Robotics', 'Mechanical Engineering', 'AI Integration'],
      description: 'Lead Boston Dynamics\' robotics engineering team, developing advanced robots',
      postedTime: '2026-01-11',
      relevanceScore: 96,
      url: 'https://example.com/job/boston-dynamics-robotics',
      source: 'enterprise',
      viewCount: 210,
      applyCount: 42,
      rating: 4.9,
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days expire
    },
  ],
};

export default function EnterprisePage() {
  const router = useRouter();
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  
  // 从localStorage获取语言设置
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 筛选条件状态
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedSalary, setSelectedSalary] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  
  // AI抓取相关状态
  const [jobs, setJobs] = useState<EnterpriseJob[]>(enterpriseJobs[lang] as unknown as EnterpriseJob[]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiCallTriggered, setAiCallTriggered] = useState(false);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true);
  
  // 初始化：将模拟数据添加到持久化存储
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 先检查是否已有持久化数据
      const hasPersistentData = localStorage.getItem('persistent_jobs');
      if (!hasPersistentData) {
        // 添加模拟数据到持久化存储
        const { addJobsToPersistentStorage } = require('@/lib/job-scraper');
        addJobsToPersistentStorage(enterpriseJobs[lang] as unknown as EnterpriseJob[]);
      }
    }
  }, [lang]);
  
  // 检查是否需要触发AI抓取
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const triggerAICall = localStorage.getItem('triggerAICall');
      if (triggerAICall) {
        const { type, timestamp } = JSON.parse(triggerAICall);
        // 只处理企业高级岗位的AI调用
        if (type === 'enterprise' && Date.now() - timestamp < 5000) {
          // 5秒内的调用才有效
          setAiCallTriggered(true);
          // 清除触发标志
          localStorage.removeItem('triggerAICall');
        }
      }
    }
  }, []);
  
  // 触发AI抓取
  useEffect(() => {
    if (aiCallTriggered) {
      const fetchJobsWithAI = async () => {
        setIsLoading(true);
        try {
          // 调用AI驱动的岗位抓取服务，抓取全球范围内的企业相关高级岗位
          const aiScrapeOptions: AIScrapeOptions = {
            keywords: ['technical director', 'chief scientist', 'R&D manager', 'research director', 'senior engineer', 'CTO', 'VP of Engineering', 'engineering manager'],
            degreeLevels: ['博士', 'PhD', 'Doctorate', '硕士', 'Master'],
            maxResults: 25, // 企业岗位：15-30个/次
            minRating: 4.0,
            maxDuration: 10000, // 10秒超时（用户主动触发：5-10秒）
            platforms: ['LinkedIn', 'Glassdoor', 'Indeed', '51Job', '智联招聘', '猎聘'],
            useAI: true,
            analysisDepth: 'comprehensive',
            includeSalaryAnalysis: true,
            includeSkillsAnalysis: true,
            includeCompanyAnalysis: true
          };

          const scrapedJobs = await intelligentJobScrape(aiScrapeOptions);
          
          // 将抓取的岗位转换为企业岗位格式
          const formattedJobs = scrapedJobs.map(job => ({
            ...job,
            type: job.title.toLowerCase().includes('总监') ? 'techDirector' : 
                  job.title.toLowerCase().includes('首席') ? 'chiefScientist' : 
                  job.title.toLowerCase().includes('经理') ? 'rManager' : 
                  'techDirector',
            deadline: job.deadline || (job.expireTime ? new Date(job.expireTime).toISOString().split('T')[0] : '')
          })) as unknown as EnterpriseJob[];
          
          // 更新岗位数据，合并现有数据和新抓取数据
          setJobs(prevJobs => [...formattedJobs, ...prevJobs]);
        } catch (error) {
          console.error('AI岗位抓取失败:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchJobsWithAI();
    }
  }, [aiCallTriggered, lang]);
  
  // 筛选条件选项
  const industries = {
    zh: ['all', '互联网', '生物医药', '金融科技', '新能源', '人工智能', '半导体', '云计算'],
    en: ['all', 'Internet', 'Biomedicine', 'FinTech', 'New Energy', 'AI', 'Semiconductor', 'Cloud Computing'],
  };
  
  const experiences = {
    zh: ['all', '3年以下', '3-5年', '5-8年', '8-10年', '10年以上'],
    en: ['all', 'Less than 3 years', '3-5 years', '5-8 years', '8-10 years', 'More than 10 years'],
  };
  
  // 薪资范围选项 - 按USD币种分级
  const salaries = {
    zh: ['all', '50万以下', '50-80万', '80-120万', '120-150万', '150万以上', '面议'],
    en: ['all', 'Below $50k', '$50k-$75k', '$75k-$100k', '$100k-$150k', '$150k-$200k', '$200k+', 'Negotiable'],
  };
  
  // 全球国家和地区工作地点选项
  const locations = {
    zh: [
      'all', '中国', '美国', '英国', '德国', '法国', '日本', '韩国', '加拿大', '澳大利亚', 
      '新加坡', '香港', '台湾', '澳门', '印度', '俄罗斯', '荷兰', '瑞士', '瑞典', '丹麦',
      '挪威', '芬兰', '爱尔兰', '意大利', '西班牙', '葡萄牙', '比利时', '奥地利', '捷克',
      '波兰', '匈牙利', '希腊', '以色列', '新西兰', '马来西亚', '泰国', '印度尼西亚', '越南'
    ],
    en: [
      'all', 'China', 'USA', 'UK', 'Germany', 'France', 'Japan', 'South Korea', 'Canada', 'Australia',
      'Singapore', 'Hong Kong', 'Taiwan', 'Macau', 'India', 'Russia', 'Netherlands', 'Switzerland', 'Sweden', 'Denmark',
      'Norway', 'Finland', 'Ireland', 'Italy', 'Spain', 'Portugal', 'Belgium', 'Austria', 'Czech Republic',
      'Poland', 'Hungary', 'Greece', 'Israel', 'New Zealand', 'Malaysia', 'Thailand', 'Indonesia', 'Vietnam'
    ],
  };

  // 当语言变化时，保存到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  }, [lang]);

  // 模拟登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(user.username || 'User');
      }
    }
  }, []);

  const t = translations[lang];

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };

  const handleViewDetails = (jobId: string | number) => {
    window.location.href = `/job/${jobId}`;
  };

  // 筛选和排序逻辑
  const filteredAndSortedJobs = jobs
    .filter(job => {
      // 类型筛选
      const matchesType = selectedType === 'all' || job.type === selectedType;
      
      // 搜索关键词筛选
      const matchesSearch = searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.company && job.company.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 其他筛选条件
      const matchesIndustry = selectedIndustry === 'all';
      const matchesExperience = selectedExperience === 'all';
      
      // 薪资筛选，没有薪资的统一显示为面议
      const normalizedSalary = job.salary || '面议';
      const matchesSalary = selectedSalary === 'all' || normalizedSalary.includes(selectedSalary);
      
      // 工作地点筛选（支持全球国家）
      const matchesLocation = selectedLocation === 'all' || 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesType && matchesSearch && matchesIndustry && matchesExperience && matchesSalary && matchesLocation;
    })
    .sort((a, b) => {
      // 排序逻辑
      switch (sortBy) {
        case 'match':
          // 匹配度排序（模拟）
          return Math.random() - 0.5;
        case 'salary':
          // 薪资排序
          return b.salary.localeCompare(a.salary, undefined, { numeric: true });
        case 'deadline':
          // 截止日期排序
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as 'zh' | 'en')} 
      />

      {/* 页面内容 */}
      <div className="container mx-auto px-4 py-8">
        {/* 共享页面标题 */}
        <PageTitle 
          title={t.enterprise.title} 
          description={t.enterprise.description} 
          lang={lang} 
        />

        {/* 顶部固定搜索栏 */}
        <div className="sticky top-16 z-40 bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-grow">
              <input
                type="text"
                placeholder={lang === 'zh' ? '搜索岗位、企业...' : 'Search positions, companies...'}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* 类型筛选 */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">{lang === 'zh' ? '全部职位' : 'All Positions'}</option>
              <option value="techDirector">{t.enterprise.positions.techDirector}</option>
              <option value="chiefScientist">{t.enterprise.positions.chiefScientist}</option>
              <option value="rManager">{t.enterprise.positions.rManager}</option>
            </select>
            
            {/* 排序选项 */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="match">{lang === 'zh' ? '匹配度优先' : 'Match Priority'}</option>
              <option value="salary">{lang === 'zh' ? '薪资从高到低' : 'Salary High to Low'}</option>
              <option value="deadline">{lang === 'zh' ? '截止日期从近到远' : 'Deadline Near to Far'}</option>
            </select>
          </div>
          
          {/* 动态筛选条件 - 企业岗位 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {/* 行业 */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              {industries[lang].map((industry) => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? (lang === 'zh' ? '全部行业' : 'All Industries') : industry}
                </option>
              ))}
            </select>
            
            {/* 经验要求 */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
            >
              {experiences[lang].map((experience) => (
                <option key={experience} value={experience}>
                  {experience === 'all' ? (lang === 'zh' ? '全部经验' : 'All Experience') : experience}
                </option>
              ))}
            </select>
            
            {/* 薪资范围 */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
            >
              {salaries[lang].map((salary) => (
                <option key={salary} value={salary}>
                  {salary === 'all' ? (lang === 'zh' ? '全部薪资' : 'All Salary') : salary}
                </option>
              ))}
            </select>
            
            {/* 工作地点 */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations[lang].map((location) => (
                <option key={location} value={location}>
                  {location === 'all' ? (lang === 'zh' ? '全部工作地点' : 'All Locations') : location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 职位列表 - 紧凑卡片式 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 加载状态 */}
          {isLoading && (
            <div className="col-span-full text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">
                {lang === 'zh' ? 'AI正在抓取最新岗位数据...' : 'AI is fetching the latest job data...'}
              </p>
            </div>
          )}
          {filteredAndSortedJobs.map((job) => {
            // 将expireTime转换为deadline格式，以便JobCard组件使用
            const jobWithDeadline = {
              ...job,
              deadline: job.deadline || (job.expireTime ? new Date(job.expireTime).toISOString().split('T')[0] : '')
            };
            
            return (
              <JobCard
                key={job.id}
                job={jobWithDeadline}
                lang={lang}
                category="enterprise"
                onViewDetails={handleViewDetails}
              />
            );
          })}
        </div>

        {/* 空状态 */}
        {filteredAndSortedJobs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-500">
              {lang === 'zh' ? '暂无相关职位' : 'No related positions found'}
            </p>
          </div>
        )}
      </div>

      {/* 共享页脚 */}
      <Footer lang={lang} />
    </div>
  );
}
