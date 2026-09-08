import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { Mail } from 'lucide-react-native';
import { SCREEN_WIDTH } from '../utils/onboardingConstants';

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
          source={require('@/assets/images/nimo/nimo_getstarted.jpg')}
          style={{ width: SCREEN_WIDTH * 0.72, height: SCREEN_WIDTH * 0.72 }}
          contentFit="contain"
        />
      </Animated.View>

      {/* Buttons */}
      <Animated.View style={[{ paddingBottom: 24, gap: 12 }, contentStyle]}>
        <Text
          style={{
            fontFamily: 'Playfair Display',
            fontSize: 28,
            fontWeight: '700',
            color: '#27170c',
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          Ready to begin?
        </Text>
        <Text
          style={{
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 14,
            color: '#8c7c6c',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Start saving the moments that matter most.
        </Text>

        {/* Email button */}
        <TouchableOpacity
          onPress={onContinueWithEmail}
          activeOpacity={0.85}
          style={{
            height: 52,
            backgroundColor: '#566434',
            borderRadius: 26,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            shadowColor: '#566434',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Mail size={18} color="white" />
          <Text style={{ color: 'white', fontSize: 15, fontFamily: 'Plus Jakarta Sans', fontWeight: '600' }}>
            Continue with Email
          </Text>
        </TouchableOpacity>

        {/* Guest / Explore button */}
        <TouchableOpacity
          onPress={onContinueWithGoogle}
          activeOpacity={0.8}
          style={{
            height: 52,
            backgroundColor: 'white',
            borderRadius: 26,
            borderWidth: 1.5,
            borderColor: '#e8e2d8',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#4f453f', fontSize: 15, fontFamily: 'Plus Jakarta Sans', fontWeight: '600' }}>
            Explore as Guest
          </Text>
        </TouchableOpacity>

        {/* Login link */}
        <TouchableOpacity onPress={onLogin} activeOpacity={0.7} style={{ alignItems: 'center', paddingTop: 4 }}>
          <Text style={{ fontSize: 13, color: '#8c7c6c', fontFamily: 'Plus Jakarta Sans' }}>
            Already have an account?{' '}
            <Text style={{ color: '#566434', fontWeight: '600' }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
