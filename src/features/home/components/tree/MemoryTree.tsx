import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import type { DayData, MomentItem } from '../../services/homeService';
import { MomentSheet } from './MomentSheet';

interface MemoryTreeProps {
  days: DayData[];
  isLoading: boolean;
  onBack?: () => void;
}

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getSeasonTheme = (monthIndex: number) => {
  // Spring: 2, 3, 4 (Mar-May)
  if (monthIndex >= 2 && monthIndex <= 4) return { dot: '#AED581' }; 
  // Summer: 5, 6, 7 (Jun-Aug)
  if (monthIndex >= 5 && monthIndex <= 7) return { dot: '#FFF59D' }; 
  // Autumn: 8, 9, 10 (Sep-Nov)
  if (monthIndex >= 8 && monthIndex <= 10) return { dot: '#FFB74D' }; 
  // Winter: 11, 0, 1 (Dec-Feb)
  return { dot: '#81D4FA' }; 
};

const AnimatedPlant = ({ emoji, seed }: { emoji: string; seed: number }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    const delay = pseudoRandom(seed) * 2000;
    const timeout = setTimeout(() => {
      rotation.value = withRepeat(
        withSequence(
          withTiming(6, { duration: 1500 }),
          withTiming(-6, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, [seed]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }]
  }));

  return (
    <Animated.View style={style}>
      <Text style={styles.plantEmoji}>{emoji}</Text>
    </Animated.View>
  );
};

const Butterfly = () => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 800 }),
        withTiming(10, { duration: 1200 })
      ),
      -1, true
    );
    translateX.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 2000 }),
        withTiming(-20, { duration: 2500 })
      ),
      -1, true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 20,
    right: 40,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value }
    ]
  }));

  return (
    <Animated.Text style={[style, { fontSize: 24, zIndex: 10 }]}>🦋</Animated.Text>
  );
};

export function MemoryTree({ days, isLoading, onBack }: MemoryTreeProps) {
  const [selectedMoment, setSelectedMoment] = useState<MomentItem | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const monthOffsets = useRef<{ [key: number]: number }>({});
  const [hasScrolled, setHasScrolled] = useState(false);
  const currentMonth = new Date().getMonth();

  // Group days by month (0-11)
  const monthsData = Array.from({ length: 12 }, () => [] as DayData[]);
  days.forEach(day => {
    const dateObj = new Date(day.date);
    const m = dateObj.getMonth();
    monthsData[m].push(day);
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDayPress = useCallback((day: DayData) => {
    if (day.moments.length > 0) {
      setSelectedMoment(day.moments[0]);
    }
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedMoment(null);
  }, []);

  const getPlantEmoji = (moment: MomentItem | undefined) => {
    if (!moment) return '';
    if (moment.emotion) return moment.emotion;
    return '🌳'; // default
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && days.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A4B47C" />
            <Text style={styles.loadingText}>Planting your garden…</Text>
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(400)} style={styles.gardenContainer}>
            <View style={styles.headerRow}>
              {onBack && (
                <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
                  <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
              )}
              <View style={styles.yearPillContainer}>
                <View style={[styles.yearPill, { backgroundColor: getSeasonTheme(currentMonth).dot }]}>
                  <Text style={styles.yearText}>{new Date().getFullYear()}</Text>
                </View>
              </View>
            </View>

            <View style={styles.gardenContainerInner}>
              {monthsData.map((monthDays, idx) => {
                if (monthDays.length === 0) return null;
                const isCurrentMonth = idx === currentMonth;
                const season = getSeasonTheme(idx);
                
                return (
                  <View 
                    key={`month-${idx}`} 
                    style={styles.monthBlock}
                    onLayout={(e) => {
                      const y = e.nativeEvent.layout.y;
                      monthOffsets.current[idx] = y;
                      if (isCurrentMonth && !hasScrolled) {
                        setHasScrolled(true);
                        setTimeout(() => {
                          scrollViewRef.current?.scrollTo({ y, animated: true });
                        }, 600);
                      }
                    }}
                  >
                    <View style={styles.monthHeaderRow}>
                      <Text style={styles.monthLabel}>{monthNames[idx]}</Text>
                      {isCurrentMonth && <Butterfly />}
                    </View>
                    
                    <View style={styles.grid}>
                      {monthDays.map((dayData, i) => {
                        const hasMoments = dayData.moments.length > 0;
                        const plant = getPlantEmoji(dayData.moments[0]);
                        const hasPrevDayMoment = i > 0 && monthDays[i - 1].moments.length > 0;
                        
                        // Seeded random jitter for organic terrain
                        const seed = idx * 100 + i;
                        const jitterX = (pseudoRandom(seed) - 0.5) * 8;
                        const jitterY = (pseudoRandom(seed + 1) - 0.5) * 8;

                        return (
                          <View key={`day-wrap-${dayData.dateStr}`} style={styles.gridCell}>
                            {/* Streak Vine */}
                            {hasMoments && hasPrevDayMoment && (
                              <View style={styles.streakVine} />
                            )}
                            
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => hasMoments && handleDayPress(dayData)}
                              disabled={!hasMoments}
                              style={{ transform: [{ translateX: jitterX }, { translateY: jitterY }] }}
                            >
                              {hasMoments ? (
                                <AnimatedPlant emoji={plant} seed={seed} />
                              ) : (
                                <Text style={[styles.emptyDot, { color: season.dot }]}>·</Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.bottomPad} />
          </Animated.View>
        )}
      </ScrollView>

      <MomentSheet moment={selectedMoment} onClose={handleCloseSheet} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 8,
  },
  gardenContainer: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#8c7c6c',
    fontFamily: 'Plus Jakarta Sans',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearPillContainer: {
    flex: 1,
    alignItems: 'center',
  },
  yearPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  yearText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  gardenContainerInner: {
    paddingBottom: 20,
  },
  monthBlock: {
    marginBottom: 24,
    position: 'relative',
  },
  monthHeaderRow: {
    position: 'relative',
    height: 30, // reserved space so butterfly doesn't overlap excessively with grid below
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 11,
    color: '#8c7c6c',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginLeft: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
  },
  gridCell: {
    width: '14.28%', // 100% / 7 columns
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  streakVine: {
    position: 'absolute',
    left: '-50%',
    top: '50%',
    width: '100%',
    height: 2,
    backgroundColor: '#8c7c6c',
    opacity: 0.3,
    zIndex: -1,
  },
  emptyDot: {
    fontSize: 24, 
    opacity: 0.8,
  },
  plantEmoji: {
    fontSize: 22,
  },
  bottomPad: { height: 100 },
});
