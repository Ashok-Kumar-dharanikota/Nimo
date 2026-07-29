import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
  withRepeat,
} from 'react-native-reanimated';

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const nameTranslateY = useSharedValue(20);
  const nameOpacity = useSharedValue(0);
  const footnoteOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    // 1. Logo scales and fades in
    logoScale.value = withDelay(100, withSpring(1, { damping: 15 }));
    logoOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));

    // 2. Brand name slides up and fades in
    nameTranslateY.value = withDelay(500, withTiming(0, { duration: 800, easing: Easing.out(Easing.quad) }));
    nameOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));

    // 3. Footnote fades in
    footnoteOpacity.value = withDelay(900, withTiming(1, { duration: 800 }));

    // 4. Container fades and zooms out to reveal the main application
    containerOpacity.value = withDelay(2500, withTiming(0, { duration: 600 }, (finished) => {
      if (finished) {
        runOnJS(setVisible)(false);
      }
    }));
    containerScale.value = withDelay(2500, withTiming(1.08, { duration: 600, easing: Easing.out(Easing.quad) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameTranslateY.value }],
  }));

  const footnoteStyle = useAnimatedStyle(() => ({
    opacity: footnoteOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.centerContent}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image
            style={styles.logo}
            source={require('@/assets/images/nimo/nimo_logo.png')}
            contentFit="contain"
          />
        </Animated.View>
        <Animated.View style={[styles.nameContainer, nameStyle]}>
          <Image
            style={styles.name}
            source={require('@/assets/images/nimo/brand_name.png')}
            contentFit="contain"
          />
        </Animated.View>
      </View>

      <Animated.View style={[styles.footnoteContainer, footnoteStyle]}>
        <Image
          style={styles.footnote}
          source={require('@/assets/images/nimo/brand_footnote.png')}
          contentFit="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

// Update AnimatedIcon component to use the new brand logo
export function AnimatedIcon() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 60000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={[styles.glow, animatedStyle]}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <View style={styles.brandBackground} />
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('@/assets/images/nimo/nimo_logo.png')} contentFit="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backgroundColor: '#fbf9f4',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    width: 160,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    width: '100%',
    height: '100%',
  },
  footnoteContainer: {
    position: 'absolute',
    bottom: 50,
    width: 220,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footnote: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  brandBackground: {
    borderRadius: 40,
    backgroundColor: '#fbf9f4',
    width: 128,
    height: 128,
    position: 'absolute',
  },
  imageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    height: 76,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
