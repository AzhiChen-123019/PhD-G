'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobCard from '@/components/JobCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTitle from '@/components/PageTitle';
import { scrapeJobs } from '@/lib/job-scraper';
import { Job } from '@/lib/job-model';

// 扩展Job接口以兼容大学岗位数据结构
interface UniversityJob extends Job {
  institution?: string;
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
    university: {
      title: '大学科研岗位',
      description: '连接全球顶尖大学和科研机构，为博士提供学术职业发展机会',
      positions: {
        professor: '教授/副教授',
        professorDesc: '全球知名大学的终身教职机会',
        postdoc: '博士后研究员',
        postdocDesc: '顶尖科研机构的研究职位',
        researchAssistant: '研究助理教授',
        researchAssistantDesc: 'tenure-track 职位，学术发展通道',
        viewPositions: '查看岗位 →',
      },
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
    university: {
      title: 'University Research Positions',
      description: 'Connecting with top universities and research institutions worldwide, providing academic career development opportunities for PhDs',
      positions: {
        professor: 'Professor/Associate Professor',
        professorDesc: 'Tenured faculty opportunities at world-renowned universities',
        postdoc: 'Postdoctoral Researcher',
        postdocDesc: 'Research positions at top research institutions',
        researchAssistant: 'Research Assistant Professor',
        researchAssistantDesc: 'Tenure-track positions with academic development paths',
        viewPositions: 'View Positions →',
      },
    },
  },
};

// 移除模拟数据，使用真实的岗位抓取服务

export default function UniversityPage() {
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
  const [selectedField, setSelectedField] = useState('all');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSalary, setSelectedSalary] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  
  // AI抓取相关状态
  const [jobs, setJobs] = useState<UniversityJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiCallTriggered, setAiCallTriggered] = useState(false);
  
  // 初始化：使用真实的岗位抓取服务
  useEffect(() => {
    const fetchUniversityJobs = async () => {
      try {
        setIsLoading(true);
        
        // 使用真实的岗位抓取服务获取大学科研岗位
        const fetchedJobs = await scrapeJobs({
          keywords: ['university', 'research', 'professor', 'associate professor', 'postdoc', 'postdoctoral', 'research fellow', 'academic'],
          degreeLevels: ['博士', 'PhD', 'Doctorate'],
          maxResults: 20,
          minRating: 4.0,
          maxDuration: 10000
        });
        
        // 将抓取的岗位转换为大学岗位格式
        const formattedJobs = fetchedJobs.map(job => ({
          ...job,
          institution: job.company, // 将公司字段作为院校字段
          type: job.title.toLowerCase().includes('教授') ? 'professor' : 
                job.title.toLowerCase().includes('博士后') ? 'postdoc' : 
                'researchAssistant'
        })) as unknown as UniversityJob[];
        
        setJobs(formattedJobs);
      } catch (error) {
        console.error('获取大学岗位数据失败:', error);
        // 如果抓取失败，使用空数组
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUniversityJobs();
  }, [lang]);
  
  // 检查是否需要触发AI抓取
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const triggerAICall = localStorage.getItem('triggerAICall');
      if (triggerAICall) {
        const { type, timestamp } = JSON.parse(triggerAICall);
        // 只处理大学科研岗位的AI调用
        if (type === 'university' && Date.now() - timestamp < 5000) {
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
          // 调用AI驱动的岗位抓取服务，抓取全球范围内的大学相关岗位
          const scrapedJobs = await scrapeJobs({
            keywords: ['university', 'research', 'professor', 'associate professor', 'postdoc', 'postdoctoral', 'research fellow', 'academic'],
            degreeLevels: ['博士', 'PhD', 'Doctorate'],
            maxResults: 15, // 大学岗位：10-20个/次
            minRating: 4.0,
            maxDuration: 8000 // 8秒超时（用户主动触发：5-10秒）
          });
          
          // 将抓取的岗位转换为大学岗位格式
          const formattedJobs = scrapedJobs.map(job => ({
            ...job,
            institution: job.company, // 将公司字段作为院校字段
            type: job.title.toLowerCase().includes('教授') ? 'professor' : 
                  job.title.toLowerCase().includes('博士后') ? 'postdoc' : 
                  'researchAssistant'
          })) as unknown as UniversityJob[];
          
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
  const fields = {
    zh: ['all', '人工智能', '机器学习', '药物研发', '材料科学', '量子物理', '金融工程', '生物信息学'],
    en: ['all', 'Artificial Intelligence', 'Machine Learning', 'Drug Development', 'Materials Science', 'Quantum Physics', 'Financial Engineering', 'Bioinformatics'],
  };
  
  const institutionTypes = {
    zh: ['all', '综合性大学', '理工科大学', '医科大学', '师范大学', '研究机构'],
    en: ['all', 'Comprehensive University', 'Science & Engineering University', 'Medical University', 'Normal University', 'Research Institution'],
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
  
  // 薪资范围选项 - 按USD币种分级
  const salaries = {
    zh: ['all', '年薪30万以下', '年薪30-50万', '年薪50-80万', '年薪80-120万', '年薪120万以上', '面议'],
    en: ['all', 'Below $50k', '$50k-$75k', '$75k-$100k', '$100k-$150k', '$150k-$200k', '$200k+', 'Negotiable'],
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
        ((job.institution || job.company) && (job.institution || job.company).toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 其他筛选条件
      const matchesField = selectedField === 'all';
      const matchesInstitutionType = selectedInstitutionType === 'all';
      
      // 工作地点筛选（支持全球国家）
      const matchesLocation = selectedLocation === 'all' || 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      // 薪资筛选
      const matchesSalary = selectedSalary === 'all' || 
        (selectedSalary === '面议' && (job.salary === '面议' || job.salary === 'Negotiable' || job.salary === '')) ||
        job.salary.includes(selectedSalary);
      
      return matchesType && matchesSearch && matchesField && matchesInstitutionType && matchesLocation && matchesSalary;
    })
    .sort((a, b) => {
      // 排序逻辑
      switch (sortBy) {
        case 'match':
          // 匹配度排序（使用真实的匹配度分数）
          return b.relevanceScore - a.relevanceScore;
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
          title={t.university.title} 
          description={t.university.description} 
          lang={lang} 
        />

        {/* 顶部固定搜索栏 */}
        <div className="sticky top-16 z-40 bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-grow">
              <input
                type="text"
                placeholder={lang === 'zh' ? '搜索岗位、院校...' : 'Search positions, institutions...'}
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
              <option value="professor">{t.university.positions.professor}</option>
              <option value="postdoc">{t.university.positions.postdoc}</option>
              <option value="researchAssistant">{t.university.positions.researchAssistant}</option>
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
          
          {/* 动态筛选条件 - 大学岗位 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {/* 研究领域 */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              {fields[lang].map((field) => (
                <option key={field} value={field}>
                  {field === 'all' ? (lang === 'zh' ? '全部研究领域' : 'All Research Fields') : field}
                </option>
              ))}
            </select>
            
            {/* 院校类型 */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={selectedInstitutionType}
              onChange={(e) => setSelectedInstitutionType(e.target.value)}
            >
              {institutionTypes[lang].map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? (lang === 'zh' ? '全部院校类型' : 'All Institution Types') : type}
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
            
            {/* 工作地点（全球国家） */}
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
                category="university"
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
