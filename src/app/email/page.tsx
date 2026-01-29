'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 多语言支持
const translations = {
  zh: {
    emailCenter: '邮件中心',
    compose: '撰写',
    inbox: '收件箱',
    sentFolder: '已发送',
    drafts: '草稿箱',
    trash: '垃圾箱',
    spam: '垃圾邮件',
    important: '重要',
    flagged: '星标',
    allMail: '全部邮件',
    contacts: '通讯录',
    settings: '设置',
    help: '帮助',
    sender: '发件人',
    subject: '主题',
    date: '日期',
    status: '状态',
    readStatus: '已读',
    sentStatus: '已发送',
    delivered: '已送达',
    failed: '发送失败',
    unread: '未读',
    send: '发送',
    cancel: '取消',
    reply: '回复',
    forward: '转发',
    delete: '删除',
    back: '返回',
    recipients: '收件人',
    body: '正文',
    sentOn: '发送时间',
    to: '收件人',
    emailTracking: '邮件跟踪',
    search: '搜索邮件',
    noEmails: '暂无邮件',
    loading: '加载中...',
    attachments: '附件',
    cc: '抄送',
    bcc: '密送',
    priority: '优先级',
  },
  en: {
    emailCenter: 'Email Center',
    compose: 'Compose',
    inbox: 'Inbox',
    sentFolder: 'Sent',
    drafts: 'Drafts',
    trash: 'Trash',
    spam: 'Spam',
    important: 'Important',
    flagged: 'Flagged',
    allMail: 'All Mail',
    contacts: 'Contacts',
    settings: 'Settings',
    help: 'Help',
    sender: 'Sender',
    subject: 'Subject',
    date: 'Date',
    status: 'Status',
    readStatus: 'Read',
    sentStatus: 'Sent',
    delivered: 'Delivered',
    failed: 'Failed',
    unread: 'Unread',
    send: 'Send',
    cancel: 'Cancel',
    reply: 'Reply',
    forward: 'Forward',
    delete: 'Delete',
    back: 'Back',
    recipients: 'Recipients',
    body: 'Body',
    sentOn: 'Sent on',
    to: 'To',
    emailTracking: 'Email Tracking',
    search: 'Search emails',
    noEmails: 'No emails',
    loading: 'Loading...',
    attachments: 'Attachments',
    cc: 'CC',
    bcc: 'BCC',
    priority: 'Priority',
  },
};

// 模拟邮件数据
const mockEmails = [
  {
    id: '1',
    sender: {
      username: 'recruiter1',
      realName: 'HR Manager',
      internalEmail: 'recruiter1@phdmap.com',
    },
    recipients: ['user1@phdmap.com'],
    subject: 'Invitation for Interview - Senior Data Scientist Position',
    body: 'Dear Candidate,\n\nWe would like to invite you for an interview for the Senior Data Scientist position at our company. Your profile stands out among the applicants, and we are impressed by your experience in machine learning and data analysis.\n\nPlease let us know your availability for a virtual interview next week.\n\nBest regards,\nHR Team',
    status: 'read',
    type: 'external',
    attachments: [],
    importance: 'normal',
    flagged: false,
    tracking: {
      sentAt: new Date('2024-01-25T10:00:00Z'),
      deliveredAt: new Date('2024-01-25T10:05:00Z'),
      readAt: new Date('2024-01-25T10:10:00Z'),
    },
    createdAt: new Date('2024-01-25T10:00:00Z'),
  },
  {
    id: '2',
    sender: {
      username: 'user1',
      realName: 'Candidate',
      internalEmail: 'user1@phdmap.com',
    },
    recipients: ['company@example.com'],
    subject: 'Application for Senior Position - Machine Learning Engineer',
    body: 'Dear Hiring Manager,\n\nI am writing to apply for the Senior Machine Learning Engineer position at your company. With over 5 years of experience in developing and deploying machine learning models, I believe I would be a valuable addition to your team.\n\nMy expertise includes natural language processing, computer vision, and predictive analytics. I have successfully led several projects that have resulted in significant business impact.\n\nThank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.\n\nSincerely,\nJohn Doe',
    status: 'sent',
    type: 'external',
    attachments: [],
    importance: 'normal',
    flagged: false,
    tracking: {
      sentAt: new Date('2024-01-24T15:30:00Z'),
      deliveredAt: new Date('2024-01-24T15:35:00Z'),
    },
    createdAt: new Date('2024-01-24T15:30:00Z'),
  },
  {
    id: '3',
    sender: {
      username: 'admin',
      realName: 'System Admin',
      internalEmail: 'admin@phdmap.com',
    },
    recipients: ['user1@phdmap.com'],
    subject: 'Account Security Update - Action Required',
    body: 'Dear User,\n\nWe have made important updates to our security protocols. As part of these changes, we require all users to update their passwords and enable two-factor authentication.\n\nPlease log in to your account within the next 7 days to complete these security updates.\n\nIf you have any questions, please contact our support team.\n\nBest regards,\nSystem Administration',
    status: 'unread',
    type: 'internal',
    attachments: [],
    importance: 'high',
    flagged: true,
    tracking: {
      sentAt: new Date('2024-01-23T09:15:00Z'),
      deliveredAt: new Date('2024-01-23T09:16:00Z'),
    },
    createdAt: new Date('2024-01-23T09:15:00Z'),
  },
  {
    id: '4',
    sender: {
      username: 'recruiter2',
      realName: 'Talent Acquisition',
      internalEmail: 'recruiter2@phdmap.com',
    },
    recipients: ['user1@phdmap.com'],
    subject: 'Job Opportunity - AI Research Scientist',
    body: 'Hello,\n\nI hope this email finds you well. Based on your profile, I believe you would be a great fit for our AI Research Scientist position.\n\nOur company is looking for talented individuals with expertise in machine learning and artificial intelligence to join our research team.\n\nPlease let me know if you\'re interested in learning more about this opportunity.\n\nBest regards,\nTalent Acquisition Team',
    status: 'unread',
    type: 'external',
    attachments: [],
    importance: 'normal',
    flagged: false,
    tracking: {
      sentAt: new Date('2024-01-22T14:20:00Z'),
      deliveredAt: new Date('2024-01-22T14:22:00Z'),
    },
    createdAt: new Date('2024-01-22T14:20:00Z'),
  },
];

