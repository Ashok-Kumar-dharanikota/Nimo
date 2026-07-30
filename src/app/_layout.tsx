import { PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { Text, useColorScheme, View } from 'react-native';

import '../../global.css';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { StatusBar } from 'expo-status-bar';

import { GlobalDialog } from '@/components/GlobalDialog';
import { SubscriptionProvider } from '@/components/SubscriptionProvider';
import { db } from '@/db';
import migrations from '@/db/migrations/migrations';
import { setupExecutorch } from '@/lib/executorch';
import { PortalHost } from '@rn-primitives/portal';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { KeyboardProvider } from 'react-native-keyboard-controller';

// Initialize ExecuTorch resource fetcher for on-device models
setupExecutorch();

const queryClient = new QueryClient();

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useAppUpdates } from '@/hooks/useAppUpdates';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  useAppUpdates();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'Plus Jakarta Sans': PlusJakartaSans_400Regular,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    'Playfair Display': PlayfairDisplay_700Bold,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (fontsLoaded && (success || error)) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, success, error]);

  if (!fontsLoaded || (!success && !error)) {
    return null;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-destructive font-bold text-lg mb-2">Migration Error</Text>
        <Text className="text-foreground text-center">{error.message}</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <SubscriptionProvider>
          <ThemeProvider value={DefaultTheme}>
            <StatusBar style="dark" />
            <AnimatedSplashOverlay />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
              <Stack.Screen name="auth" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="compose" options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }} />
              <Stack.Screen name="paywall" options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }} />
            </Stack>
            <GlobalDialog />
            <PortalHost />
          </ThemeProvider>
        </SubscriptionProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
