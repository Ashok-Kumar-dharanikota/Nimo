import React from 'react';
import { View } from 'react-native';
import { NimoAIChat } from '@/features/ai/components/NimoAIChat';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AITabScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#fbf9f4]">
      <NimoAIChat />
    </SafeAreaView>
  );
}
