'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 静态页面类型定义
interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// 本地存储键名
const STATIC_PAGES_KEY = 'staticPages';

// 获取所有静态页面
const getAllStaticPages = (): StaticPage[] => {
  const pagesJson = localStorage.getItem(STATIC_PAGES_KEY);
  if (pagesJson) {
    return JSON.parse(pagesJson);
  } else {
    // 默认页面
    const defaultPages: StaticPage[] = [
      {
        id: 'page-1',
        title: '关于我们',
        slug: 'about',
        content: `<h2>关于PhD-G</h2>\n<p>PhD-G: Global Gateway for PhD Opportunities 是专业的全球博士机会平台，致力于连接优秀的博士人才与国际知名企业和研究机构。</p>\n<h3>我们的使命</h3>\n<p>助力博士人才实现全球职业发展，帮助企业和机构招募顶尖研究人才。</p>\n<h3>我们的优势</h3>\n<ul>\n  <li>专业的人才筛选机制</li>\n  <li>精准的岗位匹配算法</li>\n  <li>AI驱动的简历优化工具</li>\n  <li>全球职位机会网络</li>\n  <li>优质的客户服务</li>\n  <li>丰富的行业资源</li>\n</ul>`, 
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'page-2',
        title: '服务条款',
        slug: 'terms',
        content: `<h2>服务条款</h2>\n<p>欢迎使用PhD-G服务。请仔细阅读以下服务条款...</p>\n<h3>1. 服务内容</h3>\n<p>我们提供高端人才招聘服务，包括...</p>\n<h3>2. 用户责任</h3>\n<p>用户在使用我们的服务时，应遵守...</p>\n<h3>3. 隐私政策</h3>\n<p>我们重视用户隐私，将严格保护用户信息...</p>`,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'page-3',
        title: '隐私政策',
        slug: 'privacy',
        content: `<h2>隐私政策</h2>\n<p>本隐私政策说明了PhD-G如何收集、使用和保护您的个人信息...</p>\n<h3>1. 信息收集</h3>\n<p>我们收集以下类型的信息...</p>\n<h3>2. 信息使用</h3>\n<p>我们使用收集的信息用于...</p>\n<h3>3. 信息保护</h3>\n<p>我们采取多种安全措施保护您的信息...</p>`,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STATIC_PAGES_KEY, JSON.stringify(defaultPages));
    return defaultPages;
  }
};

// 保存静态页面
const saveStaticPages = (pages: StaticPage[]) => {
  localStorage.setItem(STATIC_PAGES_KEY, JSON.stringify(pages));
};

// 创建新静态页面
const createStaticPage = (): StaticPage => {
  const newPage: StaticPage = {
    id: `page-${Date.now()}`,
    title: '新页面',
    slug: `new-page-${Date.now()}`,
    content: '<h2>新页面</h2>\n<p>请编辑此页面内容。</p>',
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return newPage;
};

export default function StaticPagesPage() {
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 初始化数据
  useEffect(() => {
    setStaticPages(getAllStaticPages());
  }, []);

  // 保存所有静态页面
  const handleSavePages = () => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedPages = staticPages.map(page => ({
        ...page,
        updatedAt: new Date().toISOString()
      }));
      
      saveStaticPages(updatedPages);
      setStaticPages(updatedPages);
      setSuccessMessage('页面保存成功！');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存页面失败');
      console.error('Error saving static pages:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新页面
  const addNewPage = () => {
    const newPage = createStaticPage();
    setStaticPages([...staticPages, newPage]);
    setSelectedPage(newPage);
    setIsPreviewMode(false);
  };

  // 删除页面
  const deletePage = (pageId: string) => {
    const updatedPages = staticPages.filter(page => page.id !== pageId);
    setStaticPages(updatedPages);
    if (selectedPage?.id === pageId) {
      setSelectedPage(null);
    }
  };

  // 更新页面
  const updatePage = (page: StaticPage) => {
    const updatedPages = staticPages.map(p => 
      p.id === page.id ? page : p
    );
    setStaticPages(updatedPages);
    setSelectedPage(page);
  };

  // 切换发布状态
  const togglePublishStatus = (pageId: string) => {
    const updatedPages = staticPages.map(page => 
      page.id === pageId ? { ...page, isPublished: !page.isPublished } : page
    );
    setStaticPages(updatedPages);
    if (selectedPage?.id === pageId) {
      setSelectedPage({ ...selectedPage, isPublished: !selectedPage.isPublished });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* 侧边栏导航 */}
        <div className="w-64 bg-secondary text-white flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold">管理控制面板</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>仪表盘</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/users">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>用户管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/jobs">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>岗位管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/application-materials">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>申请材料配置</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/api-costs">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>API费用跟踪</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/membership-revenue">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>会员与收入管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/ai-prompts">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>AI提示词管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/membership-rules">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>会员规则配置</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/pages">
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>页面管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/navigation">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>导航管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/content-blocks">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <span>内容区块管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/media">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>媒体库管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/data">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>数据管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/settings">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>系统设置</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                AD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">超级管理员</p>
                <p className="text-xs text-gray-300">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 主内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">页面管理</h1>
              <p className="text-gray-600">管理网站静态页面内容</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* 成功消息 */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                {successMessage}
              </div>
            )}
            
            {/* 错误消息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 页面列表 */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">页面列表</h2>
                  <button
                    onClick={addNewPage}
                    className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                  >
                    添加页面
                  </button>
                </div>
                
                <div className="space-y-2">
                  {staticPages.map(page => (
                    <div
                      key={page.id}
                      onClick={() => {
                        setSelectedPage(page);
                        setIsPreviewMode(false);
                      }}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${selectedPage?.id === page.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-900">{page.title}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {page.isPublished ? '已发布' : '草稿'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">/{page.slug}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(page.updatedAt).toLocaleString()}
                      </div>
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePublishStatus(page.id);
                          }}
                          className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-md text-xs hover:bg-gray-200 transition-colors"
                        >
                          {page.isPublished ? '下架' : '发布'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePage(page.id);
                          }}
                          className="px-2 py-0.5 bg-red-100 text-red-800 rounded-md text-xs hover:bg-red-200 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 页面编辑 */}
              {selectedPage && (
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">编辑页面</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${isPreviewMode ? 'bg-primary/10 text-primary border border-primary' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                      >
                        {isPreviewMode ? '编辑' : '预览'}
                      </button>
                      <button
                        onClick={handleSavePages}
                        disabled={loading}
                        className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? '保存中...' : '保存页面'}
                      </button>
                    </div>
                  </div>
                  
                  {isPreviewMode ? (
                    // 预览模式
                    <div className="bg-gray-50 p-6 rounded-md">
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedPage.title}</h1>
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                      ></div>
                    </div>
                  ) : (
                    // 编辑模式
                    <div className="space-y-4">
                      {/* 页面标题 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">页面标题</label>
                        <input
                          type="text"
                          value={selectedPage.title}
                          onChange={(e) => {
                            const updatedPage = { ...selectedPage, title: e.target.value };
                            updatePage(updatedPage);
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="输入页面标题"
                        />
                      </div>
                      
                      {/* 页面slug */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">页面Slug</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                            /
                          </span>
                          <input
                            type="text"
                            value={selectedPage.slug}
                            onChange={(e) => {
                              const updatedPage = { ...selectedPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') };
                              updatePage(updatedPage);
                            }}
                            className="flex-1 border border-gray-300 rounded-r-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="page-slug"
                          />
                        </div>
                      </div>
                      
                      {/* 页面内容 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">页面内容</label>
                        <textarea
                          value={selectedPage.content}
                          onChange={(e) => {
                            const updatedPage = { ...selectedPage, content: e.target.value };
                            updatePage(updatedPage);
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={15}
                          placeholder="输入页面内容（支持HTML格式）"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-2">
                          支持HTML格式，可使用h2-h6标题、p段落、ul/ol列表、a链接等标签。
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}