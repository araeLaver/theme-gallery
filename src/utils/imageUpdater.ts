import { ImageItem } from '../types/theme';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  tags: { title: string }[];
}

interface PexelsImage {
  id: number;
  src: {
    large: string;
  };
  alt: string;
}

export class ImageUpdater {
  private unsplashAccessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  private pexelsApiKey = process.env.REACT_APP_PEXELS_API_KEY;

  async fetchNewImagesFromUnsplash(query: string, count: number = 5): Promise<ImageItem[]> {
    if (!this.unsplashAccessKey) {
      console.warn('Unsplash API key not found');
      return [];
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&order_by=latest`,
        {
          headers: {
            'Authorization': `Client-ID ${this.unsplashAccessKey}`
          }
        }
      );

      const data = await response.json();
      
      return data.results.map((img: UnsplashImage, index: number) => ({
        id: `${query}_new_${Date.now()}_${index}`,
        src: img.urls.regular,
        alt: img.alt_description || `${query} image`,
        category: query,
        tags: img.tags?.slice(0, 3).map(tag => tag.title) || [query],
        isNew: true,
        dateAdded: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching from Unsplash:', error);
      return [];
    }
  }

  async fetchNewImagesFromPexels(query: string, count: number = 5): Promise<ImageItem[]> {
    if (!this.pexelsApiKey) {
      console.warn('Pexels API key not found');
      return [];
    }

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=${count}`,
        {
          headers: {
            'Authorization': this.pexelsApiKey
          }
        }
      );

      const data = await response.json();
      
      return data.photos.map((img: PexelsImage, index: number) => ({
        id: `${query}_new_${Date.now()}_${index}`,
        src: img.src.large,
        alt: img.alt || `${query} image`,
        category: query,
        tags: [query, 'pexels'],
        isNew: true,
        dateAdded: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching from Pexels:', error);
      return [];
    }
  }

  async getWeeklyNewImages(themes: string[]): Promise<Record<string, ImageItem[]>> {
    const newImages: Record<string, ImageItem[]> = {};
    
    for (const theme of themes) {
      const unsplashImages = await this.fetchNewImagesFromUnsplash(theme, 3);
      const pexelsImages = await this.fetchNewImagesFromPexels(theme, 2);
      
      newImages[theme] = [...unsplashImages, ...pexelsImages];
    }

    return newImages;
  }

  // 매주 실행될 스케줄러 함수
  scheduleWeeklyUpdate() {
    const themes = [
      'nature', 'urban', 'minimal', 'vintage', 'abstract', 'ocean',
      'food', 'travel', 'fashion', 'technology', 'animals', 'space'
    ];

    // 매주 월요일 오전 9시에 실행
    const updateInterval = 7 * 24 * 60 * 60 * 1000; // 1주일
    
    const scheduleUpdate = () => {
      this.getWeeklyNewImages(themes).then(newImages => {
        // 로컬 스토리지에 새 이미지 저장
        localStorage.setItem('weeklyNewImages', JSON.stringify({
          images: newImages,
          lastUpdate: new Date().toISOString(),
          week: this.getCurrentWeekNumber()
        }));

        console.log(`Weekly images updated: ${Object.keys(newImages).length} themes updated`);
      }).catch(error => {
        console.error('Failed to update weekly images:', error);
      });
    };

    // 첫 실행
    scheduleUpdate();
    
    // 주기적 실행
    setInterval(scheduleUpdate, updateInterval);
  }

  getCurrentWeekNumber(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek);
  }

  getStoredWeeklyImages(): { images: Record<string, ImageItem[]>, lastUpdate: string, week: number } | null {
    const stored = localStorage.getItem('weeklyNewImages');
    return stored ? JSON.parse(stored) : null;
  }

  // 새 이미지가 있는지 확인
  hasNewImagesForWeek(): boolean {
    const stored = this.getStoredWeeklyImages();
    if (!stored) return false;
    
    return stored.week === this.getCurrentWeekNumber();
  }
}

export const imageUpdater = new ImageUpdater();