import { Stack } from 'expo-router';
import { View } from 'react-native';


export default function AppLayout() {
  return (
    <View className="flex-1 bg-background">
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />

    </View>
  );
}
