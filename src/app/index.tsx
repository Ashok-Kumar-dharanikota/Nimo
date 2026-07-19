import { Redirect } from 'expo-router';
import { storage } from '@/lib/storage';

export default function Index() {
  const hasSeenOnboarding = storage.getBoolean('hasSeenOnboarding');
  return <Redirect href={hasSeenOnboarding ? '/(app)/home' : '/onboarding'} />;
}
