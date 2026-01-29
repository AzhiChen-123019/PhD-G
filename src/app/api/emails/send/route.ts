import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Email from '@/models/Email';
import { sendEmail as sendExternalEmail } from '@/lib/mail';
import { isInternalEmail } from '@/lib/internalEmail';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { senderId, recipients, subject, body, type = 'internal' } = await request.json();
    
    // 验证输入
    if (!senderId || !recipients || !Array.isArray(recipients) || recipients.length === 0 || !subject || !body) {
      return NextResponse.json({ error: 'Invalid email data' }, { status: 400 });
    }
    
    // 查找发件人
    const sender = await User.findById(senderId);
    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }
    
    // 创建邮件记录
    const email = new Email({
      sender: senderId,
      senderEmail: sender.internalEmail,
      recipients,
      subject,
      body,
      type,
      status: 'sent',
      tracking: {
        sentAt: new Date(),
      },
    });
    
    // 保存邮件
    await email.save();
    
    // 如果是外部邮件，使用SendGrid发送
    if (type === 'external' || recipients.some(recipient => !isInternalEmail(recipient))) {
      try {
        // 发送外部邮件
        await sendExternalEmail(recipients, subject, body, sender.internalEmail);
        
        // 更新邮件状态为已发送
        email.status = 'delivered';
        email.tracking.deliveredAt = new Date();
        await email.save();
      } catch (error) {
        console.error('Error sending external email:', error);
        
        // 更新邮件状态为发送失败
        email.status = 'failed';
        email.tracking.bounceStatus = 'failed';
        email.tracking.bounceReason = error instanceof Error ? error.message : 'Unknown error';
        await email.save();
      }
    }
    
    return NextResponse.json({ 
      message: 'Email sent successfully',
      email: {
        id: email._id,
        subject: email.subject,
        recipients: email.recipients,
        status: email.status,
        sentAt: email.tracking.sentAt,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}