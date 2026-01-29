// AI大模型分析服务

interface ResumeData {
  personalInfo: {
    name: string;
    gender: string;
    age: string;
    education: string;
    major: string;
    workExperience: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    major: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    courses?: string[];
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements?: string[];
  }>;
  skills: Array<{
    name: string;
    level: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  academicAchievements: Array<{
    title: string;
    date: string;
    description: string;
  }>;
  careerObjective?: {
    desiredPosition: string;
    desiredIndustry: string;
    desiredSalary: string;
    desiredLocation: string;
  };
}

interface CompetitivenessAnalysis {
  overallScore: number;
  categoryScores: {
    education: number;
    experience: number;
    skills: number;
    achievements: number;
    careerObjective: number;
  };
  marketAnalysis: {
    demand: string;
    supply: string;
    competitionLevel: string;
  };
  careerPath: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  recommendations: string[];
  improvementSuggestions: string[];
}

/**
 * 模拟调用AI大模型API进行简历分析
 * @param resume 简历数据
 * @returns 分析结果
 */
export const analyzeResumeWithAI = async (resume: ResumeData): Promise<CompetitivenessAnalysis> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 1. 分析教育背景
  const analyzeEducation = (education: Array<any>): number => {
    let score = 70;
    
    // 基于最高学历加分
    const highestDegree = education.reduce((highest, edu) => {
      const degreeRank: Record<string, number> = {
        '博士': 4,
        '硕士': 3,
        '学士': 2,
        '大专': 1
      };
      // 使用可选链和默认值来避免类型错误
      const eduRank = degreeRank[edu.degree] || 0;
      const highestRank = degreeRank[highest.degree] || 0;
      return eduRank > highestRank ? edu : highest;
    }, education[0]);
    
    if (highestDegree.degree === '博士') score += 20;
    else if (highestDegree.degree === '硕士') score += 10;
    
    // 基于院校加分
    const topInstitutions = ['清华大学', '北京大学', '中国科学技术大学', '浙江大学', '复旦大学', '上海交通大学'];
    if (highestDegree.institution && topInstitutions.some(institution => highestDegree.institution.includes(institution))) {
      score += 10;
    }
    
    return Math.min(100, score);
  };

  // 2. 分析工作经验
  const analyzeExperience = (workExperience: Array<any>): number => {
    let score = 60;
    
    // 基于工作年限加分
    const experienceYears = parseInt(resume.personalInfo.workExperience);
    if (experienceYears >= 5) score += 20;
    else if (experienceYears >= 3) score += 15;
    else if (experienceYears >= 1) score += 10;
    
    // 基于工作成就加分
    const totalAchievements = workExperience.reduce((total, exp) => {
      return total + (exp.achievements ? exp.achievements.length : 0);
    }, 0);
    score += totalAchievements * 2;
    
    return Math.min(100, score);
  };

  // 3. 分析技能
  const analyzeSkills = (skills: Array<any>): number => {
    let score = 60;
    
    // 基于技能数量加分
    score += Math.min(20, skills.length * 2);
    
    // 基于技能熟练度加分
    const proficientSkills = skills.filter(skill => skill.level === '精通').length;
    score += proficientSkills * 3;
    
    // 基于热门技能加分
    const hotSkills = ['Python', '机器学习', '深度学习', 'NLP', '计算机视觉', '算法设计', '大数据', '云计算'];
    const matchedHotSkills = skills.filter(skill => hotSkills.includes(skill.name)).length;
    score += matchedHotSkills * 2;
    
    return Math.min(100, score);
  };

  // 4. 分析成就
  const analyzeAchievements = (academicAchievements: Array<any>, workExperience: Array<any>): number => {
    let score = 60;
    
    // 基于学术成就加分
    score += academicAchievements.length * 5;
    
    // 基于工作成就加分
    const totalWorkAchievements = workExperience.reduce((total, exp) => {
      return total + (exp.achievements ? exp.achievements.length : 0);
    }, 0);
    score += totalWorkAchievements * 3;
    
    return Math.min(100, score);
  };

  // 5. 分析职业目标
  const analyzeCareerObjective = (careerObjective: any): number => {
    let score = 70;
    
    if (careerObjective) {
      // 基于职业目标完整性加分
      if (careerObjective.desiredPosition) score += 5;
      if (careerObjective.desiredIndustry) score += 5;
      if (careerObjective.desiredSalary) score += 5;
      if (careerObjective.desiredLocation) score += 5;
    }
    
    return Math.min(100, score);
  };

  // 计算各项评分
  const educationScore = analyzeEducation(resume.education);
  const experienceScore = analyzeExperience(resume.workExperience);
  const skillsScore = analyzeSkills(resume.skills);
  const achievementsScore = analyzeAchievements(resume.academicAchievements, resume.workExperience);
  const careerObjectiveScore = analyzeCareerObjective(resume.careerObjective);

  // 计算总体评分
  const overallScore = Math.round((educationScore + experienceScore + skillsScore + achievementsScore + careerObjectiveScore) / 5);

