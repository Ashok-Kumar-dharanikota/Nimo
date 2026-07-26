import React from 'react';
import { View, Platform, Text, TouchableOpacity } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'web') {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <Text className="text-foreground text-lg mb-4">
          In-app purchases are not supported on the web.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-full"
        >
          <Text className="text-primary-foreground font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* We add a dismiss button if we're showing it as a modal */}
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20 }} className="flex-row justify-end z-10 absolute top-0 left-0 right-0">
        <TouchableOpacity
          onPress={() => {
            router.replace('/(app)');
          }}
          className="bg-black/40 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-jakarta font-semibold text-[14px]">Skip</Text>
        </TouchableOpacity>
      </View>
      <RevenueCatUI.Paywall 
        onPurchaseCompleted={({ customerInfo }) => {
          console.log('Purchase completed successfully!', customerInfo);
          // SubscriptionProvider will automatically catch this via listener
          router.replace('/(app)');
        }}
        onRestoreCompleted={({ customerInfo }) => {
          console.log('Restore completed successfully!', customerInfo);
          // SubscriptionProvider will automatically catch this via listener
        }}
      />
    </View>
  );
}
