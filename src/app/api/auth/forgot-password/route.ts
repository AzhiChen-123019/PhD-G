import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email } = await request.json();
    
    // 验证输入
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // 生成密码重置链接（实际项目中应该使用更安全的方式生成重置令牌）
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=reset-token-${user._id}`;
    
    // 发送密码重置邮件
    try {
      await sendPasswordResetEmail(email, resetLink);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}