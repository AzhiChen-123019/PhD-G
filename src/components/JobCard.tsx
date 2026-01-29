'use client';

import React from 'react';

interface JobCardProps {
  job: {
    id: number | string;
    title: string;
    company?: string;
    location: string;
    salary: string;
    type: string;
    deadline: string;
  };
  lang: 'zh' | 'en';
  category: 'university' | 'enterprise';
  onViewDetails: (jobId: number | string) => void;
}

export default function JobCard({
  job,
  lang,
  category,
  onViewDetails,
}: JobCardProps) {
  const institutionOrCompany = job.company || '';
  const typeLabels: Record<string, Record<string, string>> = {
    zh: {
      professor: '教授/副教授',
      postdoc: '博士后研究员',
      researchAssistant: '研究助理教授',
      techDirector: '技术总监',
      chiefScientist: '首席科学家',
      rManager: '研发经理',
      researchScientist: '研究科学家',
    },
    en: {
      professor: 'Professor/Associate Professor',
      postdoc: 'Postdoctoral Researcher',
      researchAssistant: 'Research Assistant Professor',
      techDirector: 'Technical Director',
      chiefScientist: 'Chief Scientist',
      rManager: 'R&D Manager',
      researchScientist: 'Research Scientist',
    },
  };

  const typeLabel = typeLabels[lang][job.type as string] || job.type;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        {/* Job Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {job.title}
        </h3>
        
        {/* Institution/Company */}
        <p className="text-sm text-gray-600 mb-3">
          {institutionOrCompany}
        </p>
        
        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
          {/* Location */}
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
          
          {/* Salary */}
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.salary}
          </div>
          
          {/* Job Type */}
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {typeLabel}
          </div>
          
          {/* Deadline */}
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {job.deadline}
          </div>
        </div>
        
        {/* View Details Button */}
        <div className="mt-4">
          <button
            onClick={() => onViewDetails(job.id)}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            {lang === 'zh' ? '查看详情' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
}
