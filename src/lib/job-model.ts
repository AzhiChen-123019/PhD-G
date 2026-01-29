// 岗位数据模型定义

/**
 * 岗位分类枚举
 */
export enum JobCategory {
  UNIVERSITY = 'university', // 大学科研岗位
  ENTERPRISE = 'enterprise'   // 企业高级岗位
}

/**
 * 大学组岗位子类型
 */
export enum UniversityJobSubType {
  PROFESSOR = 'professor',         // 教授/副教授
  POSTDOC = 'postdoc',             // 博士后研究员
  RESEARCH_ASSISTANT = 'researchAssistant', // 研究助理教授
  RESEARCH_SCIENTIST = 'researchScientist' // 研究员
}

/**
 * 企业组岗位子类型
 */
export enum EnterpriseJobSubType {
  TECH_DIRECTOR = 'techDirector',     // 技术总监
  CHIEF_SCIENTIST = 'chiefScientist', // 首席科学家
  R_MANAGER = 'rManager',             // 研发经理
  AI_RESEARCHER = 'aiResearcher',     // AI研究员
  DATA_SCIENTIST = 'dataScientist',   // 数据科学家
  ALGORITHM_ENGINEER = 'algorithmEngineer' // 算法工程师
}

/**
 * 岗位标签结构
 */
export interface JobTag {
  category: JobCategory;           // 主标签：大学或企业
  subType: UniversityJobSubType | EnterpriseJobSubType; // 子标签：具体岗位类型
}

/**
 * 岗位所属库类型
 */
export enum JobLibraryType {
  PUBLIC = 'public',    // 公共岗位库
  PRIVATE = 'private'   // 私人岗位库
}

/**
 * 岗位状态
 */
export enum JobStatus {
  ACTIVE = 'active',     // 活跃状态
  INACTIVE = 'inactive', // 非活跃状态
  EXPIRED = 'expired'    // 已过期
}

/**
 * 完整的岗位数据模型
 */
export interface Job {
  // 基本信息
  id: string;                    // 岗位唯一标识
  title: string;                 // 岗位标题
  company: string;               // 公司/机构名称
  location: string;              // 工作地点
  salary: string;                // 薪资范围
  type: string;                  // 工作类型（全职/兼职等）
  experience: string;            // 经验要求
  degree: string;                // 学历要求
  skills: string[];              // 技能要求
  description: string;           // 岗位描述
  requirements: string[];        // 岗位要求
  benefits: string[];            // 福利待遇
  postedTime: string;            // 发布时间
  relevanceScore: number;        // 匹配度分数
  url: string;                   // 岗位原链接
  source: string;                // 来源平台
  viewCount: number;             // 浏览次数
  applyCount: number;            // 申请次数
  rating: number;                // 岗位评分
  deadline: string;              // 截止日期
  expireTime?: number;            // 岗位过期时间（毫秒时间戳）
  
  // 新增管理字段
  tags: JobTag;                  // 岗位标签
  libraryType: JobLibraryType;   // 所属库类型
  status: JobStatus;             // 岗位状态
  userId?: string;               // 私人库岗位所属用户ID
  isMatched: boolean;            // 是否已被匹配
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
  displayStartDate?: string;     // 展示开始时间（用于计算30天展示期）
  displayEndDate?: string;       // 展示结束时间（用于计算30天展示期）
}

/**
 * 岗位收藏数据模型
 */
export interface JobFavorite {
  id: string;                    // 收藏唯一标识
  userId: string;                // 用户ID
  jobId: string;                 // 岗位ID
  job: Job;                      // 岗位信息（冗余存储）
  createdAt: string;             // 收藏时间
}

/**
 * 岗位申请数据模型
 */
export interface JobApplication {
  id: string;                    // 申请唯一标识
  userId: string;                // 用户ID
  jobId: string;                 // 岗位ID
  job: Job;                      // 岗位信息（冗余存储）
  resumeId: string;              // 使用的简历ID
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'; // 申请状态
  appliedAt: string;             // 申请时间
  updatedAt: string;             // 更新时间
  coverLetter?: string;          // 求职信
}

/**
 * 私人岗位库用户关联模型
 */
export interface UserPrivateJob {
  id: string;                    // 关联唯一标识
  userId: string;                // 用户ID
  jobId: string;                 // 岗位ID
  job: Job;                      // 岗位信息
  matchedAt: string;             // 匹配时间
  isRemoved: boolean;            // 是否已被移除
  removedAt?: string;            // 移除时间
  // 满意度评分相关字段
  satisfactionScore?: number;    // 满意度评分（1-5星）
  ratedAt?: string;              // 评分时间
  feedback?: string;             // 详细反馈
}

/**
 * 岗位匹配请求模型
 */
export interface JobMatchRequest {
  userId: string;                // 用户ID
  resumeId: string;              // 简历ID
  matchCount: number;            // 请求匹配的岗位数量
}

/**
 * 岗位匹配结果模型
 */
export interface JobMatchResult {
  success: boolean;              // 是否成功
  matchedJobs: Job[];            // 匹配到的岗位
  totalCount: number;            // 匹配总数
  remainingQuota: number;        // 剩余配额
  message?: string;              // 结果消息
}