// 多语言翻译管理

export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ru' | 'ar' | 'pt';

interface Translation {
  nav: {
    home: string;
    university: string;
    enterprise: string;
    private: string;
    resume: string;
    jobs: string;
    login: string;
    register: string;
    lang: string;
    siteName: string;
    profile: string;
    applications: string;
    membership: string;
    settings: string;
    logout: string;
  };
  auth: {
    login: string;
    register: string;
    enterpriseLogin: string;
    enterpriseRegister: string;
    welcome: string;
  };
  membership: {
    free: string;
    vip: string;
    svip: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    btn: string;
    browseJobs: string;
  };
  features: {
    title: string;
    items: Array<{
      title: string;
      desc: string;
    }>;
  };
  jobs: {
    title: string;
    viewDetails: string;
    viewMore: string;
    academic: string;
    enterprise: string;
    filter: {
      all: string;
      university: string;
      academic: string;
      enterprise: string;
    };
  };
  university: {
    description: string;
    positions: {
      professor: string;
      professorDesc: string;
      postdoc: string;
      postdocDesc: string;
      researchAssistant: string;
      researchAssistantDesc: string;
      viewPositions: string;
    };
  };
  enterprise: {
    description: string;
    positions: {
      techDirector: string;
      techDirectorDesc: string;
      chiefScientist: string;
      chiefScientistDesc: string;
      rManager: string;
      rManagerDesc: string;
      viewPositions: string;
    };
  };
  register: {
    why: string;
    benefits: string[];
  };
  footer: {
    copyright: string;
    quickLinks: string;
    aboutUs: string;
    contact: string;
    platformIntro: string;
    partners: string;
    contactUs: string;
  };
  upload: {
    chinese: {
      title: string;
      subtitle: string;
      resume: string;
      upload: string;
      success: string;
      history: string;
    };
    foreign: {
      title: string;
      subtitle: string;
      resume: string;
      materials: string;
      upload: string;
      success: string;
      history: string;
    };
  };
  admin: {
    dashboard: string;
    users: string;
    data: string;
    settings: string;
    overview: string;
    stats: string;
    recent: string;
    verify: string;
    action: string;
  };
  form: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    countryCode: string;
    phone: string;
    degree: string;
    submit: string;
    cancel: string;
    required: string;
    invalid: string;
  };
  job: {
    location: string;
    salary: string;
    degree: string;
    experience: string;
  };
  email: {
    emailCenter: string;
    compose: string;
    inbox: string;
    sentFolder: string;
    drafts: string;
    trash: string;
    spam: string;
    sender: string;
    subject: string;
    date: string;
    status: string;
    readStatus: string;
    sentStatus: string;
    delivered: string;
    failed: string;
    unread: string;
    send: string;
    cancel: string;
    reply: string;
    back: string;
    recipients: string;
    body: string;
    sentOn: string;
    to: string;
    emailTracking: string;
  };
  error: {
    required: string;
    invalidEmail: string;
    passwordMismatch: string;
    userExists: string;
    loginFailed: string;
    serverError: string;
  };
  success: {
    registered: string;
    loggedIn: string;
    passwordReset: string;
    profileUpdated: string;
    fileUploaded: string;
  };
}

