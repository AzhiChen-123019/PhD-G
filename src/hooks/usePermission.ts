'use client';

import { useAuth } from '@/contexts/AuthContext';

/**
 * 权限验证钩子
 * 用于检查当前用户是否具有特定权限
 */
export function usePermission() {
  const { user } = useAuth();

  /**
   * 检查用户是否具有特定角色
   * @param roles 允许的角色数组
   * @returns boolean
   */
  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  /**
   * 检查用户是否具有特定权限
   * @param permission 权限名称
   * @returns boolean
   */
  const hasPermission = (permission: string) => {
    if (!user) return false;
    // 超级管理员拥有所有权限
    if (user.role === 'superadmin') return true;
    // 检查用户是否具有特定权限
    return user.permissions.includes(permission);
  };

  /**
   * 检查用户是否是管理员
   * @returns boolean
   */
  const isAdmin = () => {
    if (!user) return false;
    return user.isAdmin;
  };

  /**
   * 检查用户是否是超级管理员
   * @returns boolean
   */
  const isSuperAdmin = () => {
    if (!user) return false;
    return user.role === 'superadmin';
  };

  /**
   * 检查用户是否是企业管理员
   * @returns boolean
   */
  const isEnterpriseAdmin = () => {
    if (!user) return false;
    return user.role === 'enterprise_admin';
  };

  /**
   * 检查用户是否是客服
   * @returns boolean
   */
  const isCustomerService = () => {
    if (!user) return false;
    return user.role === 'customer_service';
  };

  return {
    hasRole,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    isEnterpriseAdmin,
    isCustomerService
  };
}
