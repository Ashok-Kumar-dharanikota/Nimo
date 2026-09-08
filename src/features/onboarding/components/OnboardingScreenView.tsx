import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { ArrowRight } from 'lucide-react-native';

import { useOnboarding } from '../hooks/useOnboarding';
import { FEATURE_SLIDES, TOTAL_SLIDES } from '../utils/onboardingConstants';
import { WelcomeSlide } from './WelcomeSlide';
import { FeatureSlide } from './FeatureSlide';
import { SlideIndicators } from './SlideIndicators';
import { OnboardingGetStarted } from './OnboardingGetStarted';

export function OnboardingScreenView() {
  const {
    scrollRef,
    currentIndex,
    scrollX,
    isLastSlide,
    isFirstSlide,
    nextBtnStyle,
    handleScroll,
    handleNext,
    handleSkip,
    completeOnboarding,
    handleContinueWithEmail,
    handleLogin,
  } = useOnboarding();

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
      >
        {/* Slide 0: Welcome */}
        <WelcomeSlide isActive={currentIndex === 0} scrollX={scrollX} />

        {/* Slides 1-4: Feature slides */}
        {FEATURE_SLIDES.map((slide, i) => (
          <FeatureSlide key={slide.id} slide={slide} isActive={currentIndex === i + 1} />
        ))}

        {/* Slide 5: Get Started */}
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
});
