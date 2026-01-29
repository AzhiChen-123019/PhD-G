import axios from 'axios';
import cheerio from 'cheerio';
import { Job } from '../types';
import { PlatformConfig } from '../types';

class LinkedInCrawler {
  private config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  async crawl(keywords: string, location: string, limit: number = 10): Promise<Job[]> {
    try {
      const jobs: Job[] = [];
      const url = `${this.config.baseUrl}/jobs/search?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`;

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
      $('.jobs-search__results-list li').each((index, element) => {
        if (jobs.length >= limit) return false;

        const titleElement = $(element).find('.job-card-list__title');
        const companyElement = $(element).find('.job-card-container__company-name');
        const locationElement = $(element).find('.job-card-container__metadata-item');
        const linkElement = $(element).find('a.job-card-list__title');

        if (titleElement.length > 0) {
          const title = titleElement.text().trim();
          const company = companyElement.text().trim();
          const jobLocation = locationElement.text().trim();
          const link = linkElement.attr('href') ? `${this.config.baseUrl}${linkElement.attr('href')}` : '';

          jobs.push({
            id: `linkedin-${Date.now()}-${index}`,
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
            source: 'linkedin',
            viewCount: 0,
            applyCount: 0,
            rating: 0,
            expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天后过期
            platform: 'linkedin',
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
            const descriptionElement = detail$('.description__text');
            const salaryElement = detail$('.salary-main__value');
            const jobTypeElement = detail$('.description__job-criteria-list li');

            job.description = descriptionElement.text().trim();
            job.salary = salaryElement.text().trim();

            // 解析工作类型、经验要求等
            jobTypeElement.each((_, item) => {
              const text = detail$(item).text().trim();
              if (text.includes('Job Type')) {
                job.jobType = text.replace('Job Type', '').trim();
              } else if (text.includes('Experience Level')) {
                job.experienceLevel = text.replace('Experience Level', '').trim();
              }
            });
          } catch (error) {
            console.error(`Failed to get details for job ${job.url}:`, error);
          }
        }
      }

      return jobs;
    } catch (error) {
      console.error('LinkedIn crawl error:', error);
      return [];
    }
  }
}

export default LinkedInCrawler;