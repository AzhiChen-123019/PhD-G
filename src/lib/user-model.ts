// 用户数据模型定义
import { MembershipLevel } from './membership';

/**
 * 用户基本信息接口
 */
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  countryCode: string;
  identity: 'chinese' | 'foreign';
  membershipLevel: MembershipLevel;
  membershipExpiresAt?: string; // 会员过期时间，终身会员可不填
  hasUploadedResume: boolean;
  userType: 'individual' | 'enterprise'; // 用户类型：个人/企业
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户学术信息接口
 */
export interface AcademicInfo {
  degree: string;
  field: string;
  university: string;
  graduationYear: string;
}

/**
 * 用户简历信息接口
 */
export interface Resume {
  id: string;
  fileName: string;
  filePath: string;
  uploadDate: string;
  type: 'original' | 'optimized';
}

/**
 * 用户完整信息接口（包含扩展信息）
 */
export interface UserWithDetails extends User {
  academicInfo?: AcademicInfo;
  resume?: Resume | null;
}

/**
 * 用户登录请求接口
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 用户注册请求接口
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  countryCode: string;
  phone: string;
  identity: 'chinese' | 'foreign';
}

/**
 * 用户更新请求接口
 */
export interface UpdateUserRequest {
  username?: string;
  phone?: string;
  academicInfo?: AcademicInfo;
}
