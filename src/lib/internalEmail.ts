// 内部邮箱域名
export const INTERNAL_EMAIL_DOMAIN = 'phdmap.com';

/**
 * 验证邮箱是否为内部邮箱
 * @param email 邮箱地址
 * @returns 是否为内部邮箱
 */
export const isInternalEmail = (email: string): boolean => {
  return email.endsWith(`@${INTERNAL_EMAIL_DOMAIN}`);
};

/**
 * 解析内部邮箱，获取用户名
 * @param internalEmail 内部邮箱地址
 * @returns 用户名
 */
export const parseInternalEmail = (internalEmail: string): string => {
  const [username] = internalEmail.split('@');
  // 移除可能的数字后缀
  return username.replace(/\d+$/, '');
};
