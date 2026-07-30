import { Redirect } from 'expo-router';
import { storage } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GoogleOneTapSignIn } from 'react-native-nitro-google-signin';
import { useProfileStore } from '@/features/profile/hooks/useProfileStore';

export default function Index() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const hasSeenOnboarding = storage.getBoolean('hasSeenOnboarding');

  useEffect(() => {
    const initAuth = async () => {
      // Check if access token or guest session exists in storage
      const token = storage.getString('google_access_token');
      const isGuestStored = storage.getBoolean('is_guest');
      const isGuestProfile = useProfileStore.getState().profile.isGuest;
      if (token || isGuestStored || isGuestProfile) {
        setIsSignedIn(true);
      }
      setSessionChecked(true);
    };
    initAuth();
  }, []);

  if (!sessionChecked) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fbf9f4', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#566434" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/auth" />;
}
