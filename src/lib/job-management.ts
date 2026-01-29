// 岗位管理业务逻辑

import { 
  Job, 
  JobLibraryType, 
  JobStatus, 
  UserPrivateJob, 
  JobMatchRequest, 
  JobMatchResult,
  JobFavorite,
  JobApplication
} from './job-model';

/**
 * 岗位管理常量
 */
export const JOB_MANAGEMENT_CONSTANTS = {
  MAX_PRIVATE_JOBS: 10, // 私人岗位库最大数量
  MATCH_BATCH_SIZE: 5,  // 每次匹配补充的岗位数量
};

/**
 * 岗位管理器类
 */
export class JobManager {
  /**
   * 检查一键匹配岗位的可行性
   * @param currentPrivateJobs 当前私人岗位数量
   * @param requestedMatchCount 请求匹配的岗位数量
   * @returns 检查结果和可匹配数量
   */
  static checkMatchFeasibility(currentPrivateJobs: number, requestedMatchCount: number = JOB_MANAGEMENT_CONSTANTS.MATCH_BATCH_SIZE): {
    canMatch: boolean;
    availableSlots: number;
    message?: string;
  } {
    const availableSlots = JOB_MANAGEMENT_CONSTANTS.MAX_PRIVATE_JOBS - currentPrivateJobs;
    
    if (availableSlots <= 0) {
      return {
        canMatch: false,
        availableSlots: 0,
        message: `您的私人岗位已达到上限${JOB_MANAGEMENT_CONSTANTS.MAX_PRIVATE_JOBS}个，请移除部分岗位后再继续。`
      };
    }
    
    if (requestedMatchCount > availableSlots) {
      return {
        canMatch: true,
        availableSlots,
        message: `您的私人岗位库还有${availableSlots}个空位，本次将匹配${availableSlots}个岗位。`
      };
    }
    
    return {
      canMatch: true,
      availableSlots: requestedMatchCount
    };
  }
  
  /**
   * 执行岗位匹配
   * @param request 匹配请求
   * @param currentPrivateJobs 当前私人岗位列表
   * @param availableJobs 可匹配的岗位列表
   * @returns 匹配结果
   */
  static performJobMatching(
    request: JobMatchRequest,
    currentPrivateJobs: UserPrivateJob[],
    availableJobs: Job[]
  ): JobMatchResult {
    // 检查匹配可行性
    const feasibility = this.checkMatchFeasibility(
      currentPrivateJobs.length,
      request.matchCount
    );
    
    if (!feasibility.canMatch) {
      return {
        success: false,
        matchedJobs: [],
        totalCount: currentPrivateJobs.length,
        remainingQuota: 0,
        message: feasibility.message
      };
    }
    
    // 提取当前私人岗位的ID，用于去重
    const currentJobIds = new Set(currentPrivateJobs.map(item => item.jobId));
    
    // 过滤掉已存在的岗位，并按匹配度排序
    const uniqueJobs = availableJobs
      .filter(job => !currentJobIds.has(job.id))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // 确定实际匹配数量
    const actualMatchCount = Math.min(feasibility.availableSlots, uniqueJobs.length);
    
    // 选择要匹配的岗位
    const matchedJobs = uniqueJobs.slice(0, actualMatchCount);
    
    // 更新岗位状态为已匹配
    const updatedMatchedJobs = matchedJobs.map(job => ({
      ...job,
      isMatched: true,
      libraryType: JobLibraryType.PRIVATE,
      userId: request.userId,
      updatedAt: new Date().toISOString()
    }));
    
    return {
      success: true,
      matchedJobs: updatedMatchedJobs,
      totalCount: currentPrivateJobs.length + updatedMatchedJobs.length,
      remainingQuota: JOB_MANAGEMENT_CONSTANTS.MAX_PRIVATE_JOBS - (currentPrivateJobs.length + updatedMatchedJobs.length),
      message: actualMatchCount > 0 
        ? `成功匹配${actualMatchCount}个新岗位，您的私人岗位库当前有${currentPrivateJobs.length + actualMatchCount}/${JOB_MANAGEMENT_CONSTANTS.MAX_PRIVATE_JOBS}个岗位。`
        : '暂无新的匹配岗位。'
    };
  }
  
