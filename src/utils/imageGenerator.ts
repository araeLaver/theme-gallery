import { ImageItem } from '../types/theme';

// 다양한 이미지 소스 풀
const imageSources = {
  unsplash: 'https://images.unsplash.com',
  pexels: 'https://images.pexels.com/photos',
  pixabay: 'https://cdn.pixabay.com/photo',
  picsum: 'https://picsum.photos',
  burst: 'https://burst.shopifycdn.com',
  stockvault: 'https://www.stockvault.net',
  gratisography: 'https://gratisography.com',
  kaboompics: 'https://kaboompics.com',
  lifeofpix: 'https://www.lifeofpix.com'
};

// 테마별 키워드와 이미지 ID 풀
const themeKeywords = {
  nature: {
    keywords: ['mountain', 'forest', 'lake', 'waterfall', 'sunset', 'tree', 'landscape', 'meadow', 'canyon', 'beach', 'river', 'valley', 'cliff', 'flowers', 'grass', 'rocks', 'sky', 'clouds', 'path', 'wilderness'],
    unsplashIds: ['1506905925346-21bda4d32df4', '1472214103451-9374bd1c798e', '1441974231531-c6227db76b6e', '1426604966848-d7adac402bff', '1470770841072-f978cf4d019e', '1502082553048-f009c37129b9', '1518173946687-a4c8892bbd9f', '1475924156734-496f6cac6ec1', '1464822759844-d150baec0494', '1439066615861-d1af74d74000'],
    pexelsIds: ['414612', '1029604', '355321', '1421903', '1285625', '1170986', '326900', '840667', '1029618', '699558', '1301856', '416778', '1158519', '1437037', '1574169'],
    pixabayIds: ['1758197_960_720', '1197753_960_720', '931706_960_720', '3082832_960_720', '2836301_960_720', '1477041_960_720', '1014712_960_720', '841441_960_720', '2373727_960_720', '2557568_960_720']
  },
  urban: {
    keywords: ['city', 'skyline', 'building', 'street', 'architecture', 'night', 'lights', 'bridge', 'skyscraper', 'downtown', 'traffic', 'metro', 'urban', 'concrete', 'glass', 'modern', 'highway', 'construction', 'apartment', 'commercial'],
    unsplashIds: ['1449824913935-59a10b8d2000', '1480714378408-67cf0d13bc1b', '1514565131-fce0801e5785', '1477959858617-67f85cf4f1df', '1519501025264-65ba15a82390', '1513407030348-c983a97b98d8', '1496442226666-8d4d0e62e6e9', '1514214246283-d427a95c5d2f', '1487958449943-2429e8be8625', '1494526585095-c41746248156'],
    pexelsIds: ['466685', '443383', '257700', '2079246', '1170412', '1396122', '267350', '159306', '1435752', '325185', '1105666', '2004161', '373543', '574071', '1181244'],
    pixabayIds: ['1853662_960_720', '2373727_960_720', '2557568_960_720', '1725340_960_720', '3088958_960_720', '3384774_960_720', '1845594_960_720', '2564660_960_720', '1851925_960_720', '2468874_960_720']
  },
  food: {
    keywords: ['cuisine', 'cooking', 'restaurant', 'chef', 'ingredients', 'fresh', 'delicious', 'gourmet', 'healthy', 'organic', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage', 'coffee', 'tea', 'wine', 'bread'],
    unsplashIds: ['1565958011703-44f9829ba187', '1551782450-a2132b4ba21d', '1504674900247-0877df9cc836', '1556909114-f6e7ad7d3136', '1490818387583-76dc3a8a4a0b', '1493770348161-369560ae357d', '1504674900247-0877df9cc836', '1578662996442-48f60103fc96', '1504674900247-0877df9cc836', '1504674900247-0877df9cc836'],
    pexelsIds: ['461198', '315755', '376464', '1640777', '70497', '1279330', '302899', '1458318', '1102341', '934070', '3373745', '1444442', '1158519', '1437037', '1574169'],
    pixabayIds: ['3007395_960_720', '1238246_960_720', '494706_960_720', '1971552_960_720', '755362_960_720', '1175193_960_720', '1840435_960_720', '2604149_960_720', '3277416_960_720', '11014_960_720']
  },
  technology: {
    keywords: ['innovation', 'digital', 'computer', 'smartphone', 'artificial intelligence', 'coding', 'programming', 'software', 'hardware', 'internet', 'data', 'cloud', 'cybersecurity', 'blockchain', 'virtual reality', 'machine learning', 'robotics', 'automation', 'electronics', 'circuit'],
    unsplashIds: ['1518709268805-4e9042af2176', '1485827404703-89b55fcc595e', '1518717758536-85ae29035b6d', '1578662996442-48f60103fc96', '1504307651254-35680f356dfd', '1559757148-5c350d0d3c56', '1486406146926-c627a92ad1ab', '1531297484001-80022131f5a1', '1504384308090-c894fdcc538d', '1518709268805-4e9042af2176'],
    pexelsIds: ['373543', '574071', '1181244', '2004161', '267350', '442576', '60504', '3184292', '1170412', '1396122', '326055', '1117132', '1102341', '934070', '3373745'],
    pixabayIds: ['3384774_960_720', '3088958_960_720', '1725340_960_720', '2212198_960_720', '1756274_960_720', '2836301_960_720', '1477041_960_720', '1014712_960_720', '841441_960_720', '2373727_960_720']
  }
};

// 랜덤 이미지 생성 함수
export const generateRandomImages = (theme: string, count: number = 50): ImageItem[] => {
  const images: ImageItem[] = [];
  const themeData = themeKeywords[theme as keyof typeof themeKeywords];
  
  if (!themeData) {
    // 기본 랜덤 이미지 생성
    for (let i = 0; i < count; i++) {
      images.push({
        id: `${theme}_${i + 1}`,
        src: `https://picsum.photos/800/600?random=${Date.now() + i}`,
        alt: `${theme} image ${i + 1}`,
        category: theme,
        tags: [theme, 'random', 'gallery'],
        resolution: '800x600',
        fileSize: '~150KB',
        license: 'Free for commercial use'
      });
    }
    return images;
  }

  const { keywords, unsplashIds, pexelsIds, pixabayIds } = themeData;
  
  // Unsplash 이미지들
  unsplashIds.forEach((id, index) => {
    if (images.length < count) {
      images.push({
        id: `${theme}_unsplash_${index + 1}`,
        src: `https://images.unsplash.com/photo-${id}?w=800`,
        alt: `${keywords[index % keywords.length]} - professional photography`,
        category: theme,
        tags: [theme, keywords[index % keywords.length], keywords[(index + 1) % keywords.length]],
        resolution: '800x600',
        fileSize: '~200KB',
        license: 'Unsplash License'
      });
    }
  });

  // Pexels 이미지들
  pexelsIds.forEach((id, index) => {
    if (images.length < count) {
      images.push({
        id: `${theme}_pexels_${index + 1}`,
        src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?w=800`,
        alt: `${keywords[(index + 2) % keywords.length]} - high quality stock photo`,
        category: theme,
        tags: [theme, keywords[(index + 2) % keywords.length], keywords[(index + 3) % keywords.length]],
        resolution: '800x600',
        fileSize: '~180KB',
        license: 'Pexels License'
      });
    }
  });

  // Pixabay 이미지들
  pixabayIds.forEach((id, index) => {
    if (images.length < count) {
      images.push({
        id: `${theme}_pixabay_${index + 1}`,
        src: `https://cdn.pixabay.com/photo/2016/11/23/15/48/${id.replace('_960_720', '_640_480')}.jpg`,
        alt: `${keywords[(index + 4) % keywords.length]} - creative commons`,
        category: theme,
        tags: [theme, keywords[(index + 4) % keywords.length], keywords[(index + 5) % keywords.length]],
        resolution: '640x480',
        fileSize: '~120KB',
        license: 'Pixabay License'
      });
    }
  });

  // 추가 랜덤 이미지로 목표 수량 채우기
  while (images.length < count) {
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    const randomSource = Math.floor(Math.random() * 4);
    let src = '';
    let license = '';
    
    switch (randomSource) {
      case 0:
        src = `https://picsum.photos/800/600?random=${Date.now() + images.length}`;
        license = 'Lorem Picsum';
        break;
      case 1:
        src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&random=${images.length}`;
        license = 'Unsplash License';
        break;
      case 2:
        src = `https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=800&random=${images.length}`;
        license = 'Pexels License';
        break;
      default:
        src = `https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_960_720.jpg?random=${images.length}`;
        license = 'Pixabay License';
    }

    images.push({
      id: `${theme}_random_${images.length + 1}`,
      src,
      alt: `${randomKeyword} - ${theme} collection`,
      category: theme,
      tags: [theme, randomKeyword, keywords[Math.floor(Math.random() * keywords.length)]],
      resolution: '800x600',
      fileSize: '~150KB',
      license
    });
  }

  return images;
};

// 페이지네이션을 위한 이미지 슬라이스 함수
export const getImagesByPage = (theme: string, page: number, pageSize: number = 20): ImageItem[] => {
  const allImages = generateRandomImages(theme, 100); // 각 테마당 100장 생성
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return allImages.slice(startIndex, endIndex);
};

// 검색을 위한 이미지 필터링 함수
export const searchImages = (theme: string, searchTerm: string, page: number = 1, pageSize: number = 20): ImageItem[] => {
  const allImages = generateRandomImages(theme, 100);
  const filteredImages = allImages.filter(image => 
    image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredImages.slice(startIndex, endIndex);
};

// 모든 테마의 총 이미지 수 계산
export const getTotalImageCount = (): number => {
  return Object.keys(themeKeywords).length * 100 + (62 - Object.keys(themeKeywords).length) * 50;
};