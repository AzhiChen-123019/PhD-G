import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '博士岗位匹配平台',
  description: '面向海外博士的岗位匹配智能平台，实现简历/材料上传、岗位匹配、邮件自动发送、后台管理全流程',
  keywords: ['博士', '岗位匹配', '简历上传', '邮件发送', '后台管理'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}