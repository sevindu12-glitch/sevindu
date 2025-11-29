import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { CategoryButtons } from './CategoryButtons';
import { ResultsDisplay } from './ResultsDisplay';
import { findResources } from '../services/geminiService';
import type { Resource } from '../types';

const ResourceFinder: React.FC = () => {
    const [query, setQuery] = useState('');
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const performSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        setResources([]); // Clear previous results

        try {
            const results = await findResources(searchQuery);
            setResources(results);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
            setResources([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(query);
    };

    const handleCategoryClick = (category: string) => {
        setQuery(category);
        performSearch(category);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-2">Resource Finder</h2>
            <p className="text-slate-600 mb-6">
                Discover various resources available at Royal College. Use the search bar for specific queries or explore popular categories.
            </p>
            <div className="mb-6">
                <SearchBar
                    query={query}
                    setQuery={setQuery}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
                <CategoryButtons
                    onCategoryClick={handleCategoryClick}
                    disabled={isLoading}
                />
            </div>
            <div className="mt-8">
                <ResultsDisplay
                    isLoading={isLoading}
                    error={error}
                    resources={resources}
                    hasSearched={hasSearched}
                />
            </div>
        </div>
    );
};

export default ResourceFinder;
