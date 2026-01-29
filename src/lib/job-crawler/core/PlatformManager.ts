import { PlatformConfig } from '../types';
import LinkedInCrawler from '../platforms/LinkedInCrawler';
import GlassdoorCrawler from '../platforms/GlassdoorCrawler';
import IndeedCrawler from '../platforms/IndeedCrawler';
import FiveOneJobCrawler from '../platforms/FiveOneJobCrawler';

class PlatformManager {
  private platforms: Map<string, any> = new Map();

  constructor(configs: Map<string, PlatformConfig>) {
    this.initializePlatforms(configs);
  }

  private initializePlatforms(configs: Map<string, PlatformConfig>) {
    configs.forEach((config, platform) => {
      switch (platform.toLowerCase()) {
        case 'linkedin':
          this.platforms.set(platform, new LinkedInCrawler(config));
          break;
        case 'glassdoor':
          this.platforms.set(platform, new GlassdoorCrawler(config));
          break;
        case 'indeed':
          this.platforms.set(platform, new IndeedCrawler(config));
          break;
        case '51job':
          this.platforms.set(platform, new FiveOneJobCrawler(config));
          break;
        // 可以根据需要添加更多平台
      }
    });
  }

  getCrawler(platform: string) {
    return this.platforms.get(platform);
  }

  getAllPlatforms() {
    return Array.from(this.platforms.keys());
  }

  hasPlatform(platform: string) {
    return this.platforms.has(platform);
  }

  async crawlFromPlatform(platform: string, keywords: string, location: string, limit: number = 10) {
    const crawler = this.getCrawler(platform);
    if (!crawler) {
      throw new Error(`Platform ${platform} is not supported`);
    }

    return crawler.crawl(keywords, location, limit);
  }
}

export default PlatformManager;