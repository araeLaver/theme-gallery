import React, { useState } from 'react';
import { ImageItem } from '../types/theme';
import { LazyImage } from './LazyImage';
import { useFavorites } from '../hooks/useFavorites';

interface ImageGridProps {
  images: ImageItem[];
  columns?: 2 | 3 | 4 | 5;
  gap?: 2 | 4 | 6 | 8;
  showActions?: boolean;
  onImageClick?: (image: ImageItem) => void;
  onDownload?: (image: ImageItem) => void;
  className?: string;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 4,
  gap = 4,
  showActions = true,
  onImageClick,
  onDownload,
  className = ''
}) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, addToRecentViews } = useFavorites();

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  };

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  const handleImageClick = (image: ImageItem) => {
    addToRecentViews(image.id);
    onImageClick?.(image);
  };

  const handleDownload = (e: React.MouseEvent, image: ImageItem) => {
    e.stopPropagation();
    onDownload?.(image);
  };

  const handleFavoriteToggle = (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    toggleFavorite(imageId);
  };

  return (
    <div className={`grid ${gridCols[columns]} ${gapClasses[gap]} ${className}`}>
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          onMouseEnter={() => setHoveredImage(image.id)}
          onMouseLeave={() => setHoveredImage(null)}
          onClick={() => handleImageClick(image)}
        >
          {/* Image container */}
          <div className="relative">
            <LazyImage
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover"
              quality="medium"
            />

            {/* New badge */}
            {image.isNew && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse-glow">
                NEW
              </div>
            )}

            {/* Actions overlay */}
            {showActions && (
              <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${
                hoveredImage === image.id ? 'bg-opacity-30' : 'bg-opacity-0'
              }`}>
                <div className={`absolute inset-0 flex items-center justify-center space-x-2 transition-opacity duration-200 ${
                  hoveredImage === image.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  {/* Favorite button */}
                  <button
                    onClick={(e) => handleFavoriteToggle(e, image.id)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite(image.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white bg-opacity-80 text-gray-700 hover:bg-red-500 hover:text-white'
                    }`}
                    title={isFavorite(image.id) ? '즐겨찾기 제거' : '즐겨찾기 추가'}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Download button */}
                  <button
                    onClick={(e) => handleDownload(e, image)}
                    className="p-2 rounded-full bg-white bg-opacity-80 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                    title="다운로드"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Image info */}
          <div className="p-3">
            <h3 className="font-medium text-gray-900 truncate text-sm mb-1">
              {image.alt}
            </h3>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {image.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="capitalize">{image.category}</span>
              {image.likes && (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>{image.likes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};