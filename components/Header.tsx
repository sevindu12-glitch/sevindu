import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <div className="bg-blue-600 p-3 rounded-lg mr-4">
            <BookOpenIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            R/EMB/ROYAL COLLEGE
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Physical resource management system
          </p>
        </div>
      </div>
    </header>
  );
};
