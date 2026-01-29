'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 导航项类型定义
interface NavigationItem {
  id: string;
  title: string;
  url: string;
  order: number;
  isActive: boolean;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

// 本地存储键名
const NAVIGATION_ITEMS_KEY = 'navigationItems';

// 获取所有导航项
const getAllNavigationItems = (): NavigationItem[] => {
  // 定义默认导航项，与前端保持一致
  const defaultItems: NavigationItem[] = [
    {
      id: 'nav-1',
      title: '首页',
      url: '/',
      order: 1,
      isActive: true,
      parentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'nav-2',
      title: '大学科研岗位',
      url: '/university',
      order: 2,
      isActive: true,
      parentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'nav-3',
      title: '企业高级岗位',
      url: '/enterprise',
      order: 3,
      isActive: true,
      parentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'nav-4',
      title: '我的私人岗位',
      url: '/private',
      order: 4,
      isActive: true,
      parentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // 直接使用默认导航项，确保与前端完全一致
  localStorage.setItem(NAVIGATION_ITEMS_KEY, JSON.stringify(defaultItems));
  return defaultItems;
};

// 保存导航项
const saveNavigationItems = (items: NavigationItem[]) => {
  localStorage.setItem(NAVIGATION_ITEMS_KEY, JSON.stringify(items));
};

// 创建新导航项
const createNavigationItem = (): NavigationItem => {
  const newItem: NavigationItem = {
    id: `nav-${Date.now()}`,
    title: '新导航项',
    url: '/',
    order: 999,
    isActive: true,
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return newItem;
};

// 获取顶级导航项
const getTopLevelNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
  return items.filter(item => item.parentId === null).sort((a, b) => a.order - b.order);
};

// 获取子导航项
const getSubNavigationItems = (items: NavigationItem[], parentId: string): NavigationItem[] => {
  return items.filter(item => item.parentId === parentId).sort((a, b) => a.order - b.order);
};

export default function NavigationPage() {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 初始化数据
  useEffect(() => {
    setNavigationItems(getAllNavigationItems());
  }, []);

  // 保存所有导航项
  const handleSaveItems = () => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedItems = navigationItems.map(item => ({
        ...item,
        updatedAt: new Date().toISOString()
      }));
      
      saveNavigationItems(updatedItems);
      setNavigationItems(updatedItems);
      setSuccessMessage('导航项保存成功！');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存导航项失败');
      console.error('Error saving navigation items:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新导航项
  const addNewItem = () => {
    const newItem = createNavigationItem();
    setNavigationItems([...navigationItems, newItem]);
    setSelectedItem(newItem);
  };

  // 删除导航项
  const deleteItem = (itemId: string) => {
    // 删除所有子项
    const updatedItems = navigationItems.filter(item => item.id !== itemId && item.parentId !== itemId);
    setNavigationItems(updatedItems);
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
  };

  // 更新导航项
  const updateItem = (item: NavigationItem) => {
    const updatedItems = navigationItems.map(i => 
      i.id === item.id ? item : i
    );
    setNavigationItems(updatedItems);
    setSelectedItem(item);
  };

  // 切换导航项状态
  const toggleItemStatus = (itemId: string) => {
    const updatedItems = navigationItems.map(item => 
      item.id === itemId ? { ...item, isActive: !item.isActive } : item
    );
    setNavigationItems(updatedItems);
    if (selectedItem?.id === itemId) {
      setSelectedItem({ ...selectedItem, isActive: !selectedItem.isActive });
    }
  };

  // 更新导航项顺序
  const updateItemOrder = (itemId: string, newOrder: number) => {
    const updatedItems = navigationItems.map(item => 
      item.id === itemId ? { ...item, order: newOrder } : item
    );
    setNavigationItems(updatedItems);
    if (selectedItem?.id === itemId) {
      setSelectedItem({ ...selectedItem, order: newOrder });
    }
  };

  // 顶级导航项
  const topLevelItems = getTopLevelNavigationItems(navigationItems);

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
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
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
              <h1 className="text-2xl font-bold text-gray-900">导航管理</h1>
              <p className="text-gray-600">管理网站导航菜单和链接</p>
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
              {/* 导航菜单列表 */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">导航菜单</h2>
                  <button
                    onClick={addNewItem}
                    className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                  >
                    添加导航项
                  </button>
                </div>
                
                <div className="space-y-2">
                  {topLevelItems.map(item => {
                    const subItems = getSubNavigationItems(navigationItems, item.id);
                    
                    return (
                      <div key={item.id} className="space-y-1">
                        <div
                          onClick={() => setSelectedItem(item)}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${selectedItem?.id === item.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-gray-900 flex items-center">
                              <span className="w-5 h-5 inline-flex items-center justify-center text-xs font-bold text-white bg-primary rounded-full mr-2">
                                {item.order}
                              </span>
                              {item.title}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.isActive ? '启用' : '禁用'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{item.url}</div>
                          <div className="flex gap-1 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemStatus(item.id);
                              }}
                              className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-md text-xs hover:bg-gray-200 transition-colors"
                            >
                              {item.isActive ? '停用' : '启用'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(item.id);
                              }}
                              className="px-2 py-0.5 bg-red-100 text-red-800 rounded-md text-xs hover:bg-red-200 transition-colors"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                        
                        {/* 子导航项 */}
                        {subItems.length > 0 && (
                          <div className="ml-4 space-y-1">
                            {subItems.map(subItem => (
                              <div
                                key={subItem.id}
                                onClick={() => setSelectedItem(subItem)}
                                className={`p-2 rounded-md cursor-pointer transition-colors ml-4 ${selectedItem?.id === subItem.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-gray-900 flex items-center">
                                    <span className="w-5 h-5 inline-flex items-center justify-center text-xs font-bold text-white bg-primary rounded-full mr-2">
                                      {subItem.order}
                                    </span>
                                    {subItem.title}
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${subItem.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {subItem.isActive ? '启用' : '禁用'}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">{subItem.url}</div>
                                <div className="flex gap-1 mt-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItemStatus(subItem.id);
                                    }}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-md text-xs hover:bg-gray-200 transition-colors"
                                  >
                                    {subItem.isActive ? '停用' : '启用'}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteItem(subItem.id);
                                    }}
                                    className="px-2 py-0.5 bg-red-100 text-red-800 rounded-md text-xs hover:bg-red-200 transition-colors"
                                  >
                                    删除
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 导航项编辑 */}
              {selectedItem && (
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">编辑导航项</h2>
                    <button
                      onClick={handleSaveItems}
                      disabled={loading}
                      className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '保存中...' : '保存导航项'}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* 导航项标题 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">导航项标题</label>
                      <input
                        type="text"
                        value={selectedItem.title}
                        onChange={(e) => {
                          const updatedItem = { ...selectedItem, title: e.target.value };
                          updateItem(updatedItem);
                        }}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="输入导航项标题"
                      />
                    </div>
                    
                    {/* 导航项URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">导航项URL</label>
                      <input
                        type="text"
                        value={selectedItem.url}
                        onChange={(e) => {
                          const updatedItem = { ...selectedItem, url: e.target.value };
                          updateItem(updatedItem);
                        }}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="输入导航项URL，如 /jobs"
                      />
                    </div>
                    
                    {/* 导航项顺序 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">导航项顺序</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={selectedItem.order}
                        onChange={(e) => {
                          const newOrder = parseInt(e.target.value) || 1;
                          updateItemOrder(selectedItem.id, newOrder);
                        }}
                        className="w-20 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    {/* 导航项状态 */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItem.isActive}
                        onChange={(e) => {
                          toggleItemStatus(selectedItem.id);
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        启用导航项
                      </label>
                    </div>
                    
                    {/* 父导航项 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">父导航项</label>
                      <select
                        value={selectedItem.parentId || ''}
                        onChange={(e) => {
                          const updatedItem = {
                            ...selectedItem,
                            parentId: e.target.value === '' ? null : e.target.value
                          };
                          updateItem(updatedItem);
                        }}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">-- 无父导航项（顶级）--</option>
                        {topLevelItems.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* 导航项信息 */}
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">导航项信息</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">创建时间</div>
                          <div className="text-gray-900">{new Date(selectedItem.createdAt).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">更新时间</div>
                          <div className="text-gray-900">{new Date(selectedItem.updatedAt).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}