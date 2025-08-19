import React, { useState, useEffect } from 'react';
import { SearchFilters } from '../hooks/useImageSearch';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  availableCategories: string[];
  availableTags: string[];
  totalResults: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  availableCategories,
  availableTags,
  totalResults
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'square' | ''>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'popular' | 'random'>('relevance');
  const [isNew, setIsNew] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({
        query,
        categories: selectedCategories,
        tags: selectedTags,
        orientation: orientation || undefined,
        sortBy,
        isNew
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategories, selectedTags, orientation, sortBy, isNew, onSearch]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setOrientation('');
    setSortBy('relevance');
    setIsNew(false);
  };

  const activeFiltersCount = selectedCategories.length + selectedTags.length + 
    (orientation ? 1 : 0) + (isNew ? 1 : 0) + (sortBy !== 'relevance' ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Main search bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이미지를 검색해보세요... (예: 자연, 비즈니스, 음식)"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-md border transition-colors ${
            showFilters 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            필터
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                {activeFiltersCount}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 mb-4">
        {totalResults.toLocaleString()}개의 이미지를 찾았습니다
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          {/* Sort and Special filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">정렬:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="relevance">관련도</option>
                <option value="newest">최신순</option>
                <option value="popular">인기순</option>
                <option value="random">랜덤</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">방향:</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="">전체</option>
                <option value="landscape">가로</option>
                <option value="portrait">세로</option>
                <option value="square">정사각형</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-green-600 font-medium">새로운 이미지만</span>
            </label>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                모든 필터 지우기
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">카테고리</h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Popular tags */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">인기 태그</h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableTags.slice(0, 30).map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};