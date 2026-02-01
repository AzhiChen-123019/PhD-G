import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Email from '@/models/Email';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId');
    const folder = searchParams.get('folder') || 'inbox';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    // 验证输入
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // 查找用户
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // 构建查询条件
    let query: any = {};
    
    switch (folder) {
      case 'inbox':
        // 收件箱：包含该用户内部邮箱的邮件
        query.recipients = user.internalEmail;
        break;
      case 'sent':
        // 发件箱：该用户发送的邮件
        query.sender = userId;
        break;
      case 'drafts':
        // 草稿箱：该用户创建的草稿
        query.sender = userId;
        query.status = 'draft';
        break;
      case 'trash':
        // 垃圾箱：已删除的邮件
        query.$or = [
          { sender: userId, folder: 'trash' },
          { recipients: user.internalEmail, folder: 'trash' }
        ];
        break;
      case 'spam':
        // 垃圾邮件
        query.recipients = user.internalEmail;
        query.folder = 'spam';
        break;
      default:
        query.recipients = user.internalEmail;
        break;
    }
    
    // 计算分页
    const skip = (page - 1) * limit;
    
    // 查询邮件
    const emails = await Email.find(query)
      .populate('sender', 'username realName internalEmail')
      .populate('replyTo', 'subject')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // 获取总数
    const total = await Email.countDocuments(query);
    
    return NextResponse.json({ 
      emails,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}