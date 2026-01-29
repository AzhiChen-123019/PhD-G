import axios from 'axios';
import cheerio from 'cheerio';
import { Job } from '../types';
import { PlatformConfig } from '../types';

class IndeedCrawler {
  private config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  async crawl(keywords: string, location: string, limit: number = 10): Promise<Job[]> {
    try {
      const jobs: Job[] = [];
      const url = `${this.config.baseUrl}/jobs?q=${encodeURIComponent(keywords)}&l=${encodeURIComponent(location)}`;

      // 使用axios获取页面内容
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);

      // 解析岗位信息
      $('.jobsearch-SerpJobCard').each((index, element) => {
        if (jobs.length >= limit) return false;

        const titleElement = $(element).find('.jobtitle');
        const companyElement = $(element).find('.company');
        const locationElement = $(element).find('.location');
        const linkElement = $(element).find('a.jobtitle');

        if (titleElement.length > 0) {
          const title = titleElement.text().trim();
          const company = companyElement.text().trim();
          const jobLocation = locationElement.text().trim();
          const link = linkElement.attr('href') ? `${this.config.baseUrl}${linkElement.attr('href')}` : '';

          jobs.push({
            id: `indeed-${Date.now()}-${index}`,
            title,
            company,
            location: jobLocation,
            salary: '',
            type: '',
            experience: '',
            degree: '',
            skills: [],
            description: '',
            postedTime: new Date().toISOString(),
            relevanceScore: 0,
            url: link,
            source: 'indeed',
            viewCount: 0,
            applyCount: 0,
            rating: 0,
            expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天后过期
            platform: 'indeed',
            isRemote: jobLocation.toLowerCase().includes('remote'),
            experienceLevel: '',
            jobType: '',
            industry: '',
            crawlDate: new Date().toISOString(),
            requirements: [],
            benefits: []
          });
        }
      });

      // 对每个岗位获取详细信息
      for (const job of jobs) {
        if (job.url) {
          try {
            const detailResponse = await axios.get(job.url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              },
              timeout: 30000
            });

            const detail$ = cheerio.load(detailResponse.data);
            const descriptionElement = detail$('.jobsearch-jobDescriptionText');
            const salaryElement = detail$('.salaryText');
            const jobTypeElement = detail$('.jobMetadataHeader-item');

            job.description = descriptionElement.text().trim();
            job.salary = salaryElement.text().trim();

            // 解析工作类型、经验要求等
            jobTypeElement.each((_, item) => {
              const text = detail$(item).text().trim();
              if (text.includes('Full-time') || text.includes('Part-time') || text.includes('Contract')) {
                job.jobType = text;
              }
            });
          } catch (error) {
            console.error(`Failed to get details for job ${job.url}:`, error);
          }
        }
      }

      return jobs;
    } catch (error) {
      console.error('Indeed crawl error:', error);
      return [];
    }
  }
}

export default IndeedCrawler;