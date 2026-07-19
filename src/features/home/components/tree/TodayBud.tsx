import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Sizes
const BUD_SIZE = 14;
const RING_MAX = 28;

export function TodayBud() {
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.6);

  useEffect(() => {
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.9, { duration: 1100, easing: Easing.out(Easing.quad) }),
        withTiming(1.0, { duration: 1100, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1100 }),
        withTiming(0.55, { duration: 1100 }),
      ),
      -1,
      false
    );
  }, [ringScale, ringOpacity]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Pulsing ring */}
      <Animated.View style={[styles.ring, ringStyle]} />
      {/* Solid bud */}
      <View style={styles.bud} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BUD_SIZE,
    height: BUD_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: BUD_SIZE,
    height: BUD_SIZE,
    borderRadius: BUD_SIZE / 2,
    borderWidth: 1.5,
    borderColor: '#566434',
  },
  bud: {
    width: BUD_SIZE,
    height: BUD_SIZE,
    borderRadius: BUD_SIZE / 2,
    backgroundColor: '#566434',
  },
});
