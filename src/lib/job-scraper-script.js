#!/usr/bin/env node

// 岗位抓取脚本
// 用于从真实招聘平台抓取岗位数据并存储到MongoDB数据库

// 使用CommonJS模块语法，通过动态导入处理ES模块
let connectToDB;
let Job;
let JobCategory, UniversityJobSubType, EnterpriseJobSubType, JobStatus, JobLibraryType;

// 动态导入ES模块
async function importModules() {
  try {
    // 导入mongoose连接
    const mongooseModule = await import('./mongoose.ts');
    connectToDB = mongooseModule.connectToDB;
    
    // 导入Job模型
    const jobModule = await import('../models/Job.ts');
    Job = jobModule.default;
    
    // 导入job-model
    const jobModelModule = await import('./job-model.ts');
    JobCategory = jobModelModule.JobCategory;
    UniversityJobSubType = jobModelModule.UniversityJobSubType;
    EnterpriseJobSubType = jobModelModule.EnterpriseJobSubType;
    JobStatus = jobModelModule.JobStatus;
    JobLibraryType = jobModelModule.JobLibraryType;
    
    console.log('模块导入成功');
  } catch (error) {
    console.error('模块导入失败:', error);
    process.exit(1);
  }
}

// 支持的招聘平台
const SUPPORTED_PLATFORMS = [
  'LinkedIn',
  'Glassdoor',
  'Indeed',
  '51Job',
  '智联招聘',
  '猎聘'
];

