import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../utils/supabase';
import { useProfileStore } from '@/features/profile/hooks/useProfileStore';
import { storage } from '@/lib/storage';
import { pullRemoteChanges } from '@/lib/syncEngine';
import Purchases from 'react-native-purchases';

type AuthMode = 'signIn' | 'signUp' | 'forgot' | 'reset';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { updateProfile } = useProfileStore();

  const [mode, setMode] = useState<AuthMode>(
    (params.mode as AuthMode) || 'signIn'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear messages when mode switches
  const handleModeSwitch = (newMode: AuthMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const validateForm = (): boolean => {
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (mode === 'forgot') {
      return true;
    }

    if (mode === 'signUp' && !name.trim()) {
      setErrorMessage('Please enter your name.');
      return false;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }

    if ((mode === 'signUp' || mode === 'reset') && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (data.session) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        storage.set('hasSeenOnboarding', true);

        if (data.user?.email) {
          const userName = data.user.user_metadata?.name || data.user.email.split('@')[0];
          updateProfile({
            email: data.user.email,
            name: userName,
          });
        }
        
        // Fetch any existing remote data for the user (even if free tier)
        if (data.user?.id) {
          pullRemoteChanges(data.user.id).catch(err => console.error('Error pulling remote changes:', err));
        }

        if (Platform.OS !== 'web' && data.user?.id) {
          try {
            const { customerInfo } = await Purchases.logIn(data.user.id);
            // Check if they are already premium
            if (customerInfo && typeof customerInfo.entitlements.active['Nimo Premium'] !== 'undefined') {
              router.replace('/(app)/home');
              return;
            }
          } catch (err) {
            console.warn('Failed to log in to RevenueCat', err);
          }
        }

        router.replace('/paywall');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (data.user) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        storage.set('hasSeenOnboarding', true);

        updateProfile({
          email: data.user.email || email.trim(),
          name: name.trim(),
        });

        // If session was not returned by signUp, attempt instant sign in
        if (!data.session) {
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
        }

        // Fetch any existing remote data for the user
        if (data.user?.id) {
          pullRemoteChanges(data.user.id).catch(err => console.error('Error pulling remote changes:', err));
        }
        
        if (Platform.OS !== 'web' && data.user?.id) {
          try {
            const { customerInfo } = await Purchases.logIn(data.user.id);
            // Check if they are already premium
            if (customerInfo && typeof customerInfo.entitlements.active['Nimo Premium'] !== 'undefined') {
              router.replace('/(app)/home');
              return;
            }
          } catch (err) {
            console.warn('Failed to log in to RevenueCat', err);
          }
        }

        router.replace('/paywall');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

      if (error) {
        setErrorMessage(error.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSuccessMessage('Password reset link sent! Check your email inbox.');
        setTimeout(() => setMode('signIn'), 2000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSuccessMessage('Password updated successfully!');
        setTimeout(() => router.replace('/(app)/home'), 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (mode === 'signIn') handleSignIn();
    else if (mode === 'signUp') handleSignUp();
    else if (mode === 'forgot') handleForgotPassword();
    else if (mode === 'reset') handleResetPassword();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={22} color="#27170c" />
            </TouchableOpacity>
          </View>

          {/* Logo Branding */}
          <View style={styles.brandingContainer}>
            <Image
              source={require('@/assets/images/nimo/brand_name.png')}
              style={styles.brandLogo}
              contentFit="contain"
            />
            <Text style={styles.subTitle}>
              {mode === 'signIn' && 'Welcome back! Sign in to your Nimo memory vault.'}
              {mode === 'signUp' && 'Create your account to start saving memories.'}
              {mode === 'forgot' && 'Reset your password to access your account.'}
              {mode === 'reset' && 'Enter your new password below.'}
            </Text>
          </View>

          {/* Mode Switcher Tabs */}
          {(mode === 'signIn' || mode === 'signUp') && (
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, mode === 'signIn' && styles.activeTab]}
                onPress={() => handleModeSwitch('signIn')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === 'signIn' && styles.activeTabText,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, mode === 'signUp' && styles.activeTab]}
                onPress={() => handleModeSwitch('signUp')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === 'signUp' && styles.activeTabText,
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Error Message Alert */}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={16} color="#dc2626" />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <View style={styles.successBanner}>
                <Feather name="check-circle" size={16} color="#16a34a" />
                <Text style={styles.successBannerText}>{successMessage}</Text>
              </View>
            )}

            {/* Full Name field for Sign Up */}
            {mode === 'signUp' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={18} color="#8c7c6c" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Jane Doe"
                    placeholderTextColor="#a89a8b"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* Email Field (for signIn, signUp, forgot) */}
            {mode !== 'reset' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={18} color="#8c7c6c" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#a89a8b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            )}

            {/* Password Field (for signIn, signUp, reset) */}
            {mode !== 'forgot' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={18} color="#8c7c6c" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#a89a8b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color="#8c7c6c"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Confirm Password Field (for signUp, reset) */}
            {(mode === 'signUp' || mode === 'reset') && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={18} color="#8c7c6c" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#a89a8b"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color="#8c7c6c"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Forgot Password Link (only in Sign In mode) */}
            {mode === 'signIn' && (
              <TouchableOpacity
                onPress={() => handleModeSwitch('forgot')}
                style={styles.forgotBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
              style={[styles.submitBtn, loading && styles.disabledBtn]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'signIn' && 'Sign In'}
                  {mode === 'signUp' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  {mode === 'reset' && 'Update Password'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Bottom link for forgot/reset modes */}
            {(mode === 'forgot' || mode === 'reset') && (
              <TouchableOpacity
                onPress={() => handleModeSwitch('signIn')}
                style={styles.backToLoginBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.backToLoginText}>
                  Remember your password? <Text style={styles.linkHighlight}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbf9f4',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    height: 52,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0eee9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e4e2dd',
  },
  brandingContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  brandLogo: {
    width: 130,
    height: 40,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: '#6b5e52',
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee8df',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8c7c6c',
    fontFamily: 'Plus Jakarta Sans',
  },
  activeTabText: {
    color: '#566434',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#efe9e1',
    shadowColor: '#566434',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#dc2626',
    fontFamily: 'Plus Jakarta Sans',
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successBannerText: {
    fontSize: 13,
    color: '#16a34a',
    fontFamily: 'Plus Jakarta Sans',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f453f',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbf9f4',
    borderWidth: 1,
    borderColor: '#e4e2dd',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#27170c',
    fontFamily: 'Plus Jakarta Sans',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#566434',
    fontFamily: 'Plus Jakarta Sans',
  },
  submitBtn: {
    backgroundColor: '#566434',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  backToLoginBtn: {
    alignItems: 'center',
    marginTop: 16,
  },
  backToLoginText: {
    fontSize: 13,
    color: '#8c7c6c',
    fontFamily: 'Plus Jakarta Sans',
  },
  linkHighlight: {
    color: '#566434',
    fontWeight: '700',
  },
});
