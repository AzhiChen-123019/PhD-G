import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Email from '@/models/Email';
import User from '@/models/User';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // 验证输入
    if (!id || !userId) {
      return NextResponse.json({ error: 'Email ID and User ID are required' }, { status: 400 });
    }
    
    // 查找邮件
    const email = await Email.findById(id)
      .populate('sender', 'username realName internalEmail')
      .populate('replyTo', 'subject sender recipients createdAt');
    
    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
    
    // 查找用户
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // 检查用户是否有权限访问该邮件
    const isSender = email.sender.toString() === userId;
    const isRecipient = email.recipients.includes(user.internalEmail);
    
    if (!isSender && !isRecipient) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // 如果是收件人且邮件状态不是已读，则更新为已读
    if (isRecipient && email.status !== 'read') {
      email.status = 'read';
      email.tracking.readAt = new Date();
      await email.save();
    }
    
    return NextResponse.json({ email }, { status: 200 });
  } catch (error) {
    console.error('Error fetching email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // 验证输入
    if (!id || !userId) {
      return NextResponse.json({ error: 'Email ID and User ID are required' }, { status: 400 });
    }
    
    // 查找邮件
    const email = await Email.findById(id);
    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
    
    // 查找用户
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // 检查用户是否有权限操作该邮件
    const isSender = email.sender.toString() === userId;
    const isRecipient = email.recipients.includes(user.internalEmail);
    
    if (!isSender && !isRecipient) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // 标记邮件为已删除（移动到垃圾箱）
    email.folder = 'trash';
    await email.save();
    
    return NextResponse.json({ message: 'Email moved to trash successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}