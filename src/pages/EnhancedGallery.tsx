import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '../components/SearchBar';
import { ImageGrid } from '../components/ImageGrid';
import { MetaTags } from '../components/SEO/MetaTags';
import { useImageSearch, useAvailableTags, useAvailableCategories, SearchFilters } from '../hooks/useImageSearch';
import { useFavorites } from '../hooks/useFavorites';
import { trackSearch, trackImageView, trackImageDownload } from '../utils/analytics';
import { ImageItem } from '../types/theme';

export const EnhancedGallery: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    tags: [],
    sortBy: 'relevance'
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [columns, setColumns] = useState<2 | 3 | 4 | 5>(4);
  
  // Hooks
  const availableTags = useAvailableTags();
  const availableCategories = useAvailableCategories();
  const { images, totalCount, hasMore, isLoading, loadMore } = useImageSearch(filters);
  const { favorites } = useFavorites();

  // Handle search
  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    trackSearch(newFilters.query, 0, newFilters);
  }, []);

  // Handle image interactions
  const handleImageClick = useCallback((image: ImageItem) => {
    trackImageView(image.id, image.category, image.source || 'unknown');
    // Open image in modal or navigate to detail page
    console.log('Image clicked:', image);
  }, []);

  const handleImageDownload = useCallback((image: ImageItem) => {
    trackImageDownload(image.id, image.category);
    
    // Create download link
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `${image.alt.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Infinite scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
        && hasMore && !isLoading
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, loadMore]);

  return (
    <>
      <MetaTags
        title="이미지 갤러리 - 모든 테마 탐색"
        description={`${totalCount.toLocaleString()}개의 고품질 이미지를 64개 테마에서 탐색하세요. 검색, 필터링, 즐겨찾기 기능을 지원합니다.`}
        keywords={['이미지 갤러리', '검색', '필터링', ...availableTags.slice(0, 10)]}
      />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              이미지 갤러리
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {totalCount.toLocaleString()}개의 큐레이션된 이미지를 탐색하세요
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {totalCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">총 이미지</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {availableCategories.length}
                </div>
                <div className="text-sm text-gray-500">테마</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {favorites.length}
                </div>
                <div className="text-sm text-gray-500">즐겨찾기</div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SearchBar
              onSearch={handleSearch}
              availableCategories={availableCategories}
              availableTags={availableTags}
              totalResults={totalCount}
            />
          </motion.div>

          {/* Grid Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="text-sm text-gray-600">
              {images.length.toLocaleString()} / {totalCount.toLocaleString()} 이미지 로드됨
            </div>
            
            <div className="flex items-center gap-4">
              {/* View mode toggle */}
              <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Column controls for grid view */}
              {viewMode === 'grid' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">컬럼:</span>
                  <div className="flex gap-1">
                    {[2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setColumns(num as 2 | 3 | 4 | 5)}
                        className={`w-8 h-8 rounded-md text-sm transition-colors ${
                          columns === num
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {images.length > 0 ? (
              <ImageGrid
                images={images}
                columns={columns}
                onImageClick={handleImageClick}
                onDownload={handleImageDownload}
              />
            ) : isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <span className="ml-4 text-gray-600">이미지를 불러오는 중...</span>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600 mb-4">
                  다른 검색어나 필터를 시도해보세요
                </p>
                <button
                  onClick={() => setFilters({ query: '', categories: [], tags: [], sortBy: 'relevance' })}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  모든 이미지 보기
                </button>
              </div>
            )}

            {/* Loading indicator for infinite scroll */}
            {isLoading && images.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="ml-2 text-gray-600">더 많은 이미지를 불러오는 중...</span>
              </div>
            )}

            {/* End of results */}
            {!hasMore && images.length > 0 && (
              <div className="text-center py-8 border-t border-gray-200">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-gray-600">
                  모든 이미지를 확인했습니다! ({images.length.toLocaleString()}개)
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};