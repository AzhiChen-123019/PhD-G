import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { sendRegistrationEmail } from '@/lib/mail';
import { writeFile, readFile } from 'fs/promises';
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
  userType: 'individual' | 'enterprise'; // 添加用户类型
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
async function saveUser(userData: Omit<UserData, '_id' | 'createdAt' | 'files' | 'degreeVerified'>) {
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
        fileName: userData.fileId, // 使用实际文件名
        filePath: `/uploads/${userData.fileId}`, // 使用实际文件路径，不添加额外扩展名
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

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, confirmPassword, countryCode, phone, identity, fileId, userType = 'individual' } = await request.json();
    
    // 验证输入
    if (!username || !email || !password || !confirmPassword || !countryCode || !phone || !identity || !fileId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(password);
    
    // 确保identity值的大小写正确
    const normalizedIdentity = identity.charAt(0).toUpperCase() + identity.slice(1).toLowerCase();
    
    // 保存用户数据到本地存储
    await saveUser({
      username,
      email,
      identity: normalizedIdentity,
      countryCode,
      phone,
      fileId,
      userType
    });
    
    // 尝试发送注册成功邮件（可选）
    try {
      await sendRegistrationEmail(email, username);
    } catch (emailError) {
      console.error('Error sending registration email:', emailError);
      // 邮件发送失败不影响注册流程
    }
    
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}