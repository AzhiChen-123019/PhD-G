// 会员类型定义
export enum MembershipLevel {
  FREE = 'free',
  VIP = 'vip',
  SVIP = 'svip'
}

// 会员服务配置
export interface MembershipService {
  unlimitedJobSearch: boolean;
  unlimitedJobMatching: boolean;
  privateJobLimit: number;
  resumeOptimization: number | 'unlimited';
  resumeTemplates: number | 'unlimited';
  companyEmails: number | 'unlimited';
  selfRecommendationEmails: number | 'unlimited';
}

// 会员套餐配置
export interface MembershipPlan {
  level: MembershipLevel;
  name: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'lifetime';
  services: MembershipService;
  description: string;
  features: string[];
}

// 会员配置常量
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    level: MembershipLevel.FREE,
    name: '免费会员',
    price: 0,
    currency: 'RMB',
    duration: 'monthly',
    services: {
      unlimitedJobSearch: true,
      unlimitedJobMatching: true,
      privateJobLimit: 10,
      resumeOptimization: 10,
      resumeTemplates: 10,
      companyEmails: 10,
      selfRecommendationEmails: 10
    },
    description: '免费会员，适合初次使用平台的用户',
    features: [
      '无限查询岗位',
      '无限次一键匹配岗位',
      '最大私人岗位库容量10个',
      '10次智能简历优化',
      '10次简历模板使用/下载',
      '10个企业招聘邮箱地址',
      '10次自荐邮件生成'
    ]
  },
  {
    level: MembershipLevel.VIP,
    name: 'VIP会员',
    price: 99,
    currency: 'RMB',
    duration: 'monthly',
    services: {
      unlimitedJobSearch: true,
      unlimitedJobMatching: true,
      privateJobLimit: 30,
      resumeOptimization: 100,
      resumeTemplates: 100,
      companyEmails: 100,
      selfRecommendationEmails: 100
    },
    description: 'VIP会员，适合需要更多功能的活跃用户',
    features: [
      '无限查询岗位',
      '无限次一键匹配岗位',
      '最大私人岗位库容量30个',
      '100次智能简历优化',
      '100次简历模板使用/下载',
      '100个企业招聘邮箱地址',
      '100次自荐邮件生成'
    ]
  },
  {
    level: MembershipLevel.SVIP,
    name: 'SVIP会员',
    price: 299,
    currency: 'RMB',
    duration: 'lifetime',
    services: {
      unlimitedJobSearch: true,
      unlimitedJobMatching: true,
      privateJobLimit: 100,
      resumeOptimization: 'unlimited',
      resumeTemplates: 'unlimited',
      companyEmails: 'unlimited',
      selfRecommendationEmails: 'unlimited'
    },
    description: 'SVIP会员，终身享有全部高级功能',
    features: [
      '无限查询岗位',
      '无限次一键匹配岗位',
      '最大私人岗位库容量100个',
      '无限次智能简历优化',
      '无限次简历模板使用/下载',
      '无限个企业招聘邮箱地址',
      '无限次自荐邮件生成'
    ]
  }
];

// 获取会员配置
export const getMembershipPlan = (level: MembershipLevel): MembershipPlan => {
  return MEMBERSHIP_PLANS.find(plan => plan.level === level) || MEMBERSHIP_PLANS[0];
};

// 获取会员名称
export const getMembershipName = (level: MembershipLevel): string => {
  return getMembershipPlan(level).name;
};