  // 生成市场分析
  const generateMarketAnalysis = (resume: ResumeData) => {
    const major = resume.personalInfo.major;
    const hotMajors = ['计算机科学', '人工智能', '数据科学', '机器学习', '软件工程'];
    
    if (hotMajors.some(hotMajor => major.includes(hotMajor))) {
      return {
        demand: '高',
        supply: '中',
        competitionLevel: '激烈'
      };
    } else {
      return {
        demand: '中',
        supply: '高',
        competitionLevel: '一般'
      };
    }
  };

  // 生成职业路径
  const generateCareerPath = (resume: ResumeData) => {
    const position = resume.careerObjective?.desiredPosition || '专业技术岗位';
    
    return {
      shortTerm: `成为团队核心${position}，主导重要项目`,
      mediumTerm: `晋升为${position}技术负责人，带领团队`,
      longTerm: `成为${position}领域专家，发表更多高质量论文或专利`
    };
  };

  // 生成推荐建议
  const generateRecommendations = (resume: ResumeData) => {
    const recommendations = [];
    
    // 基于技能推荐
    const technicalSkills = resume.skills.filter(skill => 
      ['Python', '机器学习', '深度学习', 'NLP', '计算机视觉'].includes(skill.name)
    );
    
    if (technicalSkills.length > 0) {
      recommendations.push('重点关注大模型和生成式AI方向的发展');
    }
    
    recommendations.push('加强跨领域合作，拓展研究视野');
    recommendations.push('提升技术领导力和团队管理能力');
    
    return recommendations;
  };

  // 生成改进建议
  const generateImprovementSuggestions = (resume: ResumeData) => {
    const suggestions = [];
    
    // 基于工作经验建议
    if (resume.workExperience.length < 2) {
      suggestions.push('增加行业应用案例的积累');
    }
    
    // 基于学术成就建议
    if (resume.academicAchievements.length < 2) {
      suggestions.push('提升论文发表数量和质量');
    }
    
    suggestions.push('加强与学术界的交流合作');
    
    return suggestions;
  };

  // 生成完整分析结果
  return {
    overallScore,
    categoryScores: {
      education: educationScore,
      experience: experienceScore,
      skills: skillsScore,
      achievements: achievementsScore,
      careerObjective: careerObjectiveScore
    },
    marketAnalysis: generateMarketAnalysis(resume),
    careerPath: generateCareerPath(resume),
    recommendations: generateRecommendations(resume),
    improvementSuggestions: generateImprovementSuggestions(resume)
  };
};

/**
 * 生成简历分析报告
 * @param resume 简历数据
 * @param analysis 分析结果
 * @returns 分析报告
 */
export const generateAnalysisReport = (resume: ResumeData, analysis: CompetitivenessAnalysis): string => {
  let report = `# 简历分析报告\n\n`;
  
  // 个人信息摘要
  report += `## 个人信息摘要\n`;
  report += `- 姓名: ${resume.personalInfo.name}\n`;
  report += `- 学历: ${resume.personalInfo.education}\n`;
  report += `- 专业: ${resume.personalInfo.major}\n`;
  report += `- 工作经验: ${resume.personalInfo.workExperience}\n\n`;
  
  // 总体评分
  report += `## 总体评分\n`;
  report += `**${analysis.overallScore}**/100\n\n`;
  
  // 分项评分
  report += `## 分项评分\n`;
  report += `- 教育背景: ${analysis.categoryScores.education}/100\n`;
  report += `- 工作经验: ${analysis.categoryScores.experience}/100\n`;
  report += `- 技能水平: ${analysis.categoryScores.skills}/100\n`;
  report += `- 成就荣誉: ${analysis.categoryScores.achievements}/100\n`;
  report += `- 职业目标: ${analysis.categoryScores.careerObjective}/100\n\n`;
  
  // 市场分析
  report += `## 市场分析\n`;
  report += `- 市场需求: ${analysis.marketAnalysis.demand}\n`;
  report += `- 人才供给: ${analysis.marketAnalysis.supply}\n`;
  report += `- 竞争程度: ${analysis.marketAnalysis.competitionLevel}\n\n`;
  
  // 职业路径
  report += `## 职业路径建议\n`;
  report += `- 短期目标: ${analysis.careerPath.shortTerm}\n`;
  report += `- 中期目标: ${analysis.careerPath.mediumTerm}\n`;
  report += `- 长期目标: ${analysis.careerPath.longTerm}\n\n`;
  
  // 推荐建议
  report += `## 推荐建议\n`;
  analysis.recommendations.forEach((recommendation, index) => {
    report += `${index + 1}. ${recommendation}\n`;
  });
  report += `\n`;
  
  // 改进建议
  report += `## 改进建议\n`;
  analysis.improvementSuggestions.forEach((suggestion, index) => {
    report += `${index + 1}. ${suggestion}\n`;
  });
  
  return report;
};
