import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import '../../global.css';
import { Footer } from '../components/Footer.web';
import { Header } from '../components/Header.web';

const queryClient = new QueryClient();

export default function WebLayout() {
  const [fontsLoaded] = useFonts({
    'Plus Jakarta Sans': PlusJakartaSans_400Regular,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background min-h-screen">
        <ActivityIndicator size="large" color="#A4B47C" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen font-jakarta selection:bg-sage/20">
        {/* Navigation Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 w-full mx-auto px-6">
          <Slot />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

