import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // 解析表单数据
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string;
    
    if (!file || !fileType) {
      return NextResponse.json({ error: 'File and type are required' }, { status: 400 });
    }
    
    // 验证文件类型
    const allowedTypes = ['resume', 'degree', 'other'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }
    
    // 验证文件大小（最大10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB' }, { status: 400 });
    }
    
    // 生成唯一文件名
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    
    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      const fs = await import('fs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating upload directory:', error);
      throw new Error('Failed to create upload directory');
    }
    
    // 读取文件内容并保存
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // 返回实际的文件名（不包含扩展名）作为fileId，确保后续能正确构建文件路径
    const fileId = fileName;
    
    return NextResponse.json({ message: 'File uploaded successfully', fileId }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}