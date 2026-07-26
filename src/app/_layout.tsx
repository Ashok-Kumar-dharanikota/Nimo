import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme, View, Text } from 'react-native';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '../../global.css';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { StatusBar } from 'expo-status-bar';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/db/migrations/migrations';
import { db } from '@/db';
import { setupExecutorch } from '@/lib/executorch';
import { SubscriptionProvider } from '@/components/SubscriptionProvider';
import { GlobalDialog } from '@/components/GlobalDialog';
import { PortalHost } from '@rn-primitives/portal';

// Initialize ExecuTorch resource fetcher for on-device models
setupExecutorch();

const queryClient = new QueryClient();

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
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
    </QueryClientProvider>
  );
}
