'use client';

import { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';

export interface PermissionGateProps {
  /**
   * 允许访问的角色列表
   */
  roles?: string[];
  /**
   * 允许访问的权限列表
   */
  permissions?: string[];
  /**
   * 无权限时显示的内容
   */
  fallback?: ReactNode;
  /**
   * 需要验证的子组件
   */
  children: ReactNode;
}

/**
 * 权限验证组件
 * 用于包装需要权限控制的页面或组件，确保只有具有相应权限的用户才能访问
 */
export default function PermissionGate({
  roles = [],
  permissions = [],
  fallback,
  children
}: PermissionGateProps) {
  const { hasRole, hasPermission } = usePermission();

  // 检查用户是否具有所需角色
  const hasRequiredRole = roles.length === 0 || hasRole(roles);

  // 检查用户是否具有所需权限
  const hasRequiredPermission = permissions.length === 0 ||
    permissions.some(permission => hasPermission(permission));

  // 如果用户具有所需角色或权限，则显示子组件
  if (hasRequiredRole && hasRequiredPermission) {
    return <>{children}</>;
  }

  // 否则显示无权限内容
  if (fallback) {
    return <>{fallback}</>;
  }

  // 默认无权限内容
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">权限不足</h3>
        <p className="mt-1 text-sm text-gray-500">
          您没有权限访问此页面或功能
        </p>
      </div>
    </div>
  );
}