// 文件夹图标映射
const folderIcons = {
  inbox: '📥',
  sent: '📤',
  drafts: '📝',
  trash: '🗑️',
  spam: '⚠️',
  important: '🔔',
  flagged: '⭐',
  allMail: '📧',
  contacts: '👥',
  settings: '⚙️',
  help: '❓',
};

// 邮件优先级图标
const priorityIcons = {
  high: '🔴',
  normal: '⚪',
  low: '🔵',
};

export default function EmailCenter() {
  const router = useRouter();
  const [language, setLanguage] = useState('zh'); // 默认中文
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]); // 多选邮件ID
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'conversation'>('list');
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [targetFolder, setTargetFolder] = useState('inbox');
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showEmailSignatureDialog, setShowEmailSignatureDialog] = useState(false);
  const [showAutoReplyDialog, setShowAutoReplyDialog] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  
  const [composeForm, setComposeForm] = useState({
    recipients: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    priority: 'normal',
  });
  
  const [attachments, setAttachments] = useState<any[]>([]);
  
  // 获取当前语言的翻译
  const t = translations[language as keyof typeof translations];

  const handleComposeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setComposeForm(prev => ({ ...prev, [name]: value }));
  };

  // 处理附件上传
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        file: file
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  // 移除附件
  const removeAttachment = (attachmentId: number) => {
    setAttachments(attachments.filter(attachment => attachment.id !== attachmentId));
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里将调用API发送邮件
    console.log('Sending email:', composeForm);
    console.log('Attachments:', attachments);
    setShowCompose(false);
    setComposeForm({
      recipients: '',
      cc: '',
      bcc: '',
      subject: '',
      body: '',
      priority: 'normal',
    });
    setAttachments([]);
  };

  // 过滤邮件
  const filteredEmails = emails.filter(email => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      email.subject.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query) ||
      email.sender.realName.toLowerCase().includes(query)
    );
  });

  // 按文件夹过滤邮件
  const folderEmails = filteredEmails.filter(email => {
    if (activeFolder === 'inbox') return true;
    if (activeFolder === 'sent') return email.status === 'sent';
    if (activeFolder === 'important') return email.importance === 'high';
    if (activeFolder === 'flagged') return email.flagged;
    // 为其他文件夹添加过滤逻辑
    if (activeFolder === 'drafts') return email.status === 'draft';
    if (activeFolder === 'trash') return email.status === 'trash';
    if (activeFolder === 'spam') return email.status === 'spam';
    // 对于通讯录、设置和帮助，返回空数组
    if (activeFolder === 'contacts' || activeFolder === 'settings' || activeFolder === 'help') return false;
    return true;
  });

  // 处理邮件点击
  const handleEmailClick = (email: any, event?: React.MouseEvent) => {
    // 如果点击的是复选框，不触发邮件详情
    if (event && event.target && (event.target as HTMLInputElement).type === 'checkbox') {
      return;
    }
    setSelectedEmail(email);
    // 如果邮件未读，标记为已读
    if (email.status === 'unread') {
      const updatedEmails = emails.map(e => 
        e.id === email.id ? { ...e, status: 'read' } : e
      );
      setEmails(updatedEmails);
    }
  };

  // 处理邮件选择
  const handleEmailSelect = (emailId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmails(prev => [...prev, emailId]);
    } else {
      setSelectedEmails(prev => prev.filter(id => id !== emailId));
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmails(folderEmails.map(email => email.id));
    } else {
      setSelectedEmails([]);
    }
  };

  // 处理邮件转移
  const handleMoveEmails = () => {
    if (selectedEmails.length === 0) return;
    
    // 这里可以实现实际的邮件转移逻辑
    console.log('Moving emails to:', targetFolder, selectedEmails);
    setShowMoveDialog(false);
    setSelectedEmails([]);
  };

  // AI生成邮件内容
  const generateEmail = async () => {
    setIsGeneratingEmail(true);
    
    try {
      // 模拟AI生成邮件的过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 生成示例邮件内容
      const generatedSubject = 'AI Generated Email Subject';
      const generatedBody = `尊敬的收件人：

这是一封由AI自动生成的邮件。根据您的需求，我为您准备了以下内容：

1. 邮件主题明确，简洁明了
2. 邮件内容结构清晰，逻辑连贯
3. 语言表达专业得体

如果您对邮件内容满意，可以直接发送；如果需要修改，可以在编辑后再发送。

祝您工作顺利！

此致
敬礼`;
      
      setComposeForm(prev => ({
        ...prev,
        subject: generatedSubject,
        body: generatedBody
      }));
      
      alert('邮件内容生成成功！');
    } catch (error) {
      console.error('生成邮件失败:', error);
      alert('生成邮件失败，请重试。');
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  // 处理文件夹点击
  const handleFolderClick = (folderId: string) => {
    setActiveFolder(folderId);
    setSelectedEmail(null);
    setSelectedEmails([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-blue-600 flex items-center mr-8">
            <span className="mr-2">📧</span>
            {t.emailCenter}
          </h1>
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => setActiveFolder('inbox')}
              className={`text-gray-700 hover:text-blue-600 transition-colors ${activeFolder === 'inbox' ? 'text-blue-600 font-medium' : ''}`}
            >
              {t.inbox}
            </button>
            <button 
              onClick={() => setActiveFolder('sent')}
              className={`text-gray-700 hover:text-blue-600 transition-colors ${activeFolder === 'sent' ? 'text-blue-600 font-medium' : ''}`}
            >
              {t.sentFolder}
            </button>
            <button 
              onClick={() => setActiveFolder('drafts')}
              className={`text-gray-700 hover:text-blue-600 transition-colors ${activeFolder === 'drafts' ? 'text-blue-600 font-medium' : ''}`}
            >
              {t.drafts}
            </button>
            <button 
              onClick={() => setActiveFolder('contacts')}
              className={`text-gray-700 hover:text-blue-600 transition-colors ${activeFolder === 'contacts' ? 'text-blue-600 font-medium' : ''}`}
            >
              {t.contacts}
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {/* 搜索栏 */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          {/* 语言切换 */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 text-xs">
              ▼
            </div>
          </div>
          {/* 通知和设置 */}
          <button className="text-gray-500 hover:text-blue-600 transition-colors">
            🔔
          </button>
          <button className="text-gray-500 hover:text-blue-600 transition-colors">
            ⚙️
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* 左侧导航栏 */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* 撰写按钮 */}
          <div className="p-4">
            <button
              onClick={() => setShowCompose(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-sm"
            >
              <span className="mr-2">✏️</span>
              {t.compose}
            </button>
          </div>
          
          {/* 主要文件夹导航 */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {
                [
                  { id: 'inbox', label: t.inbox, count: emails.filter(e => e.status === 'unread').length },
                  { id: 'sent', label: t.sentFolder, count: emails.filter(e => e.status === 'sent').length },
                  { id: 'drafts', label: t.drafts, count: 0 },
                  { id: 'trash', label: t.trash, count: 0 },
                  { id: 'spam', label: t.spam, count: 0 },
                ].map(folder => (
                  <li key={folder.id}>
                    <button
                      onClick={() => handleFolderClick(folder.id)}
                      className={`w-full text-left px-3 py-2.5 rounded flex items-center justify-between transition-all duration-200 ${activeFolder === folder.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{folderIcons[folder.id as keyof typeof folderIcons]}</span>
                        <span>{folder.label}</span>
                      </div>
                      {folder.count > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center font-medium">
                          {folder.count}
                        </span>
                      )}
                    </button>
                  </li>
                ))
              }
            </ul>
            
            {/* 分隔线 */}
            <div className="my-4 border-t border-gray-200 mx-4"></div>
            
            {/* 其他文件夹 */}
            <ul className="space-y-1 px-2">
              {
                [
                  { id: 'important', label: t.important, count: emails.filter(e => e.importance === 'high').length },
                  { id: 'flagged', label: t.flagged, count: emails.filter(e => e.flagged).length },
                  { id: 'allMail', label: t.allMail, count: emails.length },
                ].map(folder => (
                  <li key={folder.id}>
                    <button
                      onClick={() => handleFolderClick(folder.id)}
                      className={`w-full text-left px-3 py-2.5 rounded flex items-center justify-between transition-all duration-200 ${activeFolder === folder.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{folderIcons[folder.id as keyof typeof folderIcons]}</span>
                        <span>{folder.label}</span>
                      </div>
                      {folder.count > 0 && (
                        <span className="text-gray-500 text-xs">{folder.count}</span>
                      )}
                    </button>
                  </li>
                ))
              }
            </ul>
            
            {/* 分隔线 */}
            <div className="my-4 border-t border-gray-200 mx-4"></div>
            
            {/* 工具导航 */}
            <ul className="space-y-1 px-2">
              {
                [
                  { id: 'contacts', label: t.contacts },
                  { id: 'settings', label: t.settings },
                  { id: 'help', label: t.help },
                ].map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleFolderClick(item.id)}
                      className={`w-full text-left px-3 py-2.5 rounded flex items-center transition-all duration-200 ${activeFolder === item.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <span className="mr-3 text-lg">{folderIcons[item.id as keyof typeof folderIcons]}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))
              }
            </ul>
          </nav>
          
          {/* 底部存储信息 */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div className="mb-1">已用空间: 2.5GB</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="mt-1">总空间: 10GB</div>
            </div>
          </div>
        </aside>

        {/* 中间邮件列表 */}
        <main className={`flex-1 flex flex-col ${!showRightPanel ? 'md:max-w-2xl' : ''}`}>
          {/* 邮件列表头部 */}
          {activeFolder !== 'contacts' && activeFolder !== 'settings' && (
            <div className="bg-white border-b border-gray-200 p-3 flex flex-col space-y-3">
              {/* 文件夹标题和操作栏 */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <span className="mr-2">{folderIcons[activeFolder as keyof typeof folderIcons]}</span>
                    {activeFolder === 'inbox' ? t.inbox : 
                     activeFolder === 'sent' ? t.sentFolder : 
                     activeFolder === 'drafts' ? t.drafts :
                     activeFolder === 'trash' ? t.trash :
                     activeFolder === 'spam' ? t.spam :
                     activeFolder === 'important' ? t.important : 
                     activeFolder === 'flagged' ? t.flagged : 
                     activeFolder === 'allMail' ? t.allMail : t.inbox}
                  </h2>
                  <span className="ml-3 text-sm text-gray-500">({folderEmails.length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* 搜索栏 - 移动端 */}
                  <div className="relative md:hidden">
                    <input
                      type="text"
                      placeholder={t.search}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-40 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                      🔍
                    </div>
                  </div>
                  {/* 视图切换 */}
                  <div className="flex border border-gray-200 rounded overflow-hidden">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      列表
                    </button>
                    <button
                      onClick={() => setViewMode('conversation')}
                      className={`px-3 py-1 text-sm ${viewMode === 'conversation' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      会话
                    </button>
                  </div>
                  {/* 右侧面板切换 */}
                  <button
                    onClick={() => setShowRightPanel(!showRightPanel)}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showRightPanel ? '«' : '»'}
                  </button>
                </div>
              </div>
              
              {/* 邮件操作栏 */}
              <div className="flex items-center space-x-3">
                {/* 全选复选框 */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedEmails.length === folderEmails.length && folderEmails.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {selectedEmails.length > 0 ? `${selectedEmails.length} 已选择` : '全选'}
                  </span>
                </div>
                
                {/* 批量操作按钮 */}
                {selectedEmails.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowMoveDialog(true)}
                      className="text-sm bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                    >
                      转移
                    </button>
                    <button
                      className="text-sm bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                    >
                      删除
                    </button>
                    <button
                      className="text-sm bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                    >
                      标记
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* 邮件列表内容 */}
          <div className="flex-1 overflow-y-auto bg-white">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">{t.loading}</p>
              </div>
            ) : activeFolder === 'help' ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">{folderIcons.help}</span>
                  {t.help}
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">常见问题</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>如何设置邮件签名？</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>如何启用自动回复？</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>如何管理联系人？</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>如何转移邮件到其他文件夹？</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">联系支持</h4>
                    <p className="text-gray-600 text-sm mb-4">如果您有任何问题，请联系我们的支持团队</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                      联系支持
                    </button>
                  </div>
                </div>
              </div>
            ) : activeFolder === 'contacts' ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">{folderIcons.contacts}</span>
                  {t.contacts}
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">联系人管理</h4>
                    <p className="text-gray-600 text-sm mb-4">管理您的联系人列表，包括添加、编辑和删除联系人</p>
                    <button 
                      onClick={() => setShowAddContactDialog(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      添加联系人
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {/* 模拟联系人列表 */}
                    {
                      [
                        { id: '1', name: 'HR Manager', email: 'recruiter1@phdmap.com', phone: '13800138001' },
                        { id: '2', name: 'Talent Acquisition', email: 'recruiter2@phdmap.com', phone: '13900139001' },
                        { id: '3', name: 'System Admin', email: 'admin@phdmap.com', phone: '13700137001' },
                      ].map(contact => (
                        <div key={contact.id} className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0">
                              {contact.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{contact.name}</div>
                              <div className="text-sm text-gray-500">{contact.email}</div>
                            </div>
                            <div className="text-sm text-gray-500">{contact.phone}</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : activeFolder === 'settings' ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">{folderIcons.settings}</span>
                  {t.settings}
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">账户设置</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">修改密码</span>
                        <button 
                          onClick={() => setShowChangePasswordDialog(true)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          修改
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">邮箱签名</span>
                        <button 
                          onClick={() => setShowEmailSignatureDialog(true)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          设置
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">自动回复</span>
                        <button 
                          onClick={() => setShowAutoReplyDialog(true)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          设置
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">通知设置</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">新邮件通知</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">邮件阅读通知</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : folderEmails.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noEmails}</h3>
                <p className="text-gray-600 mb-6">{activeFolder === 'inbox' ? '暂无新邮件' : '该文件夹为空'}</p>
                <button
                  onClick={() => setShowCompose(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {t.compose}
                </button>
              </div>
            ) : viewMode === 'list' ? (
              <div className="divide-y divide-gray-100">
                {folderEmails.map(email => (
                  <div
                    key={email.id}
                    onClick={(e) => handleEmailClick(email, e)}
                    className={`p-3 transition-all duration-200 cursor-pointer hover:bg-gray-50 ${selectedEmail?.id === email.id ? 'bg-blue-50' : ''} ${email.status === 'unread' ? 'font-medium' : 'text-gray-600'}`}
                  >
                    <div className="flex items-start">
                      {/* 复选框 */}
                      <div className="mr-3 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(email.id)}
                          onChange={(e) => handleEmailSelect(email.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      
                      {/* 优先级和星标 */}
                      <div className="flex flex-col items-center mr-3 space-y-1">
                        <span className="text-sm">{priorityIcons[email.importance as keyof typeof priorityIcons]}</span>
                        <span className="text-sm">{email.flagged ? '⭐' : ''}</span>
                      </div>
                        
                      {/* 邮件内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className={`font-medium ${email.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                            {email.sender.realName}
                          </div>
                          <span className="text-sm ml-4 whitespace-nowrap">
                            {new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <h4 className={`text-sm mb-1 ${email.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                          {email.subject}
                        </h4>
                        
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {email.body.replace(/\n/g, ' ').substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // 会话视图
              <div className="space-y-4 p-3">
                {/* 简单的会话分组实现 */}
                {(() => {
                  // 按主题分组邮件
                  const groupedEmails: Record<string, any[]> = {};
                  
                  folderEmails.forEach(email => {
                    // 移除Re:和Fwd:前缀，以便正确分组
                    let subjectKey = email.subject.replace(/^(Re:|Fwd:)\s*/i, '');
                    if (!groupedEmails[subjectKey]) {
                      groupedEmails[subjectKey] = [];
                    }
                    groupedEmails[subjectKey].push(email);
                  });
                  
                  // 对每个会话按日期排序，最新的在前面
                  Object.values(groupedEmails).forEach(emails => {
                    emails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                  });
                  
                  // 将会话按最新邮件的日期排序
                  const sortedConversations = Object.entries(groupedEmails)
                    .sort((a, b) => {
                      const latestA = new Date(a[1][0].createdAt).getTime();
                      const latestB = new Date(b[1][0].createdAt).getTime();
                      return latestB - latestA;
                    });
                  
                  return sortedConversations.map(([subject, conversationEmails]) => {
                    const latestEmail = conversationEmails[0];
                    const unreadCount = conversationEmails.filter(e => e.status === 'unread').length;
                    
                    return (
                      <div
                        key={subject}
                        onClick={() => handleEmailClick(latestEmail)}
                        className={`p-3 transition-all duration-200 cursor-pointer hover:bg-gray-50 rounded-lg border ${selectedEmail?.id === latestEmail.id ? 'border-blue-300 bg-blue-50' : 'border-gray-100'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-gray-900">
                            {conversationEmails.map((email, index) => (
                              <span key={email.id} className="inline-block">
                                {email.sender.realName}{index < conversationEmails.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center">
                            {unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 mr-2">
                                {unreadCount}
                              </span>
                            )}
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {new Date(latestEmail.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {subject}
                        </h4>
                        
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {latestEmail.body.replace(/\n/g, ' ').substring(0, 150)}...
                        </p>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          {conversationEmails.length} 封邮件
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </main>

        {/* 右侧邮件内容 */}
        {showRightPanel && selectedEmail && (
          <aside className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col">
            {/* 邮件内容头部 */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{selectedEmail.subject}</h2>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0">
                    {selectedEmail.sender.realName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{selectedEmail.sender.realName}</div>
                    <div className="text-xs text-gray-500">{selectedEmail.sender.internalEmail}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {t.sentOn} {new Date(selectedEmail.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    const updatedEmails = emails.map(e => 
                      e.id === selectedEmail.id ? { ...e, flagged: !e.flagged } : e
                    );
                    setEmails(updatedEmails);
                    setSelectedEmail({ ...selectedEmail, flagged: !selectedEmail.flagged });
                  }}
                  className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
                >
                  {selectedEmail.flagged ? '⭐' : '☆'}
                </button>
                <button 
                  onClick={() => {
                    const updatedEmails = emails.filter(e => e.id !== selectedEmail.id);
                    setEmails(updatedEmails);
                    setSelectedEmail(null);
                  }}
                  className="text-gray-500 hover:text-red-600 transition-colors text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {/* 邮件内容 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-1">{t.to}:</div>
                <div className="text-sm text-gray-900">{selectedEmail.recipients.join(', ')}</div>
              </div>
              
              <div className="prose max-w-none text-sm">
                {selectedEmail.body.split('\n').map((line: string, index: number) => (
                  <p key={index} className="mb-3">{line}</p>
                ))}
              </div>
              
              {/* 附件 */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">{t.attachments}</h3>
                  <div className="space-y-2">
                    {selectedEmail.attachments.map((attachment: any, index: number) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <span className="mr-2">📎</span>
                        <span className="text-sm flex-1">{attachment.name}</span>
                        <span className="text-xs text-gray-500 mr-2">{attachment.size}</span>
                        <button 
                          onClick={() => {
                            // 模拟附件下载
                            console.log(`Downloading attachment: ${attachment.name}`);
                            alert(`开始下载附件: ${attachment.name}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          下载
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 邮件跟踪信息 */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  {t.emailTracking}
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">{t.sentStatus}:</span> {new Date(selectedEmail.tracking.sentAt).toLocaleString()}
                  </div>
                  {selectedEmail.tracking.deliveredAt && (
                    <div>
                      <span className="font-medium">{t.delivered}:</span> {new Date(selectedEmail.tracking.deliveredAt).toLocaleString()}
                    </div>
                  )}
                  {selectedEmail.tracking.readAt && (
                    <div>
                      <span className="font-medium">{t.readStatus}:</span> {new Date(selectedEmail.tracking.readAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 邮件操作栏 */}
            <div className="p-3 border-t border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setComposeForm({
                      recipients: selectedEmail.sender.internalEmail,
                      cc: '',
                      bcc: '',
                      subject: `Re: ${selectedEmail.subject}`,
                      body: '',
                      priority: 'normal',
                    });
                    setShowCompose(true);
                  }}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                >
                  <span className="mr-1">↩️</span>
                  {t.reply}
                </button>
                <button 
                  onClick={() => {
                    setComposeForm({
                      recipients: '',
                      cc: '',
                      bcc: '',
                      subject: `Fwd: ${selectedEmail.subject}`,
                      body: `--- 转发邮件 ---\n发件人: ${selectedEmail.sender.realName} <${selectedEmail.sender.internalEmail}>\n收件人: ${selectedEmail.recipients.join(', ')}\n主题: ${selectedEmail.subject}\n日期: ${new Date(selectedEmail.createdAt).toLocaleString()}\n\n${selectedEmail.body}\n\n--- 转发邮件 ---\n`,
                      priority: 'normal',
                    });
                    setShowCompose(true);
                  }}
                  className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors text-sm flex items-center"
                >
                  <span className="mr-1">➡️</span>
                  {t.forward}
                </button>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    const updatedEmails = emails.map(e => 
                      e.id === selectedEmail.id ? { ...e, flagged: !e.flagged } : e
                    );
                    setEmails(updatedEmails);
                    setSelectedEmail({ ...selectedEmail, flagged: !selectedEmail.flagged });
                  }}
                  className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
                >
                  {selectedEmail.flagged ? '⭐' : '☆'}
                </button>
                <button 
                  onClick={() => {
                    const updatedEmails = emails.filter(e => e.id !== selectedEmail.id);
                    setEmails(updatedEmails);
                    setSelectedEmail(null);
                  }}
                  className="text-gray-500 hover:text-red-600 transition-colors text-sm"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* 撰写邮件弹窗 */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* 弹窗头部 */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">{t.compose}</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* 表单内容 */}
            <div className="flex-1 overflow-y-auto p-4">
              <form onSubmit={handleComposeSubmit} className="space-y-4">
                <div>
                  <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.recipients} *
                  </label>
                  <input
                    type="email"
                    id="recipients"
                    name="recipients"
                    value={composeForm.recipients}
                    onChange={handleComposeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cc" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.cc}
                    </label>
                    <input
                      type="email"
                      id="cc"
                      name="cc"
                      value={composeForm.cc}
                      onChange={handleComposeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="bcc" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.bcc}
                    </label>
                    <input
                      type="email"
                      id="bcc"
                      name="bcc"
                      value={composeForm.bcc}
                      onChange={handleComposeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.subject} *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={composeForm.subject}
                    onChange={handleComposeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="输入邮件主题"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.body} *
                  </label>
                  <textarea
                    id="body"
                    name="body"
                    value={composeForm.body}
                    onChange={handleComposeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[200px] resize-none"
                    placeholder="请输入邮件内容..."
                    required
                  ></textarea>
                </div>
                
                <div className="space-y-4">
                  {/* 优先级设置 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">{t.priority}:</span>
                      <div className="flex space-x-2">
                        {['high', 'normal', 'low'].map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => setComposeForm(prev => ({ ...prev, priority }))}
                            className={`px-3 py-1 rounded text-sm ${composeForm.priority === priority ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
                          >
                            {priority === 'high' ? '高' : priority === 'normal' ? '中' : '低'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={generateEmail}
                        disabled={isGeneratingEmail}
                        className="text-sm bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        {isGeneratingEmail ? (
                          <>
                            <span className="mr-1">⏳</span>
                            生成中...
                          </>
                        ) : (
                          <>
                            <span className="mr-1">🤖</span>
                            AI生成
                          </>
                        )}
                      </button>
                      <label className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors text-sm flex items-center">
                        <input
                          type="file"
                          multiple
                          onChange={handleAttachmentUpload}
                          className="hidden"
                        />
                        📎 {t.attachments}
                      </label>
                    </div>
                  </div>
                  
                  {/* 附件列表 */}
                  {attachments.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        📎 {t.attachments} ({attachments.length})
                      </h3>
                      <div className="space-y-2">
                        {attachments.map(attachment => (
                          <div key={attachment.id} className="flex items-center p-2 bg-gray-50 rounded">
                            <span className="mr-2">📄</span>
                            <span className="text-sm flex-1">{attachment.name}</span>
                            <span className="text-xs text-gray-500 mr-2">{attachment.size}</span>
                            <button
                              onClick={() => removeAttachment(attachment.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            {/* 弹窗底部 */}
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowCompose(false);
                  setAttachments([]);
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleComposeSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {t.send}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 转移邮件弹窗 */}
      {showMoveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            {/* 弹窗头部 */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">转移邮件</h2>
              <button
                onClick={() => setShowMoveDialog(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* 表单内容 */}
            <div className="p-6">
              <p className="mb-4 text-gray-600">
                选择目标文件夹，将 {selectedEmails.length} 封邮件转移到该文件夹
              </p>
              <div className="space-y-2">
                {
                  [
                    { id: 'inbox', label: t.inbox, icon: folderIcons.inbox },
                    { id: 'sent', label: t.sentFolder, icon: folderIcons.sent },
                    { id: 'drafts', label: t.drafts, icon: folderIcons.drafts },
                    { id: 'trash', label: t.trash, icon: folderIcons.trash },
                    { id: 'spam', label: t.spam, icon: folderIcons.spam },
                    { id: 'important', label: t.important, icon: folderIcons.important },
                    { id: 'flagged', label: t.flagged, icon: folderIcons.flagged },
                  ].map(folder => (
                    <div key={folder.id}>
                      <label className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="targetFolder"
                          value={folder.id}
                          checked={targetFolder === folder.id}
                          onChange={(e) => setTargetFolder(e.target.value)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-lg">{folder.icon}</span>
                        <span className="ml-2">{folder.label}</span>
                      </label>
                    </div>
                  ))
                }
              </div>
            </div>
            
            {/* 弹窗底部 */}
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={() => setShowMoveDialog(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleMoveEmails}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                转移
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加联系人弹窗 */}
      {showAddContactDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            {/* 弹窗头部 */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">添加联系人</h2>
              <button
                onClick={() => setShowAddContactDialog(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* 表单内容 */}
            <div className="flex-1 overflow-y-auto p-4">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="请输入联系人姓名"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱 *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="请输入联系人邮箱"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    电话
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="请输入联系人电话"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    备注
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] resize-none"
                    placeholder="请输入备注信息"
                  ></textarea>
                </div>
              </form>
            </div>
            
            {/* 弹窗底部 */}
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={() => setShowAddContactDialog(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 这里可以实现添加联系人的逻辑
                  console.log('Adding contact...');
                  setShowAddContactDialog(false);
                  alert('联系人添加成功！');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 修改密码弹窗 */}
      {showChangePasswordDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            {/* 弹窗头部 */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">修改密码</h2>
              <button
                onClick={() => setShowChangePasswordDialog(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* 表单内容 */}
            <div className="flex-1 overflow-y-auto p-4">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    当前密码 *
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="请输入当前密码"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    新密码 *
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="请输入新密码"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认新密码 *
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="请确认新密码"
                    required
                  />
                </div>
              </form>
            </div>
            
            {/* 弹窗底部 */}
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={() => setShowChangePasswordDialog(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 这里可以实现修改密码的逻辑
                  console.log('Changing password...');
                  setShowChangePasswordDialog(false);
                  alert('密码修改成功！');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 邮箱签名弹窗 */}
      {showEmailSignatureDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            {/* 弹窗头部 */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">邮箱签名</h2>
              <button
                onClick={() => setShowEmailSignatureDialog(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* 表单内容 */}
            <div className="flex-1 overflow-y-auto p-4">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    签名内容
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px] resize-none"
                    placeholder="请输入您的邮箱签名"
                  >{`${t.emailCenter}
${t.sender}: {您的姓名}
${t.recipients}: {您的邮箱}
电话: {您的电话}

此邮件由 ${t.emailCenter} 发送`}</textarea>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    在新邮件中自动添加签名
                  </label>
                </div>
              </form>
            </div>
            
            {/* 弹窗底部 */}
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={() => setShowEmailSignatureDialog(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 这里可以实现保存邮箱签名的逻辑
                  console.log('Saving email signature...');
                  setShowEmailSignatureDialog(false);
                  alert('邮箱签名保存成功！');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 自动回复弹窗 */}
      {showAutoReplyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            {/* 弹窗头部 */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">自动回复</h2>
              <button
                onClick={() => setShowAutoReplyDialog(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* 表单内容 */}
            <div className="flex-1 overflow-y-auto p-4">
              <form className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    启用自动回复
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    回复主题
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="请输入回复主题"
                    defaultValue="自动回复：我已收到您的邮件"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    回复内容
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px] resize-none"
                    placeholder="请输入自动回复内容"
                  >{`尊敬的发件人：

您好！我已收到您的邮件，会尽快回复您。

如有紧急事宜，请直接致电联系。

此为自动回复，请勿直接回复本邮件。

谢谢！`}</textarea>
                </div>
              </form>
            </div>
            
            {/* 弹窗底部 */}
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={() => setShowAutoReplyDialog(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 这里可以实现保存自动回复的逻辑
                  console.log('Saving auto reply...');
                  setShowAutoReplyDialog(false);
                  alert('自动回复设置成功！');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
