'use client';

import { useEffect, ReactNode } from 'react';
import { useStreakStore } from '@/store/streak/streakStore';

interface StreakProviderProps {
  children: ReactNode;
}

export function StreakProvider({ children }: StreakProviderProps) {
  const { fetchStreakData, needsRefresh } = useStreakStore();

  useEffect(() => {
    const initializeStreak = async () => {
      try {
        // Fetch current data if needed - this already handles streak reset logic server-side
        if (needsRefresh()) {
          await fetchStreakData();
        }
      } catch (error) {
        console.error('Error initializing streak data:', error);
      }
    };

    initializeStreak();
  }, []);

  // Listen for global streak update events
  useEffect(() => {
    const handleStreakUpdate = () => {
      fetchStreakData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('streak-data-updated', handleStreakUpdate);
      return () => window.removeEventListener('streak-data-updated', handleStreakUpdate);
    }
  }, [fetchStreakData]);

  return <>{children}</>;
}
