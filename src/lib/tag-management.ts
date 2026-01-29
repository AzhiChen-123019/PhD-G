// 岗位分类标签管理系统

import { 
  Job, 
  JobCategory, 
  JobTag, 
  UniversityJobSubType, 
  EnterpriseJobSubType 
} from './job-model';

/**
 * 岗位标签管理类
 */
export class TagManager {
  /**
   * 自动为岗位分配标签
   * @param job 岗位信息
   * @returns 岗位标签
   */
  static autoAssignTag(job: Partial<Job>): JobTag {
    const title = (job.title || '').toLowerCase();
    const description = (job.description || '').toLowerCase();
    const company = (job.company || '').toLowerCase();
    const institution = (job.company || '').toLowerCase();
    
    // 大学组岗位关键词
    const universityKeywords = {
      [UniversityJobSubType.PROFESSOR]: ['教授', '副教授', '助理教授', 'tenure-track', 'research assistant professor'],
      [UniversityJobSubType.POSTDOC]: ['博士后', 'postdoc', 'postdoctoral', 'research fellow'],
      [UniversityJobSubType.RESEARCH_ASSISTANT]: ['研究助理教授', 'research assistant professor', 'assistant research professor'],
      [UniversityJobSubType.RESEARCH_SCIENTIST]: ['研究员', '研究科学家', 'research scientist', 'research associate']
    };
    
    // 企业组岗位关键词
    const enterpriseKeywords = {
      [EnterpriseJobSubType.TECH_DIRECTOR]: ['技术总监', 'cto', 'chief technology officer', '技术负责人'],
      [EnterpriseJobSubType.CHIEF_SCIENTIST]: ['首席科学家', 'chief scientist', '首席研究员'],
      [EnterpriseJobSubType.R_MANAGER]: ['研发经理', 'r&d manager', 'research manager', '技术经理'],
      [EnterpriseJobSubType.AI_RESEARCHER]: ['ai研究员', '人工智能研究员', 'artificial intelligence researcher'],
      [EnterpriseJobSubType.DATA_SCIENTIST]: ['数据科学家', 'data scientist'],
      [EnterpriseJobSubType.ALGORITHM_ENGINEER]: ['算法工程师', 'algorithm engineer', 'algorithms engineer']
    };
    
    // 首先判断主标签：大学或企业
    let category: JobCategory;
    
    // 检查是否为大学科研岗位
    const isUniversityJob = 
      (institution && (institution.includes('大学') || institution.includes('学院') || institution.includes('研究院') || 
       institution.includes('university') || institution.includes('college') || institution.includes('institute'))) ||
      (title && (title.includes('教授') || title.includes('副教授') || title.includes('博士后') || 
       title.includes('postdoc') || title.includes('research fellow'))) ||
      (description && (description.includes('tenure-track') || description.includes('学术') || 
       description.includes('academic') || description.includes('research grant')));
    
    if (isUniversityJob) {
      category = JobCategory.UNIVERSITY;
    } else {
      category = JobCategory.ENTERPRISE;
    }
    
    // 然后判断子标签：具体岗位类型
    let subType: UniversityJobSubType | EnterpriseJobSubType;
    
    if (category === JobCategory.UNIVERSITY) {
      // 匹配大学组子标签
      subType = UniversityJobSubType.RESEARCH_SCIENTIST; // 默认值
      
      for (const [type, keywords] of Object.entries(universityKeywords)) {
        if (keywords.some(keyword => 
          title.includes(keyword) || 
          description.includes(keyword) || 
          title.includes(keyword.toLowerCase()) || 
          description.includes(keyword.toLowerCase())
        )) {
          subType = type as UniversityJobSubType;
          break;
        }
      }
    } else {
      // 匹配企业组子标签
      subType = EnterpriseJobSubType.AI_RESEARCHER; // 默认值
      
      for (const [type, keywords] of Object.entries(enterpriseKeywords)) {
        if (keywords.some(keyword => 
          title.includes(keyword) || 
          description.includes(keyword) || 
          title.includes(keyword.toLowerCase()) || 
          description.includes(keyword.toLowerCase())
        )) {
          subType = type as EnterpriseJobSubType;
          break;
        }
      }
    }
    
    return {
      category,
      subType
    };
  }
  
  /**
   * 验证岗位标签是否有效
   * @param tag 岗位标签
   * @returns 是否有效
   */
  static validateTag(tag: JobTag): boolean {
    // 验证主标签
    if (!Object.values(JobCategory).includes(tag.category)) {
      return false;
    }
    
    // 验证子标签与主标签的匹配性
    if (tag.category === JobCategory.UNIVERSITY) {
      return Object.values(UniversityJobSubType).includes(tag.subType as UniversityJobSubType);
    } else {
      return Object.values(EnterpriseJobSubType).includes(tag.subType as EnterpriseJobSubType);
    }
  }
  
