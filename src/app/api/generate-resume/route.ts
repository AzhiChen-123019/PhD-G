import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

interface GenerateResumeRequest {
  resumeContent: string;
  jobTitle: string;
  format: 'pdf' | 'word';
  templateId: string;
  userName: string;
}

export async function POST(request: NextRequest) {
  try {
    const { resumeContent, jobTitle, format, templateId, userName } = await request.json() as GenerateResumeRequest;
    
    // 生成文件名
    const date = new Date().toISOString().split('T')[0];
    const sanitizedJobTitle = jobTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-');
    const filename = `${userName}-${sanitizedJobTitle}-${date}.${format}`;
    
    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // 生成简历内容（这里可以根据模板生成不同格式的简历，现在只是简单保存文本内容）
    const fileContent = resumeContent;
    
    // 保存文件到public/uploads目录
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, fileContent, 'utf8');
    
    // 返回成功响应，包含文件路径
    return NextResponse.json({
      success: true,
      message: `简历已成功生成`,
      filePath: `/uploads/${filename}`,
      filename: filename
    }, { status: 200 });
  } catch (error) {
    console.error('生成简历失败:', error);
    return NextResponse.json(
      { success: false, message: '生成简历失败，请重试' },
      { status: 500 }
    );
  }
}
