import { JobStorageManager } from '../../lib/job-storage';
import { Job, JobStatus } from '../../lib/job-model';

describe('JobStorageManager', () => {
  beforeEach(() => {
    // 清空存储
    JobStorageManager.clearAllJobs();
  });

  describe('addJob', () => {
    it('should add a job to storage', () => {
      const mockJob: Job = {
        id: 'test-job-1',
        title: '测试岗位',
        company: '测试公司',
        location: '北京',
        salary: '10000',
        type: 'enterprise',
        deadline: '2026-12-31',
        description: '测试岗位描述',
        responsibilities: [],
        requirements: [],
        skills: ['JavaScript', 'React'],
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      JobStorageManager.addJob(mockJob);
      const jobs = JobStorageManager.getAllJobs();
      expect(jobs).toHaveLength(1);
      expect(jobs[0].id).toBe('test-job-1');
    });
  });

  describe('getAllJobs', () => {
    it('should return all jobs in storage', () => {
      const mockJob1: Job = {
        id: 'test-job-1',
        title: '测试岗位1',
        company: '测试公司1',
        location: '北京',
        salary: '10000',
        type: 'enterprise',
        deadline: '2026-12-31',
        description: '测试岗位描述1',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockJob2: Job = {
        id: 'test-job-2',
        title: '测试岗位2',
        company: '测试公司2',
        location: '上海',
        salary: '15000',
        type: 'university',
        deadline: '2026-12-31',
        description: '测试岗位描述2',
        responsibilities: [],
        requirements: [],
        skills: ['Python'],
        postedTime: new Date().toISOString(),
        relevanceScore: 90,
        url: 'https://example.com/job/2',
        source: 'manual',
        viewCount: 0,
        applyCount: 0,
        rating: 4.8,
        status: JobStatus.ACTIVE,
        tags: {
          category: 'university',
          subType: 'professor'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      JobStorageManager.addJob(mockJob1);
      JobStorageManager.addJob(mockJob2);
      const jobs = JobStorageManager.getAllJobs();
      expect(jobs).toHaveLength(2);
    });
  });

  describe('getJobById', () => {
    it('should return job by id', () => {
      const mockJob: Job = {
        id: 'test-job-1',
        title: '测试岗位',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      JobStorageManager.addJob(mockJob);
      const job = JobStorageManager.getJobById('test-job-1');
      expect(job).toBeDefined();
      expect(job?.id).toBe('test-job-1');
    });

    it('should return undefined for non-existent job', () => {
      const job = JobStorageManager.getJobById('non-existent-job');
      expect(job).toBeUndefined();
    });
  });

  describe('clearAllJobs', () => {
    it('should clear all jobs from storage', () => {
      const mockJob: Job = {
        id: 'test-job-1',
        title: '测试岗位',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      JobStorageManager.addJob(mockJob);
      expect(JobStorageManager.getAllJobs()).toHaveLength(1);

      JobStorageManager.clearAllJobs();
      expect(JobStorageManager.getAllJobs()).toHaveLength(0);
    });
  });
});
