import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export function SettingsRow({
  icon: Icon,
  label,
  value,
  onPress,
  rightElement,
}: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={() => {
        if (onPress) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }
      }}
      className="flex-row items-center px-4 py-3.5"
    >
      <View className="w-9 h-9 rounded-[12px] bg-[#f0eee9] items-center justify-center mr-3">
        <Icon size={18} color="#4f453f" />
      </View>
      <Text className="font-jakarta text-[14px] font-medium text-[#27170c] flex-1">{label}</Text>
      {rightElement ?? (
        <>
          {value && (
            <Text className="font-jakarta text-[12px] text-[#a89a8b] mr-1" numberOfLines={1}>
              {value}
            </Text>
          )}
          {onPress && <ChevronRight size={16} color="#c4b8aa" />}
        </>
      )}
    </TouchableOpacity>
  );
}

export function SettingsDivider() {
  return <View className="h-[1px] bg-[#efe9e1] mx-4" />;
}
