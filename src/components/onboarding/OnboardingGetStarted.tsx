import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingGetStartedProps {
  isActive: boolean;
  onContinueWithEmail: () => void;
  onContinueWithGoogle: () => void;
  onLogin: () => void;
}

export function OnboardingGetStarted({
  isActive,
  onContinueWithEmail,
  onContinueWithGoogle,
  onLogin,
}: OnboardingGetStartedProps) {
  const characterStyle = useAnimatedStyle(() => ({
    opacity: withDelay(isActive ? 100 : 0, withTiming(isActive ? 1 : 0, { duration: 400 })),
    transform: [
      {
        scale: withDelay(
          isActive ? 100 : 0,
          withSpring(isActive ? 1 : 0.9, { damping: 18, stiffness: 200 })
        ),
      },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: withDelay(isActive ? 200 : 0, withTiming(isActive ? 1 : 0, { duration: 400 })),
    transform: [
      {
        translateY: withDelay(isActive ? 200 : 0, withTiming(isActive ? 0 : 16, { duration: 400 })),
      },
    ],
  }));

  return (
    <View style={{ width: SCREEN_WIDTH }} className="flex-1 px-6">
      {/* Character */}
      <Animated.View
        style={[{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 16 }, characterStyle]}
      >
        <Image
          source={require('@/assets/images/nimo/nimo_getstarted.png')}
          style={{ width: SCREEN_WIDTH * 0.72, height: SCREEN_WIDTH * 0.72 }}
          contentFit="contain"
        />
      </Animated.View>

      {/* Content */}
      <Animated.View style={[{ paddingBottom: 12 }, contentStyle]}>
        <Text
          className="text-center font-jakarta text-primary mb-2"
          style={{ fontSize: 26, fontWeight: '700' }}
        >
          Let's get started!
        </Text>
        <Text
          className="text-center font-jakarta text-onSurfaceVariant mb-8"
          style={{ fontSize: 14, lineHeight: 20, maxWidth: 260, alignSelf: 'center' }}
        >
          Create your space and let Nimo be your memory guardian.
        </Text>

        {/* Continue with Email */}
        <TouchableOpacity
          onPress={onContinueWithEmail}
          activeOpacity={0.85}
          className="w-full rounded-2xl items-center justify-center flex-row gap-3 mb-3"
          style={{ backgroundColor: '#566434', height: 54 }}
        >
          <MaterialIcons name="email" size={20} color="white" />
          <Text style={{ color: 'white', fontSize: 15, fontWeight: '600', fontFamily: 'Plus Jakarta Sans' }}>
            Continue with Email
          </Text>
        </TouchableOpacity>

        {/* Continue with Google */}
        <TouchableOpacity
          onPress={onContinueWithGoogle}
          activeOpacity={0.85}
          className="w-full rounded-2xl items-center justify-center flex-row gap-3 border"
          style={{ borderColor: '#d2c4bc', height: 54, backgroundColor: '#ffffff' }}
        >
          {/* Google G icon (simple SVG-like text fallback) */}
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#4285F4' }}>G</Text>
          <Text style={{ color: '#27170c', fontSize: 15, fontWeight: '600', fontFamily: 'Plus Jakarta Sans' }}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Login link */}
        <TouchableOpacity onPress={onLogin} activeOpacity={0.7} className="items-center mt-5 mb-2">
          <Text style={{ fontSize: 13, color: '#4f453f', fontFamily: 'Plus Jakarta Sans' }}>
            Already have an account?{' '}
            <Text style={{ fontWeight: '700', color: '#566434' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
