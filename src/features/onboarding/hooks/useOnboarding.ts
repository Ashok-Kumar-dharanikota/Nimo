import { useRef, useState, useCallback } from 'react';
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';
import { onboardingService } from '../services/onboardingService';
import { SCREEN_WIDTH, TOTAL_SLIDES } from '../utils/onboardingConstants';

export function useOnboarding() {
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

  const goToSlide = useCallback((index: number) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  }, []);

  const { requestPermissions } = useNotificationScheduler();

  const handleNext = useCallback(async () => {
    // Index 4 is the notifications slide
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
    onboardingService.completeOnboarding();
    router.replace('/(app)');
  }, [router]);

  const handleContinueWithEmail = useCallback(() => {
    router.push({ pathname: '/auth', params: { mode: 'signUp' } });
  }, [router]);

  const handleLogin = useCallback(() => {
    router.push({ pathname: '/auth', params: { mode: 'signIn' } });
  }, [router]);

  const isLastSlide = currentIndex === TOTAL_SLIDES - 1;
  const isFirstSlide = currentIndex === 0;

  const nextBtnStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isLastSlide ? 0 : 1, { duration: 200 }),
    transform: [{ scale: withTiming(isLastSlide ? 0.7 : 1, { duration: 200 }) }],
  }));

  return {
    scrollRef,
    currentIndex,
    scrollX,
    isLastSlide,
    isFirstSlide,
    nextBtnStyle,
    handleScroll,
    goToSlide,
    handleNext,
    handleSkip,
    completeOnboarding,
    handleContinueWithEmail,
    handleLogin,
  };
}
