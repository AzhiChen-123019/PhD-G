import { AIIntegrationService } from '../../lib/ai-integration';
import { JobStorageManager } from '../../lib/job-storage';
import { JobStatus } from '../../lib/job-model';

describe('Integration Tests', () => {
  beforeEach(() => {
    // 清空所有存储
    JobStorageManager.clearAllJobs();
    // 清空用户私人岗位存储和其他用户相关存储
    if (typeof localStorage !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('privateJobs_') || 
            key.startsWith('jobFavorites_') || 
            key.startsWith('jobApplications_')) {
          localStorage.removeItem(key);
        }
      });
    }
    // 重置 AI 服务单例
    (AIIntegrationService as any).instance = undefined;
  });

  describe('AI Integration with Job Storage', () => {
    it('should scrape jobs and save them to storage', async () => {
      const aiService = AIIntegrationService.getInstance();

      // 模拟抓取岗位
      const scrapedJobs = await aiService.intelligentJobScrape({
        keywords: ['人工智能', '机器学习'],
        maxResults: 2,
        useAI: false
      });

      expect(scrapedJobs).toHaveLength(2);

      // 将抓取的岗位保存到存储
      scrapedJobs.forEach(job => {
        JobStorageManager.addJob(job);
      });

      const storedJobs = JobStorageManager.getAllJobs();
      expect(storedJobs).toHaveLength(2);
    });

    it('should enhance jobs with AI analysis and save them', async () => {
      const aiService = AIIntegrationService.getInstance();

      // 使用 AI 增强抓取岗位
      const enhancedJobs = await aiService.intelligentJobScrape({
        keywords: ['人工智能'],
        maxResults: 1,
        useAI: true,
        analysisDepth: 'detailed'
      });

      expect(enhancedJobs).toHaveLength(1);
      expect(enhancedJobs[0].aiAnalysis).toBeDefined();

      // 保存增强后的岗位
      JobStorageManager.addJob(enhancedJobs[0]);

      const storedJob = JobStorageManager.getJobById(enhancedJobs[0].id);
      expect(storedJob).toBeDefined();
    });
  });

  describe('Job Storage with User Management', () => {
    it('should add job to private library and retrieve it', () => {
      const mockJob = {
        id: 'test-job-private',
        title: '测试私人岗位',
        company: '测试公司',
        location: '北京',
        salary: '10000',
        type: 'enterprise',
        deadline: '2026-12-31',
        description: '测试岗位描述',
        responsibilities: [],
        requirements: [],
        skills: ['JavaScript'],
        postedTime: new Date().toISOString(),
        relevanceScore: 85,
        url: 'https://example.com/job/1',
        source: 'manual',
        viewCount: 0,
        applyCount: 0,
        rating: 4.5,
        status: JobStatus.ACTIVE,
        tags: {
          category: 'enterprise',
          subType: 'tech'
        },
        libraryType: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 先保存到公共库
      JobStorageManager.addJob(mockJob);

      // 添加到私人库
      const addResult = JobStorageManager.addJobToPrivateLibrary('user123', mockJob);
      expect(addResult).toBe(true);

      // 获取私人岗位
      const privateJobs = JobStorageManager.getUserPrivateJobs('user123');
      expect(privateJobs).toHaveLength(1);
      expect(privateJobs[0].jobId).toBe('test-job-private');
    });

    it('should remove job from private library', () => {
      const mockJob = {
        id: 'test-job-remove',
        title: '测试移除岗位',
        company: '测试公司',
        location: '北京',
        salary: '10000',
        type: 'enterprise',
        deadline: '2026-12-31',
        description: '测试岗位描述',
        responsibilities: [],
        requirements: [],
        skills: ['JavaScript'],
        postedTime: new Date().toISOString(),
        relevanceScore: 85,
        url: 'https://example.com/job/1',
        source: 'manual',
        viewCount: 0,
        applyCount: 0,
        rating: 4.5,
        status: JobStatus.ACTIVE,
        tags: {
          category: 'enterprise',
          subType: 'tech'
        },
        libraryType: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 保存并添加到私人库
      JobStorageManager.addJob(mockJob);
      JobStorageManager.addJobToPrivateLibrary('user123', mockJob);

      let privateJobs = JobStorageManager.getUserPrivateJobs('user123');
      expect(privateJobs).toHaveLength(1);

      // 从私人库移除
      const removeResult = JobStorageManager.removeJobFromPrivateLibrary('user123', 'test-job-remove');
      expect(removeResult).toBe(true);

      privateJobs = JobStorageManager.getUserPrivateJobs('user123');
      expect(privateJobs).toHaveLength(0);
    });
  });

  describe('Job Matching Workflow', () => {
    it('should complete end-to-end job matching process', async () => {
      const aiService = AIIntegrationService.getInstance();

      // 1. 抓取岗位
      const scrapedJobs = await aiService.intelligentJobScrape({
        keywords: ['人工智能', '机器学习'],
        maxResults: 3,
        useAI: true
      });

      expect(scrapedJobs).toHaveLength(3);

      // 2. 保存岗位到存储
      scrapedJobs.forEach(job => {
        JobStorageManager.addJob(job);
      });

      const storedJobs = JobStorageManager.getAllJobs();
      expect(storedJobs).toHaveLength(3);

      // 3. 将第一个岗位添加到私人库
      const addResult = JobStorageManager.addJobToPrivateLibrary('user123', storedJobs[0]);
      expect(addResult).toBe(true);

      // 4. 验证私人岗位
      const privateJobs = JobStorageManager.getUserPrivateJobs('user123');
      expect(privateJobs).toHaveLength(1);

      // 5. 对私人岗位进行评分
      const rateResult = JobStorageManager.rateJobSatisfaction('user123', storedJobs[0].id, 5, '非常满意');
      expect(rateResult).toBe(true);

      // 6. 验证评分
      const updatedPrivateJobs = JobStorageManager.getUserPrivateJobs('user123');
      expect(updatedPrivateJobs[0].satisfactionScore).toBe(5);
    });
  });
});
