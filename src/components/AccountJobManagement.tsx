'use client';

import React, { useState } from 'react';
import { Job, JobFavorite, JobApplication } from '../lib/job-model';
import { JobCard } from './JobUIComponents';

/**
 * 申请状态标签组件
 */
const ApplicationStatusBadge: React.FC<{
  status: JobApplication['status'];
}> = ({ status }) => {
  const statusConfig = {
    pending: {
      label: '待处理',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    },
    reviewed: {
      label: '已审核',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    accepted: {
      label: '已通过',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    rejected: {
      label: '已拒绝',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
      {config.label}
    </span>
  );
};

/**
 * 岗位管理标签页组件
 */
export const JobManagementTabs: React.FC<{
  activeTab: 'favorites' | 'applications';
  onTabChange: (tab: 'favorites' | 'applications') => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        <button
          onClick={() => onTabChange('favorites')}
          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'favorites' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          我的收藏
        </button>
        <button
          onClick={() => onTabChange('applications')}
          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'applications' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          我的申请
        </button>
      </nav>
    </div>
  );
};

/**
 * 我的收藏页面组件
 */
export const FavoritesPage: React.FC<{
  favorites: JobFavorite[];
  onRemoveFavorite: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
}> = ({ favorites, onRemoveFavorite, onViewDetails }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">我的收藏</h2>
      
      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-600 mb-4">您还没有收藏任何岗位</p>
          <p className="text-sm text-gray-500">
            在浏览岗位时，点击收藏按钮可以将感兴趣的岗位保存到这里
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((favorite) => (
            <JobCard
              key={favorite.id}
              job={favorite.job}
              onViewDetails={onViewDetails}
              showFavoriteButton={true}
              isFavorite={true}
              onToggleFavorite={() => onRemoveFavorite(favorite.jobId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 我的申请页面组件
 */
export const ApplicationsPage: React.FC<{
  applications: JobApplication[];
  onViewDetails: (jobId: string) => void;
}> = ({ applications, onViewDetails }) => {
  // 按申请时间倒序排序
  const sortedApplications = [...applications].sort((a, b) => 
    new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">我的申请</h2>
      
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 mb-4">您还没有申请任何岗位</p>
          <p className="text-sm text-gray-500">
            在岗位详情页点击“立即申请”可以提交申请
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{application.job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{application.job.company}</p>
                </div>
                <ApplicationStatusBadge status={application.status} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">地点:</span> {application.job.location}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">薪资:</span> {application.job.salary}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">申请时间:</span> {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">状态更新:</span> {new Date(application.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => onViewDetails(application.jobId)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 岗位管理页面主组件
 */
export const JobManagementPage: React.FC<{
  favorites: JobFavorite[];
  applications: JobApplication[];
  onRemoveFavorite: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
}> = ({ favorites, applications, onRemoveFavorite, onViewDetails }) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'applications'>('favorites');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <JobManagementTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {activeTab === 'favorites' ? (
        <FavoritesPage
          favorites={favorites}
          onRemoveFavorite={onRemoveFavorite}
          onViewDetails={onViewDetails}
        />
      ) : (
        <ApplicationsPage
          applications={applications}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
};

/**
 * 岗位详情页收藏按钮组件
 */
export const JobDetailFavoriteButton: React.FC<{
  job: Job;
  isFavorite: boolean;
  onToggleFavorite: (job: Job) => void;
  isLoading: boolean;
}> = ({ job, isFavorite, onToggleFavorite, isLoading }) => {
  return (
    <button
      onClick={() => onToggleFavorite(job)}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium ${
        isFavorite 
          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <svg 
          className="h-5 w-5" 
          fill={isFavorite ? "currentColor" : "none"} 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
      {isFavorite ? '取消收藏' : '收藏岗位'}
    </button>
  );
};

/**
 * 岗位详情页申请按钮组件
 */
export const JobDetailApplyButton: React.FC<{
  job: Job;
  onApply: () => void;
  isApplying: boolean;
  isApplied: boolean;
  applicationStatus?: JobApplication['status'];
}> = ({ job, onApply, isApplying, isApplied, applicationStatus }) => {
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);

  const handleApplyClick = () => {
    setShowApplyConfirm(true);
  };

  const confirmApply = () => {
    onApply();
    setShowApplyConfirm(false);
  };

  const cancelApply = () => {
    setShowApplyConfirm(false);
  };

  return (
    <div>
      {!isApplied ? (
        <button
          onClick={handleApplyClick}
          disabled={isApplying}
          className={`px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-semibold ${
            isApplying ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isApplying ? '申请中...' : '立即申请'}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <ApplicationStatusBadge status={applicationStatus || 'pending'} />
          <span className="text-sm text-gray-600">您已申请该岗位</span>
        </div>
      )}

      {/* 申请确认对话框 */}
      {showApplyConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">确认申请</h3>
            <p className="text-gray-600 mb-4">
              确定要申请「{job.title}」岗位吗？
            </p>
            <p className="text-sm text-gray-500 mb-4">
              申请提交后，您可以在「个人中心 - 我的申请」中查看申请状态
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelApply}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmApply}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                确认申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};