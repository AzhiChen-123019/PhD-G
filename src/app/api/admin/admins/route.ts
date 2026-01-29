import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // 获取所有管理员用户
    const admins = await User.find({
      isAdmin: true
    }).select('-password');

    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, realName, countryCode, phone, nationality, role, permissions } = await request.json();

    // 验证输入
    if (!username || !email || !password || !realName || !countryCode || !phone || !nationality || !role) {
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }

    // 检查用户名和邮箱是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
    }

    // 哈希密码
    const hashedPassword = await hashPassword(password);

    // 创建新管理员
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      realName,
      countryCode,
      phone,
      nationality,
      role,
      isAdmin: true,
      permissions: permissions || [],
      userType: 'individual',
      isEnterprise: false
    });

    await newAdmin.save();

    // 返回创建的管理员信息，不包含密码
    const adminWithoutPassword = {
      ...newAdmin.toObject(),
      password: undefined
    };

    return NextResponse.json(adminWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, username, email, realName, countryCode, phone, nationality, role, permissions } = await request.json();

    // 验证输入
    if (!id || !username || !email || !realName || !countryCode || !phone || !nationality || !role) {
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }

    // 查找管理员
    const admin = await User.findById(id);
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // 检查用户名和邮箱是否已被其他用户使用
    const existingUser = await User.findOne({ 
      $and: [
        { _id: { $ne: id } },
        { $or: [{ username }, { email }] }
      ]
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
    }

    // 更新管理员信息
    admin.username = username;
    admin.email = email;
    admin.realName = realName;
    admin.countryCode = countryCode;
    admin.phone = phone;
    admin.nationality = nationality;
    admin.role = role;
    admin.permissions = permissions || [];
    admin.updatedAt = new Date();

    await admin.save();

    // 返回更新后的管理员信息，不包含密码
    const adminWithoutPassword = {
      ...admin.toObject(),
      password: undefined
    };

    return NextResponse.json(adminWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    // 查找管理员
    const admin = await User.findById(id);
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // 不允许删除超级管理员
    if (admin.role === 'superadmin') {
      return NextResponse.json({ error: 'Cannot delete super admin' }, { status: 403 });
    }

    // 删除管理员
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Admin deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
