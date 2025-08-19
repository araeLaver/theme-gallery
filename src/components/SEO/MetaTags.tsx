import React, { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  siteName?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = '테마 갤러리 - 큐레이션된 이미지 라이브러리',
  description = '64개 테마로 분류된 고품질 이미지를 탐색하고 다운로드하세요. 매주 새로운 이미지가 업데이트됩니다. 크리에이터를 위한 무료 스톡 이미지.',
  keywords = ['이미지', '스톡포토', '무료이미지', '테마', '갤러리', '크리에이터', '디자인', 'Unsplash', 'Pexels'],
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = '테마 갤러리',
  locale = 'ko_KR',
  siteName = '테마 갤러리'
}) => {
  const fullTitle = title.includes('테마 갤러리') ? title : `${title} | 테마 갤러리`;
  const canonicalUrl = url.split('?')[0];

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      let selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          (meta as HTMLMetaElement).setAttribute('property', name);
        } else {
          (meta as HTMLMetaElement).setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      (meta as HTMLMetaElement).setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('author', author);

    // Open Graph
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', canonicalUrl, true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

  }, [fullTitle, description, keywords, author, type, image, canonicalUrl]);

  return null; // No JSX needed since we're updating DOM directly
};

// Theme-specific meta tags
export const ThemeMetaTags: React.FC<{
  themeId: string;
  themeName: string;
  themeDescription: string;
  imageCount: number;
  coverImage: string;
}> = ({ themeId, themeName, themeDescription, imageCount, coverImage }) => {
  return (
    <MetaTags
      title={`${themeName} 이미지 컬렉션`}
      description={`${themeDescription} - ${imageCount}개의 고품질 ${themeName.toLowerCase()} 이미지를 무료로 다운로드하세요.`}
      keywords={[themeName.toLowerCase(), '이미지', '스톡포토', '무료다운로드', themeId]}
      image={coverImage}
      type="article"
    />
  );
};

// Image-specific meta tags
export const ImageMetaTags: React.FC<{
  imageId: string;
  imageAlt: string;
  imageSrc: string;
  category: string;
  tags: string[];
}> = ({ imageId, imageAlt, imageSrc, category, tags }) => {
  return (
    <MetaTags
      title={`${imageAlt} - ${category} 이미지`}
      description={`고품질 ${category} 이미지 "${imageAlt}"를 무료로 다운로드하세요. ${tags.join(', ')} 관련 이미지입니다.`}
      keywords={[...tags, category, '무료이미지', '고화질', '다운로드']}
      image={imageSrc}
      type="article"
    />
  );
};