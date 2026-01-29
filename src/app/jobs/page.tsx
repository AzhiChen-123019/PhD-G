'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JobCard } from '../../components/JobUIComponents';
import LanguageSelector from '@/components/LanguageSelector';
import { Job, JobTag, JobCategory, JobStatus, JobLibraryType, UniversityJobSubType, EnterpriseJobSubType } from '../../lib/job-model';
import { TagManager } from '../../lib/tag-management';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTitle from '@/components/PageTitle';

// 多语言支持
import { getTranslation, Language } from '@/lib/i18n';

// 中文热门岗位数据
const zhJobs: Job[] = [
  {
    id: '1',
    title: '人工智能助理教授',
    company: '北京大学',
    location: '北京',
    salary: '年薪40-60万',
    type: '全职',
    experience: '不限',
    degree: '博士',
    skills: ['人工智能', '机器学习', '深度学习', '自然语言处理'],
    description: '负责人工智能领域的教学和研究工作',
    requirements: ['博士学历，人工智能相关专业', '有相关研究经验', '发表过高水平论文'],
    benefits: ['事业编制', '科研启动经费', '住房补贴', '子女入学优惠'],
    postedTime: '2026-01-15',
    relevanceScore: 85,
    url: '#',
    source: '高校招聘平台',
    viewCount: 120,
    applyCount: 25,
    rating: 4.5,
    deadline: '2026-06-30',
    tags: {
      category: JobCategory.UNIVERSITY,
      subType: UniversityJobSubType.RESEARCH_ASSISTANT
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: '高级机器学习工程师',
    company: '腾讯科技',
    location: '深圳',
    salary: '年薪60-80万',
    type: '全职',
    experience: '3-5年',
    degree: '硕士及以上',
    skills: ['机器学习', '深度学习', 'Python', 'TensorFlow'],
    description: '负责公司核心产品的机器学习算法研发',
    requirements: ['硕士及以上学历，计算机相关专业', '3年以上机器学习相关工作经验', '熟悉Python和TensorFlow/PyTorch'],
    benefits: ['15薪', '弹性工作', '免费三餐', '健身房', '股票期权'],
    postedTime: '2026-01-10',
    relevanceScore: 90,
    url: '#',
    source: '企业招聘平台',
    viewCount: 180,
    applyCount: 45,
    rating: 4.7,
    deadline: '2026-05-30',
    tags: {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.AI_RESEARCHER
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z'
  },
  {
    id: '3',
    title: '生物医学研究员',
    company: '中科院生物物理研究所',
    location: '北京',
    salary: '年薪35-55万',
    type: '全职',
    experience: '不限',
    degree: '博士',
    skills: ['生物医学', '分子生物学', '细胞生物学', '实验设计'],
    description: '从事生物医学领域的基础研究工作',
    requirements: ['博士学历，生物医学相关专业', '有相关研究经验', '发表过高水平论文'],
    benefits: ['事业编制', '科研启动经费', '住房补贴', '医疗保险'],
    postedTime: '2026-01-05',
    relevanceScore: 82,
    url: '#',
    source: '科研机构招聘平台',
    viewCount: 95,
    applyCount: 18,
    rating: 4.3,
    deadline: '2026-06-15',
    tags: {
      category: JobCategory.UNIVERSITY,
      subType: UniversityJobSubType.RESEARCH_SCIENTIST
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z'
  },
  {
    id: '4',
    title: '数据科学总监',
    company: '阿里巴巴集团',
    location: '杭州',
    salary: '年薪80-120万',
    type: '全职',
    experience: '5-10年',
    degree: '硕士及以上',
    skills: ['数据科学', '机器学习', '大数据', '团队管理'],
    description: '负责公司数据科学团队的管理和战略规划',
    requirements: ['硕士及以上学历，计算机/统计学相关专业', '5年以上数据科学工作经验', '3年以上团队管理经验'],
    benefits: ['16薪', '股票期权', '弹性工作', '免费午餐', '健身房'],
    postedTime: '2026-01-12',
    relevanceScore: 92,
    url: '#',
    source: '企业招聘平台',
    viewCount: 210,
    applyCount: 52,
    rating: 4.8,
    deadline: '2026-06-01',
    tags: {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.DATA_SCIENTIST
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z'
  },
  {
    id: '5',
    title: '芯片设计工程师',
    company: '华为技术',
    location: '深圳',
    salary: '年薪50-70万',
    type: '全职',
    experience: '2-5年',
    degree: '硕士及以上',
    skills: ['芯片设计', 'Verilog', '数字电路', 'ASIC'],
    description: '负责高性能芯片的设计和验证工作',
    requirements: ['硕士及以上学历，微电子/电子工程相关专业', '2年以上芯片设计经验', '熟悉Verilog和ASIC设计流程'],
    benefits: ['15薪', '住房补贴', '医疗保险', '年终奖金', '员工持股计划'],
    postedTime: '2026-01-08',
    relevanceScore: 88,
    url: '#',
    source: '企业招聘平台',
    viewCount: 150,
    applyCount: 38,
    rating: 4.6,
    deadline: '2026-05-15',
    tags: {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.ALGORITHM_ENGINEER
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z'
  },
  {
    id: '6',
    title: '物理学博士后',
    company: '中国科学技术大学',
    location: '合肥',
    salary: '年薪30-40万',
    type: '全职',
    experience: '不限',
    degree: '博士',
    skills: ['物理学', '量子物理', '实验物理', '数据分析'],
    description: '从事量子物理领域的博士后研究工作',
    requirements: ['博士学历，物理学相关专业', '有量子物理研究经验', '发表过高水平论文'],
    benefits: ['博士后津贴', '科研启动经费', '住房补贴', '职称评定优惠'],
    postedTime: '2026-01-10',
    relevanceScore: 80,
    url: '#',
    source: '高校招聘平台',
    viewCount: 85,
    applyCount: 15,
    rating: 4.4,
    deadline: '2026-06-30',
    tags: {
      category: JobCategory.UNIVERSITY,
      subType: UniversityJobSubType.POSTDOC
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z'
  },
  {
    id: '7',
    title: '金融科技技术总监',
    company: '蚂蚁集团',
    location: '杭州',
    salary: '年薪90-130万',
    type: '全职',
    experience: '8-15年',
    degree: '硕士及以上',
    skills: ['金融科技', '区块链', '人工智能', '技术管理'],
    description: '负责金融科技产品的技术战略规划和团队管理',
    requirements: ['硕士及以上学历，计算机/金融相关专业', '8年以上金融科技工作经验', '5年以上技术管理经验'],
    benefits: ['18薪', '股票期权', '豪华办公环境', '高端医疗保险', '子女教育补贴'],
    postedTime: '2026-01-14',
    relevanceScore: 95,
    url: '#',
    source: '企业招聘平台',
    viewCount: 230,
    applyCount: 58,
    rating: 4.9,
    deadline: '2026-05-20',
    tags: {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.TECH_DIRECTOR
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-14T00:00:00Z',
    updatedAt: '2026-01-14T00:00:00Z'
  },
  {
    id: '8',
    title: '化学工程副教授',
    company: '浙江大学',
    location: '杭州',
    salary: '年薪45-65万',
    type: '全职',
    experience: '5-10年',
    degree: '博士',
    skills: ['化学工程', '材料科学', '反应工程', '催化'],
    description: '负责化学工程领域的教学和研究工作',
    requirements: ['博士学历，化学工程相关专业', '5年以上相关研究经验', '发表过高水平论文'],
    benefits: ['事业编制', '科研启动经费', '住房补贴', '学术交流经费'],
    postedTime: '2026-01-12',
    relevanceScore: 87,
    url: '#',
    source: '高校招聘平台',
    viewCount: 105,
    applyCount: 22,
    rating: 4.6,
    deadline: '2026-07-15',
    tags: {
      category: JobCategory.UNIVERSITY,
      subType: UniversityJobSubType.PROFESSOR
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z'
  },
];

// 英文热门岗位数据
const enJobs: Job[] = [
  {
    id: '1',
    title: 'Assistant Professor of Artificial Intelligence',
    company: 'Peking University',
    location: 'Beijing',
    salary: 'Annual Salary: $60,000-90,000',
    type: 'Full-time',
    experience: 'No requirement',
    degree: 'PhD',
    skills: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Natural Language Processing'],
    description: 'Responsible for teaching and research in the field of artificial intelligence',
    requirements: ['PhD in Artificial Intelligence or related field', 'Relevant research experience', 'Published high-level papers'],
    benefits: ['Career establishment', 'Research start-up fund', 'Housing subsidy', 'Children education benefits'],
    postedTime: '2026-01-15',
    relevanceScore: 85,
    url: '#',
    source: 'University Recruitment Platform',
    viewCount: 120,
    applyCount: 25,
    rating: 4.5,
    deadline: '2026-06-30',
    tags: {
      category: JobCategory.UNIVERSITY,
      subType: UniversityJobSubType.RESEARCH_ASSISTANT
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Senior Machine Learning Engineer',
    company: 'Tencent Technology',
    location: 'Shenzhen',
    salary: 'Annual Salary: $90,000-120,000',
    type: 'Full-time',
    experience: '3-5 years',
    degree: 'Master or above',
    skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow'],
    description: 'Responsible for machine learning algorithm research and development for core products',
    requirements: ['Master or above in Computer Science or related field', '3+ years of machine learning experience', 'Familiar with Python and TensorFlow/PyTorch'],
    benefits: ['15 months salary', 'Flexible working hours', 'Free meals', 'Gym access', 'Stock options'],
    postedTime: '2026-01-10',
    relevanceScore: 90,
    url: '#',
    source: 'Enterprise Recruitment Platform',
    viewCount: 180,
    applyCount: 45,
    rating: 4.7,
    deadline: '2026-05-30',
    tags: {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.AI_RESEARCHER
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z'
  },
  {
    id: '3',
    title: 'Biomedical Researcher',
    company: 'Chinese Academy of Sciences',
    location: 'Beijing',
    salary: 'Annual Salary: $50,000-80,000',
    type: 'Full-time',
    experience: 'No requirement',
    degree: 'PhD',
    skills: ['Biomedical Science', 'Molecular Biology', 'Cell Biology', 'Experimental Design'],
    description: 'Engage in basic research in the field of biomedical science',
    requirements: ['PhD in Biomedical Science or related field', 'Relevant research experience', 'Published high-level papers'],
    benefits: ['Career establishment', 'Research start-up fund', 'Housing subsidy', 'Medical insurance'],
    postedTime: '2026-01-05',
    relevanceScore: 82,
    url: '#',
    source: 'Research Institute Recruitment Platform',
    viewCount: 95,
    applyCount: 18,
    rating: 4.3,
    deadline: '2026-06-15',
    tags: {
      category: JobCategory.UNIVERSITY,
      subType: UniversityJobSubType.RESEARCH_SCIENTIST
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z'
  },
  {
    id: '4',
    title: 'Data Science Director',
    company: 'Alibaba Group',
    location: 'Hangzhou',
    salary: 'Annual Salary: $120,000-180,000',
    type: 'Full-time',
    experience: '5-10 years',
    degree: 'Master or above',
    skills: ['Data Science', 'Machine Learning', 'Big Data', 'Team Management'],
    description: 'Responsible for management and strategic planning of the data science team',
    requirements: ['Master or above in Computer Science/Statistics', '5+ years of data science experience', '3+ years of team management experience'],
    benefits: ['16 months salary', 'Stock options', 'Flexible working hours', 'Free lunch', 'Gym access'],
    postedTime: '2026-01-12',
    relevanceScore: 92,
    url: '#',
    source: 'Enterprise Recruitment Platform',
    viewCount: 210,
    applyCount: 52,
    rating: 4.8,
    deadline: '2026-06-01',
    tags: {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.DATA_SCIENTIST
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z'
  },
  {
    id: '5',
    title: 'Chip Design Engineer',
    company: 'Huawei Technologies',
    location: 'Shenzhen',
    salary: 'Annual Salary: $75,000-105,000',
    type: 'Full-time',
    experience: '2-5 years',
    degree: 'Master or above',
    skills: ['Chip Design', 'Verilog', 'Digital Circuit', 'ASIC'],
    description: 'Responsible for high-performance chip design and verification',
    requirements: ['Master or above in Microelectronics/Electronic Engineering', '2+ years of chip design experience', 'Familiar with Verilog and ASIC design flow'],
    benefits: ['15 months salary', 'Housing subsidy', 'Medical insurance', 'Year-end bonus', 'Employee stock ownership plan'],
    postedTime: '2026-01-08',
    relevanceScore: 88,
    url: '#',
    source: 'Enterprise Recruitment Platform',
    viewCount: 150,
    applyCount: 38,
    rating: 4.6,
    deadline: '2026-05-15',
    tags: {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.ALGORITHM_ENGINEER
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z'
  },
  {
    id: '6',
    title: 'Physics Postdoctoral Fellow',
    company: 'University of Science and Technology of China',
    location: 'Hefei',
    salary: 'Annual Salary: $45,000-60,000',
    type: 'Full-time',
    experience: 'No requirement',
    degree: 'PhD',
    skills: ['Physics', 'Quantum Physics', 'Experimental Physics', 'Data Analysis'],
    description: 'Engage in postdoctoral research in quantum physics',
    requirements: ['PhD in Physics or related field', 'Quantum physics research experience', 'Published high-level papers'],
    benefits: ['Postdoctoral fellowship', 'Research start-up fund', 'Housing subsidy', 'Title evaluation benefits'],
    postedTime: '2026-01-10',
    relevanceScore: 80,
    url: '#',
    source: 'University Recruitment Platform',
    viewCount: 85,
    applyCount: 15,
    rating: 4.4,
    deadline: '2026-06-30',
    tags: {
      category: JobCategory.UNIVERSITY,
      subType: UniversityJobSubType.POSTDOC
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z'
  },
  {
    id: '7',
    title: 'FinTech Technical Director',
    company: 'Ant Group',
    location: 'Hangzhou',
    salary: 'Annual Salary: $135,000-195,000',
    type: 'Full-time',
    experience: '8-15 years',
    degree: 'Master or above',
    skills: ['FinTech', 'Blockchain', 'Artificial Intelligence', 'Technical Management'],
    description: 'Responsible for technical strategic planning and team management of fintech products',
    requirements: ['Master or above in Computer Science/Finance', '8+ years of fintech experience', '5+ years of technical management experience'],
    benefits: ['18 months salary', 'Stock options', 'Luxury office environment', 'High-end medical insurance', 'Children education subsidy'],
    postedTime: '2026-01-14',
    relevanceScore: 95,
    url: '#',
    source: 'Enterprise Recruitment Platform',
    viewCount: 230,
    applyCount: 58,
    rating: 4.9,
    deadline: '2026-05-20',
    tags: {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.TECH_DIRECTOR
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-14T00:00:00Z',
    updatedAt: '2026-01-14T00:00:00Z'
  },
  {
    id: '8',
    title: 'Associate Professor of Chemical Engineering',
    company: 'Zhejiang University',
    location: 'Hangzhou',
    salary: 'Annual Salary: $67,500-97,500',
    type: 'Full-time',
    experience: '5-10 years',
    degree: 'PhD',
    skills: ['Chemical Engineering', 'Materials Science', 'Reaction Engineering', 'Catalysis'],
    description: 'Responsible for teaching and research in chemical engineering',
    requirements: ['PhD in Chemical Engineering or related field', '5+ years of relevant research experience', 'Published high-level papers'],
    benefits: ['Career establishment', 'Research start-up fund', 'Housing subsidy', 'Academic exchange funds'],
    postedTime: '2026-01-12',
    relevanceScore: 87,
    url: '#',
    source: 'University Recruitment Platform',
    viewCount: 105,
    applyCount: 22,
    rating: 4.6,
    deadline: '2026-07-15',
    tags: {
      category: JobCategory.UNIVERSITY,
      subType: UniversityJobSubType.PROFESSOR
    },
    libraryType: JobLibraryType.PUBLIC,
    status: JobStatus.ACTIVE,
    isMatched: false,
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z'
  },
];

// 模拟热门岗位数据，支持所有语言
const hotJobs = (lang: Language): Job[] => {
  // 中文返回中文岗位，其他语言返回英文岗位
  return lang === 'zh' ? zhJobs : enJobs;
};

export default function JobsPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('zh');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [jobViewCount, setJobViewCount] = useState(0);
  const t = getTranslation(lang);

  // 模拟登录状态
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserName(user.username || 'User');
    }
    
    // 从localStorage获取岗位浏览次数
    const storedViewCount = localStorage.getItem('jobViewCount');
    if (storedViewCount) {
      setJobViewCount(parseInt(storedViewCount));
    }
  }, []);

  // 当岗位浏览次数变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('jobViewCount', jobViewCount.toString());
    
    // 当浏览次数达到5时，弹出上传简历的提醒
    if (jobViewCount === 5) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (!user.hasUploadedResume) {
          const showUploadModal = window.confirm('您已经浏览了5个岗位，为了给您提供更精准的岗位推荐，建议您上传简历。是否现在上传？');
          if (showUploadModal) {
            // 导航到首页上传区域
            window.location.href = '/#upload-resume';
          }
        }
      }
    }
  }, [jobViewCount, router]);

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };

  const filteredJobs = selectedType === 'all' 
    ? hotJobs(lang)
    : hotJobs(lang).filter(job => job.tags.category === (selectedType === 'university' ? JobCategory.UNIVERSITY : JobCategory.ENTERPRISE));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as Language)} 
      />

      {/* 页面内容 */}
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.jobs.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {lang === 'zh' ? '发现最新最热的博士岗位机会，找到最适合您的职业发展方向' : 'Discover the latest and hottest PhD job opportunities, find the most suitable career development direction for you'}
          </p>
        </div>

        {/* 职位类型筛选 */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-6 py-2 rounded-full transition-colors ${selectedType === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t.jobs.filter.all}
          </button>
          <button
            onClick={() => setSelectedType('university')}
            className={`px-6 py-2 rounded-full transition-colors ${selectedType === 'university' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t.jobs.filter.academic}
          </button>
          <button
            onClick={() => setSelectedType('enterprise')}
            className={`px-6 py-2 rounded-full transition-colors ${selectedType === 'enterprise' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t.jobs.filter.enterprise}
          </button>
        </div>

        {/* 职位列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={(jobId) => {
                // 增加岗位浏览次数
                setJobViewCount(prevCount => prevCount + 1);
                // 导航到岗位详情页面
                router.push(`/job/${jobId}`);
              }}
              showFavoriteButton={true}
              isFavorite={false}
            />
          ))}
        </div>

        {/* 空状态 */}
        {filteredJobs.length === 0 && (
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

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Unique%20tech%20logo%20for%20PhD%20job%20platform%2C%20futuristic%20design%20with%20hexagon%20and%20upward%20arrow%2C%20purple%20and%20blue%20gradient%2C%20minimalist%20style%2C%20not%20similar%20to%20Baidu%20Netdisk%20logo%2C%20clean%20white%20background%2C%20professional%20and%20distinctive&image_size=square_hd" alt={t.nav.siteName} className="h-10 w-10 mr-2" />
                <h3 className="text-xl font-bold">{t.nav.siteName}</h3>
              </div>
              <p className="text-gray-400">
                {lang === 'zh' ? '为博士人才提供精准的岗位匹配服务' : 'Providing precise job matching services for PhD talents'}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.quickLinks}</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">{t.nav.home}</a></li>
                <li><a href="/university" className="text-gray-400 hover:text-white">{t.nav.university}</a></li>
                <li><a href="/enterprise" className="text-gray-400 hover:text-white">{t.nav.enterprise}</a></li>
                <li><a href="/jobs" className="text-gray-400 hover:text-white">{t.nav.jobs}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.aboutUs}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">{t.footer.platformIntro}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{t.footer.partners}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{t.footer.contactUs}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.contact}</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">email@example.com</li>
                <li className="text-gray-400">+86 123 4567 8910</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
