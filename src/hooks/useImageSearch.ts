import { useState, useMemo, useEffect } from 'react';
import { ImageItem } from '../types/theme';
import { themeImages } from '../data/themes';

export interface SearchFilters {
  query: string;
  categories: string[];
  tags: string[];
  orientation?: 'landscape' | 'portrait' | 'square';
  sortBy: 'relevance' | 'newest' | 'popular' | 'random';
  isNew?: boolean;
}

export interface SearchResult {
  images: ImageItem[];
  totalCount: number;
  hasMore: boolean;
}

export const useImageSearch = (filters: SearchFilters, pageSize: number = 24) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.query, filters.categories, filters.tags, filters.orientation, filters.sortBy, filters.isNew]);

  const searchResult = useMemo(() => {
    setIsLoading(true);

    // Get all images from all themes
    const allImages: ImageItem[] = [];
    Object.entries(themeImages).forEach(([theme, images]) => {
      allImages.push(...images.map(img => ({ ...img, category: theme })));
    });

    let filteredImages = allImages;

    // Apply text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      filteredImages = filteredImages.filter(img => 
        img.alt.toLowerCase().includes(query) ||
        img.tags.some(tag => tag.toLowerCase().includes(query)) ||
        img.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filteredImages = filteredImages.filter(img => 
        filters.categories.includes(img.category)
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filteredImages = filteredImages.filter(img => 
        filters.tags.some(tag => img.tags.includes(tag))
      );
    }

    // Apply orientation filter
    if (filters.orientation) {
      filteredImages = filteredImages.filter(img => 
        img.orientation === filters.orientation
      );
    }

    // Apply new images filter
    if (filters.isNew) {
      filteredImages = filteredImages.filter(img => img.isNew === true);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filteredImages.sort((a, b) => {
          if (a.dateAdded && b.dateAdded) {
            return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
          }
          return 0;
        });
        break;
      case 'popular':
        filteredImages.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'random':
        filteredImages.sort(() => Math.random() - 0.5);
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
        break;
    }

    const totalCount = filteredImages.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const images = filteredImages.slice(0, endIndex); // Load progressively
    const hasMore = endIndex < totalCount;

    setIsLoading(false);

    return {
      images,
      totalCount,
      hasMore
    };
  }, [filters, currentPage, pageSize]);

  const loadMore = () => {
    if (searchResult.hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const reset = () => {
    setCurrentPage(1);
  };

  return {
    ...searchResult,
    isLoading,
    loadMore,
    reset,
    currentPage
  };
};

// Get all available tags for filter options
export const useAvailableTags = () => {
  return useMemo(() => {
    const allTags = new Set<string>();
    Object.values(themeImages).forEach(images => {
      images.forEach(img => {
        img.tags.forEach(tag => allTags.add(tag));
      });
    });
    return Array.from(allTags).sort();
  }, []);
};

// Get all available categories
export const useAvailableCategories = () => {
  return useMemo(() => {
    return Object.keys(themeImages).sort();
  }, []);
};