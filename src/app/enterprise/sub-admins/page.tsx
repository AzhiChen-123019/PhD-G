'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Language, getTranslation } from '@/lib/i18n';

interface SubAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: string;
  status: 'active' | 'inactive';
}

const SubAdminsPage: React.FC = () => {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('zh');
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    permissions: [] as string[]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = getTranslation(lang);

  // 当语言变化时，保存到localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language || 'zh';
    setLang(savedLang);
  }, []);

  // 加载子管理员数据
  useEffect(() => {
    loadSubAdmins();
  }, []);

  const handleLanguageChange = (newLang: string) => {
    const language = newLang as Language;
    setLang(language);
    localStorage.setItem('lang', language);
  };

  const loadSubAdmins = () => {
    // 从localStorage加载子管理员数据
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.isEnterprise && user.subAdmins) {
        setSubAdmins(user.subAdmins);
      } else {
        // 模拟数据
        setSubAdmins([
          {
            id: 1,
            name: '张三',
            email: 'zhangsan@example.com',
            role: '招聘专员',
            permissions: ['job_post', 'candidate_manage'],
            createdAt: '2024-01-01',
            status: 'active'
          },
          {
            id: 2,
            name: '李四',
            email: 'lisi@example.com',
            role: 'HR经理',
            permissions: ['job_post', 'candidate_manage', 'sub_admin_manage'],
            createdAt: '2024-01-02',
            status: 'active'
          }
        ]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 验证姓名
    if (!formData.name.trim()) {
      newErrors.name = lang === 'zh' ? '请输入姓名' : 'Please enter name';
    }

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = lang === 'zh' ? '请输入邮箱地址' : 'Please enter email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = lang === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address';
    }

    // 验证角色
    if (!formData.role.trim()) {
      newErrors.role = lang === 'zh' ? '请选择角色' : 'Please select role';
    }

    // 验证权限
    if (formData.permissions.length === 0) {
      newErrors.permissions = lang === 'zh' ? '请至少选择一项权限' : 'Please select at least one permission';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟添加子管理员
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSubAdmin: SubAdmin = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        permissions: formData.permissions,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      // 更新子管理员列表
      const updatedSubAdmins = [...subAdmins, newSubAdmin];
      setSubAdmins(updatedSubAdmins.map(admin => ({
      ...admin,
      status: admin.status as "active" | "inactive"
    })));

      // 保存到localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.subAdmins = updatedSubAdmins;
        localStorage.setItem('user', JSON.stringify(user));
      }

      // 关闭模态框并重置表单
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        role: '',
        permissions: []
      });
      setErrors({});
    } catch (error) {
      console.error('添加子管理员失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubAdmin = (id: number) => {
    if (window.confirm(lang === 'zh' ? '确定要删除这个子管理员吗？' : 'Are you sure you want to delete this sub-admin?')) {
      const updatedSubAdmins = subAdmins.filter(admin => admin.id !== id);
      setSubAdmins(updatedSubAdmins.map(admin => ({
      ...admin,
      status: admin.status as "active" | "inactive"
    })));

      // 保存到localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.subAdmins = updatedSubAdmins;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  };

  const handleToggleStatus = (id: number) => {
    const updatedSubAdmins = subAdmins.map(admin => 
      admin.id === id 
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
    );
    setSubAdmins(updatedSubAdmins.map(admin => ({
      ...admin,
      status: admin.status as "active" | "inactive"
    })));

    // 保存到localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.subAdmins = updatedSubAdmins;
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const permissionOptions = [
    { value: 'job_post', label: lang === 'zh' ? '发布岗位' : 'Post Jobs' },
    { value: 'candidate_manage', label: lang === 'zh' ? '管理候选人' : 'Manage Candidates' },
    { value: 'sub_admin_manage', label: lang === 'zh' ? '管理子管理员' : 'Manage Sub-admins' },
    { value: 'company_info', label: lang === 'zh' ? '修改公司信息' : 'Edit Company Info' },
    { value: 'data_analysis', label: lang === 'zh' ? '数据分析' : 'Data Analysis' }
  ];

  const roleOptions = [
    { value: 'hr_specialist', label: lang === 'zh' ? '招聘专员' : 'HR Specialist' },
    { value: 'hr_manager', label: lang === 'zh' ? 'HR经理' : 'HR Manager' },
    { value: 'department_head', label: lang === 'zh' ? '部门负责人' : 'Department Head' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 导航栏 */}
      <Header 
        lang={lang} 
        onLanguageChange={handleLanguageChange} 
      />

      {/* 主内容 */}
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lang === 'zh' ? '子管理员管理' : 'Sub-admins Management'}
              </h1>
              <p className="text-gray-600">
                {lang === 'zh' ? '管理企业的下级管理员，分配相应权限' : 'Manage enterprise sub-admins and assign appropriate permissions'}
              </p>
            </div>

            {/* 操作栏 */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                {lang === 'zh' ? '添加子管理员' : 'Add Sub-admin'}
              </button>
            </div>

            {/* 子管理员列表 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {lang === 'zh' ? '姓名' : 'Name'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {lang === 'zh' ? '邮箱' : 'Email'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {lang === 'zh' ? '角色' : 'Role'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {lang === 'zh' ? '权限' : 'Permissions'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {lang === 'zh' ? '创建时间' : 'Created At'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {lang === 'zh' ? '状态' : 'Status'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {lang === 'zh' ? '操作' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subAdmins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{admin.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{admin.role}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {admin.permissions.map((permission) => {
                              const perm = permissionOptions.find(p => p.value === permission);
                              return (
                                <span key={permission} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  {perm?.label}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{admin.createdAt}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {admin.status === 'active' ? (lang === 'zh' ? '活跃' : 'Active') : (lang === 'zh' ? '非活跃' : 'Inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleToggleStatus(admin.id)}
                            className="text-primary hover:text-primary/80 mr-3"
                          >
                            {admin.status === 'active' ? (lang === 'zh' ? '禁用' : 'Disable') : (lang === 'zh' ? '启用' : 'Enable')}
                          </button>
                          <button
                            onClick={() => handleDeleteSubAdmin(admin.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            {lang === 'zh' ? '删除' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 空状态 */}
              {subAdmins.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {lang === 'zh' ? '暂无子管理员' : 'No Sub-admins Yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {lang === 'zh' ? '点击添加按钮创建您的第一个子管理员' : 'Click the add button to create your first sub-admin'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 添加子管理员模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {lang === 'zh' ? '添加子管理员' : 'Add Sub-admin'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    {lang === 'zh' ? '姓名' : 'Name'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder={lang === 'zh' ? '请输入姓名' : 'Please enter name'}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                    {lang === 'zh' ? '邮箱地址' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder={lang === 'zh' ? '请输入邮箱地址' : 'Please enter email address'}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">
                    {lang === 'zh' ? '角色' : 'Role'}
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  >
                    <option value="">{lang === 'zh' ? '请选择角色' : 'Please select role'}</option>
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {lang === 'zh' ? '权限' : 'Permissions'}
                  </label>
                  <div className="space-y-2">
                    {permissionOptions.map((permission) => (
                      <div key={permission.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`permission-${permission.value}`}
                          checked={formData.permissions.includes(permission.value)}
                          onChange={() => handlePermissionChange(permission.value)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor={`permission-${permission.value}`} className="ml-2 block text-sm text-gray-700">
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.permissions && (
                    <p className="text-red-500 text-sm mt-1">{errors.permissions}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting 
                    ? (lang === 'zh' ? '添加中...' : 'Adding...') 
                    : (lang === 'zh' ? '添加' : 'Add')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <Footer lang={lang} />
    </div>
  );
};

export default SubAdminsPage;