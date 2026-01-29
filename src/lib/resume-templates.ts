/**
 * 简历模板数据模型
 */
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  isPremium: boolean;
  supportedFormats: ('word' | 'pdf')[];
  category: 'modern' | 'professional' | 'creative' | 'academic';
}

/**
 * 简历模板数据
 */
export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'modern-1',
    name: '现代简约',
    description: '简洁现代的设计风格，适合科技和创意行业',
    previewImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20minimalist%20resume%20template%2C%20clean%20white%20background%2C%20blue%20accent%20color%2C%20professional%20design%2C%20A4%20size%2C%20minimal%20elements%2C%20high%20resolution&image_size=square_hd',
    isPremium: false,
    supportedFormats: ['word', 'pdf'],
    category: 'modern'
  },
  {
    id: 'professional-1',
    name: '专业经典',
    description: '传统专业的设计，适合金融、法律等行业',
    previewImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20classic%20resume%20template%2C%20clean%20design%2C%20formal%20layout%2C%20A4%20size%2C%20black%20and%20white%2C%20professional%20look%2C%20high%20resolution&image_size=square_hd',
    isPremium: false,
    supportedFormats: ['word', 'pdf'],
    category: 'professional'
  },
  {
    id: 'academic-1',
    name: '学术研究',
    description: '适合科研人员和学术背景的简历模板',
    previewImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Academic%20resume%20template%2C%20focus%20on%20research%20experience%20and%20publications%2C%20clean%20format%2C%20A4%20size%2C%20professional%20academic%20design%2C%20high%20resolution&image_size=square_hd',
    isPremium: false,
    supportedFormats: ['word', 'pdf'],
    category: 'academic'
  },
  {
    id: 'creative-1',
    name: '创意设计',
    description: '富有创意的设计，适合设计、艺术等行业',
    previewImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Creative%20resume%20template%2C%20unique%20layout%2C%20colorful%20design%2C%20creative%20profession%2C%20A4%20size%2C%20high%20resolution&image_size=square_hd',
    isPremium: false,
    supportedFormats: ['pdf'],
    category: 'creative'
  },
  {
    id: 'modern-2',
    name: '科技蓝',
    description: '科技感十足的蓝色主题简历',
    previewImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tech%20blue%20resume%20template%2C%20blue%20gradient%20background%2C%20modern%20tech%20design%2C%20A4%20size%2C%20professional%20layout%2C%20high%20resolution&image_size=square_hd',
    isPremium: false,
    supportedFormats: ['word', 'pdf'],
    category: 'modern'
  },
  {
    id: 'professional-2',
    name: '商务精英',
    description: '高端商务风格，适合管理和高管职位',
    previewImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Executive%20business%20resume%20template%2C%20elegant%20design%2C%20gold%20accent%20color%2C%20professional%20layout%2C%20A4%20size%2C%20high%20resolution&image_size=square_hd',
    isPremium: false,
    supportedFormats: ['word', 'pdf'],
    category: 'professional'
  }
];

/**
 * 简历格式选项
 */
export const RESUME_FORMATS = [
  { value: 'pdf', label: 'PDF格式' },
  { value: 'word', label: 'Word格式' }
];

/**
 * 简历模板分类
 */
export const TEMPLATE_CATEGORIES = [
  { value: 'all', label: '全部' },
  { value: 'modern', label: '现代' },
  { value: 'professional', label: '专业' },
  { value: 'academic', label: '学术' },
  { value: 'creative', label: '创意' }
] as const;

/**
 * 根据ID获取模板
 */
export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return RESUME_TEMPLATES.find(template => template.id === id);
};

/**
 * 过滤模板
 */
export const filterTemplates = (
  category: string,
  onlyFree: boolean = false,
  format?: 'word' | 'pdf'
): ResumeTemplate[] => {
  return RESUME_TEMPLATES.filter(template => {
    const matchesCategory = category === 'all' || template.category === category;
    const matchesFree = !onlyFree || !template.isPremium;
    const matchesFormat = !format || template.supportedFormats.includes(format);
    return matchesCategory && matchesFree && matchesFormat;
  });
};