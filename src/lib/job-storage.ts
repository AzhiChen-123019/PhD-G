// 岗位数据存储和管理方案

import { 
  Job, 
  JobLibraryType, 
  JobStatus, 
  UserPrivateJob, 
  JobFavorite, 
  JobApplication,
  JobCategory,
  UniversityJobSubType,
  EnterpriseJobSubType
} from './job-model';
import { filterActiveJobs } from './job-management';
import { JOB_MANAGEMENT_CONSTANTS } from './job-management';

/**
 * 本地存储键名
 */
const STORAGE_KEYS = {
  ALL_JOBS: 'allJobs',              // 所有岗位（公共+私人）
  PRIVATE_JOBS_PREFIX: 'privateJobs_', // 用户私人岗位前缀
  JOB_FAVORITES_PREFIX: 'jobFavorites_', // 用户岗位收藏前缀
  JOB_APPLICATIONS_PREFIX: 'jobApplications_', // 用户岗位申请前缀
};

/**
 * 岗位存储管理器类
 */
export class JobStorageManager {
  /**
   * 获取所有公共岗位
   * @returns 公共岗位列表
   */
  static getPublicJobs(): Job[] {
    const allJobs = this.getAllJobs();
    return allJobs.filter(job => 
      job.libraryType === JobLibraryType.PUBLIC && 
      job.status === JobStatus.ACTIVE
    );
  }

  /**
   * 获取所有岗位（公共+私人）
   * @returns 所有岗位列表
   */
  static getAllJobs(): Job[] {
    try {
      const jobsJson = localStorage.getItem(STORAGE_KEYS.ALL_JOBS);
      return jobsJson ? JSON.parse(jobsJson) : [];
    } catch (error) {
      console.error('Error getting all jobs:', error);
      return [];
    }
  }

