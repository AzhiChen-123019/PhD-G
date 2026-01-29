import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

interface UserData {
  _id: string;
  username: string;
  email: string;
  identity: string;
  degreeVerified: boolean;
  countryCode: string;
  phone: string;
  fileId: string;
  createdAt: string;
  files: Array<{
    _id: string;
    fileName: string;
    filePath: string;
    fileType: string;
    uploadedAt: string;
    verified: boolean;
  }>;
}

const STORAGE_PATH = path.join(process.cwd(), 'storage');
const USERS_FILE = path.join(STORAGE_PATH, 'users.json');

// 确保存储目录存在
async function ensureStorageExists() {
  try {
    const fs = await import('fs');
    if (!fs.existsSync(STORAGE_PATH)) {
      fs.mkdirSync(STORAGE_PATH, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      await writeFile(USERS_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error ensuring storage exists:', error);
    throw error;
  }
}

// 保存用户数据
export async function saveUser(userData: Omit<UserData, '_id' | 'createdAt' | 'files'>) {
  try {
    await ensureStorageExists();
    
    // 读取现有用户数据
    const existingData = await readFile(USERS_FILE, 'utf8');
    const users: UserData[] = JSON.parse(existingData);
    
    // 创建新用户数据
    const newUser: UserData = {
      _id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      degreeVerified: false,
      createdAt: new Date().toISOString(),
      files: [{
        _id: userData.fileId,
        fileName: '博士学位证明.pdf',
        filePath: `/uploads/${userData.fileId}.pdf`,
        fileType: 'degree',
        uploadedAt: new Date().toISOString(),
        verified: false
      }]
    };
    
    // 添加新用户
    users.push(newUser);
    
    // 保存更新后的数据
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    
    return newUser;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

// 获取所有用户数据
export async function getUsers() {
  try {
    await ensureStorageExists();
    
    const data = await readFile(USERS_FILE, 'utf8');
    return JSON.parse(data) as UserData[];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

// 更新用户验证状态
export async function updateUserVerification(userId: string, verified: boolean) {
  try {
    await ensureStorageExists();
    
    const existingData = await readFile(USERS_FILE, 'utf8');
    const users: UserData[] = JSON.parse(existingData);
    
    const updatedUsers = users.map(user => 
      user._id === userId ? { ...user, degreeVerified: verified } : user
    );
    
    await writeFile(USERS_FILE, JSON.stringify(updatedUsers, null, 2));
    
    return updatedUsers;
  } catch (error) {
    console.error('Error updating user verification:', error);
    throw error;
  }
}

// 更新文件验证状态
export async function updateFileVerification(fileId: string, verified: boolean) {
  try {
    await ensureStorageExists();
    
    const existingData = await readFile(USERS_FILE, 'utf8');
    const users: UserData[] = JSON.parse(existingData);
    
    const updatedUsers = users.map(user => ({
      ...user,
      files: user.files.map(file => 
        file._id === fileId ? { ...file, verified } : file
      ),
      degreeVerified: user.files.some(f => f.fileType === 'degree' && f._id === fileId) ? verified : user.degreeVerified
    }));
    
    await writeFile(USERS_FILE, JSON.stringify(updatedUsers, null, 2));
    
    return updatedUsers;
  } catch (error) {
    console.error('Error updating file verification:', error);
    throw error;
  }
}
