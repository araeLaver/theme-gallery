import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMoreData: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasMoreData,
  isLoading,
  onLoadMore,
  threshold = 100
}: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (
      scrollTop + clientHeight >= scrollHeight - threshold &&
      hasMoreData &&
      !isLoading &&
      !isFetching
    ) {
      setIsFetching(true);
      onLoadMore();
    }
  }, [hasMoreData, isLoading, isFetching, onLoadMore, threshold]);

  useEffect(() => {
    if (!isFetching) return;
    
    const timer = setTimeout(() => {
      setIsFetching(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isFetching]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { isFetching };
};

export default useInfiniteScroll;