  /**
   * 保存所有岗位
   * @param jobs 岗位列表
   */
  static saveAllJobs(jobs: Job[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_JOBS, JSON.stringify(jobs));
    } catch (error) {
      console.error('Error saving all jobs:', error);
    }
  }

  /**
   * 添加新岗位
   * @param job 岗位信息
   */
  static addJob(job: Job): void {
    const allJobs = this.getAllJobs();
    // 检查是否已存在
    const existingIndex = allJobs.findIndex(j => j.id === job.id);
    
    if (existingIndex >= 0) {
      // 更新现有岗位
      allJobs[existingIndex] = job;
    } else {
      // 添加新岗位
      allJobs.push(job);
    }
    
    this.saveAllJobs(allJobs);
  }

  /**
   * 更新岗位
   * @param jobId 岗位ID
   * @param updatedFields 更新的字段
   */
  static updateJob(jobId: string, updatedFields: Partial<Job>): void {
    const allJobs = this.getAllJobs();
    const existingIndex = allJobs.findIndex(job => job.id === jobId);
    
    if (existingIndex >= 0) {
      allJobs[existingIndex] = {
        ...allJobs[existingIndex],
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };
      this.saveAllJobs(allJobs);
    }
  }

  /**
   * 删除岗位
   * @param jobId 岗位ID
   */
  static deleteJob(jobId: string): void {
    const allJobs = this.getAllJobs();
    const filteredJobs = allJobs.filter(job => job.id !== jobId);
    this.saveAllJobs(filteredJobs);
  }

  /**
   * 根据ID获取岗位
   * @param jobId 岗位ID
   * @returns 岗位信息或undefined
   */
  static getJobById(jobId: string): Job | undefined {
    const allJobs = this.getAllJobs();
    return allJobs.find(job => job.id === jobId);
  }

  /**
   * 获取用户私人岗位
   * @param userId 用户ID
   * @returns 用户私人岗位列表
   */
  static getUserPrivateJobs(userId: string): UserPrivateJob[] {
    try {
      const privateJobsJson = localStorage.getItem(`${STORAGE_KEYS.PRIVATE_JOBS_PREFIX}${userId}`);
      return privateJobsJson ? JSON.parse(privateJobsJson) : [];
    } catch (error) {
      console.error('Error getting user private jobs:', error);
      return [];
    }
  }

  /**
   * 保存用户私人岗位
   * @param userId 用户ID
   * @param privateJobs 用户私人岗位列表
   */
  static saveUserPrivateJobs(userId: string, privateJobs: UserPrivateJob[]): void {
    try {
      localStorage.setItem(`${STORAGE_KEYS.PRIVATE_JOBS_PREFIX}${userId}`, JSON.stringify(privateJobs));
    } catch (error) {
      console.error('Error saving user private jobs:', error);
    }
  }

  /**
   * 将岗位添加到用户私人库
   * @param userId 用户ID
   * @param job 岗位信息
   * @returns 添加结果
   */
  static addJobToPrivateLibrary(userId: string, job: Job): boolean {
    // 检查用户私人岗位数量是否已达上限
    const currentPrivateJobs = this.getUserPrivateJobs(userId);
    if (currentPrivateJobs.length >= JOB_MANAGEMENT_CONSTANTS.MAX_PRIVATE_JOBS) {
      return false;
    }

    // 设置30天展示期
    const now = new Date();
    const displayStartDate = now.toISOString();
    const displayEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // 更新岗位状态为私人库
    const privateJob: Job = {
      ...job,
      libraryType: JobLibraryType.PRIVATE,
      userId,
      isMatched: true,
      displayStartDate,
      displayEndDate,
      updatedAt: now.toISOString()
    };

    // 更新所有岗位列表
    this.updateJob(job.id, privateJob);

    // 创建用户私人岗位关联
    const newUserPrivateJob: UserPrivateJob = {
      id: `upj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      jobId: job.id,
      job: privateJob,
      matchedAt: now.toISOString(),
      isRemoved: false
    };

    // 添加到用户私人岗位列表
    const updatedPrivateJobs = [...currentPrivateJobs, newUserPrivateJob];
    this.saveUserPrivateJobs(userId, updatedPrivateJobs);

    return true;
  }

  /**
   * 将岗位从用户私人库移除，返回公共库
   * @param userId 用户ID
   * @param jobId 岗位ID
   * @returns 移除结果
   */
  static removeJobFromPrivateLibrary(userId: string, jobId: string): boolean {
    // 获取用户私人岗位
    const currentPrivateJobs = this.getUserPrivateJobs(userId);
    const jobToRemove = currentPrivateJobs.find(item => item.jobId === jobId && item.userId === userId);

    if (!jobToRemove) {
      return false;
    }

    // 计算剩余展示天数
    const now = new Date();
    const displayStartDate = new Date(jobToRemove.job.displayStartDate || now);
    const originalDisplayEndDate = new Date(jobToRemove.job.displayEndDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
    
    // 计算已展示天数（毫秒转换为天，向上取整）
    const daysDisplayed = Math.ceil((now.getTime() - displayStartDate.getTime()) / (1000 * 60 * 60 * 24));
    // 计算剩余天数（总天数30天 - 已展示天数，最小为0）
    const remainingDays = Math.max(0, 30 - daysDisplayed);
    
    // 计算新的展示结束时间
    const newDisplayEndDate = new Date(now.getTime() + remainingDays * 24 * 60 * 60 * 1000);

    // 更新岗位状态为公共库，并设置剩余展示期
    // 注意：岗位标签由系统根据岗位内容自动分配，这里不需要修改
    const publicJob: Job = {
      ...jobToRemove.job,
      libraryType: JobLibraryType.PUBLIC,
      userId: undefined,
      isMatched: false,
      displayStartDate: now.toISOString(), // 更新开始时间为当前时间
      displayEndDate: newDisplayEndDate.toISOString(), // 设置新的结束时间为当前时间+剩余天数
      updatedAt: now.toISOString()
    };

    // 更新所有岗位列表
    this.updateJob(jobId, publicJob);

    // 从用户私人岗位列表移除
    const updatedPrivateJobs = currentPrivateJobs.filter(item => !(item.jobId === jobId && item.userId === userId));
    this.saveUserPrivateJobs(userId, updatedPrivateJobs);

    return true;
  }

  /**
   * 获取用户可匹配的公共岗位（过滤掉已匹配和过期的岗位）
   * @param userId 用户ID
   * @returns 可匹配的公共岗位列表
   */
  static getMatchablePublicJobs(userId: string): Job[] {
    // 获取所有公共岗位
    const allPublicJobs = this.getPublicJobs();
    // 获取用户已有的私人岗位ID
    const userPrivateJobs = this.getUserPrivateJobs(userId);
    const userJobIds = new Set(userPrivateJobs.map(item => item.jobId));
    
    // 过滤掉用户已有的岗位，只保留活跃岗位
    return filterActiveJobs(allPublicJobs).filter(job => !userJobIds.has(job.id));
  }

  /**
   * 获取用户岗位收藏
   * @param userId 用户ID
   * @returns 用户岗位收藏列表
   */
  static getUserJobFavorites(userId: string): JobFavorite[] {
    try {
      const favoritesJson = localStorage.getItem(`${STORAGE_KEYS.JOB_FAVORITES_PREFIX}${userId}`);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error getting user job favorites:', error);
      return [];
    }
  }

  /**
   * 添加岗位到收藏
   * @param userId 用户ID
   * @param favorite 岗位收藏信息
   */
  static addJobFavorite(userId: string, favorite: JobFavorite): void {
    const currentFavorites = this.getUserJobFavorites(userId);
    // 检查是否已收藏
    const isAlreadyFavorited = currentFavorites.some(fav => fav.jobId === favorite.jobId);
    
    if (!isAlreadyFavorited) {
      const updatedFavorites = [...currentFavorites, favorite];
      localStorage.setItem(`${STORAGE_KEYS.JOB_FAVORITES_PREFIX}${userId}`, JSON.stringify(updatedFavorites));
    }
  }

  /**
   * 从收藏中移除岗位
   * @param userId 用户ID
   * @param jobId 岗位ID
   */
  static removeJobFavorite(userId: string, jobId: string): void {
    const currentFavorites = this.getUserJobFavorites(userId);
    const updatedFavorites = currentFavorites.filter(fav => fav.jobId !== jobId);
    localStorage.setItem(`${STORAGE_KEYS.JOB_FAVORITES_PREFIX}${userId}`, JSON.stringify(updatedFavorites));
  }

  /**
   * 检查岗位是否被用户收藏
   * @param userId 用户ID
   * @param jobId 岗位ID
   * @returns 是否被收藏
   */
  static isJobFavorited(userId: string, jobId: string): boolean {
    const favorites = this.getUserJobFavorites(userId);
    return favorites.some(fav => fav.jobId === jobId);
  }

  /**
   * 获取用户岗位申请
   * @param userId 用户ID
   * @returns 用户岗位申请列表
   */
  static getUserJobApplications(userId: string): JobApplication[] {
    try {
      const applicationsJson = localStorage.getItem(`${STORAGE_KEYS.JOB_APPLICATIONS_PREFIX}${userId}`);
      return applicationsJson ? JSON.parse(applicationsJson) : [];
    } catch (error) {
      console.error('Error getting user job applications:', error);
      return [];
    }
  }

  /**
   * 添加岗位申请
   * @param userId 用户ID
   * @param application 岗位申请信息
   */
  static addJobApplication(userId: string, application: JobApplication): void {
    const currentApplications = this.getUserJobApplications(userId);
    // 检查是否已申请
    const isAlreadyApplied = currentApplications.some(app => app.jobId === application.jobId);
    
    if (!isAlreadyApplied) {
      const updatedApplications = [...currentApplications, application];
      localStorage.setItem(`${STORAGE_KEYS.JOB_APPLICATIONS_PREFIX}${userId}`, JSON.stringify(updatedApplications));
    }
  }

  /**
   * 更新岗位申请状态
   * @param userId 用户ID
   * @param applicationId 申请ID
   * @param status 新状态
   */
  static updateJobApplicationStatus(userId: string, applicationId: string, status: JobApplication['status']): void {
    const currentApplications = this.getUserJobApplications(userId);
    const applicationIndex = currentApplications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex >= 0) {
      currentApplications[applicationIndex] = {
        ...currentApplications[applicationIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`${STORAGE_KEYS.JOB_APPLICATIONS_PREFIX}${userId}`, JSON.stringify(currentApplications));
    }
  }

  /**
   * 检查用户是否已申请该岗位
   * @param userId 用户ID
   * @param jobId 岗位ID
   * @returns 是否已申请
   */
  static hasUserAppliedForJob(userId: string, jobId: string): { applied: boolean; status?: JobApplication['status'] } {
    const applications = this.getUserJobApplications(userId);
    const application = applications.find(app => app.jobId === jobId);
    
    if (application) {
      return { applied: true, status: application.status };
    }
    
    return { applied: false };
  }

  /**
   * 清理过期岗位
   */
  static cleanupExpiredJobs(): void {
    const allJobs = this.getAllJobs();
    const now = new Date();
    const activeJobs: Job[] = [];
    const expiredJobs: Job[] = [];
    
    allJobs.forEach(job => {
      // 检查岗位是否过期：1. 截止日期已过 2. 展示期已过
      const isDeadlineExpired = new Date(job.deadline) < now;
      const isDisplayExpired = job.displayEndDate && new Date(job.displayEndDate) < now;
      
      if (isDeadlineExpired || isDisplayExpired) {
        expiredJobs.push({
          ...job,
          status: JobStatus.EXPIRED,
          updatedAt: new Date().toISOString()
        });
      } else {
        activeJobs.push(job);
      }
    });
    
    // 更新所有岗位列表
    this.saveAllJobs([...activeJobs, ...expiredJobs]);
    
    console.log(`清理了 ${expiredJobs.length} 个过期岗位`);
  }

  /**
   * 清空所有岗位存储
   */
  static clearAllJobs(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ALL_JOBS);
      console.log('已清空所有岗位存储');
    } catch (error) {
      console.error('Error clearing all jobs:', error);
    }
  }

  /**
   * 初始化示例数据
   * @param sampleJobs 示例岗位数据
   */
  static initializeSampleData(sampleJobs: Job[]): void {
    // 检查是否已有数据
    const existingJobs = this.getAllJobs();
    if (existingJobs.length > 0) {
      return; // 已有数据，不覆盖
    }
    
    // 添加示例数据
    sampleJobs.forEach(job => {
      this.addJob(job);
    });
    
    console.log(`初始化了 ${sampleJobs.length} 个示例岗位`);
  }

  /**
   * 获取岗位数量统计
   * @param userId 用户ID
   * @returns 岗位数量统计
   */
  static getJobStats(userId: string): {
    totalPublicJobs: number;
    userPrivateJobs: number;
    userMaxPrivateJobs: number;
    userJobFavorites: number;
    userJobApplications: number;
  } {
    const totalPublicJobs = this.getPublicJobs().length;
    const userPrivateJobs = this.getUserPrivateJobs(userId).length;
    const userJobFavorites = this.getUserJobFavorites(userId).length;
    const userJobApplications = this.getUserJobApplications(userId).length;
    
    return {
      totalPublicJobs,
      userPrivateJobs,
      userMaxPrivateJobs: JOB_MANAGEMENT_CONSTANTS.MAX_PRIVATE_JOBS,
      userJobFavorites,
      userJobApplications
    };
  }

  /**
   * 添加或更新岗位满意度评分
   * @param userId 用户ID
   * @param jobId 岗位ID
   * @param score 满意度评分（1-5星）
   * @param feedback 详细反馈
   * @returns 是否成功
   */
  static rateJobSatisfaction(userId: string, jobId: string, score: number, feedback?: string): boolean {
    try {
      const userPrivateJobs = this.getUserPrivateJobs(userId);
      const jobIndex = userPrivateJobs.findIndex(item => item.jobId === jobId && item.userId === userId);
      
      if (jobIndex >= 0) {
        const updatedPrivateJobs = [...userPrivateJobs];
        updatedPrivateJobs[jobIndex] = {
          ...updatedPrivateJobs[jobIndex],
          satisfactionScore: score,
          ratedAt: new Date().toISOString(),
          feedback: feedback
        };
        
        this.saveUserPrivateJobs(userId, updatedPrivateJobs);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error rating job satisfaction:', error);
      return false;
    }
  }

  /**
   * 获取岗位满意度评分
   * @param userId 用户ID
   * @param jobId 岗位ID
   * @returns 评分信息
   */
  static getJobSatisfaction(userId: string, jobId: string): {
    scored: boolean;
    score?: number;
    ratedAt?: string;
    feedback?: string;
  } {
    try {
      const userPrivateJobs = this.getUserPrivateJobs(userId);
      const job = userPrivateJobs.find(item => item.jobId === jobId && item.userId === userId);
      
      if (job && job.satisfactionScore !== undefined) {
        return {
          scored: true,
          score: job.satisfactionScore,
          ratedAt: job.ratedAt,
          feedback: job.feedback
        };
      }
      
      return { scored: false };
    } catch (error) {
      console.error('Error getting job satisfaction:', error);
      return { scored: false };
    }
  }

  /**
   * 获取用户所有岗位的满意度评分统计
   * @param userId 用户ID
   * @returns 评分统计
   */
  static getSatisfactionStats(userId: string): {
    totalRatedJobs: number;
    averageScore: number;
    scoreDistribution: {
      [key: number]: number;
    };
  } {
    try {
      const userPrivateJobs = this.getUserPrivateJobs(userId);
      const ratedJobs = userPrivateJobs.filter(item => item.satisfactionScore !== undefined);
      
      const scoreDistribution: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };
      
      let totalScore = 0;
      ratedJobs.forEach(job => {
        if (job.satisfactionScore) {
          totalScore += job.satisfactionScore;
          scoreDistribution[job.satisfactionScore] = (scoreDistribution[job.satisfactionScore] || 0) + 1;
        }
      });
      
      const averageScore = ratedJobs.length > 0 ? totalScore / ratedJobs.length : 0;
      
      return {
        totalRatedJobs: ratedJobs.length,
        averageScore: parseFloat(averageScore.toFixed(1)),
        scoreDistribution
      };
    } catch (error) {
      console.error('Error getting satisfaction stats:', error);
      return {
        totalRatedJobs: 0,
        averageScore: 0,
        scoreDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
      };
    }
  }
}

/**
 * 创建默认示例岗位数据
 * @param lang 语言
 * @returns 示例岗位列表
 */
export const createSampleJobs = (lang: 'zh' | 'en' = 'zh'): Job[] => {
  const now = new Date();
  
  const sampleJobs = {
    zh: [
      {
        id: '1',
        title: '人工智能助理教授',
        company: '北京大学',
        location: '北京',
        salary: '年薪40-60万',
        type: '全职',
        experience: '不限',
        degree: '博士',
        skills: ['人工智能', '机器学习', '深度学习', '计算机视觉', '自然语言处理'],
        description: '北京大学计算机科学技术研究所诚聘人工智能方向助理教授，负责本科生和研究生教学工作，开展人工智能领域的前沿研究，发表高水平学术论文，申请科研项目，指导研究生。',
        postedTime: '2小时前',
        relevanceScore: 95,
        url: 'https://example.com/job/1',
        source: '北京大学官网',
        viewCount: 120,
        applyCount: 25,
        rating: 4.8,
        deadline: new Date(now.setMonth(now.getMonth() + 6)).toISOString(),
        tags: {
          category: 'university',
          subType: 'professor'
        },
        libraryType: 'public',
        status: 'active',
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        skills: ['Python', '机器学习', '深度学习', 'TensorFlow', 'PyTorch', 'NLP'],
        description: '负责腾讯AI Lab的核心项目研发，包括大语言模型、计算机视觉等领域的研究工作。参与研发的大语言模型获得2024年国家科技进步奖。',
        postedTime: '5小时前',
        relevanceScore: 88,
        url: 'https://example.com/job/2',
        source: '腾讯招聘',
        viewCount: 180,
        applyCount: 45,
        rating: 4.6,
        deadline: new Date(now.setMonth(now.getMonth() + 3)).toISOString(),
        tags: {
          category: 'enterprise',
          subType: 'aiResearcher'
        },
        libraryType: 'public',
        status: 'active',
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: '生物医学博士后研究员',
        company: '中科院生物物理研究所',
        location: '北京',
        salary: '年薪35-55万',
        type: '全职',
        experience: '不限',
        degree: '博士',
        skills: ['生物医学', '分子生物学', '细胞生物学', '实验设计', '数据分析'],
        description: '中科院生物物理研究所诚聘生物医学方向博士后研究员，参与国家重点研发计划项目，开展生物医学领域的前沿研究。',
        postedTime: '1天前',
        relevanceScore: 92,
        url: 'https://example.com/job/3',
        source: '中科院官网',
        viewCount: 95,
        applyCount: 18,
        rating: 4.7,
        deadline: new Date(now.setMonth(now.getMonth() + 6)).toISOString(),
        tags: {
          category: 'university',
          subType: 'postdoc'
        },
        libraryType: 'public',
        status: 'active',
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        title: '数据科学总监',
        company: '阿里巴巴集团',
        location: '杭州',
        salary: '年薪80-120万',
        type: '全职',
        experience: '5-8年',
        degree: '硕士及以上',
        skills: ['Python', '统计分析', '数据可视化', 'SQL', '大数据处理', '机器学习'],
        description: '负责阿里巴巴集团的数据科学团队管理，制定数据战略，推动业务创新和增长。',
        postedTime: '2天前',
        relevanceScore: 85,
        url: 'https://example.com/job/4',
        source: '阿里巴巴招聘',
        viewCount: 200,
        applyCount: 55,
        rating: 4.5,
        deadline: new Date(now.setMonth(now.getMonth() + 2)).toISOString(),
        tags: {
          category: 'enterprise',
          subType: 'dataScientist'
        },
        libraryType: 'public',
        status: 'active',
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    en: [
      {
        id: '1',
        title: 'Assistant Professor of Artificial Intelligence',
        company: 'Peking University',
        location: 'Beijing',
        salary: '$60,000-$90,000/year',
        type: 'Full-time',
        experience: 'Not specified',
        degree: 'PhD',
        skills: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing'],
        description: 'Peking University Institute of Computer Science and Technology is recruiting an Assistant Professor in Artificial Intelligence, responsible for undergraduate and graduate teaching, conducting cutting-edge research in AI, publishing high-level academic papers, applying for research projects, and guiding graduate students.',
        postedTime: '2 hours ago',
        relevanceScore: 95,
        url: 'https://example.com/job/1',
        source: 'Peking University Official Website',
        viewCount: 120,
        applyCount: 25,
        rating: 4.8,
        deadline: new Date(now.setMonth(now.getMonth() + 6)).toISOString(),
        tags: {
          category: 'university',
          subType: 'professor'
        },
        libraryType: 'public',
        status: 'active',
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Senior Machine Learning Engineer',
        company: 'Tencent Technology',
        location: 'Shenzhen',
        salary: '$90,000-$120,000/year',
        type: 'Full-time',
        experience: '3-5 years',
        degree: 'Master or above',
        skills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP'],
        description: 'Responsible for core project research and development of Tencent AI Lab, including large language models, computer vision and other fields. Participated in the development of large language models that won the 2024 National Science and Technology Progress Award.',
        postedTime: '5 hours ago',
        relevanceScore: 88,
        url: 'https://example.com/job/2',
        source: 'Tencent Recruitment',
        viewCount: 180,
        applyCount: 45,
        rating: 4.6,
        deadline: new Date(now.setMonth(now.getMonth() + 3)).toISOString(),
        tags: {
          category: 'enterprise',
          subType: 'aiResearcher'
        },
        libraryType: 'public',
        status: 'active',
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Biomedical Postdoctoral Researcher',
        company: 'Chinese Academy of Sciences Institute of Biophysics',
        location: 'Beijing',
        salary: '$50,000-$80,000/year',
        type: 'Full-time',
        experience: 'Not specified',
        degree: 'PhD',
        skills: ['Biomedical', 'Molecular Biology', 'Cell Biology', 'Experimental Design', 'Data Analysis'],
        description: 'Chinese Academy of Sciences Institute of Biophysics is recruiting a postdoctoral researcher in biomedical field, participating in national key R&D projects, conducting cutting-edge research in biomedical field.',
        postedTime: '1 day ago',
        relevanceScore: 92,
        url: 'https://example.com/job/3',
        source: 'Chinese Academy of Sciences Official Website',
        viewCount: 95,
        applyCount: 18,
        rating: 4.7,
        deadline: new Date(now.setMonth(now.getMonth() + 6)).toISOString(),
        tags: {
          category: 'university',
          subType: 'postdoc'
        },
        libraryType: 'public',
        status: 'active',
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Data Science Director',
        company: 'Alibaba Group',
        location: 'Hangzhou',
        salary: '$120,000-$180,000/year',
        type: 'Full-time',
        experience: '5-8 years',
        degree: 'Master or above',
        skills: ['Python', 'Statistical Analysis', 'Data Visualization', 'SQL', 'Big Data Processing', 'Machine Learning'],
        description: 'Responsible for managing Alibaba Group\'s data science team, formulating data strategy, and driving business innovation and growth.',
        postedTime: '2 days ago',
        relevanceScore: 85,
        url: 'https://example.com/job/4',
        source: 'Alibaba Recruitment',
        viewCount: 200,
        applyCount: 55,
        rating: 4.5,
        deadline: new Date(now.setMonth(now.getMonth() + 2)).toISOString(),
        tags: {
          category: 'enterprise',
          subType: 'dataScientist'
        },
        libraryType: 'public',
        status: 'active',
        isMatched: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

  // 将字符串类型的属性转换为对应的枚举值
  return (sampleJobs[lang] || sampleJobs.zh).map(job => ({
    ...job,
    requirements: [], // 直接设置为空数组
    benefits: [], // 直接设置为空数组
    tags: {
      ...job.tags,
      category: job.tags.category as JobCategory,
      subType: job.tags.subType as UniversityJobSubType | EnterpriseJobSubType
    },
    libraryType: job.libraryType as JobLibraryType,
    status: job.status as JobStatus
  }));
}

/**
 * 模拟API调用的包装器
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 异步函数
 */
export const simulateApiCall = <T>(fn: () => T, delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
};