import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

import { MembershipLevel } from '@/lib/membership';

interface UserData {
  id: string;
  username: string;
  email: string;
  phone: string;
  countryCode: string;
  identity: 'chinese' | 'foreign';
  membershipLevel: MembershipLevel;
  membershipExpiresAt?: string;
  hasUploadedResume: boolean;
  userType: 'individual' | 'enterprise';
  degreeVerified: boolean;
  createdAt: string;
  updatedAt: string;
  files: Array<{
    id: string;
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

// 获取所有用户数据
export async function GET() {
  try {
    await ensureStorageExists();
    
    const data = await readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(data) as UserData[];
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 更新用户验证状态
export async function PUT(request: NextRequest) {
  try {
    await ensureStorageExists();
    
    const { userId, degreeVerified } = await request.json();
    
    if (!userId || degreeVerified === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const existingData = await readFile(USERS_FILE, 'utf8');
    const users: UserData[] = JSON.parse(existingData);
    
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, degreeVerified, updatedAt: new Date().toISOString() } : user
    );
    
    await writeFile(USERS_FILE, JSON.stringify(updatedUsers, null, 2));
    
    return NextResponse.json({ users: updatedUsers }, { status: 200 });
  } catch (error) {
    console.error('Error updating user verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
