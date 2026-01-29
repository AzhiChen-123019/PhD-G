import { CorporateConfig, UniversityConfig } from '../types';
import CorporateCrawler from '../crawlers/CorporateCrawler';
import UniversityCrawler from '../crawlers/UniversityCrawler';

class OrganizationManager {
  private corporateCrawlers: Map<string, CorporateCrawler> = new Map();
  private universityCrawlers: Map<string, UniversityCrawler> = new Map();

  constructor(corporateConfigs: CorporateConfig[], universityConfigs: UniversityConfig[]) {
    this.initializeCorporateCrawlers(corporateConfigs);
    this.initializeUniversityCrawlers(universityConfigs);
  }

  /**
   * 初始化企业爬虫
   * @param corporateConfigs 企业配置列表
   */
  private initializeCorporateCrawlers(corporateConfigs: CorporateConfig[]) {
    corporateConfigs.forEach(config => {
      if (config.enabled) {
        this.corporateCrawlers.set(config.id, new CorporateCrawler(config));
      }
    });
  }

  /**
   * 初始化大学爬虫
   * @param universityConfigs 大学配置列表
   */
  private initializeUniversityCrawlers(universityConfigs: UniversityConfig[]) {
    universityConfigs.forEach(config => {
      if (config.enabled) {
        this.universityCrawlers.set(config.id, new UniversityCrawler(config));
      }
    });
  }

  /**
   * 获取企业爬虫
   * @param corporateId 企业ID
   * @returns 企业爬虫实例
   */
  getCorporateCrawler(corporateId: string) {
    return this.corporateCrawlers.get(corporateId);
  }

  /**
   * 获取大学爬虫
   * @param universityId 大学ID
   * @returns 大学爬虫实例
   */
  getUniversityCrawler(universityId: string) {
    return this.universityCrawlers.get(universityId);
  }

  /**
   * 获取所有企业爬虫
   * @returns 企业爬虫映射
   */
  getAllCorporateCrawlers() {
    return this.corporateCrawlers;
  }

  /**
   * 获取所有大学爬虫
   * @returns 大学爬虫映射
   */
  getAllUniversityCrawlers() {
    return this.universityCrawlers;
  }

  /**
   * 获取可用的企业列表
   * @returns 可用企业ID列表
   */
  getAvailableCorporations() {
    return Array.from(this.corporateCrawlers.keys());
  }

  /**
   * 获取可用的大学列表
   * @returns 可用大学ID列表
   */
  getAvailableUniversities() {
    return Array.from(this.universityCrawlers.keys());
  }

  /**
   * 添加企业爬虫
   * @param config 企业配置
   */
  addCorporateCrawler(config: CorporateConfig) {
    if (config.enabled) {
      this.corporateCrawlers.set(config.id, new CorporateCrawler(config));
    }
  }

  /**
   * 添加大学爬虫
   * @param config 大学配置
   */
  addUniversityCrawler(config: UniversityConfig) {
    if (config.enabled) {
      this.universityCrawlers.set(config.id, new UniversityCrawler(config));
    }
  }

  /**
   * 移除企业爬虫
   * @param corporateId 企业ID
   */
  removeCorporateCrawler(corporateId: string) {
    this.corporateCrawlers.delete(corporateId);
  }

  /**
   * 移除大学爬虫
   * @param universityId 大学ID
   */
  removeUniversityCrawler(universityId: string) {
    this.universityCrawlers.delete(universityId);
  }

  /**
   * 刷新爬虫实例
   * @param corporateConfigs 企业配置列表
   * @param universityConfigs 大学配置列表
   */
  refreshCrawlers(corporateConfigs: CorporateConfig[], universityConfigs: UniversityConfig[]) {
    this.corporateCrawlers.clear();
    this.universityCrawlers.clear();
    this.initializeCorporateCrawlers(corporateConfigs);
    this.initializeUniversityCrawlers(universityConfigs);
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.corporateCrawlers.clear();
    this.universityCrawlers.clear();
  }
}

export default OrganizationManager;