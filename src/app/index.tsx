import { Redirect } from 'expo-router';
import { storage } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { View, ActivityIndicator } from 'react-native';
import { pullRemoteChanges } from '@/lib/syncEngine';

export default function Index() {
  const [session, setSession] = useState<any>(undefined);
  const hasSeenOnboarding = storage.getBoolean('hasSeenOnboarding');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      if (data.session?.user?.id) {
        pullRemoteChanges(data.session.user.id).catch(err => console.error('Error pulling remote changes on load:', err));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fbf9f4', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#566434" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(app)" />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/auth" />;
}
