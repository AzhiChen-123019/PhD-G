'use client';

import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  lang: 'zh' | 'en';
}

const PageTitle: React.FC<PageTitleProps> = ({ title, description, lang }) => {
  return (
    <div className="text-center mb-8 mt-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      {description && (
        <p className="text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageTitle;