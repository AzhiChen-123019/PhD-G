'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 媒体文件类型定义
interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  isActive: boolean;
}

// 本地存储键名
const MEDIA_FILES_KEY = 'mediaFiles';

// 获取所有媒体文件
const getAllMediaFiles = (): MediaFile[] => {
  const filesJson = localStorage.getItem(MEDIA_FILES_KEY);
  if (filesJson) {
    return JSON.parse(filesJson);
  } else {
    // 默认媒体文件
    const defaultFiles: MediaFile[] = [
      {
        id: 'media-1',
        name: 'logo.png',
        url: '/logo.png',
        type: 'image/png',
        size: 102400,
        uploadedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: 'media-2',
        name: 'banner.jpg',
        url: '/banner.jpg',
        type: 'image/jpeg',
        size: 512000,
        uploadedAt: new Date().toISOString(),
        isActive: true
      }
    ];
    localStorage.setItem(MEDIA_FILES_KEY, JSON.stringify(defaultFiles));
    return defaultFiles;
  }
};

// 保存媒体文件
const saveMediaFiles = (files: MediaFile[]) => {
  localStorage.setItem(MEDIA_FILES_KEY, JSON.stringify(files));
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // 客户端加载媒体文件
  useEffect(() => {
    setMediaFiles(getAllMediaFiles());
  }, []);

  // 过滤媒体文件
  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
      (filterType === 'image' && file.type.startsWith('image/')) ||
      (filterType === 'document' && file.type.startsWith('application/'));
    return matchesSearch && matchesType;
  });

  // 保存所有媒体文件
  const handleSaveFiles = () => {
    try {
      setLoading(true);
      setError(null);
      
      saveMediaFiles(mediaFiles);
      setSuccessMessage('媒体文件保存成功！');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存媒体文件失败');
      console.error('Error saving media files:', err);
    } finally {
      setLoading(false);
    }
  };

  // 模拟文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        setLoading(true);
        setError(null);
        
        // 模拟文件上传，这里只保存文件信息到本地存储
        const newFiles: MediaFile[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const newFile: MediaFile = {
            id: `media-${Date.now()}-${i}`,
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            isActive: true
          };
          newFiles.push(newFile);
        }
        
        const updatedFiles = [...mediaFiles, ...newFiles];
        setMediaFiles(updatedFiles);
        saveMediaFiles(updatedFiles);
        setSuccessMessage(`${newFiles.length}个文件上传成功！`);
        
        // 3秒后清除成功消息
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        
        // 重置文件输入
        if (fileInput) {
          fileInput.value = '';
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '文件上传失败');
        console.error('Error uploading files:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // 删除媒体文件
  const deleteFile = (fileId: string) => {
    const updatedFiles = mediaFiles.filter(file => file.id !== fileId);
    setMediaFiles(updatedFiles);
    saveMediaFiles(updatedFiles);
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
    setSuccessMessage('文件删除成功！');
    
    // 3秒后清除成功消息
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // 切换媒体文件状态
  const toggleFileStatus = (fileId: string) => {
    const updatedFiles = mediaFiles.map(file => 
      file.id === fileId ? { ...file, isActive: !file.isActive } : file
    );
    setMediaFiles(updatedFiles);
    if (selectedFile?.id === fileId) {
      setSelectedFile({ ...selectedFile, isActive: !selectedFile.isActive });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* 侧边栏导航 */}
        <div className="w-64 bg-secondary text-white flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold">管理控制面板</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>仪表盘</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/users">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>用户管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/jobs">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>岗位管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/application-materials">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>申请材料配置</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/api-costs">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>API费用跟踪</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/membership-revenue">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>会员与收入管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/ai-prompts">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>AI提示词管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/membership-rules">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>会员规则配置</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/pages">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>页面管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/navigation">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>导航管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/content-blocks">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <span>内容区块管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/media">
                  <div className="flex items-center p-3 rounded-md bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>媒体库管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/data">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>数据管理</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin/settings">
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>系统设置</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                AD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">超级管理员</p>
                <p className="text-xs text-gray-300">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 主内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">媒体库管理</h1>
              <p className="text-gray-600">管理网站媒体文件</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* 成功消息 */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                {successMessage}
              </div>
            )}
            
            {/* 错误消息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}
            
            {/* 上传区域 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">上传文件</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      ref={setFileInput}
                      onChange={handleFileUpload}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={() => fileInput?.click()}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      选择文件
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">搜索文件</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="输入文件名搜索"
                  />
                </div>
                
                <div className="min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">筛选类型</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">所有类型</option>
                    <option value="image">图片</option>
                    <option value="document">文档</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 媒体文件列表 */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">媒体文件</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredFiles.map(file => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`border rounded-md overflow-hidden cursor-pointer transition-all ${selectedFile?.id === file.id ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary'}`}
                    >
                      <div className="relative">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                              // 图片加载失败时显示默认图标
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Image+Not+Found';
                            }}
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFileStatus(file.id);
                            }}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${file.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {file.isActive ? '启用' : '禁用'}
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="font-medium text-gray-900 truncate">{file.name}</div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile(file.id);
                            }}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredFiles.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>没有找到匹配的文件</p>
                  </div>
                )}
              </div>
              
              {/* 媒体文件详情 */}
              {selectedFile && (
                <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">文件详情</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">预览</label>
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        {selectedFile.type.startsWith('image/') ? (
                          <img
                            src={selectedFile.url}
                            alt={selectedFile.name}
                            className="w-full h-auto"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">文件名</label>
                      <div className="text-gray-900">{selectedFile.name}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">文件类型</label>
                      <div className="text-gray-900">{selectedFile.type}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">文件大小</label>
                      <div className="text-gray-900">{formatFileSize(selectedFile.size)}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">上传时间</label>
                      <div className="text-gray-900">
                        {new Date(selectedFile.uploadedAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">文件URL</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-2">
                        <input
                          type="text"
                          value={selectedFile.url}
                          readOnly
                          className="w-full bg-transparent border-none focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFile.isActive}
                        onChange={(e) => toggleFileStatus(selectedFile.id)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        启用文件
                      </label>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => deleteFile(selectedFile.id)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                      >
                        删除文件
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
