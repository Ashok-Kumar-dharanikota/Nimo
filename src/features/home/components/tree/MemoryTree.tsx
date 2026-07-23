import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { DayData, MomentItem } from '../../services/homeService';
import { FloatingMomentTooltip } from './FloatingMomentTooltip';

interface MemoryTreeProps {
  days: DayData[];
  isLoading: boolean;
  onBack?: () => void;
  onSelectEmptyDay?: (day: DayData) => void;
}

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getSeasonTheme = (monthIndex: number) => {
  // Spring: 2, 3, 4 (Mar-May)
  if (monthIndex >= 2 && monthIndex <= 4)
    return { dot: '#7CB342', bg: 'rgba(124, 179, 66, 0.12)', label: '#558B2F' };
  // Summer: 5, 6, 7 (Jun-Aug) - High contrast gold/amber
  if (monthIndex >= 5 && monthIndex <= 7)
    return { dot: '#FBC02D', bg: 'rgba(251, 192, 45, 0.15)', label: '#F57F17' };
  // Autumn: 8, 9, 10 (Sep-Nov)
  if (monthIndex >= 8 && monthIndex <= 10)
    return { dot: '#FB8C00', bg: 'rgba(251, 140, 0, 0.12)', label: '#E65100' };
  // Winter: 11, 0, 1 (Dec-Feb)
  return { dot: '#0288D1', bg: 'rgba(2, 136, 209, 0.12)', label: '#01579B' };
};

const StaticSprout = ({ opacity = 1 }: { opacity?: number }) => {
  return (
    <Image
      source={require('../../../../../assets/images/nimo/sprout.png')}
      style={[styles.sproutImage, { opacity }]}
      resizeMode="contain"
    />
  );
};

const TodayPulseRing = ({ children }: { children: React.ReactNode }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 1200 }),
        withTiming(1.0, { duration: 1200 })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1200 }),
        withTiming(0.3, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.todayWrapper}>
      <Animated.View style={[styles.todayGlowRing, ringStyle]} />
      {children}
    </View>
  );
};

