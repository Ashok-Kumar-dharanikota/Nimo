import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface SlideIndicatorsProps {
  count: number;
  currentIndex: number;
}

export function SlideIndicators({ count, currentIndex }: SlideIndicatorsProps) {
  return (
    <View className="flex-row items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <DotIndicator key={i} isActive={i === currentIndex} />
      ))}
    </View>
  );
}

function DotIndicator({ isActive }: { isActive: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isActive ? 24 : 8, { damping: 20, stiffness: 260 }),
    opacity: withSpring(isActive ? 1 : 0.35, { damping: 20, stiffness: 260 }),
  }));

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
          backgroundColor: '#566434',
        },
        animatedStyle,
      ]}
    />
  );
}
