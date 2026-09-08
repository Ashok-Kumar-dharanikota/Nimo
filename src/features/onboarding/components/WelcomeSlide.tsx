import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../utils/onboardingConstants';

export function WelcomeSlide({ isActive, scrollX }: { isActive: boolean; scrollX: SharedValue<number> }) {
  const characterStyle = useAnimatedStyle(() => {
    const progress = interpolate(scrollX.value, [0, SCREEN_WIDTH], [1, 0.9], Extrapolation.CLAMP);
    const opacityVal = interpolate(scrollX.value, [0, SCREEN_WIDTH * 0.5], [1, 0], Extrapolation.CLAMP);
    return {
      transform: [{ scale: progress }],
      opacity: opacityVal,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const opacityVal = interpolate(scrollX.value, [0, SCREEN_WIDTH * 0.4], [1, 0], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, [0, SCREEN_WIDTH], [0, -20], Extrapolation.CLAMP);
    return { opacity: opacityVal, transform: [{ translateY }] };
  });

  return (
    <View style={{ width: SCREEN_WIDTH }} className="flex-1">
      {/* Character fills most of the screen */}
      <Animated.View style={[styles.welcomeCharContainer, characterStyle]}>
        <Image
          source={require('@/assets/images/nimo/nimo_welcome.jpg')}
          style={styles.welcomeCharImage}
          contentFit="contain"
        />
      </Animated.View>

      {/* Brand name overlay at top */}
      <Animated.View style={[styles.welcomeTextTop, textStyle]}>
        <Image
          source={require('@/assets/images/nimo/brand_name.png')}
          style={{ width: 120, height: 36 }}
          contentFit="contain"
        />
        <Text style={styles.welcomeTagline}>
          Your memories.{'\n'}Protected with{' '}
          <Text style={{ color: '#c0874a', fontWeight: '700' }}>love.</Text>
        </Text>
      </Animated.View>

      {/* Bottom footnote */}
      <Animated.View style={[styles.welcomeFootnote, textStyle]}>
        <Text style={styles.welcomeFootnoteText}>
          Every moment you save,{'\n'}Nimo keeps it safe{'\n'}forever.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeCharContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  welcomeCharImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.65,
  },
  welcomeTextTop: {
    position: 'absolute',
    top: 20,
    left: 28,
  },
  welcomeTagline: {
    marginTop: 6,
    fontSize: 17,
    color: '#27170c',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '500',
    lineHeight: 24,
  },
  welcomeFootnote: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  welcomeFootnoteText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#4f453f',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: 20,
  },
});