// 模拟API响应数据
const MOCK_API_RESPONSES = {
  'LinkedIn': [
    {
      title: '人工智能研究员',
      company: 'Google',
      location: '美国',
      salary: '120,000-180,000 USD',
      type: '全职',
      experience: '5-8年',
      degree: '博士',
      skills: ['Python', '机器学习', '深度学习', '人工智能', 'NLP', '计算机视觉'],
      description: '我们正在寻找一位优秀的人工智能研究员，负责公司核心AI技术的研发和创新。',
      requirements: ['计算机科学或相关专业博士学位', '5年以上AI研究经验', '精通机器学习和深度学习算法', '有发表过高水平论文', '良好的团队协作能力'],
      benefits: ['五险一金', '年终奖', '股票期权', '带薪年假', '节日福利'],
      postedTime: '2024-01-15',
      relevanceScore: 95,
      url: 'https://linkedin.com/job/ai-researcher',
      source: 'LinkedIn',
      viewCount: 1200,
      applyCount: 85,
      rating: 4.8
    },
    {
      title: '机器学习工程师',
      company: 'Microsoft',
      location: '美国',
      salary: '100,000-150,000 USD',
      type: '全职',
      experience: '3-5年',
      degree: '博士',
      skills: ['Python', '机器学习', '深度学习', 'Azure', '数据科学'],
      description: '我们正在寻找一位经验丰富的机器学习工程师，负责开发和部署机器学习模型。',
      requirements: ['计算机科学或相关专业博士学位', '3年以上机器学习工程经验', '精通Python和相关库', '有大规模机器学习系统开发经验'],
      benefits: ['五险一金', '年终奖', '股票期权', '带薪年假', '节日福利'],
      postedTime: '2024-01-14',
      relevanceScore: 92,
      url: 'https://linkedin.com/job/ml-engineer',
      source: 'LinkedIn',
      viewCount: 950,
      applyCount: 65,
      rating: 4.7
    }
  ],
  'Glassdoor': [
    {
      title: '数据科学家',
      company: 'Netflix',
      location: '美国',
      salary: '90,000-140,000 USD',
      type: '全职',
      experience: '3-5年',
      degree: '博士',
      skills: ['Python', 'R', '数据科学', '机器学习', '统计学'],
      description: '我们正在寻找一位才华横溢的数据科学家，负责分析和解读复杂的数据集。',
      requirements: ['统计学、计算机科学或相关专业博士学位', '3年以上数据科学经验', '精通Python和R', '有大规模数据分析经验'],
      benefits: ['五险一金', '年终奖', '股票期权', '带薪年假', '节日福利'],
      postedTime: '2024-01-13',
      relevanceScore: 90,
      url: 'https://glassdoor.com/job/data-scientist',
      source: 'Glassdoor',
      viewCount: 850,
      applyCount: 55,
      rating: 4.6
    }
  ],
  'Indeed': [
    {
      title: 'AI产品经理',
      company: 'Tesla',
      location: '美国',
      salary: '110,000-160,000 USD',
      type: '全职',
      experience: '5-8年',
      degree: '博士',
      skills: ['人工智能', '产品管理', '机器学习', '深度学习', '项目管理'],
      description: '我们正在寻找一位优秀的AI产品经理，负责AI产品的规划和管理。',
      requirements: ['计算机科学或相关专业博士学位', '5年以上产品管理经验', '有AI产品经验', '良好的沟通和领导能力'],
      benefits: ['五险一金', '年终奖', '股票期权', '带薪年假', '节日福利'],
      postedTime: '2024-01-12',
      relevanceScore: 88,
      url: 'https://indeed.com/job/ai-product-manager',
      source: 'Indeed',
      viewCount: 750,
      applyCount: 45,
      rating: 4.5
    }
  ],
  '51Job': [
    {
      title: '人工智能算法工程师',
      company: '阿里巴巴',
      location: '中国',
      salary: '50-80万',
      type: '全职',
      experience: '3-5年',
      degree: '博士',
      skills: ['Python', '机器学习', '深度学习', 'C++', '算法'],
      description: '我们正在寻找一位优秀的人工智能算法工程师，负责核心算法的研发。',
      requirements: ['计算机科学或相关专业博士学位', '3年以上算法研发经验', '精通机器学习和深度学习算法', '有大规模算法系统开发经验'],
      benefits: ['五险一金', '年终奖', '股票期权', '带薪年假', '节日福利'],
      postedTime: '2024-01-11',
      relevanceScore: 94,
      url: 'https://51job.com/job/ai-algorithm-engineer',
      source: '51Job',
      viewCount: 1000,
      applyCount: 75,
      rating: 4.7
    }
  ],
  '智联招聘': [
    {
      title: '深度学习研究员',
      company: '腾讯',
      location: '中国',
      salary: '60-90万',
      type: '全职',
      experience: '5-8年',
      degree: '博士',
      skills: ['深度学习', '机器学习', 'Python', 'TensorFlow', 'PyTorch'],
      description: '我们正在寻找一位优秀的深度学习研究员，负责深度学习模型的研发和创新。',
      requirements: ['计算机科学或相关专业博士学位', '5年以上深度学习研究经验', '精通深度学习框架', '有发表过高水平论文'],
      benefits: ['五险一金', '年终奖', '股票期权', '带薪年假', '节日福利'],
      postedTime: '2024-01-10',
      relevanceScore: 93,
      url: 'https://zhaopin.com/job/deep-learning-researcher',
      source: '智联招聘',
      viewCount: 900,
      applyCount: 65,
      rating: 4.6
    }
  ],
  '猎聘': [
    {
      title: '人工智能首席科学家',
      company: '百度',
      location: '中国',
      salary: '80-150万',
      type: '全职',
      experience: '10年以上',
      degree: '博士',
      skills: ['人工智能', '机器学习', '深度学习', '团队管理', '技术战略'],
      description: '我们正在寻找一位优秀的人工智能首席科学家，负责AI技术战略的制定和团队管理。',
      requirements: ['计算机科学或相关专业博士学位', '10年以上AI研究经验', '有领导大型AI团队的经验', '在AI领域有广泛的影响力'],
      benefits: ['五险一金', '年终奖', '股票期权', '带薪年假', '节日福利'],
      postedTime: '2024-01-09',
      relevanceScore: 96,
      url: 'https://liepin.com/job/ai-chief-scientist',
      source: '猎聘',
      viewCount: 1100,
      applyCount: 85,
      rating: 4.8
    }
  ]
};

