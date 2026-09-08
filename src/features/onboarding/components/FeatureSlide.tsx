import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { SCREEN_WIDTH, type FeatureSlideData } from '../utils/onboardingConstants';

export function FeatureSlide({
  slide,
  isActive,
}: {
  slide: FeatureSlideData;
  isActive: boolean;
}) {
  const characterStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0, { duration: 350 }),
    transform: [
      { scale: withSpring(isActive ? 1 : 0.88, { damping: 18, stiffness: 180 }) },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0, { duration: 350 }),
    transform: [
      { translateY: withTiming(isActive ? 0 : 16, { duration: 350 }) },
    ],
  }));

  return (
    <View style={{ width: SCREEN_WIDTH }} className="flex-1 px-6">
      {/* Icon badge */}
      <View style={styles.iconBadge}>
        <View style={[styles.iconCircle, { backgroundColor: slide.iconBg }]}>
          <Text style={{ fontSize: 26 }}>{slide.iconEmoji}</Text>
        </View>
      </View>

      {/* Character */}
      <Animated.View style={[styles.featureCharContainer, characterStyle]}>
        <Image
          source={slide.characterSource}
          style={styles.featureCharImage}
          contentFit="contain"
        />
      </Animated.View>

      {/* Text */}
      <Animated.View style={[{ paddingBottom: 8, alignItems: 'center' }, textStyle]}>
        <Text style={styles.featureTitle}>{slide.title}</Text>
        <Text style={styles.featureDesc}>{slide.description}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBadge: {
    alignItems: 'center',
    paddingTop: 12,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCharContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  featureCharImage: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
  },
  featureTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#27170c',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: 32,
    marginBottom: 10,
  },
  featureDesc: {
    textAlign: 'center',
    fontSize: 15,
    color: '#4f453f',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: 22,
    maxWidth: 280,
  },
});
