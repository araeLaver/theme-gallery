export const getOptimizedImageUrl = (originalUrl: string, size: 'thumbnail' | 'medium' | 'large' | 'xlarge' = 'medium'): string => {
  const sizeMap = {
    thumbnail: 400,
    medium: 800,
    large: 1200,
    xlarge: 1920
  };

  const targetWidth = sizeMap[size];

  // Unsplash
  if (originalUrl.includes('images.unsplash.com')) {
    return `${originalUrl.split('?')[0]}?w=${targetWidth}&q=80&fm=webp&fit=crop&crop=entropy`;
  } 
  
  // Pexels
  if (originalUrl.includes('images.pexels.com')) {
    return `${originalUrl.split('?')[0]}?auto=compress&cs=tinysrgb&w=${targetWidth}&h=${targetWidth}&dpr=1`;
  }
  
  // Pixabay
  if (originalUrl.includes('cdn.pixabay.com')) {
    const baseName = originalUrl.split('_960_720.jpg')[0];
    if (size === 'thumbnail') return `${baseName}_640_480.jpg`;
    if (size === 'medium') return `${baseName}_960_720.jpg`;
    if (size === 'large') return `${baseName}_1280_960.jpg`;
    return `${baseName}_1920_1080.jpg`;
  }
  
  // Lorem Picsum
  if (originalUrl.includes('picsum.photos')) {
    return `https://picsum.photos/${targetWidth}/${targetWidth}?${originalUrl.includes('random') ? originalUrl.split('random=')[1] : 'random'}`;
  }

  // Burst by Shopify
  if (originalUrl.includes('burst.shopifycdn.com')) {
    return `${originalUrl}?width=${targetWidth}&format=webp&quality=80`;
  }

  // StockVault
  if (originalUrl.includes('stockvault.net')) {
    return originalUrl; // StockVault uses direct links
  }

  // Gratisography
  if (originalUrl.includes('gratisography.com')) {
    return originalUrl; // Direct links
  }

  // Kaboompics
  if (originalUrl.includes('kaboompics.com')) {
    return originalUrl; // Direct links
  }

  // Life of Pix
  if (originalUrl.includes('lifeofpix.com')) {
    return originalUrl; // Direct links
  }

  // Freepik (placeholder for future implementation)
  if (originalUrl.includes('freepik.com')) {
    return originalUrl;
  }

  return originalUrl;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const createImageSrcSet = (baseUrl: string): string => {
  const thumbnail = getOptimizedImageUrl(baseUrl, 'thumbnail');
  const medium = getOptimizedImageUrl(baseUrl, 'medium');
  const large = getOptimizedImageUrl(baseUrl, 'large');
  
  return `${thumbnail} 400w, ${medium} 800w, ${large} 1200w`;
};

export const getImageSizes = (): string => {
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
};