export function MemoryTree({ days, isLoading, onBack, onSelectEmptyDay }: MemoryTreeProps) {
  const [selectedMoment, setSelectedMoment] = useState<MomentItem | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const monthOffsets = useRef<{ [key: number]: number }>({});
  const currentMonthY = useRef<number | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showJumpToToday, setShowJumpToToday] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth();

  // Group days by month (0-11)
  const monthsData = Array.from({ length: 12 }, () => [] as DayData[]);
  days.forEach((day) => {
    const dateObj = new Date(day.date);
    const m = dateObj.getMonth();
    monthsData[m].push(day);
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handleDayPress = useCallback((day: DayData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (day.moments.length > 0) {
      setSelectedMoment(day.moments[0]);
    } else if (onSelectEmptyDay) {
      onSelectEmptyDay(day);
    }
  }, [onSelectEmptyDay]);

  const handleCloseSheet = useCallback(() => {
    setSelectedMoment(null);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    if (currentMonthY.current !== null) {
      if (Math.abs(y - currentMonthY.current) > 280) {
        setShowJumpToToday(true);
      } else {
        setShowJumpToToday(false);
      }
    }
  }, []);

  const handleJumpToToday = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentMonthY.current !== null) {
      scrollViewRef.current?.scrollTo({ y: currentMonthY.current, animated: true });
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {isLoading && days.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A4B47C" />
            <Text style={styles.loadingText}>Planting your garden…</Text>
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(400)} style={styles.gardenContainer}>
            {/* Top Bar Header */}
            <View style={styles.headerRow}>
              {onBack && (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onBack();
                  }}
                  style={styles.backBtn}
                  activeOpacity={0.7}
                  accessibilityLabel="Go back"
                  accessibilityRole="button"
                >
                  <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
              )}
              <View style={styles.yearPillContainer}>
                <View style={[styles.yearPill, { backgroundColor: getSeasonTheme(currentMonth).dot }]}>
                  <Text style={styles.yearText}>{now.getFullYear()}</Text>
                </View>
              </View>
            </View>

            {/* Months Stream */}
            <View style={styles.gardenContainerInner}>
              {monthsData.map((monthDays, idx) => {
                if (monthDays.length === 0) return null;
                const isCurrentMonth = idx === currentMonth;
                const season = getSeasonTheme(idx);

                // Determine weekday offset for 1st day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
                const firstDayDate = monthDays[0]?.date
                  ? new Date(monthDays[0].date)
                  : new Date(now.getFullYear(), idx, 1);
                const firstDayOfWeek = firstDayDate.getDay();

                return (
                  <View
                    key={`month-${idx}`}
                    style={styles.monthBlock}
                    onLayout={(e) => {
                      const y = e.nativeEvent.layout.y;
                      monthOffsets.current[idx] = y;
                      if (isCurrentMonth) {
                        currentMonthY.current = y;
                        if (!hasScrolled) {
                          setHasScrolled(true);
                          setTimeout(() => {
                            scrollViewRef.current?.scrollTo({ y, animated: true });
                          }, 400);
                        }
                      }
                    }}
                  >
                    {/* Month Header Label */}
                    <View style={styles.monthHeaderRow}>
                      <Text style={[styles.monthLabel, { color: season.label }]}>
                        {monthNames[idx]}
                      </Text>
                    </View>

                    {/* Weekday Row Header (S M T W T F S) */}
                    <View style={styles.weekdayHeaderRow}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <View key={`wd-${idx}-${i}`} style={styles.weekdayCell}>
                          <Text style={styles.weekdayLabel}>{day}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Calendar Grid with Offset Padding */}
                    <View style={styles.grid}>
                      {/* Leading Empty Spacer Cells for Day-of-Week Alignment */}
                      {Array.from({ length: firstDayOfWeek }).map((_, padIdx) => (
                        <View key={`pad-${idx}-${padIdx}`} style={styles.gridCell} />
                      ))}

                      {/* Actual Days */}
                      {monthDays.map((dayData, i) => {
                        const hasMoments = dayData.moments.length > 0;
                        const isToday = dayData.isToday;

                        // Seeded random jitter for organic terrain
                        const seed = idx * 100 + i;
                        const jitterX = (pseudoRandom(seed) - 0.5) * 6;
                        const jitterY = (pseudoRandom(seed + 1) - 0.5) * 6;

                        const dateFormatted = `${monthNames[idx]} ${i + 1}`;
                        const accessibilityText = `${dateFormatted}, ${hasMoments
                          ? `${dayData.moments.length} memory logged`
                          : 'No memories'
                          }${isToday ? ' (Today)' : ''}`;

                        const CellContent = (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleDayPress(dayData)}
                            style={[
                              styles.touchableCell,
                              isToday && styles.todayCellContainer,
                              { transform: [{ translateX: jitterX }, { translateY: jitterY }] },
                            ]}
                            accessible={true}
                            accessibilityLabel={accessibilityText}
                            accessibilityHint={
                              hasMoments
                                ? 'Tap to view memory'
                                : isToday
                                  ? 'Tap to add today memory'
                                  : undefined
                            }
                            accessibilityRole="button"
                          >
                            {hasMoments ? (
                              <StaticSprout opacity={1} />
                            ) : isToday ? (
                              <StaticSprout opacity={0.6} />
                            ) : (
                              <Text style={[styles.emptyDot, { color: season.dot }]}>·</Text>
                            )}
                          </TouchableOpacity>
                        );

                        return (
                          <View key={`day-wrap-${dayData.dateStr}`} style={styles.gridCell}>
                            {isToday ? (
                              <TodayPulseRing>{CellContent}</TodayPulseRing>
                            ) : (
                              CellContent
                            )}
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

      {/* Floating Jump to Today FAB */}
      {showJumpToToday && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.fabContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleJumpToToday}
            style={styles.fabButton}
            accessibilityLabel="Jump to Today"
            accessibilityRole="button"
          >
            <Feather name="navigation" size={14} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.fabText}>Today</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Floating Tooltip Card (replaces bottom sheet) */}
      <FloatingMomentTooltip moment={selectedMoment} onClose={handleCloseSheet} />
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
    marginBottom: 28,
    marginTop: 16,
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
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  yearText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  gardenContainerInner: {
    paddingBottom: 20,
  },
  monthBlock: {
    marginBottom: 32,
    position: 'relative',
  },
  monthHeaderRow: {
    position: 'relative',
    height: 32,
    justifyContent: 'center',
    marginBottom: 6,
  },
  monthLabel: {
    fontSize: 12,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginLeft: 16,
  },
  weekdayHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  weekdayCell: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#a39485',
    fontFamily: 'Plus Jakarta Sans',
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
  touchableCell: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayGlowRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#7CB342',
    backgroundColor: 'rgba(124, 179, 66, 0.15)',
  },
  todayCellContainer: {
    borderRadius: 18,
  },
  sproutImage: {
    width: 28,
    height: 28,
  },
  emptyDot: {
    fontSize: 26,
    fontWeight: '700',
  },
  bottomPad: { height: 100 },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 100,
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7CB342',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
});
