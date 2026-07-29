import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Automatically redirect back or to app since paywall is disabled
    const timer = setTimeout(() => {
      router.replace('/(app)');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 bg-background items-center justify-center p-4">
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20 }} className="flex-row justify-end z-10 absolute top-0 left-0 right-0">
        <TouchableOpacity
          onPress={() => router.replace('/(app)')}
          className="bg-black/40 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-jakarta font-semibold text-[14px]">Skip</Text>
        </TouchableOpacity>
      </View>
      
      <Text className="text-foreground text-lg mb-4 text-center">
        Premium features unlocked!
      </Text>
      <TouchableOpacity
        onPress={() => router.replace('/(app)')}
        className="bg-primary px-6 py-3 rounded-full"
      >
        <Text className="text-primary-foreground font-semibold">Continue to App</Text>
      </TouchableOpacity>
    </View>
  );
}
