import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { authService } from '@/features/auth';
import { useProfileStore } from '@/features/profile/hooks/useProfileStore';

export default function Index() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const session = authService.getSession();
      const isGuestProfile = useProfileStore.getState().profile.isGuest;
      if (session.isSignedIn || isGuestProfile) {
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
