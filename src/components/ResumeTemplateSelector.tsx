import React, { useState } from 'react';
import { ResumeTemplate, RESUME_TEMPLATES, TEMPLATE_CATEGORIES, RESUME_FORMATS } from '@/lib/resume-templates';

interface ResumeTemplateSelectorProps {
  onTemplateSelect: (template: ResumeTemplate, format: 'word' | 'pdf') => void;
  onCancel: () => void;
}

const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({ onTemplateSelect, onCancel }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState<'word' | 'pdf'>('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = RESUME_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesFormat = template.supportedFormats.includes(selectedFormat);
    return matchesCategory && matchesFormat;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">选择简历模板</h2>
          <p className="text-gray-600 mt-2">选择一个适合您的简历模板和格式</p>
        </div>

        {/* 筛选选项 */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">模板分类</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {TEMPLATE_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md transition-all ${selectedFormat === 'pdf' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => setSelectedFormat('pdf')}
                >
                  PDF
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md transition-all ${selectedFormat === 'word' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => setSelectedFormat('word')}
                >
                  Word
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 模板列表 */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 shadow-lg transform scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="relative">
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                  {template.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      会员专享
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1">
                      {template.supportedFormats.includes('pdf') && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">PDF</span>
                      )}
                      {template.supportedFormats.includes('word') && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Word</span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {template.category === 'modern' && '现代'}
                      {template.category === 'professional' && '专业'}
                      {template.category === 'academic' && '学术'}
                      {template.category === 'creative' && '创意'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            onClick={() => {
              const template = RESUME_TEMPLATES.find(t => t.id === selectedTemplate);
              if (template) {
                onTemplateSelect(template, selectedFormat);
              }
            }}
            disabled={!selectedTemplate}
          >
            生成简历
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;