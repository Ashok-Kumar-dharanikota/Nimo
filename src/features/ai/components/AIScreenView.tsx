import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NimoAIChat } from './NimoAIChat';

export function AIScreenView() {
  return (
    <SafeAreaView className="flex-1 bg-[#fbf9f4]" edges={['top']}>
      <NimoAIChat />
    </SafeAreaView>
  );
}