  /**
   * 从私人岗位库移除岗位
   * @param userId 用户ID
   * @param jobId 要移除的岗位ID
   * @param currentPrivateJobs 当前私人岗位列表
   * @returns 移除结果和更新后的岗位列表
   */
  static removePrivateJob(
    userId: string,
    jobId: string,
    currentPrivateJobs: UserPrivateJob[]
  ): {
    success: boolean;
    updatedPrivateJobs: UserPrivateJob[];
    removedJob?: Job;
    message: string;
  } {
    const jobToRemove = currentPrivateJobs.find(item => item.jobId === jobId && item.userId === userId);
    
    if (!jobToRemove) {
      return {
        success: false,
        updatedPrivateJobs: currentPrivateJobs,
        message: '未找到要移除的岗位。'
      };
    }
    
    // 从私人岗位库移除
    const updatedPrivateJobs = currentPrivateJobs.filter(item => !(item.jobId === jobId && item.userId === userId));
    
    // 更新岗位状态，从私人库转为公共库
    const removedJob = {
      ...jobToRemove.job,
      libraryType: JobLibraryType.PUBLIC,
      userId: undefined,
      isMatched: false,
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      updatedPrivateJobs,
      removedJob,
      message: '岗位已成功从私人岗位库移除。'
    };
  }
  
  /**
   * 收藏岗位
   * @param userId 用户ID
   * @param job 要收藏的岗位
   * @param currentFavorites 当前收藏列表
   * @returns 收藏结果
   */
  static favoriteJob(
    userId: string,
    job: Job,
    currentFavorites: JobFavorite[]
  ): {
    success: boolean;
    updatedFavorites: JobFavorite[];
    message: string;
  } {
    // 检查是否已收藏
    const isAlreadyFavorited = currentFavorites.some(fav => fav.jobId === job.id && fav.userId === userId);
    
    if (isAlreadyFavorited) {
      return {
        success: false,
        updatedFavorites: currentFavorites,
        message: '该岗位已在您的收藏列表中。'
      };
    }
    
    // 创建收藏记录
    const newFavorite: JobFavorite = {
      id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      jobId: job.id,
      job,
      createdAt: new Date().toISOString()
    };
    
    const updatedFavorites = [...currentFavorites, newFavorite];
    
    return {
      success: true,
      updatedFavorites,
      message: '岗位已成功收藏。'
    };
  }
  
  /**
   * 取消收藏岗位
   * @param userId 用户ID
   * @param jobId 要取消收藏的岗位ID
   * @param currentFavorites 当前收藏列表
   * @returns 取消收藏结果
   */
  static unfavoriteJob(
    userId: string,
    jobId: string,
    currentFavorites: JobFavorite[]
  ): {
    success: boolean;
    updatedFavorites: JobFavorite[];
    message: string;
  } {
    const updatedFavorites = currentFavorites.filter(fav => !(fav.jobId === jobId && fav.userId === userId));
    
    const wasFavorited = currentFavorites.length !== updatedFavorites.length;
    
    return {
      success: wasFavorited,
      updatedFavorites,
      message: wasFavorited ? '岗位已成功取消收藏。' : '该岗位不在您的收藏列表中。'
    };
  }
  
  /**
   * 申请岗位
   * @param userId 用户ID
   * @param job 要申请的岗位
   * @param resumeId 使用的简历ID
   * @param currentApplications 当前申请列表
   * @param coverLetter 求职信（可选）
   * @returns 申请结果
   */
  static applyForJob(
    userId: string,
    job: Job,
    resumeId: string,
    currentApplications: JobApplication[],
    coverLetter?: string
  ): {
    success: boolean;
    updatedApplications: JobApplication[];
    message: string;
  } {
    // 检查是否已申请
    const isAlreadyApplied = currentApplications.some(app => app.jobId === job.id && app.userId === userId);
    
    if (isAlreadyApplied) {
      return {
        success: false,
        updatedApplications: currentApplications,
        message: '您已申请过该岗位。'
      };
    }
    
    // 检查岗位是否已过期
    if (new Date(job.deadline) < new Date()) {
      return {
        success: false,
        updatedApplications: currentApplications,
        message: '该岗位已过期，无法申请。'
      };
    }
    
    // 创建申请记录
    const newApplication: JobApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      jobId: job.id,
      job,
      resumeId,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      coverLetter
    };
    
