import React, { useState, useEffect } from 'react';
import { imageUpdater } from '../utils/imageUpdater';
import { ImageItem } from '../types/theme';

interface NewImagesBannerProps {
  onViewNewImages?: () => void;
}

export const NewImagesBanner: React.FC<NewImagesBannerProps> = ({ onViewNewImages }) => {
  const [hasNewImages, setHasNewImages] = useState(false);
  const [newImagesCount, setNewImagesCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkForNewImages();
  }, []);

  const checkForNewImages = () => {
    const stored = imageUpdater.getStoredWeeklyImages();
    if (stored && imageUpdater.hasNewImagesForWeek()) {
      const totalNewImages = Object.values(stored.images).reduce(
        (total, images) => total + images.length, 
        0
      );
      setNewImagesCount(totalNewImages);
      setHasNewImages(true);
      setIsVisible(true);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleViewImages = () => {
    onViewNewImages?.();
    setIsVisible(false);
  };

  if (!hasNewImages || !isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-4 animate-slide-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <h3 className="text-sm font-semibold">새로운 이미지 업데이트!</h3>
          </div>
          <p className="text-xs text-blue-100 mb-3">
            이번 주 {newImagesCount}개의 신규 이미지가 추가되었습니다
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleViewImages}
              className="bg-white text-blue-600 text-xs px-3 py-1 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              새 이미지 보기
            </button>
            <button
              onClick={handleClose}
              className="text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-300 hover:bg-blue-500 transition-colors"
            >
              나중에
            </button>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="ml-2 text-blue-200 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// 새 이미지 섹션 컴포넌트
export const NewImagesSection: React.FC = () => {
  const [newImages, setNewImages] = useState<Record<string, ImageItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNewImages();
  }, []);

  const loadNewImages = () => {
    const stored = imageUpdater.getStoredWeeklyImages();
    if (stored) {
      setNewImages(stored.images);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">새 이미지를 불러오는 중...</p>
      </div>
    );
  }

  const totalNewImages = Object.values(newImages).reduce((total, images) => total + images.length, 0);

  if (totalNewImages === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">이번 주 새로운 이미지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">이번 주 새로운 이미지</h2>
        <p className="text-gray-600">총 {totalNewImages}개의 새로운 이미지가 추가되었습니다</p>
      </div>

      {Object.entries(newImages).map(([theme, images]) => (
        images.length > 0 && (
          <div key={theme} className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
              {theme} ({images.length}개)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    NEW
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};