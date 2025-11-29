
import React from 'react';
import type { Resource } from '../types';
import { ResourceCard } from './ResourceCard';
import { InfoIcon } from './icons/InfoIcon';

interface ResultsDisplayProps {
  isLoading: boolean;
  error: string | null;
  resources: Resource[];
  hasSearched: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-slate-600 font-medium">Searching for resources...</p>
        <p className="text-sm text-slate-500">This may take a moment.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Error</p>
        <p>{message}</p>
    </div>
);

const NoResults: React.FC = () => (
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <InfoIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700">No Resources Found</h3>
        <p className="text-slate-500 mt-2">Try a different search term or category to find what you're looking for.</p>
    </div>
);


const InitialState: React.FC = () => (
     <div className="text-center p-8">
        <img src="https://picsum.photos/seed/royalcollege/500/300" alt="Illustration of a college campus" className="mx-auto rounded-lg mb-6 shadow-lg" />
        <h3 className="text-xl font-semibold text-slate-700">Ready to Explore?</h3>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">Use the search bar above to begin your journey into the resources of Royal College.</p>
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, error, resources, hasSearched }) => {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (!hasSearched) {
        return <InitialState />;
    }

    if (resources.length === 0) {
        return <NoResults />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
            ))}
        </div>
    );
};
