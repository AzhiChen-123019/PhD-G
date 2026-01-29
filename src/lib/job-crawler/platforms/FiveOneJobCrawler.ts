import axios from 'axios';
import cheerio from 'cheerio';
import { Job } from '../types';
import { PlatformConfig } from '../types';

class FiveOneJobCrawler {
  private config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  async crawl(keywords: string, location: string, limit: number = 10): Promise<Job[]> {
    try {
      const jobs: Job[] = [];
      const url = `${this.config.baseUrl}/search.php?keyword=${encodeURIComponent(keywords)}&workarea=${encodeURIComponent(location)}`;

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
      $('.j_joblist').each((index, element) => {
        if (jobs.length >= limit) return false;

        const titleElement = $(element).find('.jname a');
        const companyElement = $(element).find('.cname a');
        const locationElement = $(element).find('.info .d');
        const salaryElement = $(element).find('.sal');

        if (titleElement.length > 0) {
          const title = titleElement.text().trim();
          const company = companyElement.text().trim();
          const jobLocation = locationElement.eq(0).text().trim();
          const salary = salaryElement.text().trim();
          const link = titleElement.attr('href') || '';

          jobs.push({
            id: `51job-${Date.now()}-${index}`,
            title,
            company,
            location: jobLocation,
            salary,
            type: '',
            experience: locationElement.eq(1).text().trim(),
            degree: locationElement.eq(2).text().trim(),
            skills: [],
            description: '',
            postedTime: new Date().toISOString(),
            relevanceScore: 0,
            url: link,
            source: '51job',
            viewCount: 0,
            applyCount: 0,
            rating: 0,
            expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天后过期
            platform: '51job',
            isRemote: jobLocation.includes('远程') || jobLocation.includes('remote'),
            experienceLevel: locationElement.eq(1).text().trim(),
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
            const descriptionElement = detail$('.job_msg');

            job.description = descriptionElement.text().trim();
          } catch (error) {
            console.error(`Failed to get details for job ${job.url}:`, error);
          }
        }
      }

      return jobs;
    } catch (error) {
      console.error('51Job crawl error:', error);
      return [];
    }
  }
}

export default FiveOneJobCrawler;