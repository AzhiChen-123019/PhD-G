'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JobCard } from '../../components/JobUIComponents';
import LanguageSelector from '@/components/LanguageSelector';
import { Job, JobTag, JobCategory, JobStatus, JobLibraryType, UniversityJobSubType, EnterpriseJobSubType } from '../../lib/job-model';
import { TagManager } from '../../lib/tag-management';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTitle from '@/components/PageTitle';

// 多语言支持
import { getTranslation, Language } from '@/lib/i18n';

// 导入真实的岗位抓取服务
import { scrapeJobs } from '../../lib/job-scraper';

export default function JobsPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('zh');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [jobViewCount, setJobViewCount] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = getTranslation(lang);

  // 获取真实的岗位数据
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 使用真实的岗位抓取服务
        const fetchedJobs = await scrapeJobs({
          maxResults: 20,
          platforms: ['LinkedIn', 'Glassdoor', 'Indeed', '51Job', '智联招聘', '猎聘']
        });
        
        setJobs(fetchedJobs);
      } catch (err) {
        console.error('获取岗位数据失败:', err);
        setError(lang === 'zh' ? '获取岗位数据失败，请稍后重试' : 'Failed to fetch job data, please try again later');
        // 如果真实数据获取失败，使用空数组
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [lang]);

  // 检查登录状态
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserName(user.username || 'User');
    }
    
    // 从localStorage获取岗位浏览次数
    const storedViewCount = localStorage.getItem('jobViewCount');
    if (storedViewCount) {
      setJobViewCount(parseInt(storedViewCount));
    }
  }, []);

  // 当岗位浏览次数变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('jobViewCount', jobViewCount.toString());
    
    // 当浏览次数达到5时，弹出上传简历的提醒
    if (jobViewCount === 5) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (!user.hasUploadedResume) {
          const showUploadModal = window.confirm(lang === 'zh' ? '您已经浏览了5个岗位，为了给您提供更精准的岗位推荐，建议您上传简历。是否现在上传？' : 'You have viewed 5 jobs. To provide you with more accurate job recommendations, we suggest you upload your resume. Would you like to upload it now?');
          if (showUploadModal) {
            // 导航到首页上传区域
            window.location.href = '/#upload-resume';
          }
        }
      }
    }
  }, [jobViewCount, router, lang]);

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };

  const filteredJobs = selectedType === 'all' 
    ? jobs
    : jobs.filter(job => job.tags && job.tags.category === (selectedType === 'university' ? JobCategory.UNIVERSITY : JobCategory.ENTERPRISE));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 共享导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={(newLang) => setLang(newLang as Language)} 
      />

      {/* 页面内容 */}
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.jobs.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {lang === 'zh' ? '发现最新最热的博士岗位机会，找到最适合您的职业发展方向' : 'Discover the latest and hottest PhD job opportunities, find the most suitable career development direction for you'}
          </p>
        </div>

        {/* 职位类型筛选 */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-6 py-2 rounded-full transition-colors ${selectedType === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t.jobs.filter.all}
          </button>
          <button
            onClick={() => setSelectedType('university')}
            className={`px-6 py-2 rounded-full transition-colors ${selectedType === 'university' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t.jobs.filter.academic}
          </button>
          <button
            onClick={() => setSelectedType('enterprise')}
            className={`px-6 py-2 rounded-full transition-colors ${selectedType === 'enterprise' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t.jobs.filter.enterprise}
          </button>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {lang === 'zh' ? '正在获取岗位数据...' : 'Fetching job data...'}
            </p>
          </div>
        )}

        {/* 错误状态 */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => {
                // 重新加载数据
                const fetchJobs = async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    const fetchedJobs = await scrapeJobs({
                      maxResults: 20,
                      platforms: ['LinkedIn', 'Glassdoor', 'Indeed', '51Job', '智联招聘', '猎聘']
                    });
                    setJobs(fetchedJobs);
                  } catch (err) {
                    console.error('获取岗位数据失败:', err);
                    setError(lang === 'zh' ? '获取岗位数据失败，请稍后重试' : 'Failed to fetch job data, please try again later');
                    setJobs([]);
                  } finally {
                    setLoading(false);
                  }
                };
                fetchJobs();
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {lang === 'zh' ? '重试' : 'Retry'}
            </button>
          </div>
        )}

        {/* 职位列表 */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={(jobId) => {
                    // 增加岗位浏览次数
                    setJobViewCount(prevCount => prevCount + 1);
                    // 导航到岗位详情页面
                    router.push(`/job/${jobId}`);
                  }}
                  showFavoriteButton={true}
                  isFavorite={false}
                />
              ))}
            </div>

            {/* 空状态 */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-gray-500">
                  {lang === 'zh' ? '暂无相关职位' : 'No related positions found'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Unique%20tech%20logo%20for%20PhD%20job%20platform%2C%20futuristic%20design%20with%20hexagon%20and%20upward%20arrow%2C%20purple%20and%20blue%20gradient%2C%20minimalist%20style%2C%20not%20similar%20to%20Baidu%20Netdisk%20logo%2C%20clean%20white%20background%2C%20professional%20and%20distinctive&image_size=square_hd" alt={t.nav.siteName} className="h-10 w-10 mr-2" />
                <h3 className="text-xl font-bold">{t.nav.siteName}</h3>
              </div>
              <p className="text-gray-400">
                {lang === 'zh' ? '为博士人才提供精准的岗位匹配服务' : 'Providing precise job matching services for PhD talents'}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.quickLinks}</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">{t.nav.home}</a></li>
                <li><a href="/university" className="text-gray-400 hover:text-white">{t.nav.university}</a></li>
                <li><a href="/enterprise" className="text-gray-400 hover:text-white">{t.nav.enterprise}</a></li>
                <li><a href="/jobs" className="text-gray-400 hover:text-white">{t.nav.jobs}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.aboutUs}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">{t.footer.platformIntro}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{t.footer.partners}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">{t.footer.contactUs}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.contact}</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">email@example.com</li>
                <li className="text-gray-400">+86 123 4567 8910</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
