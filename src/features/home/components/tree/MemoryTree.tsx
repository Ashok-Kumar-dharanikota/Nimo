import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useRef, useState } from 'react';
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
  FadeIn
} from 'react-native-reanimated';
import type { DayData, MomentItem } from '../../services/homeService';
import {
  calculateGardenStats,
  getTheme,
  type GardenThemeId,
} from '../../utils/gardenUtils';
import { FloatingMomentTooltip } from './FloatingMomentTooltip';
import { GardenPlant } from './GardenPlant';

interface MemoryTreeProps {
  days: DayData[];
  isLoading: boolean;
  onBack?: () => void;
  onSelectEmptyDay?: (day: DayData) => void;
  themeId?: GardenThemeId;
}

const getSeasonTheme = (monthIndex: number) => {
  if (monthIndex >= 2 && monthIndex <= 4)
    return { dot: '#7CB342', bg: 'rgba(124, 179, 66, 0.12)', label: '#558B2F' };
  if (monthIndex >= 5 && monthIndex <= 7)
    return { dot: '#FBC02D', bg: 'rgba(251, 192, 45, 0.15)', label: '#F57F17' };
  if (monthIndex >= 8 && monthIndex <= 10)
    return { dot: '#FB8C00', bg: 'rgba(251, 140, 0, 0.12)', label: '#E65100' };
  return { dot: '#0288D1', bg: 'rgba(2, 136, 209, 0.12)', label: '#01579B' };
};

// TodayPulseRing removed as requested by user.

// ─── Garden Stats Bar ─────────────────────────────────────────
const GardenStatsBar = ({ days, themeColor }: { days: DayData[]; themeColor: string }) => {
  const stats = useMemo(() => calculateGardenStats(days), [days]);

  return (
    <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.statsBar}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.totalPlants}</Text>
        <Text style={styles.statLabel}>planted</Text>
      </View>
      <View style={[styles.statDivider, { backgroundColor: themeColor + '30' }]} />
      <View style={styles.statItem}>
        <Text style={[styles.statValue, stats.currentStreak > 0 && { color: themeColor }]}>
          {stats.currentStreak}
        </Text>
        <Text style={styles.statLabel}>streak</Text>
      </View>
      <View style={[styles.statDivider, { backgroundColor: themeColor + '30' }]} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.bloomCount}</Text>
        <Text style={styles.statLabel}>blooms</Text>
      </View>
      <View style={[styles.statDivider, { backgroundColor: themeColor + '30' }]} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.uniqueEmotions}</Text>
        <Text style={styles.statLabel}>varieties</Text>
      </View>
    </Animated.View>
  );
};

const LEGEND_STAGES = [
  { height: 78, opacity: 1, label: '0-1d', source: require('../../../../../assets/images/nimo/sprout.png') },
  { height: 78, opacity: 1, label: '2-3d', source: require('../../../../../assets/images/nimo/sprout_level2_growth.png') },
  { height: 78, opacity: 1, label: '4-5d', source: require('../../../../../assets/images/nimo/sprout_level3_growth.png') },
  { height: 78, opacity: 1, label: '6-7d', source: require('../../../../../assets/images/nimo/sprout_level4_growth.png') },
  { height: 78, opacity: 1, label: '8+d', source: require('../../../../../assets/images/nimo/tree_memoryofthemonth.png') },
];

const GrowthLegend = () => (
  <Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.legendContainer}>
    <Text style={styles.legendTitle}>How your garden grows</Text>
    <View style={styles.legendRow}>
      {LEGEND_STAGES.map((stage) => {
        const asset = Image.resolveAssetSource(stage.source);
        const aspectRatio = asset && asset.height > 0 ? asset.width / asset.height : 1;
        return (
          <View key={stage.label} style={styles.legendItem}>
            <View style={styles.legendVisual}>
              <Image
                source={stage.source}
                style={{ height: stage.height, width: stage.height * aspectRatio, opacity: stage.opacity }}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.legendLabel}>{stage.label}</Text>
          </View>
        );
      })}
    </View>
  </Animated.View>
);

