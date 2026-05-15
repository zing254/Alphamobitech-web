import { useState, useEffect, useCallback } from 'react';

interface UseCompareReturn {
  compareList: number[];
  addToCompare: (productId: number) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
}

export const useCompare = (): UseCompareReturn => {
  const [compareList, setCompareList] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('compareList');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = useCallback((productId: number) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 3) {
        return prev; // max 3 items
      }
      return [...prev, productId];
    });
  }, []);

  const removeFromCompare = useCallback((productId: number) => {
    setCompareList(prev => prev.filter(id => id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  return { compareList, addToCompare, removeFromCompare, clearCompare };
};