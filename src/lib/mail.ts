import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key';
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@ctalents.com';

sgMail.setApiKey(SENDGRID_API_KEY);

// 通用邮件发送函数
export const sendEmail = async (to: string | string[], subject: string, htmlContent: string, from?: string) => {
  const msg = {
    to: Array.isArray(to) ? to : [to],
    from: from || FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// 发送注册成功邮件
export const sendRegistrationEmail = async (to: string, username: string) => {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Welcome to PhDMap!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(to right, #4f46e5, #8b5cf6); padding: 20px; color: white; text-align: center;">
          <h1 style="margin: 0;">Welcome to PhDMap</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello ${username},</p>
          <p>Thank you for registering with PhDMap! Your account has been successfully created.</p>
          <p>We will review your degree certificate soon. Once verified, you will receive another notification.</p>
          <p>In the meantime, you can explore our platform and browse available positions.</p>
          <p>Best regards,</p>
          <p>The PhDMap Team</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Registration email sent successfully');
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error;
  }
};

// 发送学历证明审核结果邮件
export const sendDegreeVerificationEmail = async (to: string, username: string, isVerified: boolean) => {
  const subject = isVerified ? 'Your degree has been verified!' : 'Degree verification update';
  const message = isVerified 
    ? 'Congratulations! Your PhD degree has been successfully verified.' 
    : 'We were unable to verify your PhD degree. Please upload a clear copy of your degree certificate.';

  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(to right, #4f46e5, #8b5cf6); padding: 20px; color: white; text-align: center;">
          <h1 style="margin: 0;">${subject}</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello ${username},</p>
          <p>${message}</p>
          <p>Best regards,</p>
          <p>The PhDMap Team</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Degree verification email sent successfully');
  } catch (error) {
    console.error('Error sending degree verification email:', error);
    throw error;
  }
};

// 发送密码重置邮件
export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Reset your PhDMap password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(to right, #4f46e5, #8b5cf6); padding: 20px; color: white; text-align: center;">
          <h1 style="margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>You requested to reset your password for PhDMap. Click the button below to reset it:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
          </p>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,</p>
          <p>The PhDMap Team</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};