  /**
   * 获取岗位标签的显示名称
   * @param tag 岗位标签
   * @param lang 语言
   * @returns 显示名称
   */
  static getTagDisplayName(tag: JobTag, lang: string = 'zh'): string {
    // 只支持中文和英文，其他语言默认使用英文
    const displayLang = ['zh', 'en'].includes(lang) ? lang : 'en';
    
    // 定义tagNames对象，确保类型安全
    const tagNames = {
      zh: {
        [JobCategory.UNIVERSITY]: {
          [UniversityJobSubType.PROFESSOR]: '教授/副教授',
          [UniversityJobSubType.POSTDOC]: '博士后研究员',
          [UniversityJobSubType.RESEARCH_ASSISTANT]: '研究助理教授',
          [UniversityJobSubType.RESEARCH_SCIENTIST]: '研究员'
        },
        [JobCategory.ENTERPRISE]: {
          [EnterpriseJobSubType.TECH_DIRECTOR]: '技术总监',
          [EnterpriseJobSubType.CHIEF_SCIENTIST]: '首席科学家',
          [EnterpriseJobSubType.R_MANAGER]: '研发经理',
          [EnterpriseJobSubType.AI_RESEARCHER]: 'AI研究员',
          [EnterpriseJobSubType.DATA_SCIENTIST]: '数据科学家',
          [EnterpriseJobSubType.ALGORITHM_ENGINEER]: '算法工程师'
        }
      },
      en: {
        [JobCategory.UNIVERSITY]: {
          [UniversityJobSubType.PROFESSOR]: 'Professor/Associate Professor',
          [UniversityJobSubType.POSTDOC]: 'Postdoctoral Researcher',
          [UniversityJobSubType.RESEARCH_ASSISTANT]: 'Research Assistant Professor',
          [UniversityJobSubType.RESEARCH_SCIENTIST]: 'Research Scientist'
        },
        [JobCategory.ENTERPRISE]: {
          [EnterpriseJobSubType.TECH_DIRECTOR]: 'Technical Director',
          [EnterpriseJobSubType.CHIEF_SCIENTIST]: 'Chief Scientist',
          [EnterpriseJobSubType.R_MANAGER]: 'R&D Manager',
          [EnterpriseJobSubType.AI_RESEARCHER]: 'AI Researcher',
          [EnterpriseJobSubType.DATA_SCIENTIST]: 'Data Scientist',
          [EnterpriseJobSubType.ALGORITHM_ENGINEER]: 'Algorithm Engineer'
        }
      }
    };
    
    // 使用类型断言确保displayLang是合法索引
    const safeDisplayLang = displayLang as keyof typeof tagNames;
    
    // 使用类型守卫来确保tag.subType与tag.category匹配
    if (tag.category === JobCategory.UNIVERSITY) {
      return tagNames[safeDisplayLang][tag.category][tag.subType as UniversityJobSubType] || (displayLang === 'zh' ? '未知岗位类型' : 'Unknown Job Type');
    } else {
      return tagNames[safeDisplayLang][tag.category][tag.subType as EnterpriseJobSubType] || (displayLang === 'zh' ? '未知岗位类型' : 'Unknown Job Type');
    }
  }
  
  /**
   * 判断岗位是否属于指定页面
   * @param job 岗位信息
   * @param pageType 页面类型
   * @returns 是否属于该页面
   */
  static isJobForPage(job: Job, pageType: 'university' | 'enterprise' | 'private'): boolean {
    switch (pageType) {
      case 'university':
        return job.tags.category === JobCategory.UNIVERSITY;
      case 'enterprise':
        return job.tags.category === JobCategory.ENTERPRISE;
      case 'private':
        return true; // 私人页面接受所有标签
      default:
        return false;
    }
  }
  
  /**
   * 获取所有可用标签
   * @returns 所有可用标签
   */
  static getAllTags(): {
    university: Array<{ value: UniversityJobSubType; label: string }>;
    enterprise: Array<{ value: EnterpriseJobSubType; label: string }>;
  } {
    return {
      university: Object.entries(UniversityJobSubType).map(([key, value]) => ({
        value,
        label: this.getTagDisplayName({
          category: JobCategory.UNIVERSITY,
          subType: value
        })
      })),
      enterprise: Object.entries(EnterpriseJobSubType).map(([key, value]) => ({
        value,
        label: this.getTagDisplayName({
          category: JobCategory.ENTERPRISE,
          subType: value
        })
      }))
    };
  }
}

/**
 * 根据标签过滤岗位
 * @param jobs 岗位列表
 * @param category 主标签
 * @returns 过滤后的岗位列表
 */
export const filterJobsByTag = (jobs: Job[], category?: JobCategory): Job[] => {
  if (!category) {
    return jobs;
  }
  
  return jobs.filter(job => job.tags.category === category);
};

/**
 * 获取岗位标签的颜色
 * @param tag 岗位标签
 * @returns 颜色代码
 */
export const getTagColor = (tag: JobTag): string => {
  const colorMap = {
    [JobCategory.UNIVERSITY]: {
      [UniversityJobSubType.PROFESSOR]: '#4F46E5',      // 靛蓝
      [UniversityJobSubType.POSTDOC]: '#06B6D4',        // 青色
      [UniversityJobSubType.RESEARCH_ASSISTANT]: '#10B981', // 绿色
      [UniversityJobSubType.RESEARCH_SCIENTIST]: '#F59E0B'  // 琥珀色
    },
    [JobCategory.ENTERPRISE]: {
      [EnterpriseJobSubType.TECH_DIRECTOR]: '#EF4444',     // 红色
      [EnterpriseJobSubType.CHIEF_SCIENTIST]: '#8B5CF6',   // 紫色
      [EnterpriseJobSubType.R_MANAGER]: '#EC4899',         // 粉色
      [EnterpriseJobSubType.AI_RESEARCHER]: '#0EA5E9',     // 蓝色
      [EnterpriseJobSubType.DATA_SCIENTIST]: '#6366F1',    // 靛蓝
      [EnterpriseJobSubType.ALGORITHM_ENGINEER]: '#22C55E' // 绿色
    }
  };
  
  if (tag.category === JobCategory.UNIVERSITY) {
    return colorMap[tag.category][tag.subType as UniversityJobSubType] || '#6B7280'; // 默认灰色
  } else {
    return colorMap[tag.category][tag.subType as EnterpriseJobSubType] || '#6B7280'; // 默认灰色
  }
};