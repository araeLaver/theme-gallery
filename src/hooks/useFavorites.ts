import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'theme_gallery_favorites';
const RECENT_VIEWS_KEY = 'theme_gallery_recent_views';
const USER_COLLECTIONS_KEY = 'theme_gallery_collections';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  imageIds: string[];
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentViews, setRecentViews] = useState<string[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    const savedRecentViews = localStorage.getItem(RECENT_VIEWS_KEY);
    const savedCollections = localStorage.getItem(USER_COLLECTIONS_KEY);

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRecentViews) {
      setRecentViews(JSON.parse(savedRecentViews));
    }
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  // Save recent views to localStorage
  const saveRecentViews = (newRecentViews: string[]) => {
    setRecentViews(newRecentViews);
    localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(newRecentViews));
  };

  // Save collections to localStorage
  const saveCollections = (newCollections: Collection[]) => {
    setCollections(newCollections);
    localStorage.setItem(USER_COLLECTIONS_KEY, JSON.stringify(newCollections));
  };

  // Toggle favorite
  const toggleFavorite = (imageId: string) => {
    const newFavorites = favorites.includes(imageId)
      ? favorites.filter(id => id !== imageId)
      : [...favorites, imageId];
    saveFavorites(newFavorites);
  };

  // Check if image is favorite
  const isFavorite = (imageId: string) => {
    return favorites.includes(imageId);
  };

  // Add to recent views
  const addToRecentViews = (imageId: string) => {
    const newRecentViews = [
      imageId,
      ...recentViews.filter(id => id !== imageId)
    ].slice(0, 50); // Keep only last 50 views
    saveRecentViews(newRecentViews);
  };

  // Create new collection
  const createCollection = (name: string, description?: string, color?: string) => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name,
      description,
      imageIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color
    };
    const newCollections = [...collections, newCollection];
    saveCollections(newCollections);
    return newCollection;
  };

  // Update collection
  const updateCollection = (id: string, updates: Partial<Collection>) => {
    const newCollections = collections.map(collection =>
      collection.id === id
        ? { ...collection, ...updates, updatedAt: new Date().toISOString() }
        : collection
    );
    saveCollections(newCollections);
  };

  // Delete collection
  const deleteCollection = (id: string) => {
    const newCollections = collections.filter(collection => collection.id !== id);
    saveCollections(newCollections);
  };

  // Add image to collection
  const addToCollection = (collectionId: string, imageId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection && !collection.imageIds.includes(imageId)) {
      updateCollection(collectionId, {
        imageIds: [...collection.imageIds, imageId]
      });
    }
  };

  // Remove image from collection
  const removeFromCollection = (collectionId: string, imageId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      updateCollection(collectionId, {
        imageIds: collection.imageIds.filter(id => id !== imageId)
      });
    }
  };

  // Get collection by id
  const getCollection = (id: string) => {
    return collections.find(c => c.id === id);
  };

  // Get collections containing image
  const getCollectionsForImage = (imageId: string) => {
    return collections.filter(collection => 
      collection.imageIds.includes(imageId)
    );
  };

  // Export data for backup
  const exportUserData = () => {
    return {
      favorites,
      recentViews,
      collections,
      exportedAt: new Date().toISOString()
    };
  };

  // Import data from backup
  const importUserData = (data: any) => {
    if (data.favorites) saveFavorites(data.favorites);
    if (data.recentViews) saveRecentViews(data.recentViews);
    if (data.collections) saveCollections(data.collections);
  };

  // Get statistics
  const getStats = () => {
    return {
      totalFavorites: favorites.length,
      totalCollections: collections.length,
      totalImagesInCollections: collections.reduce(
        (total, collection) => total + collection.imageIds.length, 
        0
      ),
      recentViewsCount: recentViews.length
    };
  };

  return {
    // Favorites
    favorites,
    toggleFavorite,
    isFavorite,

    // Recent views
    recentViews,
    addToRecentViews,

    // Collections
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    getCollection,
    getCollectionsForImage,

    // Utilities
    exportUserData,
    importUserData,
    getStats
  };
};