'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 内容区块类型定义
interface ContentBlock {
  id: string;
  name: string;
  slug: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 本地存储键名
const CONTENT_BLOCKS_KEY = 'contentBlocks';

// 获取所有内容区块
const getAllContentBlocks = (): ContentBlock[] => {
  const blocksJson = localStorage.getItem(CONTENT_BLOCKS_KEY);
  if (blocksJson) {
    return JSON.parse(blocksJson);
  } else {
    // 默认内容区块
    const defaultBlocks: ContentBlock[] = [
      {
        id: 'block-1',
        name: '首页横幅',
        slug: 'home-banner',
        content: `<div class="bg-primary text-white p-12 text-center">
  <h1 class="text-4xl font-bold mb-4">欢迎来到PhD-G</h1>
  <p class="text-xl mb-8">Global Gateway for PhD Opportunities</p>
  <a href="/jobs" class="bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
    浏览岗位
  </a>
</div>`,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'block-2',
        name: '首页优势',
        slug: 'home-advantages',
        content: `<div class="py-12">
  <div class="container mx-auto">
    <h2 class="text-3xl font-bold text-center mb-12">我们的优势</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">精准匹配</h3>
        <p class="text-gray-600">基于AI算法的精准岗位匹配</p>
      </div>
      <div class="text-center">
        <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">专业服务</h3>
        <p class="text-gray-600">专业的人才服务团队</p>
      </div>
      <div class="text-center">
        <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">高效便捷</h3>
        <p class="text-gray-600">简单易用的平台操作</p>
      </div>
    </div>
  </div>
</div>`,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(CONTENT_BLOCKS_KEY, JSON.stringify(defaultBlocks));
    return defaultBlocks;
  }
};

// 保存内容区块
const saveContentBlocks = (blocks: ContentBlock[]) => {
  localStorage.setItem(CONTENT_BLOCKS_KEY, JSON.stringify(blocks));
};

// 创建新内容区块
const createContentBlock = (): ContentBlock => {
  const newBlock: ContentBlock = {
    id: `block-${Date.now()}`,
    name: '新内容区块',
    slug: `new-block-${Date.now()}`,
    content: `<div class="p-8 bg-gray-50">
  <h2 class="text-2xl font-bold mb-4">新内容区块</h2>
  <p>请编辑此内容区块。</p>
</div>`,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return newBlock;
};

export default function ContentBlocksPage() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 初始化数据
  useEffect(() => {
    setContentBlocks(getAllContentBlocks());
  }, []);

  // 保存所有内容区块
  const handleSaveBlocks = () => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedBlocks = contentBlocks.map(block => ({
        ...block,
        updatedAt: new Date().toISOString()
      }));
      
      saveContentBlocks(updatedBlocks);
      setContentBlocks(updatedBlocks);
      setSuccessMessage('内容区块保存成功！');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存内容区块失败');
      console.error('Error saving content blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新内容区块
  const addNewBlock = () => {
    const newBlock = createContentBlock();
    setContentBlocks([...contentBlocks, newBlock]);
    setSelectedBlock(newBlock);
    setIsPreviewMode(false);
  };

  // 删除内容区块
  const deleteBlock = (blockId: string) => {
    const updatedBlocks = contentBlocks.filter(block => block.id !== blockId);
    setContentBlocks(updatedBlocks);
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  // 更新内容区块
  const updateBlock = (block: ContentBlock) => {
    const updatedBlocks = contentBlocks.map(b => 
      b.id === block.id ? block : b
    );
    setContentBlocks(updatedBlocks);
    setSelectedBlock(block);
  };

  // 切换内容区块状态
  const toggleBlockStatus = (blockId: string) => {
    const updatedBlocks = contentBlocks.map(block => 
      block.id === blockId ? { ...block, isActive: !block.isActive } : block
    );
    setContentBlocks(updatedBlocks);
    if (selectedBlock?.id === blockId) {
      setSelectedBlock({ ...selectedBlock, isActive: !selectedBlock.isActive });
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
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
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
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
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
              <h1 className="text-2xl font-bold text-gray-900">内容区块管理</h1>
              <p className="text-gray-600">管理网站动态内容区块</p>
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
              {/* 内容区块列表 */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">内容区块列表</h2>
                  <button
                    onClick={addNewBlock}
                    className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                  >
                    添加区块
                  </button>
                </div>
                
                <div className="space-y-2">
                  {contentBlocks.map(block => (
                    <div
                      key={block.id}
                      onClick={() => {
                        setSelectedBlock(block);
                        setIsPreviewMode(false);
                      }}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${selectedBlock?.id === block.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-900">{block.name}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${block.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {block.isActive ? '启用' : '禁用'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{block.slug}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(block.updatedAt).toLocaleString()}
                      </div>
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBlockStatus(block.id);
                          }}
                          className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-md text-xs hover:bg-gray-200 transition-colors"
                        >
                          {block.isActive ? '禁用' : '启用'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBlock(block.id);
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
              
              {/* 内容区块编辑 */}
              {selectedBlock && (
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">编辑内容区块</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${isPreviewMode ? 'bg-primary/10 text-primary border border-primary' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                      >
                        {isPreviewMode ? '编辑' : '预览'}
                      </button>
                      <button
                        onClick={handleSaveBlocks}
                        disabled={loading}
                        className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? '保存中...' : '保存区块'}
                      </button>
                    </div>
                  </div>
                  
                  {isPreviewMode ? (
                    // 预览模式
                    <div className="bg-gray-50 p-6 rounded-md">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedBlock.name}</h3>
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedBlock.content }}
                      ></div>
                    </div>
                  ) : (
                    // 编辑模式
                    <div className="space-y-4">
                      {/* 内容区块名称 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">区块名称</label>
                        <input
                          type="text"
                          value={selectedBlock.name}
                          onChange={(e) => {
                            const updatedBlock = { ...selectedBlock, name: e.target.value };
                            updateBlock(updatedBlock);
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="输入区块名称"
                        />
                      </div>
                      
                      {/* 内容区块标识 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">区块标识</label>
                        <input
                          type="text"
                          value={selectedBlock.slug}
                          onChange={(e) => {
                            const updatedBlock = { 
                              ...selectedBlock, 
                              slug: e.target.value.toLowerCase().replace(/\s+/g, '-') 
                            };
                            updateBlock(updatedBlock);
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="输入区块标识，如 home-banner"
                        />
                      </div>
                      
                      {/* 内容区块内容 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">区块内容</label>
                        <textarea
                          value={selectedBlock.content}
                          onChange={(e) => {
                            const updatedBlock = { ...selectedBlock, content: e.target.value };
                            updateBlock(updatedBlock);
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={15}
                          placeholder="输入区块内容（支持HTML格式）"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-2">
                          支持HTML格式，可使用各种HTML标签和内联样式。
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
