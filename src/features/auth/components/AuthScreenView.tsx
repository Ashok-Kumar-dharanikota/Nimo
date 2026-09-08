import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { AlertCircle } from 'lucide-react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { IMAGES } from '@/assets';
import { useAuth } from '../hooks/useAuth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { GuestNameInput } from './GuestNameInput';

export function AuthScreenView() {
  const {
    loading,
    errorMessage,
    signInWithGoogle,
    signInAsGuest,
  } = useAuth();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={IMAGES.nimo.authBackground}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Soft aesthetic overlay */}
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Branding Section */}
            <View style={styles.brandingContainer}>
              <Image
                source={IMAGES.nimo.brandName}
                style={styles.brandName}
                contentFit="contain"
              />
              <Image
                source={IMAGES.nimo.brandFootnote}
                style={styles.brandFootnote}
                contentFit="contain"
              />
              <Text style={styles.subTitle}>
                Welcome back! Sign in to your Nimo memory vault.
              </Text>
            </View>

            {/* Action Controls Section */}
            <View style={styles.actionContainer}>
              {errorMessage && (
                <View style={styles.errorBanner}>
                  <AlertCircle size={16} color="#dc2626" />
                  <Text style={styles.errorBannerText}>{errorMessage}</Text>
                </View>
              )}

              {/* 1. Google Sign-In */}
              <GoogleSignInButton
                onPress={signInWithGoogle}
                loading={loading}
              />

              {/* Subtle Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or join as guest</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* 2. Inline Guest Name Input with Circular Confirm Button */}
              <GuestNameInput
                onSubmit={signInAsGuest}
                disabled={loading}
              />

              {/* Disclaimer */}
              <Text style={styles.disclaimerText}>
                By continuing, you agree to our Terms of Use and Privacy Policy.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  brandName: {
    width: 140,
    height: 48,
    marginBottom: 4,
  },
  brandFootnote: {
    width: 180,
    height: 20,
    marginBottom: 16,
  },
  subTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: '#65574c',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  actionContainer: {
    width: '100%',
    gap: 12,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginBottom: 4,
  },
  errorBannerText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5dec9',
  },
  dividerText: {
    fontSize: 12,
    color: '#8c7c6c',
    fontFamily: 'Plus Jakarta Sans',
    paddingHorizontal: 12,
  },
  disclaimerText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#8c7c6c',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
    paddingHorizontal: 16,
  },
});
