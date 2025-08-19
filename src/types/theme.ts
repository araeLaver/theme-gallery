export interface Theme {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  accentColor: string;
  gradient: string;
}

export interface ImageItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  tags: string[];
  resolution?: string;
  fileSize?: string;
  license?: string;
  downloadCount?: number;
  likes?: number;
  views?: number;
  photographer?: string;
  source?: string;
  uploadDate?: string;
  colors?: string[];
  orientation?: 'landscape' | 'portrait' | 'square';
  isNew?: boolean;
  dateAdded?: string;
}

export interface ThemeWithSubcategories extends Theme {
  subcategories?: string[];
  imageCount?: number;
  lastUpdated?: string;
  featured?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}