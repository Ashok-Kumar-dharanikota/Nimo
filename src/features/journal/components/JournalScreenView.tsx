import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen } from 'lucide-react-native';

export function JournalScreenView() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#fbf9f4]">
      <View className="w-16 h-16 rounded-full bg-[#eef1e4] items-center justify-center mb-3">
        <BookOpen size={28} color="#566434" />
      </View>
      <Text className="font-playfair text-[20px] font-bold text-[#27170c] mb-1">
        Journal Collections
      </Text>
      <Text className="font-jakarta text-[13px] text-[#8c7c6c]">
        Themed journals and multi-entry collections coming soon.
      </Text>
    </SafeAreaView>
  );
}
