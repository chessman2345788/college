'use client';

import { useState, useEffect } from 'react';

const COMPARE_STORAGE_KEY = 'college_compass_compare_ids';

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (stored) {
      try {
        setCompareIds(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing compare IDs', e);
      }
    }
    setMounted(true);
  }, []);

  const saveIds = (ids: string[]) => {
    setCompareIds(ids);
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
  };

  const addToCompare = (id: string): { success: boolean; message: string } => {
    if (compareIds.includes(id)) {
      return { success: true, message: 'College is already in comparison list' };
    }
    if (compareIds.length >= 3) {
      return { success: false, message: 'You can compare a maximum of 3 colleges' };
    }
    const newIds = [...compareIds, id];
    saveIds(newIds);
    return { success: true, message: 'Added to comparison list' };
  };

  const removeFromCompare = (id: string) => {
    const newIds = compareIds.filter((item) => item !== id);
    saveIds(newIds);
  };

  const toggleCompare = (id: string): { success: boolean; message: string; action: 'added' | 'removed' } => {
    if (compareIds.includes(id)) {
      removeFromCompare(id);
      return { success: true, message: 'Removed from comparison list', action: 'removed' };
    } else {
      const res = addToCompare(id);
      return { ...res, action: 'added' };
    }
  };

  const isInCompare = (id: string) => {
    return compareIds.includes(id);
  };

  const clearCompare = () => {
    saveIds([]);
  };

  return {
    compareIds: mounted ? compareIds : [],
    addToCompare,
    removeFromCompare,
    toggleCompare,
    isInCompare,
    clearCompare,
    isMounted: mounted,
  };
}
