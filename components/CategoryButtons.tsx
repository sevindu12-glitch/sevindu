
import React from 'react';

interface CategoryButtonsProps {
  onCategoryClick: (category: string) => void;
  disabled: boolean;
}

const categories = ['Academics', 'Sports', 'Clubs & Societies', 'Alumni', 'Facilities'];

export const CategoryButtons: React.FC<CategoryButtonsProps> = ({ onCategoryClick, disabled }) => {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-500 mr-2">Popular:</span>
        {categories.map((category) => (
            <button
                key={category}
                onClick={() => onCategoryClick(category)}
                disabled={disabled}
                className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                {category}
            </button>
        ))}
    </div>
  );
};
