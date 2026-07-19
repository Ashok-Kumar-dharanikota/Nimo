import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { MomentItem } from '../../services/homeService';

// Leaf geometry
const LEAF_W = 40;
const LEAF_H = 54;

// Slight rotation variation per leaf index for organic feel
const ROTATIONS = [22, 28, 18, 32, 20, 26, 24, 30, 16, 34];

interface TreeLeafProps {
  moment: MomentItem;
  side: 'left' | 'right';
  /** 0-based index of this leaf on its day, used for rotation variation */
  index: number;
  /** Stagger delay in ms */
  delay?: number;
  onPress: (moment: MomentItem) => void;
}

export function TreeLeaf({ moment, side, index, delay = 0, onPress }: TreeLeafProps) {
  const scale = useSharedValue(1);

  const rotationDeg = ROTATIONS[index % ROTATIONS.length];
  // Left leaves tilt left (negative), right leaves tilt right (positive)
  const rotateDeg = side === 'left' ? -rotationDeg : rotationDeg;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotateDeg}deg` }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.85, { duration: 80 }),
      withTiming(1.05, { duration: 100 }),
      withTiming(1.0, { duration: 80 }),
    );
    onPress(moment);
  };

  // Leaf tip: for left-side leaves, the top-right corner is the tip pointing toward trunk
  // For right-side leaves, the top-left corner is the tip
  const borderRadii =
    side === 'left'
      ? {
          borderTopLeftRadius: LEAF_H / 2,
          borderTopRightRadius: 5,
          borderBottomLeftRadius: LEAF_H / 2,
          borderBottomRightRadius: LEAF_H / 2,
        }
      : {
          borderTopLeftRadius: 5,
          borderTopRightRadius: LEAF_H / 2,
          borderBottomLeftRadius: LEAF_H / 2,
          borderBottomRightRadius: LEAF_H / 2,
        };

  return (
    <Animated.View entering={FadeIn.delay(delay).duration(300)}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePress}
          style={[styles.leaf, borderRadii]}
        >
          {/* Leaf vein line */}
          <View style={[styles.vein, side === 'left' ? styles.veinLeft : styles.veinRight]} />
          {/* Content preview */}
          <Text style={styles.text} numberOfLines={3}>
            {moment.content}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

// Ghost leaf for empty days
export function GhostLeaf({ side }: { side: 'left' | 'right' }) {
  const rotationDeg = 24;
  const rotateDeg = side === 'left' ? -rotationDeg : rotationDeg;

  const borderRadii =
    side === 'left'
      ? { borderTopLeftRadius: LEAF_H / 2, borderTopRightRadius: 5, borderBottomLeftRadius: LEAF_H / 2, borderBottomRightRadius: LEAF_H / 2 }
      : { borderTopLeftRadius: 5, borderTopRightRadius: LEAF_H / 2, borderBottomLeftRadius: LEAF_H / 2, borderBottomRightRadius: LEAF_H / 2 };

  return (
    <View
      style={[
        styles.leaf,
        borderRadii,
        styles.ghostLeaf,
        { transform: [{ rotate: `${rotateDeg}deg` }] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  leaf: {
    width: LEAF_W,
    height: LEAF_H,
    backgroundColor: '#566434',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  vein: {
    position: 'absolute',
    width: 1,
    height: '65%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    top: '18%',
  },
  veinLeft: { right: '30%' },
  veinRight: { left: '30%' },
  text: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: 9,
  },
  ghostLeaf: {
    backgroundColor: 'rgba(164, 180, 124, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(164, 180, 124, 0.5)',
  },
});
