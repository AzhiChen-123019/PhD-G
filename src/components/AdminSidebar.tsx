'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface AdminSidebarProps {
  lang?: 'zh' | 'en';
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export default function AdminSidebar({ lang = 'zh', collapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  // 检查当前链接是否为活跃链接
  const isActiveLink = (path: string) => {
    if (!pathname) {
      return false;
    }
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  // 处理侧边栏折叠切换
  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-secondary text-white flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        {!isCollapsed && <h1 className="text-xl font-bold">管理控制面板</h1>}
        <button 
          onClick={handleToggle}
          className="p-2 hover:bg-gray-700 rounded-md transition-colors"
          aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {/* 固定顺序的菜单项 */}
          <li>
            <Link href="/admin/dashboard">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {!isCollapsed && <span>仪表盘</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/users') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {!isCollapsed && <span>个人用户管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/enterprise-users">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/enterprise-users') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {!isCollapsed && <span>企业用户管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/admins">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/admins') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {!isCollapsed && <span>管理员管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/jobs">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/jobs') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {!isCollapsed && <span>岗位管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/application-materials">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/application-materials') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {!isCollapsed && <span>申请材料配置</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/api-costs">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/api-costs') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!isCollapsed && <span>API费用跟踪</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/membership-revenue">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/membership-revenue') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!isCollapsed && <span>会员与收入管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/ai-prompts">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/ai-prompts') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {!isCollapsed && <span>AI提示词管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/membership-rules">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/membership-rules') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {!isCollapsed && <span>会员规则配置</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/pages">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/pages') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {!isCollapsed && <span>页面管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/navigation">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/navigation') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6l8-4m0 0l8 4m-8-4v12m0 0l-8 4m8-4l8-4" />
                </svg>
                {!isCollapsed && <span>导航管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/content-blocks">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/content-blocks') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                {!isCollapsed && <span>内容区块管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/media">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/media') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {!isCollapsed && <span>媒体库管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/data">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/data') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {!isCollapsed && <span>数据管理</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/admin/settings">
              <div className={`flex items-center p-3 rounded-md transition-colors ${isActiveLink('/admin/settings') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {!isCollapsed && <span>系统设置</span>}
              </div>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-center">
          {!isCollapsed ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                AD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">超级管理员</p>
                <p className="text-xs text-gray-300">admin@example.com</p>
              </div>
            </>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
              AD
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
