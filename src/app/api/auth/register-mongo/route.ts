import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { sendRegistrationEmail } from '@/lib/mail';
import { generateInternalEmail } from '@/lib/serverInternalEmail';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { username, email, password, confirmPassword, countryCode, phone, realName, nationality, userType = 'individual' } = await request.json();
    
    // 验证输入
    if (!username || !email || !password || !confirmPassword || !countryCode || !phone || !realName || !nationality) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(password);
    
    // 生成唯一的内部邮箱地址
    const internalEmail = await generateInternalEmail(username);
    
    // 创建新用户
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      countryCode,
      phone,
      realName,
      nationality,
      internalEmail,
      role: userType === 'enterprise' ? 'enterprise_admin' : 'user',
      isEnterprise: userType === 'enterprise',
    });
    
    // 保存用户
    await newUser.save();
    
    // 尝试发送注册成功邮件（可选）
    try {
      await sendRegistrationEmail(email, username);
    } catch (emailError) {
      console.error('Error sending registration email:', emailError);
      // 邮件发送失败不影响注册流程
    }
    
    return NextResponse.json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        internalEmail: newUser.internalEmail,
        role: newUser.role,
        isEnterprise: newUser.isEnterprise,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}