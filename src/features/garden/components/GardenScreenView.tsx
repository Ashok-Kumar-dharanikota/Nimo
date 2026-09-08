import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MemoryTree } from '@/features/home/components/tree/MemoryTree';
import { useGarden } from '../hooks/useGarden';
import { ThemeSelectionModal } from './ThemeSelectionModal';

export function GardenScreenView() {
  const router = useRouter();
  const {
    memoryTree,
    isLoading,
    themeModalVisible,
    setThemeModalVisible,
    selectedTheme,
    currentTheme,
    handleThemeSelect,
  } = useGarden();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: currentTheme.bgColor }}
      edges={['top']}
    >
      <MemoryTree
        days={memoryTree}
        isLoading={isLoading}
        onBack={() => router.back()}
        themeId={selectedTheme}
      />

      {/* Theme Selection Modal */}
      <ThemeSelectionModal
        visible={themeModalVisible}
        selectedTheme={selectedTheme}
        currentTheme={currentTheme}
        onSelectTheme={handleThemeSelect}
        onClose={() => setThemeModalVisible(false)}
      />
    </SafeAreaView>
  );
}
