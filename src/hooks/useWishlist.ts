import { useState, useCallback } from 'react';

interface UseWishlistReturn {
  wishlistItems: number[];
  removeFromWishlist: (productId: number) => void;
  addToWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlist = (): UseWishlistReturn => {
  const [wishlistItems, setWishlistItems] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlistItems(prev => {
      const updated = prev.filter(id => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addToWishlist = useCallback((productId: number) => {
    setWishlistItems(prev => {
      if (prev.includes(productId)) return prev;
      const updated = [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isInWishlist = useCallback((productId: number) => {
    return wishlistItems.includes(productId);
  }, [wishlistItems]);

  return { wishlistItems, removeFromWishlist, addToWishlist, isInWishlist };
};
