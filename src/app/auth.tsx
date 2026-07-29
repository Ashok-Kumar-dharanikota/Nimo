import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useProfileStore } from '@/features/profile/hooks/useProfileStore';
import { storage } from '@/lib/storage';
import { GoogleOneTapSignIn } from 'react-native-nitro-google-signin';

GoogleOneTapSignIn.configure({
  webClientId: '200516238326-7m06gdstgbgu6unpt0m4j34nr9113v0l.apps.googleusercontent.com',
});

export default function AuthScreen() {
  const router = useRouter();
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (Platform.OS === 'android') {
        await GoogleOneTapSignIn.checkPlayServices();
      }
      
      const response = await GoogleOneTapSignIn.signIn();
      
      if (response.type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        const userInfo = response.data;
        
        if (!userInfo?.user) {
          throw new Error('Failed to retrieve user information.');
        }

        // Store user profile in Zustand
        updateProfile({
          email: userInfo.user.email || '',
          name: userInfo.user.name || (userInfo.user.email ? userInfo.user.email.split('@')[0] : 'User'),
          avatarUri: userInfo.user.photo || null,
        });

        const tokens = await GoogleOneTapSignIn.getTokens();
        if (tokens.accessToken) {
          storage.set('google_access_token', tokens.accessToken);
        }

        
        router.replace('/(app)');
      } else if (response.type === 'cancelled') {
        setErrorMessage(null);
      } else if (response.type === 'noSavedCredentialFound') {
        const explicitResponse = await GoogleOneTapSignIn.presentExplicitSignIn();
        if (explicitResponse.type === 'success') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          const userInfo = explicitResponse.data;

          if (!userInfo?.user) {
            throw new Error('Failed to retrieve user information.');
          }

          updateProfile({
            email: userInfo.user.email || '',
            name: userInfo.user.name || (userInfo.user.email ? userInfo.user.email.split('@')[0] : 'User'),
            avatarUri: userInfo.user.photo || null,
          });

          const tokens = await GoogleOneTapSignIn.getTokens();
          if (tokens.accessToken) {
            storage.set('google_access_token', tokens.accessToken);
          }

          
          router.replace('/(app)');
        } else if (explicitResponse.type !== 'cancelled') {
           setErrorMessage('Failed to sign in.');
           Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } catch (error: any) {
      console.error('Google SignIn Error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/nimo/Auth screen background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Optional dark overlay if background is too bright */}
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        {/* Logo Branding */}
        <View style={styles.brandingContainer}>
          <Image
            source={require('@/assets/images/nimo/brand_name.png')}
            style={styles.brandName}
            contentFit="contain"
          />
          <Image
            source={require('@/assets/images/nimo/brand_footnote.png')}
            style={styles.brandFootnote}
            contentFit="contain"
          />
          <Text style={styles.subTitle}>
            Welcome back! Sign in to your Nimo memory vault.
          </Text>
        </View>

        {/* Action Container */}
        <View style={styles.actionContainer}>
          {errorMessage && (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color="#dc2626" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.85}
            style={[styles.submitBtn, loading && styles.disabledBtn]}
          >
            {loading ? (
              <ActivityIndicator color="#566434" />
            ) : (
                 <Text style={styles.submitBtnText}>Continue with Google</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.disclaimerText}>
              By continuing, you agree to our Terms of Use and Privacy Policy.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(251, 249, 244, 0.4)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandName: {
    width: 150,
    height: 50,
    marginBottom: 8,
  },
  brandFootnote: {
    width: 120,
    height: 30,
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 15,
    color: '#3d342b',
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
    fontWeight: '500',
  },
  actionContainer: {
    width: '100%',
    padding: 24,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#dc2626',
    fontFamily: 'Plus Jakarta Sans',
    flex: 1,
  },
  submitBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d2c4bc',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledBtn: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#566434',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  disclaimerText: {
    marginTop: 20,
    fontSize: 12,
    color: '#6b5e52',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: 18,
    fontWeight: '500',
  }
});
