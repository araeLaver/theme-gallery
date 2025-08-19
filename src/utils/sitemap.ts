import { themes, themeImages } from '../data/themes';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const generateSitemap = (): SitemapUrl[] => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://theme-gallery.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [];

  // Main pages
  urls.push(
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/gallery`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5
    }
  );

  // Theme pages
  themes.forEach(theme => {
    urls.push({
      loc: `${baseUrl}/theme/${theme.id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  // Individual image pages (if implemented)
  Object.entries(themeImages).forEach(([themeId, images]) => {
    images.forEach(image => {
      urls.push({
        loc: `${baseUrl}/image/${image.id}`,
        lastmod: image.dateAdded || currentDate,
        changefreq: 'monthly',
        priority: 0.6
      });
    });
  });

  // Search and filter pages
  const popularSearchTerms = [
    'nature', 'business', 'technology', 'food', 'travel',
    'fashion', 'health', 'education', 'abstract', 'minimal'
  ];

  popularSearchTerms.forEach(term => {
    urls.push({
      loc: `${baseUrl}/search?q=${encodeURIComponent(term)}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  return urls;
};

export const generateSitemapXML = (urls: SitemapUrl[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urlEntries = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return `${xmlHeader}\n${urlsetOpen}${urlEntries}\n${urlsetClose}`;
};

export const generateRobotsTxt = (): string => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://theme-gallery.com';
  
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /*.json$
Disallow: /*?*api_key=*

# Specific crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (seconds)
Crawl-delay: 1`;
};

// Generate structured data for search results
export const generateImageStructuredData = (images: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "테마 갤러리 이미지 컬렉션",
    "description": "64개 테마로 분류된 고품질 이미지 컬렉션",
    "url": `${process.env.REACT_APP_BASE_URL || 'https://theme-gallery.com'}/gallery`,
    "image": images.slice(0, 10).map(img => ({
      "@type": "ImageObject",
      "contentUrl": img.src,
      "name": img.alt,
      "description": img.alt,
      "thumbnailUrl": img.src,
      "keywords": img.tags.join(', '),
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "creditText": img.photographer || "테마 갤러리",
      "creator": {
        "@type": "Person",
        "name": img.photographer || "테마 갤러리"
      }
    })),
    "numberOfImages": images.length,
    "about": themes.map(theme => theme.name).join(', ')
  };
};

export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};