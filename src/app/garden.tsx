import { MemoryTree } from '@/features/home/components/tree/MemoryTree';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import {
  GARDEN_THEMES,
  getSavedTheme,
  getTheme,
  saveTheme,
  type GardenThemeId,
} from '@/features/home/utils/gardenUtils';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '@/components/SubscriptionProvider';

export default function GardenScreen() {
  const { memoryTree, isLoading } = useHomeData();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<GardenThemeId>(getSavedTheme());
  const { isPremium } = useSubscription();

  const currentTheme = getTheme(selectedTheme);

  const handleThemeSelect = useCallback((themeId: GardenThemeId, isPremiumTheme: boolean) => {
    if (isPremiumTheme && !isPremium) {
      setThemeModalVisible(false);
      router.push('/paywall');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedTheme(themeId);
    saveTheme(themeId);
  }, [isPremium]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: currentTheme.bgColor }} edges={['top']}>
      {/* Theme Button - Temporarily hidden
      <View className="absolute top-12 right-5 z-10">
        <TouchableOpacity
          onPress={() => setThemeModalVisible(true)}
          activeOpacity={0.8}
          className="flex-row items-center gap-2 bg-white/80 px-3 py-2 rounded-full border border-[#efe9e1] shadow-sm"
        >
          <Feather name="droplet" size={14} color={currentTheme.fabColor} />
          <Text className="font-jakarta text-[12px] font-semibold" style={{ color: currentTheme.fabColor }}>
            Theme
          </Text>
        </TouchableOpacity>
      </View>
      */}

      <MemoryTree
        days={memoryTree}
        isLoading={isLoading}
        onBack={() => router.back()}
        themeId={selectedTheme}
      />

      {/* Theme Selection Modal */}
      <Modal visible={themeModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-[32px] p-6 h-[55%]" style={{ backgroundColor: currentTheme.bgColor }}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-playfair text-[24px] font-bold text-[#27170c]">Garden Themes</Text>
              <TouchableOpacity
                onPress={() => setThemeModalVisible(false)}
                className="w-8 h-8 bg-[#f0eee9] rounded-full items-center justify-center"
              >
                <Feather name="x" size={16} color="#8c7c6c" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {GARDEN_THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                const isLocked = theme.isPremium && !isPremium;

                return (
                  <TouchableOpacity
                    key={theme.id}
                    onPress={() => handleThemeSelect(theme.id, theme.isPremium)}
                    activeOpacity={0.7}
                    className="flex-row items-center p-4 bg-white rounded-2xl mb-4"
                    style={{
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected ? currentTheme.fabColor : '#efe9e1',
                      opacity: isLocked ? 0.7 : 1,
                    }}
                  >
                    {/* Theme color preview */}
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: theme.bgColor, borderWidth: 1, borderColor: theme.emptyDotBorder }}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: theme.fabColor,
                          opacity: 0.8,
                        }}
                      />
                    </View>

                    {/* Label */}
                    <View className="flex-1">
                      <Text className="font-playfair text-[18px] font-bold text-[#27170c]">
                        {theme.name}
                      </Text>
                      <Text className="font-jakarta text-[13px] text-[#8c7c6c]">
                        {theme.description}
                      </Text>
                    </View>

                    {/* Status indicator */}
                    {isSelected ? (
                      <View
                        className="w-6 h-6 rounded-full items-center justify-center"
                        style={{ backgroundColor: currentTheme.fabColor }}
                      >
                        <Feather name="check" size={14} color="white" />
                      </View>
                    ) : isLocked ? (
                      <View className="flex-row items-center gap-1">
                        <Feather name="lock" size={14} color="#8c7c6c" />
                        <Text className="font-jakarta text-[11px] font-semibold text-[#8c7c6c]">PRO</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
