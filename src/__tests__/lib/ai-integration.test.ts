import { AIIntegrationService } from '../../lib/ai-integration';

describe('AIIntegrationService', () => {
  let aiService: AIIntegrationService;

  beforeEach(() => {
    // 重置单例
    (AIIntegrationService as any).instance = undefined;
    aiService = AIIntegrationService.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = AIIntegrationService.getInstance();
      const instance2 = AIIntegrationService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('callLLM', () => {
    it('should return mock response when API key is not set', async () => {
      // 模拟 process.env
      const originalEnv = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const response = await (aiService as any).callLLM('Test prompt', 'gpt-4o');
      expect(response).toContain('分析结果：');
      expect(response).toContain('关键职责：');

      // 恢复原始环境
      process.env.OPENAI_API_KEY = originalEnv;
    });
  });

  describe('parseLLMJobAnalysisResponse', () => {
    it('should parse LLM response into structured format', () => {
      const mockResponse = `分析结果：
1. 关键职责：
- 负责核心AI技术研发
- 参与产品规划和设计

2. 必备 qualifications：
- 计算机科学或相关专业博士学位
- 5年以上AI相关工作经验
`;

      const result = (aiService as any).parseLLMJobAnalysisResponse(mockResponse);
      expect(result).toHaveProperty('keyResponsibilities');
      expect(result).toHaveProperty('requiredQualifications');
      expect(result.keyResponsibilities.length).toBeGreaterThan(0);
    });
  });

  describe('calculateJobFitScore', () => {
    it('should calculate job fit score based on user profile', () => {
      const mockJob = {
        skills: ['Python', '机器学习', '深度学习'],
        location: '北京',
        company: '腾讯'
      };

      const mockUserProfile = {
        skills: ['Python', '机器学习'],
        location: '北京',
        education: [{ degree: '博士' }],
        industryPreferences: ['互联网']
      };

      const score = (aiService as any).calculateJobFitScore(mockJob, mockUserProfile);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('matchDegreeLevel', () => {
    it('should return 1.0 for exact degree match', () => {
      const score = (aiService as any).matchDegreeLevel('博士', '博士');
      expect(score).toBe(1.0);
    });

    it('should return 0.5 for no degree match', () => {
      const score = (aiService as any).matchDegreeLevel('博士', '硕士');
      expect(score).toBe(0.5);
    });
  });

  describe('matchLocation', () => {
    it('should return 1.0 for exact location match', () => {
      const score = (aiService as any).matchLocation('北京市海淀区', '北京');
      expect(score).toBe(1.0);
    });

    it('should return 0.3 for no location match', () => {
      const score = (aiService as any).matchLocation('上海', '北京');
      expect(score).toBe(0.3);
    });
  });
});
