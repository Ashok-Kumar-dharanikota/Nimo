import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { storage } from '@/lib/storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { ArrowRight } from 'lucide-react-native';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';

import { SlideIndicators } from '@/components/onboarding/SlideIndicators';
import { OnboardingGetStarted } from '@/components/onboarding/OnboardingGetStarted';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


// ─── Slide data ──────────────────────────────────────────────────────────────

const FEATURE_SLIDES = [
  {
    id: 'protect',
    iconEmoji: '🛡️',
    iconBg: '#e8f4ef',
    title: 'Nimos protect\nyour memories',
    titleHighlight: null,
    description: 'We keep your precious moments safe, private and secure.',
    characterSource: require('@/assets/images/nimo/nimo_protect.png'),
  },
  {
    id: 'capture',
    iconEmoji: '🖼️',
    iconBg: '#e8f0f8',
    title: 'Capture anything,\nremember everything',
    titleHighlight: null,
    description: 'Photos, videos, notes, voice or places – Nimo remembers it all.',
    characterSource: require('@/assets/images/nimo/nimo_capture.png'),
  },
  {
    id: 'relive',
    iconEmoji: '💜',
    iconBg: '#f0eaf8',
    title: 'Relive. Reflect.\nGrow.',
    titleHighlight: null,
    description: 'Nimo helps you look back, understand and grow with your memories.',
    characterSource: require('@/assets/images/nimo/nimo_relive.png'),
  },
  {
    id: 'notifications',
    iconEmoji: '🔔',
    iconBg: '#fff4e6',
    title: 'Stay on track',
    titleHighlight: null,
    description: 'Enable notifications to remember to record your moments and daily tasks.',
    characterSource: require('@/assets/images/nimo/nimo_welcome.png'),
  },
];

// Total slides: welcome (0) + 4 features (1-4) + get-started (5)
const TOTAL_SLIDES = 6;

// ─── Main component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.value = e.nativeEvent.contentOffset.x;
      const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setCurrentIndex(idx);
    },
    [scrollX]
  );

  const goToSlide = useCallback(
    (index: number) => {
      scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    },
    []
  );

  const { requestPermissions } = useNotificationScheduler();

  const handleNext = useCallback(async () => {
    // Index 4 is the notifications slide.
    if (currentIndex === 4) {
      await requestPermissions();
    }
    
    if (currentIndex < TOTAL_SLIDES - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, goToSlide, requestPermissions]);

  const handleSkip = useCallback(() => {
    goToSlide(TOTAL_SLIDES - 1);
  }, [goToSlide]);

  const completeOnboarding = useCallback(() => {
    storage.set('hasSeenOnboarding', true);
    router.replace('/(app)/home');
  }, [router]);

  const handleContinueWithEmail = useCallback(() => {
    router.push({ pathname: '/auth', params: { mode: 'signUp' } });
  }, [router]);

  const handleLogin = useCallback(() => {
    router.push({ pathname: '/auth', params: { mode: 'signIn' } });
  }, [router]);

  const isLastSlide = currentIndex === TOTAL_SLIDES - 1;
  const isFirstSlide = currentIndex === 0;

  // Animate the next button (hide on last slide)
  const nextBtnStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isLastSlide ? 0 : 1, { duration: 200 }),
    transform: [{ scale: withTiming(isLastSlide ? 0.7 : 1, { duration: 200 }) }],
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* ── Header: Skip (shown on slides 1-3) ── */}
      <View style={styles.header}>
        {!isFirstSlide && !isLastSlide && (
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Pager ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.pager}
        contentContainerStyle={styles.pagerContent}
      >
        {/* Slide 0: Welcome */}
        <WelcomeSlide isActive={currentIndex === 0} scrollX={scrollX} />

        {/* Slides 1-3: Feature slides */}
        {FEATURE_SLIDES.map((slide, i) => (
          <FeatureSlide key={slide.id} slide={slide} isActive={currentIndex === i + 1} />
        ))}

        {/* Slide 4: Get Started */}
        <OnboardingGetStarted
          isActive={currentIndex === TOTAL_SLIDES - 1}
          onContinueWithEmail={handleContinueWithEmail}
          onContinueWithGoogle={completeOnboarding}
          onLogin={handleLogin}
        />
      </ScrollView>

      {/* ── Footer: Dots + Next Button ── */}
      {!isLastSlide && (
        <View style={styles.footer}>
          <SlideIndicators count={TOTAL_SLIDES - 1} currentIndex={currentIndex} />
          <Animated.View style={nextBtnStyle}>
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.85}
              style={styles.nextBtn}
            >
              <ArrowRight size={22} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Welcome Slide ────────────────────────────────────────────────────────────

function WelcomeSlide({ isActive, scrollX }: { isActive: boolean; scrollX: any }) {
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
          source={require('@/assets/images/nimo/nimo_welcome.png')}
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

// ─── Feature Slide ────────────────────────────────────────────────────────────

function FeatureSlide({ slide, isActive }: { slide: typeof FEATURE_SLIDES[0]; isActive: boolean }) {
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbf9f4',
  },
  header: {
    height: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipText: {
    fontSize: 15,
    color: '#4f453f',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '500',
  },
  pager: {
    flex: 1,
  },
  pagerContent: {
    // width handled per slide
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  nextBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#566434',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#566434',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Welcome
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
  // Feature
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
