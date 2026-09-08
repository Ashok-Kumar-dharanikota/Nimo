import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { X, Check } from 'lucide-react-native';
import {
  GARDEN_THEMES,
  type GardenThemeId,
  type GardenTheme,
} from '../utils/gardenThemes';

interface ThemeSelectionModalProps {
  visible: boolean;
  selectedTheme: GardenThemeId;
  currentTheme: GardenTheme;
  onSelectTheme: (themeId: GardenThemeId) => void;
  onClose: () => void;
}

export function ThemeSelectionModal({
  visible,
  selectedTheme,
  currentTheme,
  onSelectTheme,
  onClose,
}: ThemeSelectionModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <View
          className="rounded-t-[32px] p-6 h-[55%]"
          style={{ backgroundColor: currentTheme.bgColor }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-playfair text-[24px] font-bold text-[#27170c]">
              Garden Themes
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 bg-[#f0eee9] rounded-full items-center justify-center"
            >
              <X size={16} color="#8c7c6c" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {GARDEN_THEMES.map((theme) => {
              const isSelected = selectedTheme === theme.id;

              return (
                <TouchableOpacity
                  key={theme.id}
                  onPress={() => onSelectTheme(theme.id)}
                  activeOpacity={0.7}
                  className="flex-row items-center p-4 bg-white rounded-2xl mb-4"
                  style={{
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? currentTheme.fabColor : '#efe9e1',
                  }}
                >
                  {/* Theme color preview */}
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderWidth: 1,
                      borderColor: theme.emptyDotBorder,
                    }}
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
                  {isSelected && (
                    <View
                      className="w-6 h-6 rounded-full items-center justify-center"
                      style={{ backgroundColor: currentTheme.fabColor }}
                    >
                      <Check size={14} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
