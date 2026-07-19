import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme, View, Text } from 'react-native';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '../../global.css';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { StatusBar } from 'expo-status-bar';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/db/migrations/migrations';
import { db } from '@/db';

const queryClient = new QueryClient();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'Plus Jakarta Sans': PlusJakartaSans_400Regular,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const { success, error } = useMigrations(db, migrations);

  if (!fontsLoaded || (!success && !error)) {
    return <View />;
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
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="compose" options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