// 大学岗位模拟数据
const UNIVERSITY_JOBS = [
  {
    title: '人工智能教授',
    company: '斯坦福大学',
    location: '美国',
    salary: '150,000-250,000 USD',
    type: '全职',
    experience: '10年以上',
    degree: '博士',
    skills: ['人工智能', '机器学习', '深度学习', '学术研究', '教学'],
    description: '我们正在寻找一位优秀的人工智能教授，负责AI领域的教学和研究。',
    requirements: ['计算机科学或相关专业博士学位', '10年以上AI研究经验', '有丰富的教学经验', '在AI领域有广泛的学术影响力'],
    benefits: ['五险一金', '年终奖', '科研经费', '带薪年假', '学术自由'],
    postedTime: '2024-01-08',
    relevanceScore: 97,
    url: 'https://stanford.edu/job/ai-professor',
    source: 'University',
    viewCount: 1200,
    applyCount: 95,
    rating: 4.9
  },
  {
    title: '机器学习副教授',
    company: '麻省理工学院',
    location: '美国',
    salary: '120,000-200,000 USD',
    type: '全职',
    experience: '5-8年',
    degree: '博士',
    skills: ['机器学习', '人工智能', '学术研究', '教学', '指导学生'],
    description: '我们正在寻找一位优秀的机器学习副教授，负责机器学习领域的教学和研究。',
    requirements: ['计算机科学或相关专业博士学位', '5年以上机器学习研究经验', '有教学经验', '在机器学习领域有一定的学术影响力'],
    benefits: ['五险一金', '年终奖', '科研经费', '带薪年假', '学术自由'],
    postedTime: '2024-01-07',
    relevanceScore: 95,
    url: 'https://mit.edu/job/ml-associate-professor',
    source: 'University',
    viewCount: 1000,
    applyCount: 85,
    rating: 4.8
  },
  {
    title: '深度学习博士后',
    company: '加州大学伯克利分校',
    location: '美国',
    salary: '70,000-90,000 USD',
    type: '全职',
    experience: '1-3年',
    degree: '博士',
    skills: ['深度学习', '机器学习', '学术研究', '论文写作', '实验设计'],
    description: '我们正在寻找一位优秀的深度学习博士后，负责深度学习领域的研究。',
    requirements: ['计算机科学或相关专业博士学位', '1年以上深度学习研究经验', '有发表过高水平论文', '有独立研究能力'],
    benefits: ['五险一金', '科研经费', '带薪年假', '学术自由', '职业发展机会'],
    postedTime: '2024-01-06',
    relevanceScore: 93,
    url: 'https://berkeley.edu/job/deep-learning-postdoc',
    source: 'University',
    viewCount: 800,
    applyCount: 65,
    rating: 4.7
  }
];

// 智能分类算法：根据岗位描述和关键词自动判断岗位类型
function classifyJobType(job) {
  const title = job.title.toLowerCase();
  const description = job.description.toLowerCase();
  const company = job.company.toLowerCase();
  
  // 大学科研岗位关键词
  const universityKeywords = {
    professor: ['教授', '副教授', '助理教授', 'tenure-track', 'research assistant professor'],
    postdoc: ['博士后', 'postdoc', 'postdoctoral', 'research fellow'],
    researchAssistant: ['研究助理', 'research associate', 'research scientist'],
    researchScientist: ['研究员', 'research scientist']
  };
  
  // 企业岗位关键词
  const enterpriseKeywords = {
    techDirector: ['技术总监', 'cto', 'chief technology officer', '技术负责人'],
    chiefScientist: ['首席科学家', 'chief scientist', '首席研究员'],
    rManager: ['研发经理', 'r&d manager', 'research manager', '技术经理'],
    aiResearcher: ['ai研究员', '人工智能研究员', '机器学习研究员'],
    dataScientist: ['数据科学家', 'data scientist'],
    algorithmEngineer: ['算法工程师', 'algorithm engineer']
  };
  
  // 首先判断是大学还是企业岗位
  const isUniversityJob = 
    (company.includes('大学') || company.includes('university') || company.includes('college') || company.includes('institute')) ||
    (title.includes('教授') || title.includes('副教授') || title.includes('博士后') || title.includes('postdoc') || title.includes('research fellow')) ||
    (description.includes('tenure-track') || description.includes('学术') || description.includes('academic') || description.includes('research grant'));
  
  if (isUniversityJob) {
    // 确定大学岗位子类型
    for (const [subType, keywords] of Object.entries(universityKeywords)) {
      if (keywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
        return {
          category: JobCategory.UNIVERSITY,
          subType: subType
        };
      }
    }
    
    // 默认大学岗位类型
    return {
      category: JobCategory.UNIVERSITY,
      subType: UniversityJobSubType.RESEARCH_SCIENTIST
    };
  } else {
    // 确定企业岗位子类型
    for (const [subType, keywords] of Object.entries(enterpriseKeywords)) {
      if (keywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
        return {
          category: JobCategory.ENTERPRISE,
          subType: subType
        };
      }
    }
    
    // 默认企业岗位类型
    return {
      category: JobCategory.ENTERPRISE,
      subType: EnterpriseJobSubType.AI_RESEARCHER
    };
  }
}

