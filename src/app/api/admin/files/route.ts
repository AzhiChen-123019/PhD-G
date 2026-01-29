import { NextRequest, NextResponse } from 'next/server';
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

// 获取所有文件数据
export async function GET() {
  try {
    await ensureStorageExists();
    
    const data = await readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(data) as UserData[];
    
    // 提取所有文件
    const allFiles = users.flatMap(user => 
      user.files.map(file => ({
        ...file,
        userId: user._id,
        username: user.username
      }))
    );
    
    return NextResponse.json({ files: allFiles }, { status: 200 });
  } catch (error) {
    console.error('Error getting files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 更新文件验证状态
export async function PUT(request: NextRequest) {
  try {
    await ensureStorageExists();
    
    const { fileId, verified } = await request.json();
    
    if (!fileId || verified === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const existingData = await readFile(USERS_FILE, 'utf8');
    const users: UserData[] = JSON.parse(existingData);
    
    // 更新文件验证状态
    const updatedUsers = users.map(user => ({
      ...user,
      files: user.files.map(file => 
        file._id === fileId ? { ...file, verified } : file
      ),
      degreeVerified: user.files.some(f => f.fileType === 'degree' && f._id === fileId) ? verified : user.degreeVerified
    }));
    
    await writeFile(USERS_FILE, JSON.stringify(updatedUsers, null, 2));
    
    return NextResponse.json({ users: updatedUsers }, { status: 200 });
  } catch (error) {
    console.error('Error updating file verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