// 创建英文默认翻译
const defaultTranslation: Translation = {
  nav: {
    home: 'Home',
    university: 'University Research Positions',
    enterprise: 'Enterprise Senior Positions',
    private: 'My Private Positions',
    resume: 'My Resume Center',
    jobs: 'My Private Jobs',
    login: 'Login',
    register: 'Register',
    lang: '中文',
    siteName: 'PhD-G',
    profile: 'Profile',
    applications: 'Applications',
    membership: 'Membership Center',
    settings: 'Account Settings',
    logout: 'Logout',
  },
  auth: {
    login: 'Login',
    register: 'Register',
    enterpriseLogin: 'Enterprise Login',
    enterpriseRegister: 'Enterprise Register',
    welcome: 'Welcome, ',
  },
  membership: {
    free: 'Free Member',
    vip: 'VIP Member',
    svip: 'SVIP Member',
  },
  hero: {
    title: 'PhD Job Matching Platform',
    subtitle: 'Precise job matching for PhDs',
    description: 'Providing precise job matching services for overseas PhDs, connecting global top talents with quality positions',
    btn: 'Register Now',
    browseJobs: 'Browse Jobs',
  },
  features: {
    title: 'Platform Advantages',
    items: [
      { title: 'Precise Matching', desc: 'Based on AI algorithms, intelligently recommend the most suitable positions according to your background and preferences' },
      { title: 'Global Opportunities', desc: 'Covering senior positions in top universities, research institutions and enterprises worldwide' },
      { title: 'Exclusive Service', desc: 'Provide customized career development advice and support for PhD talents' },
      { title: 'Safe and Reliable', desc: 'Strictly protect your personal information and academic achievements' },
    ],
  },
  jobs: {
    title: 'Hot Positions',
    viewDetails: 'View Details',
    viewMore: 'View More Positions →',
    academic: 'Academic',
    enterprise: 'Enterprise',
    filter: {
      all: 'All',
      university: 'University Research',
      academic: 'Academic',
      enterprise: 'Enterprise Senior',
    },
  },
  university: {
    description: 'Connecting with top universities and research institutions worldwide, providing academic career development opportunities for PhDs',
    positions: {
      professor: 'Professor/Associate Professor',
      professorDesc: 'Tenured faculty opportunities at world-renowned universities',
      postdoc: 'Postdoctoral Researcher',
      postdocDesc: 'Research positions at top research institutions',
      researchAssistant: 'Research Assistant Professor',
      researchAssistantDesc: 'Tenure-track positions with academic development paths',
      viewPositions: 'View Positions →',
    },
  },
  enterprise: {
    description: 'Providing senior management and technical positions in enterprises for PhD talents, maximizing career value',
    positions: {
      techDirector: 'Technical Director',
      techDirectorDesc: 'Leading enterprise technological innovation and R&D direction',
      chiefScientist: 'Chief Scientist',
      chiefScientistDesc: 'Responsible for enterprise core technology R&D and strategic planning',
      rManager: 'R&D Manager',
      rManagerDesc: 'Managing R&D teams and driving product innovation',
      viewPositions: 'View Positions →',
    },
  },
  register: {
    why: 'Why register?',
    benefits: [
      'Create your resume profile',
      'Receive personalized job recommendations',
      'Manage your applications',
      'Get career development advice',
    ],
  },
  footer: {
    copyright: '© 2026 PhDMap. All rights reserved.',
    quickLinks: 'Quick Links',
    aboutUs: 'About Us',
    contact: 'Contact',
    platformIntro: 'Platform Introduction',
    partners: 'Partners',
    contactUs: 'Contact Us',
  },
  upload: {
    chinese: {
      title: 'Chinese PhD Upload Center',
      subtitle: 'Upload your resume and start precise matching',
      resume: 'Resume Upload',
      upload: 'Upload File',
      success: 'Upload Success',
      history: 'Upload History',
    },
    foreign: {
      title: 'Foreign PhD Upload Center',
      subtitle: 'Upload your resume and application materials',
      resume: 'Resume Upload',
      materials: 'Application Materials',
      upload: 'Upload Files',
      success: 'Upload Success',
      history: 'Upload History',
    },
  },
  admin: {
    dashboard: 'Dashboard',
    users: 'User Management',
    data: 'Data Management',
    settings: 'System Settings',
    overview: 'System Overview',
    stats: 'Statistics',
    recent: 'Recent Activities',
    verify: 'Verify',
    action: 'Action',
  },
  form: {
    username: 'Username',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    countryCode: 'Country Code',
    phone: 'Phone Number',
    degree: 'Degree Certificate',
    submit: 'Submit',
    cancel: 'Cancel',
    required: 'Required',
    invalid: 'Invalid Input',
  },
  job: {
    location: 'Location',
    salary: 'Salary',
    degree: 'Degree',
    experience: 'Experience',
  },
  email: {
    emailCenter: 'Email Center',
    compose: 'Compose',
    inbox: 'Inbox',
    sentFolder: 'Sent',
    drafts: 'Drafts',
    trash: 'Trash',
    spam: 'Spam',
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
    back: 'Back',
    recipients: 'Recipients',
    body: 'Body',
    sentOn: 'Sent on',
    to: 'To',
    emailTracking: 'Email Tracking',
  },
  error: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordMismatch: 'Passwords do not match',
    userExists: 'User already exists',
    loginFailed: 'Login failed, please check your email and password',
    serverError: 'Server error, please try again later',
  },
  success: {
    registered: 'Registration successful',
    loggedIn: 'Login successful',
    passwordReset: 'Password reset successful',
    profileUpdated: 'Profile updated successfully',
    fileUploaded: 'File uploaded successfully',
  },
};