export function MemoryTree({ days, isLoading, onBack, onSelectEmptyDay, themeId = 'sprout' }: MemoryTreeProps) {
  const [selectedMoment, setSelectedMoment] = useState<MomentItem | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentMonthY = useRef<number | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showJumpToToday, setShowJumpToToday] = useState(false);

  const theme = useMemo(() => getTheme(themeId), [themeId]);

  const now = new Date();
  const currentMonth = now.getMonth();

  // Group days by month
  const monthsData = Array.from({ length: 12 }, () => [] as DayData[]);
  days.forEach((day) => {
    const dateObj = new Date(day.date);
    monthsData[dateObj.getMonth()].push(day);
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Get dominant emotion for a day (most frequent)
  const getDominantEmotion = useCallback((moments: MomentItem[]): string | null => {
    if (moments.length === 0) return null;
    const counts: Record<string, number> = {};
    for (const m of moments) {
      if (m.emotion) counts[m.emotion] = (counts[m.emotion] || 0) + 1;
    }
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, []);

  const handleDayPress = useCallback((day: DayData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (day.moments.length > 0) {
      setSelectedMoment(day.moments[0]);
    } else if (onSelectEmptyDay) {
      onSelectEmptyDay(day);
    }
  }, [onSelectEmptyDay]);

  const handleDayLongPress = useCallback((day: DayData) => {
    if (day.moments.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      // Show a richer preview — for now just haptic + show first moment
      setSelectedMoment(day.moments[0]);
    }
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedMoment(null);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    if (currentMonthY.current !== null) {
      setShowJumpToToday(Math.abs(y - currentMonthY.current) > 280);
    }
  }, []);

  const handleJumpToToday = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentMonthY.current !== null) {
      scrollViewRef.current?.scrollTo({ y: currentMonthY.current, animated: true });
    }
  }, []);

  // Track running day index for stagger delays
  let globalDayIndex = 0;

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.bgColor }]}>
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
            <ActivityIndicator size="large" color={theme.fabColor} />
            <Text style={styles.loadingText}>Growing your garden…</Text>
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(400)} style={styles.gardenContainer}>
            {/* Header */}
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
                <View style={[styles.yearPill, { backgroundColor: theme.fabColor }]}>
                  <Text style={styles.yearText}>{now.getFullYear()}</Text>
                </View>
              </View>
            </View>

            {/* Garden Stats */}
            <GardenStatsBar days={days} themeColor={theme.fabColor} />

            {/* Growth Legend */}
            {/* <GrowthLegend /> */}

            {/* Months */}
            <View style={styles.gardenContainerInner}>
              {monthsData.map((monthDays, idx) => {
                if (monthDays.length === 0) return null;
                const isCurrentMonth = idx === currentMonth;
                const season = getSeasonTheme(idx);

                const firstDayDate = monthDays[0]?.date
                  ? new Date(monthDays[0].date)
                  : new Date(now.getFullYear(), idx, 1);
                const firstDayOfWeek = firstDayDate.getDay();

                const gridItems = [
                  ...Array.from({ length: firstDayOfWeek }).map((_, padIdx) => ({
                    isPadding: true as const,
                    id: `pad-${idx}-${padIdx}`,
                  })),
                  ...monthDays.map((dayData, i) => ({
                    isPadding: false as const,
                    id: dayData.dateStr,
                    dayData,
                    indexInMonth: i,
                  })),
                ];

                return (
                  <View
                    key={`month-${idx}`}
                    style={styles.monthBlock}
                    onLayout={(e) => {
                      const y = e.nativeEvent.layout.y;
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
                    {/* Month Header */}
                    <View style={styles.monthHeaderRow}>
                      <Text style={[styles.monthLabel, { color: season.label }]}>
                        {monthNames[idx]}
                      </Text>
                      {/* Month moment count */}
                      {(() => {
                        const monthMoments = monthDays.reduce((sum, d) => sum + d.moments.length, 0);
                        if (monthMoments === 0) return null;
                        return (
                          <Text style={[styles.monthCount, { color: season.label + '90' }]}>
                            {monthMoments} moment{monthMoments !== 1 ? 's' : ''}
                          </Text>
                        );
                      })()}
                    </View>

                    {/* Weekday Headers */}
                    <View style={styles.weekdayHeaderRow}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <View key={`wd-${idx}-${i}`} style={styles.weekdayCell}>
                          <Text style={styles.weekdayLabel}>{day}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Calendar Grid */}
                    <View style={styles.grid}>
                      {gridItems.map((item) => {
                        if (item.isPadding) {
                          return <View key={item.id} style={styles.gridCell} />;
                        }

                        const { dayData } = item;
                        const hasMoments = dayData.moments.length > 0;
                        const isToday = dayData.isToday;
                        const dayIdx = globalDayIndex++;
                        const dominantEmotion = getDominantEmotion(dayData.moments);

                        const dayDate = new Date(dayData.date);
                        dayDate.setHours(0, 0, 0, 0);
                        const todayDate = new Date();
                        todayDate.setHours(0, 0, 0, 0);
                        const daysSinceCreation = Math.max(0, Math.floor((todayDate.getTime() - dayDate.getTime()) / (1000 * 3600 * 24)));

                        const CellContent = (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleDayPress(dayData)}
                            onLongPress={() => handleDayLongPress(dayData)}
                            delayLongPress={400}
                            style={[
                              styles.touchableCell,
                              isToday && styles.todayCellContainer,
                            ]}
                            accessibilityLabel={`${monthNames[idx]} ${item.indexInMonth + 1}, ${hasMoments ? `${dayData.moments.length} memories` : 'No memories'}${isToday ? ' (Today)' : ''}`}
                            accessibilityHint={hasMoments ? 'Tap to view, hold to inspect' : isToday ? 'Tap to add a memory' : undefined}
                            accessibilityRole="button"
                          >
                            {hasMoments ? (
                              <GardenPlant
                                momentCount={dayData.moments.length}
                                dominantEmotion={dominantEmotion}
                                dayIndex={dayIdx}
                                theme={theme}
                                daysSinceCreation={daysSinceCreation}
                              />
                            ) : isToday ? (
                              <View style={[styles.todayEmptyDot, { borderColor: theme.todayRingColor + '60' }]}>
                                <Text style={{ fontSize: 10 }}>+</Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.emptyDotCircle,
                                  {
                                    backgroundColor: theme.emptyDotColor,
                                    borderColor: theme.emptyDotBorder,
                                  },
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        );

                        return (
                          <View key={item.id} style={styles.gridCell}>
                            {CellContent}
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

      {/* Jump to Today FAB */}
      {showJumpToToday && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.fabContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleJumpToToday}
            style={[styles.fabButton, { backgroundColor: theme.fabColor }]}
            accessibilityLabel="Jump to Today"
            accessibilityRole="button"
          >
            <Feather name="navigation" size={14} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.fabText}>Today</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Tooltip */}
      <FloatingMomentTooltip moment={selectedMoment} onClose={handleCloseSheet} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8 },
  gardenContainer: { flex: 1 },
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

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  yearPillContainer: { flex: 1, alignItems: 'center' },
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

  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#efe9e1',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#27170c',
    fontFamily: 'Plus Jakarta Sans',
  },
  statLabel: {
    fontSize: 10,
    color: '#8c7c6c',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 24,
  },

  // Growth Legend
  legendContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#efe9e1',
  },
  legendTitle: {
    fontSize: 10,
    color: '#a39485',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: { alignItems: 'center', gap: 4 },
  legendVisual: {
    height: 80,
    alignItems: 'baseline',
    justifyContent: 'center',
    position: 'relative',
  },
  legendGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(102, 187, 106, 0.12)',
  },
  legendLabel: {
    fontSize: 9,
    color: '#8c7c6c',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
  },

  // Month blocks
  gardenContainerInner: { paddingBottom: 20 },
  monthBlock: { marginBottom: 32, position: 'relative' },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  monthLabel: {
    fontSize: 12,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  monthCount: {
    fontSize: 10,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
  },

  // Weekday headers
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

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
  },
  gridCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 5,
  },
  touchableCell: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCellContainer: { borderRadius: 18 },

  // Empty dot
  emptyDotCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  todayEmptyDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 179, 66, 0.06)',
  },

  // Bottom
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
