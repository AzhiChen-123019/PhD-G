import User from '../models/User';
import { INTERNAL_EMAIL_DOMAIN } from './internalEmail';

/**
 * 生成唯一的内部邮箱地址
 * @param username 用户名
 * @returns 唯一的内部邮箱地址
 */
export const generateInternalEmail = async (username: string): Promise<string> => {
  // 基础邮箱地址（用户名@域名）
  let baseEmail = `${username.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}@${INTERNAL_EMAIL_DOMAIN}`;
  let internalEmail = baseEmail;
  let counter = 1;

  // 检查邮箱是否已存在，如果存在则添加数字后缀
  while (await User.findOne({ internalEmail })) {
    internalEmail = `${username.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}${counter}@${INTERNAL_EMAIL_DOMAIN}`;
    counter++;
  }

  return internalEmail;
};
