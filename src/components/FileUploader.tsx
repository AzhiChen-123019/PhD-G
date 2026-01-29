'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FileUploaderProps {
  fileType: 'resume' | 'degree' | 'other';
  label: string;
  onUploadSuccess?: (file: any) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ fileType, label, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    if (!token) {
      setError('Please login first');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      setUploadSuccess(true);
      if (onUploadSuccess) {
        onUploadSuccess(data.file);
      }
      
      // 重置表单
      setTimeout(() => {
        setFile(null);
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {label}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <input
            type="file"
            className="hidden"
            id={`file-${fileType}`}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label 
            htmlFor={`file-${fileType}`} 
            className="cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-gray-400 mb-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              <p className="text-sm text-gray-600">
                {file ? `Selected: ${file.name}` : 'Click to upload file'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports PDF, DOC, DOCX, JPG, PNG (max 10MB)
              </p>
            </div>
          </label>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        
        {uploadSuccess && (
          <p className="mt-2 text-sm text-green-600">File uploaded successfully!</p>
        )}
        
        <button
          type="submit"
          className="mt-4 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
    </div>
  );
};