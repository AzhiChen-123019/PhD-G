import { NextRequest, NextResponse } from 'next/server';
import { Job, JobStatus, JobCategory, UniversityJobSubType, EnterpriseJobSubType, JobLibraryType } from '@/lib/job-model';

// 内存存储，用于模拟数据库
let jobs: Job[] = [];

// 初始化示例数据
const initializeSampleJobs = () => {
  const sampleJobs: Job[] = [
    {
      id: '1',
      title: '人工智能助理教授',
      company: '北京大学',
      location: '北京',
      salary: '年薪40-60万',
      type: 'university',
      deadline: '2026-06-30',
      description: '北京大学计算机科学技术研究所诚聘人工智能方向助理教授',
      requirements: [
        '计算机科学、人工智能或相关领域博士学位',
        '在人工智能领域有高水平学术成果',
        '具有良好的教学能力和团队合作精神',
        '能够独立开展科研工作并指导研究生'
      ],
      benefits: [
        '具有竞争力的薪资待遇',
        '良好的科研环境和团队支持',
        '提供科研启动经费',
        '协助解决住房问题',
        '子女入学优惠政策'
      ],
      skills: ['人工智能', '机器学习', '深度学习', '计算机视觉', '自然语言处理'],
      postedTime: new Date().toISOString(),
      relevanceScore: 95,
      url: 'https://example.com/job/1',
      source: 'university',
      viewCount: 100,
      applyCount: 20,
      rating: 4.8,
      experience: '不限',
      degree: '博士',
      status: JobStatus.ACTIVE,
      libraryType: JobLibraryType.PUBLIC,
      isMatched: false,
      tags: {
        category: JobCategory.UNIVERSITY,
        subType: UniversityJobSubType.PROFESSOR
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: '高级机器学习工程师',
      company: '腾讯科技',
      location: '深圳',
      salary: '年薪60-80万',
      type: 'enterprise',
      deadline: '2026-05-15',
      description: '腾讯科技人工智能实验室诚聘高级机器学习工程师',
      requirements: [
        '计算机科学、人工智能或相关领域硕士及以上学位',
        '3年以上机器学习相关工作经验',
        '精通Python、TensorFlow或PyTorch等深度学习框架',
        '有大规模机器学习系统研发经验',
        '良好的团队合作和沟通能力'
      ],
      benefits: [
        '具有竞争力的薪资待遇',
        '完善的福利体系',
        '良好的职业发展空间',
        '国际化的工作环境',
        '丰富的技术交流机会'
      ],
      skills: ['机器学习', '深度学习', 'Python', 'TensorFlow', 'PyTorch', '分布式计算'],
      postedTime: new Date().toISOString(),
      relevanceScore: 92,
      url: 'https://example.com/job/2',
      source: 'enterprise',
      viewCount: 150,
      applyCount: 35,
      rating: 4.7,
      experience: '3年以上',
      degree: '硕士及以上',
      status: JobStatus.ACTIVE,
      libraryType: JobLibraryType.PUBLIC,
      isMatched: false,
      tags: {
        category: JobCategory.ENTERPRISE,
        subType: EnterpriseJobSubType.TECH_DIRECTOR
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  jobs = sampleJobs;
};

// 初始化示例数据
initializeSampleJobs();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    let filteredJobs = jobs;
    
    // 按类别筛选
    if (category && category !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.tags.category === category);
    }
    
    // 按状态筛选
    if (status && status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    
    return NextResponse.json(filteredJobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();
    
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      salary: jobData.salary,
      type: jobData.type,
      deadline: jobData.deadline,
      description: jobData.description,
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || [],
      skills: jobData.skills || [],
      postedTime: new Date().toISOString(),
      relevanceScore: jobData.relevanceScore || 0,
      url: jobData.url || '',
      source: jobData.source || 'manual',
      viewCount: 0,
      applyCount: 0,
      rating: jobData.rating || 0,
      experience: jobData.experience || '',
      degree: jobData.degree || '',
      status: JobStatus.ACTIVE,
      libraryType: JobLibraryType.PUBLIC,
      isMatched: false,
      tags: jobData.tags || {
        category: jobData.type === 'university' ? JobCategory.UNIVERSITY : JobCategory.ENTERPRISE,
        subType: 'other'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    jobs.push(newJob);
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }
    
    const jobData = await request.json();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    const updatedJob: Job = {
      ...jobs[jobIndex],
      ...jobData,
      updatedAt: new Date().toISOString()
    };
    
    jobs[jobIndex] = updatedJob;
    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }
    
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    jobs.splice(jobIndex, 1);
    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
