import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useProfileStore } from '@/features/profile/hooks/useProfileStore';
import { authService, AuthUser } from '../services/authService';

export function useAuth() {
  const router = useRouter();
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  /**
   * Triggers the Google Sign-In procedure and navigates to the app on success.
   * Includes re-entrancy guard to prevent rapid multi-tap race conditions.
   */
  const signInWithGoogle = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const user = await authService.signInWithGoogle();

      if (user) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        updateProfile({
          name: user.name,
          email: user.email,
          avatarUri: user.avatarUri,
          isGuest: false,
        });

        router.replace('/(app)');
      }
      // If user cancelled, do nothing (no error to display)
    } catch (err: any) {
      console.error('[useAuth] Google Sign-In error:', err);
      const message = err?.message || 'Failed to sign in with Google.';
      setErrorMessage(message);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }, [loading, router, updateProfile]);

  /**
   * Signs in the user as a guest with their chosen username.
   * Includes re-entrancy guard to prevent rapid multi-tap race conditions.
   */
  const signInAsGuest = useCallback(
    async (username: string) => {
      if (loading) return;

      setLoading(true);
      setErrorMessage(null);

      try {
        const user = authService.signInAsGuest(username);

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        updateProfile({
          name: user.name,
          email: '',
          avatarUri: null,
          isGuest: true,
        });

        router.replace('/(app)');
      } catch (err: any) {
        console.error('[useAuth] Guest Sign-In error:', err);
        setErrorMessage(err?.message || 'Failed to sign in as guest.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setLoading(false);
      }
    },
    [loading, router, updateProfile]
  );

  /**
   * Signs out the user, clears session tokens, removes local database data,
   * and navigates back to the Auth screen.
   */
  const signOut = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      await authService.signOut();
      updateProfile({
        name: 'Guest',
        email: '',
        avatarUri: null,
        isGuest: true,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/auth');
    } catch (err) {
      console.warn('[useAuth] Sign-out error:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, router, updateProfile]);

  return {
    loading,
    errorMessage,
    clearError,
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };
}
