// 管理员相关类型定义

/**
 * 用户数据接口（包含文件信息）
 */
export interface UserData {
  _id: string;
  username: string;
  email: string;
  internalEmail?: string;
  nationality: string;
  realName: string;
  degreeVerified: boolean;
  countryCode: string;
  phone: string;
  fileId: string;
  userType: 'individual' | 'enterprise'; // 添加用户类型
  // 角色和权限字段
  role: 'superadmin' | 'admin' | 'customer_service' | 'enterprise_admin' | 'user';
  isAdmin: boolean;
  permissions: string[];
  // 企业相关字段
  isEnterprise: boolean;
  enterpriseName: string;
  enterpriseIndustry: string;
  enterpriseDescription: string;
  enterpriseSize: string;
  enterpriseWebsite: string;
  enterpriseLogo: string;
  contactPerson: string;
  cooperationStatus: 'pending' | 'active' | 'expired' | 'terminated';
  cooperationStartDate: string | null;
  cooperationEndDate: string | null;
  createdAt: string;
  updatedAt?: string;
  files: Array<{
    _id: string;
    fileName: string;
    filePath: string;
    fileType: string;
    uploadedAt: string;
    fileSize: number; // 文件大小，单位字节
    verified: boolean; // 文件验证状态
  }>;
  education: {
    highestDegree: string;
    graduationSchool: string;
    graduationDate: string;
    major: string;
  };
}

/**
 * API调用记录接口
 */
export interface ApiCallRecord {
  id: string;
  userId: string;
  endpoint: string;
  method: string;
  cost: number;
  timestamp: string;
  status: number;
  responseTime: number;
}

/**
 * 岗位申请材料配置接口
 */
export interface ApplicationMaterialConfig {
  id: string;
  jobId: string;
  materials: Array<{
    id: string;
    name: string;
    required: boolean;
    type: 'file' | 'text' | 'dropdown';
    options?: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 会员订单接口
 */
export interface MembershipOrder {
  id: string;
  userId: string;
  membershipLevel: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  expiresAt: string;
}

/**
 * 岗位抓取任务接口
 */
export interface JobScrapingTask {
  id: string;
  type: 'university' | 'enterprise' | 'both';
  status: 'pending' | 'running' | 'completed' | 'failed';
  result: {
    universityJobs: number;
    enterpriseJobs: number;
    totalJobs: number;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

/**
 * AI提示词配置接口
 */
export interface AIPromptConfig {
  id: string;
  type: 'universityJobScrape' | 'enterpriseJobScrape' | 'privateJobScrape' | 
        'uploadAnalyzeResume' | 'resumeReportGenerate' | 'resumeOptimize' | 
        'getRecruitEmail' | 'generateCoverEmail' | 'educationVerification';
  name: string;
  prompt: string;
  parameters: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
