import { redirect } from 'next/navigation';

export default function UploadPage() {
  // 重定向到首页上传区域
  redirect('/#upload-resume');
}