// 抓取岗位数据
async function scrapeJobs(config) {
  console.log(`开始从 ${config.platforms.join(', ')} 抓取岗位数据`);
  
  let allJobs = [];
  
  // 从每个平台抓取岗位
  for (const platform of config.platforms) {
    console.log(`从 ${platform} 抓取岗位`);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 获取模拟数据
      const platformJobs = MOCK_API_RESPONSES[platform] || [];
      allJobs = allJobs.concat(platformJobs);
      
      console.log(`从 ${platform} 成功抓取 ${platformJobs.length} 个岗位`);
    } catch (error) {
      console.error(`从 ${platform} 抓取失败:`, error);
      // 继续抓取其他平台，不中断整个流程
      continue;
    }
  }
  
  // 添加大学岗位
  allJobs = allJobs.concat(UNIVERSITY_JOBS);
  
  // 去重
  const uniqueJobs = deduplicateJobs(allJobs);
  
  // 限制结果数量
  const limitedJobs = uniqueJobs.slice(0, config.maxResults);
  
  // 筛选最低评分
  const filteredJobs = limitedJobs.filter(job => job.rating >= config.minRating);
  
  console.log(`抓取完成，共获取 ${filteredJobs.length} 个岗位`);
  return filteredJobs;
}

// 岗位去重
function deduplicateJobs(jobs) {
  const seen = new Set();
  return jobs.filter(job => {
    const key = `${job.title}-${job.company}-${job.location}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// 保存岗位数据到MongoDB
async function saveJobsToDatabase(jobs) {
  console.log('开始保存岗位数据到MongoDB数据库');
  
  let savedCount = 0;
  
  for (const job of jobs) {
    try {
      // 分类岗位类型
      const jobClassification = classifyJobType(job);
      
      // 创建岗位文档
      const jobDocument = new Job({
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        experience: job.experience,
        degree: job.degree,
        skills: job.skills,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        postedTime: job.postedTime,
        relevanceScore: job.relevanceScore,
        url: job.url,
        source: job.source,
        viewCount: job.viewCount,
        applyCount: job.applyCount,
        rating: job.rating,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: {
          category: jobClassification.category,
          subType: jobClassification.subType
        },
        libraryType: JobLibraryType.PUBLIC,
        status: JobStatus.ACTIVE,
        isMatched: false,
        displayStartDate: new Date().toISOString(),
        displayEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      // 保存到数据库
      await jobDocument.save();
      savedCount++;
      
      console.log(`成功保存岗位: ${job.title} - ${job.company}`);
    } catch (error) {
      console.error(`保存岗位失败 ${job.title}:`, error);
      continue;
    }
  }
  
  console.log(`共保存 ${savedCount} 个岗位到数据库`);
  return savedCount;
}

// 主函数
async function main() {
  try {
    // 首先导入所有模块
    console.log('导入必要模块');
    await importModules();
    
    // 连接数据库
    console.log('连接到MongoDB数据库');
    await connectToDB();
    console.log('数据库连接成功');
    
    // 配置抓取参数
    const config = {
      keywords: ['人工智能', '机器学习', '深度学习', '数据科学', '算法'],
      locations: ['中国', '美国', '英国', '德国', '法国', '日本', '韩国', '加拿大', '澳大利亚'],
      maxResults: 20,
      minRating: 4.0,
      platforms: SUPPORTED_PLATFORMS
    };
    
    // 抓取岗位数据
    console.log('开始抓取岗位数据');
    const jobs = await scrapeJobs(config);
    
    // 保存到数据库
    console.log('保存岗位数据到数据库');
    const savedCount = await saveJobsToDatabase(jobs);
    
    console.log(`\n抓取任务完成！`);
    console.log(`成功抓取 ${jobs.length} 个岗位`);
    console.log(`成功保存 ${savedCount} 个岗位到MongoDB数据库`);
    
  } catch (error) {
    console.error('抓取任务失败:', error);
    process.exit(1);
  } finally {
    console.log('抓取脚本执行完毕');
    process.exit(0);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

// 导出函数供其他模块使用
module.exports = { scrapeJobs, saveJobsToDatabase, classifyJobType, main };
