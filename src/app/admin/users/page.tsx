'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { UserData } from '@/lib/admin-types';

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ nationality: 'all', verified: 'all' });

  // 模拟获取用户数据
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.users);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleVerifyUser = async (userId: string, degreeVerified: boolean) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, degreeVerified }),
      });
      if (!response.ok) throw new Error('Failed to update verification status');
      
      // 更新本地状态
      setUsers(users.map(user => 
        user._id === userId ? { ...user, degreeVerified } : user
      ));
    } catch (err) {
      console.error('Error updating verification status:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesNationality = filter.nationality === 'all' || user.nationality === filter.nationality;
    const matchesVerified = filter.verified === 'all' || 
      (filter.verified === 'verified' && user.degreeVerified) ||
      (filter.verified === 'unverified' && !user.degreeVerified);
    return matchesNationality && matchesVerified;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* 使用统一的侧边栏组件 */}
        <AdminSidebar />
        
        {/* 主内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
              <p className="text-gray-600">管理所有用户信息和验证状态</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* 筛选器 */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">身份</label>
                  <select 
                    value={filter.nationality} 
                    onChange={(e) => setFilter({ ...filter, nationality: e.target.value })} 
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部</option>
                    <option value="chinese">中国</option>
                    <option value="foreign">外国</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">验证状态</label>
                  <select 
                    value={filter.verified} 
                    onChange={(e) => setFilter({ ...filter, verified: e.target.value })} 
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部</option>
                    <option value="verified">已验证</option>
                    <option value="unverified">未验证</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* 用户列表 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">用户列表</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">加载用户数据中...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-600">
                  <p>加载用户数据失败: {error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          用户名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          邮箱
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          国籍
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          学历验证
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          注册时间
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          上传文件
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user.nationality === 'chinese' ? '中国' : '外国'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.degreeVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {user.degreeVerified ? '已验证' : '未验证'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.files && user.files.length > 0 ? '是' : '否'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerifyUser(user._id, !user.degreeVerified)}
                                className={`px-3 py-1 rounded-md text-sm ${user.degreeVerified ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'} transition-colors`}
                              >
                                {user.degreeVerified ? '取消验证' : '验证'}
                              </button>
                              <Link href={`/admin/users/${user._id}`}>
                                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors">
                                  查看详情
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-600">没有符合条件的用户</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}