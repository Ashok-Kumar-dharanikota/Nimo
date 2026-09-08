import { useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useGardenData } from '@/features/home/hooks/useHomeData';
import {
  getSavedTheme,
  getTheme,
  saveTheme,
  type GardenThemeId,
  GARDEN_THEMES,
} from '../utils/gardenThemes';

export function useGarden() {
  const { memoryTree, isLoading } = useGardenData();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<GardenThemeId>(getSavedTheme());

  const currentTheme = getTheme(selectedTheme);

  const handleThemeSelect = useCallback((themeId: GardenThemeId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedTheme(themeId);
    saveTheme(themeId);
  }, []);

  return {
    memoryTree,
    isLoading,
    themeModalVisible,
    setThemeModalVisible,
    selectedTheme,
    currentTheme,
    handleThemeSelect,
    themes: GARDEN_THEMES,
  };
}
