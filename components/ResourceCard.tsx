
import React from 'react';
import type { Resource } from '../types';
import { TagIcon } from './icons/TagIcon';

interface ResourceCardProps {
  resource: Resource;
}

const categoryColors: { [key: string]: string } = {
  'Academics': 'bg-blue-100 text-blue-800',
  'Sports': 'bg-green-100 text-green-800',
  'Clubs & Societies': 'bg-purple-100 text-purple-800',
  'Alumni': 'bg-yellow-100 text-yellow-800',
  'Facilities': 'bg-indigo-100 text-indigo-800',
  'Extracurricular': 'bg-pink-100 text-pink-800',
};

const getCategoryColor = (category: string) => {
    for (const key in categoryColors) {
        if (category.toLowerCase().includes(key.toLowerCase())) {
            return categoryColors[key];
        }
    }
    return 'bg-slate-100 text-slate-800';
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const colorClasses = getCategoryColor(resource.category);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-3">
            <TagIcon className="h-4 w-4 text-slate-400 mr-2" />
            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${colorClasses}`}>
                {resource.category}
            </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{resource.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{resource.summary}</p>
      </div>
    </div>
  );
};