    const updatedApplications = [...currentApplications, newApplication];
    
    return {
      success: true,
      updatedApplications,
      message: '岗位申请已提交成功。'
    };
  }
  
  /**
   * 更新岗位状态
   * @param job 要更新的岗位
   * @param newStatus 新状态
   * @returns 更新后的岗位
   */
  static updateJobStatus(job: Job, newStatus: JobStatus): Job {
    return {
      ...job,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
  }
  
  /**
   * 清理过期岗位
   * @param jobs 岗位列表
   * @returns 清理后的岗位列表和过期岗位列表
   */
  static cleanupExpiredJobs(jobs: Job[]): {
    activeJobs: Job[];
    expiredJobs: Job[];
  } {
    const now = new Date();
    const activeJobs: Job[] = [];
    const expiredJobs: Job[] = [];
    
    jobs.forEach(job => {
      // 检查岗位是否过期：1. 截止日期已过 2. 展示期已过
      const isDeadlineExpired = new Date(job.deadline) < now;
      const isDisplayExpired = job.displayEndDate && new Date(job.displayEndDate) < now;
      
      if (isDeadlineExpired || isDisplayExpired) {
        expiredJobs.push(this.updateJobStatus(job, JobStatus.EXPIRED));
      } else {
        activeJobs.push(job);
      }
    });
    
    return {
      activeJobs,
      expiredJobs
    };
  }
  
  /**
   * 从用户私人岗位库移除岗位并转换为公共岗位
   * @param userPrivateJob 用户私人岗位关联
   * @returns 转换后的公共岗位
   */
  static convertPrivateToPublicJob(userPrivateJob: UserPrivateJob): Job {
    return {
      ...userPrivateJob.job,
      libraryType: JobLibraryType.PUBLIC,
      userId: undefined,
      isMatched: false,
      updatedAt: new Date().toISOString()
    };
  }
}

/**
 * 创建用户私人岗位关联
 * @param userId 用户ID
 * @param job 岗位信息
 * @returns 用户私人岗位关联
 */
export const createUserPrivateJob = (userId: string, job: Job): UserPrivateJob => {
  return {
    id: `upj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    jobId: job.id,
    job,
    matchedAt: new Date().toISOString(),
    isRemoved: false
  };
};

/**
 * 过滤活跃岗位
 * @param jobs 岗位列表
 * @returns 活跃岗位列表
 */
export const filterActiveJobs = (jobs: Job[]): Job[] => {
  return jobs.filter(job => job.status === JobStatus.ACTIVE);
};

/**
 * 获取岗位统计信息
 * @param privateJobs 私人岗位列表
 * @returns 统计信息
 */
export const getJobStatistics = (privateJobs: UserPrivateJob[]) => {
  const totalJobs = privateJobs.length;
  const universityJobs = privateJobs.filter(item => item.job.tags.category === 'university').length;
  const enterpriseJobs = privateJobs.filter(item => item.job.tags.category === 'enterprise').length;
  const avgRelevanceScore = totalJobs > 0 
    ? Math.round(privateJobs.reduce((sum, item) => sum + item.job.relevanceScore, 0) / totalJobs)
    : 0;
  
  return {
    totalJobs,
    universityJobs,
    enterpriseJobs,
    avgRelevanceScore,
    remainingSlots: JOB_MANAGEMENT_CONSTANTS.MAX_PRIVATE_JOBS - totalJobs
  };
};

/**
 * 按匹配度排序岗位
 * @param jobs 岗位列表
 * @param ascending 是否升序排列
 * @returns 排序后的岗位列表
 */
export const sortJobsByRelevance = (jobs: Job[], ascending: boolean = false): Job[] => {
  return [...jobs].sort((a, b) => {
    return ascending 
      ? a.relevanceScore - b.relevanceScore 
      : b.relevanceScore - a.relevanceScore;
  });
};