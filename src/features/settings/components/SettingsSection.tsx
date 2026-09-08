import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function SettingsSection({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay)} className="mb-5">
      <Text className="font-jakarta text-[11px] font-bold tracking-wider text-[#a89a8b] uppercase mb-2 px-1">
        {title}
      </Text>
      <View className="bg-white rounded-[20px] border border-[#efe9e1] overflow-hidden">
        {children}
      </View>
    </Animated.View>
  );
}
