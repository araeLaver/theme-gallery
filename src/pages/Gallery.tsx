import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, BarChart3, Loader2 } from 'lucide-react';
import { themes } from '../data/themes';
import { ImageGrid } from '../components/ImageGrid';
import { ImageItem } from '../types/theme';
import { generateRandomImages, searchImages } from '../utils/imageGenerator';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { downloadImage } from '../utils/imageDownloader';
import { ToastContainer, useToast } from '../components/Toast';

const Gallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [stats, setStats] = useState({ totalImages: 0, totalThemes: themes.length });
  const [isDownloading, setIsDownloading] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const pageSize = 24;
  const categories = useMemo(() => 
    ['all', ...themes.map(theme => theme.id)], 
    []
  );

  // 초기 이미지 로드
  useEffect(() => {
    loadInitialImages();
  }, [selectedCategory, searchTerm, sortBy]);

  const loadInitialImages = async () => {
    setIsLoading(true);
    setCurrentPage(1);
    
    try {
      let newImages: ImageItem[] = [];
      
      if (searchTerm) {
        // 검색 모드
        if (selectedCategory === 'all') {
          // 모든 테마에서 검색
          for (const theme of themes) {
            const searchResults = searchImages(theme.id, searchTerm, 1, 10);
            newImages = [...newImages, ...searchResults];
          }
        } else {
          newImages = searchImages(selectedCategory, searchTerm, 1, pageSize);
        }
      } else {
        // 일반 모드
        if (selectedCategory === 'all') {
          // 모든 테마에서 이미지 가져오기
          for (const theme of themes.slice(0, 10)) { // 처음 10개 테마만
            const themeImages = generateRandomImages(theme.id, 5);
            newImages = [...newImages, ...themeImages];
          }
        } else {
          newImages = generateRandomImages(selectedCategory, pageSize);
        }
      }

      // 정렬 적용
      newImages = sortImages(newImages, sortBy);
      
      setImages(newImages);
      setHasMoreData(newImages.length === pageSize);
      
      // 통계 업데이트
      const totalImages = themes.reduce((acc, theme) => acc + 100, 0);
      setStats({ totalImages, totalThemes: themes.length });
      
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreImages = async () => {
    if (isLoading || !hasMoreData) return;
    
    setIsLoading(true);
    const nextPage = currentPage + 1;
    
    try {
      let newImages: ImageItem[] = [];
      
      if (searchTerm) {
        if (selectedCategory === 'all') {
          for (const theme of themes) {
            const searchResults = searchImages(theme.id, searchTerm, nextPage, 5);
            newImages = [...newImages, ...searchResults];
          }
        } else {
          newImages = searchImages(selectedCategory, searchTerm, nextPage, pageSize);
        }
      } else {
        if (selectedCategory === 'all') {
          const startThemeIndex = (nextPage - 1) * 10;
          const endThemeIndex = Math.min(startThemeIndex + 10, themes.length);
          
          for (let i = startThemeIndex; i < endThemeIndex; i++) {
            if (themes[i]) {
              const themeImages = generateRandomImages(themes[i].id, 5);
              newImages = [...newImages, ...themeImages];
            }
          }
        } else {
          const startIndex = (nextPage - 1) * pageSize;
          const allThemeImages = generateRandomImages(selectedCategory, 100);
          newImages = allThemeImages.slice(startIndex, startIndex + pageSize);
        }
      }

      newImages = sortImages(newImages, sortBy);
      
      if (newImages.length > 0) {
        setImages(prev => [...prev, ...newImages]);
        setCurrentPage(nextPage);
        setHasMoreData(newImages.length === pageSize || (selectedCategory === 'all' && nextPage * 10 < themes.length));
      } else {
        setHasMoreData(false);
      }
      
    } catch (error) {
      console.error('Error loading more images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortImages = (imagesToSort: ImageItem[], sortOption: string): ImageItem[] => {
    switch (sortOption) {
      case 'popular':
        return [...imagesToSort].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'name':
        return [...imagesToSort].sort((a, b) => a.alt.localeCompare(b.alt));
      case 'newest':
      default:
        return imagesToSort; // Already in newest order
    }
  };

  // 이미지 다운로드 핸들러
  const handleImageDownload = async (image: ImageItem) => {
    setIsDownloading(true);
    try {
      const success = await downloadImage(image);
      if (success) {
        showSuccess('다운로드 완료', `"${image.alt}" 이미지가 다운로드되었습니다.`);
      } else {
        showError('다운로드 실패', '이미지 다운로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('다운로드 에러:', error);
      showError('다운로드 오류', '이미지 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  // 무한 스크롤 훅 사용
  useInfiniteScroll({
    hasMoreData,
    isLoading,
    onLoadMore: loadMoreImages,
    threshold: 100
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Complete Gallery
          </h1>
          
          {/* Stats Section */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.totalImages.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.totalThemes}</div>
              <div className="text-sm text-gray-500">Themes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{images.length}</div>
              <div className="text-sm text-gray-500">Loaded</div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search from thousands of high-quality images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter and View Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Category Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="text-gray-600" size={20} />
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {categories.slice(0, 15).map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category === 'all' ? 'All' : themes.find(t => t.id === category)?.name || category}
                    </button>
                  ))}
                  {categories.length > 15 && (
                    <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                      +{categories.length - 15} more
                    </button>
                  )}
                </div>
              </div>

              {/* View and Sort Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'name')}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="name">Name A-Z</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Stats Toggle */}
                <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                  <BarChart3 size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {images.length > 0 ? (
            <>
              <ImageGrid 
                images={images} 
                onDownload={handleImageDownload}
                showActions={true}
              />
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="animate-spin text-purple-600" size={32} />
                  <span className="ml-2 text-gray-600">Loading more amazing images...</span>
                </div>
              )}
              
              {/* End of Results */}
              {!hasMoreData && images.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">You've reached the end! 🎉</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Showing {images.length} images from our collection
                  </p>
                </div>
              )}
            </>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-purple-600" size={32} />
              <span className="ml-2 text-gray-600">Loading beautiful images...</span>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No images found matching your criteria</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Gallery;