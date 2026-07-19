import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <Text className="font-jakarta text-2xl font-bold text-primary">Settings</Text>
    </SafeAreaView>
  );
}
