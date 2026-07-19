import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlideProp {
  iconSource?: any;
  iconColor?: string;
  iconBgColor?: string;
  iconName?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  characterSource: any;
  isActive: boolean;
}

export function OnboardingSlide({
  iconSource,
  iconColor,
  iconBgColor,
  iconName,
  title,
  titleHighlight,
  description,
  characterSource,
  isActive,
}: OnboardingSlideProp) {
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

  const textStyle = useAnimatedStyle(() => ({
    opacity: withDelay(isActive ? 200 : 0, withTiming(isActive ? 1 : 0, { duration: 400 })),
    transform: [
      {
        translateY: withDelay(
          isActive ? 200 : 0,
          withTiming(isActive ? 0 : 12, { duration: 400, easing: Easing.out(Easing.quad) })
        ),
      },
    ],
  }));

  return (
    <View style={{ width: SCREEN_WIDTH }} className="flex-1 px-6">
      {/* Character illustration */}
      <Animated.View
        style={[{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 12 }, characterStyle]}
      >
        {/* Icon badge (slides 2–4) */}
        {iconName && iconBgColor && (
          <View
            className="absolute top-10 self-center rounded-full items-center justify-center"
            style={{ width: 52, height: 52, backgroundColor: iconBgColor, zIndex: 10 }}
          >
            <Text style={{ fontSize: 26 }}>{iconSource}</Text>
          </View>
        )}

        <Image
          source={characterSource}
          style={{ width: SCREEN_WIDTH * 0.78, height: SCREEN_WIDTH * 0.78 }}
          contentFit="contain"
        />
      </Animated.View>

      {/* Text content */}
      <Animated.View style={[{ paddingBottom: 8, alignItems: 'center' }, textStyle]}>
        <Text
          className="text-center font-jakarta text-primary mb-3"
          style={{ fontSize: 24, fontWeight: '700', lineHeight: 32 }}
        >
          {title}
          {titleHighlight && (
            <Text style={{ color: '#c0874a' }}>{titleHighlight}</Text>
          )}
        </Text>
        <Text
          className="text-center font-jakarta text-onSurfaceVariant"
          style={{ fontSize: 15, lineHeight: 22, maxWidth: 280 }}
        >
          {description}
        </Text>
      </Animated.View>
    </View>
  );
}