export const translations: Record<Language, Translation> = {
  zh: {
    nav: {
      home: '首页',
      university: '大学科研岗位',
      enterprise: '企业高级岗位',
      private: '我的私人岗位',
      resume: '我的简历中心',
      jobs: '我的私人岗位',
      login: '登录',
      register: '注册',
      lang: 'English',
      siteName: 'PhD-G',
      profile: '个人资料',
      applications: '申请记录',
      membership: '会员中心',
      settings: '账号设置',
      logout: '退出登录',
    },
    auth: {
      login: '登录',
      register: '注册',
      enterpriseLogin: '企业登录',
      enterpriseRegister: '企业注册',
      welcome: '欢迎，',
    },
    membership: {
      free: '免费会员',
      vip: 'VIP会员',
      svip: 'SVIP会员',
    },
    hero: {
      title: '博士岗位匹配平台',
      subtitle: '博士找岗，精准直达',
      description: '为海外博士提供精准的岗位匹配服务，连接全球顶尖人才与优质岗位',
      btn: '立即注册',
      browseJobs: '浏览岗位',
    },
    features: {
      title: '平台优势',
      items: [
        { title: '精准匹配', desc: '基于AI算法，根据您的背景和偏好智能推荐最合适的岗位' },
        { title: '全球机会', desc: '覆盖全球顶尖大学、科研机构和企业的高级岗位' },
        { title: '专属服务', desc: '为博士人才提供定制化的职业发展建议和支持' },
        { title: '安全可靠', desc: '严格保护您的个人信息和学术成果' },
      ],
    },
    jobs: {
      title: '热门岗位',
      viewDetails: '查看详情',
      viewMore: '查看更多岗位 →',
      academic: '学术',
      enterprise: '企业',
      filter: {
        all: '全部',
        university: '高校科研',
        academic: '学术',
        enterprise: '企业高级',
      },
    },
    university: {
      description: '连接全球顶尖大学和科研机构，为博士提供学术职业发展机会',
      positions: {
        professor: '教授/副教授',
        professorDesc: '全球知名大学的终身教职机会',
        postdoc: '博士后研究员',
        postdocDesc: '顶尖科研机构的研究职位',
        researchAssistant: '研究助理教授',
        researchAssistantDesc: 'tenure-track 职位，学术发展通道',
        viewPositions: '查看岗位 →',
      },
    },
    enterprise: {
      description: '为博士人才提供企业高级管理和技术岗位，实现职业价值最大化',
      positions: {
        techDirector: '技术总监',
        techDirectorDesc: '引领企业技术创新和研发方向',
        chiefScientist: '首席科学家',
        chiefScientistDesc: '负责企业核心技术研发和战略规划',
        rManager: '研发经理',
        rManagerDesc: '管理研发团队，推动产品创新',
        viewPositions: '查看岗位 →',
      },
    },
    register: {
      why: '为什么注册？',
      benefits: [
        '创建个人简历档案',
        '接收精准岗位推荐',
        '管理申请记录',
        '获取职业发展建议',
      ],
    },
    footer: {
      copyright: '© 2026 PhD-G. 保留所有权利.',
      quickLinks: '快速链接',
      aboutUs: '关于我们',
      contact: '联系方式',
      platformIntro: '平台介绍',
      partners: '合作伙伴',
      contactUs: '联系我们',
    },
    upload: {
      chinese: {
        title: '华人博士上传中心',
        subtitle: '上传您的简历，开始精准匹配',
        resume: '简历上传',
        upload: '上传文件',
        success: '上传成功',
        history: '上传历史',
      },
      foreign: {
        title: '外籍博士上传中心',
        subtitle: '上传您的简历和申请材料',
        resume: '简历上传',
        materials: '申请材料',
        upload: '上传文件',
        success: '上传成功',
        history: '上传历史',
      },
    },
    admin: {
      dashboard: '仪表盘',
      users: '用户管理',
      data: '数据管理',
      settings: '系统设置',
      overview: '系统概览',
      stats: '统计数据',
      recent: '最近活动',
      verify: '验证',
      action: '操作',
    },
    form: {
      username: '用户名',
      email: '邮箱地址',
      password: '密码',
      confirmPassword: '确认密码',
      countryCode: '国家区号',
      phone: '手机号',
      degree: '学历证明',
      submit: '提交',
      cancel: '取消',
      required: '必填项',
      invalid: '无效输入',
    },
    job: {
      location: '工作地点',
      salary: '薪资',
      degree: '学历要求',
      experience: '工作经验',
    },
    email: {
      emailCenter: '邮件中心',
      compose: '撰写',
      inbox: '收件箱',
      sentFolder: '已发送',
      drafts: '草稿箱',
      trash: '垃圾箱',
      spam: '垃圾邮件',
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
      back: '返回',
      recipients: '收件人',
      body: '正文',
      sentOn: '发送时间',
      to: '收件人',
      emailTracking: '邮件跟踪',
    },
    error: {
      required: '此字段为必填项',
      invalidEmail: '请输入有效的邮箱地址',
      passwordMismatch: '两次输入的密码不一致',
      userExists: '用户已存在',
      loginFailed: '登录失败，请检查邮箱和密码',
      serverError: '服务器错误，请稍后重试',
    },
    success: {
      registered: '注册成功',
      loggedIn: '登录成功',
      passwordReset: '密码重置成功',
      profileUpdated: '个人信息更新成功',
      fileUploaded: '文件上传成功',
    },
  },
  en: defaultTranslation,
  ja: defaultTranslation,
  ko: defaultTranslation,
  es: defaultTranslation,
  fr: defaultTranslation,
  de: defaultTranslation,
  ru: defaultTranslation,
  ar: defaultTranslation,
  pt: defaultTranslation,
};

// 获取翻译内容
export const getTranslation = (lang: Language): Translation => {
  // 如果该语言没有翻译，默认使用英文
  return translations[lang] || translations.en;
};

// 切换语言
export const toggleLanguage = (currentLang: Language): Language => {
  return currentLang === 'zh' ? 'en' : 'zh';
};

// 保存语言偏好到本地存储
export const saveLanguagePreference = (lang: Language): void => {
  localStorage.setItem('language', lang);
};

// 从本地存储获取语言偏好
export const getLanguagePreference = (): Language => {
  const savedLang = localStorage.getItem('language') as Language;
  return savedLang || 'zh';
};