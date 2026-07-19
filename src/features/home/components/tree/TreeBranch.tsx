import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DayData, MomentItem } from '../../services/homeService';
import { TreeLeaf, GhostLeaf } from './TreeLeaf';
import { TodayBud } from './TodayBud';

const MAX_LEAVES = 20;
const LEAF_ROW_HEIGHT = 68;       // vertical space per leaf row
const MIN_BRANCH_HEIGHT = 80;     // minimum height for empty days
const TRUNK_WIDTH = 2;
const TRUNK_COLOR = '#8c7c6c';
const NODE_SIZE = 10;
const DATE_COL_WIDTH = 56;
const TRUNK_COL_WIDTH = 20;
const LEAVES_COL_WIDTH = 52;      // fixed width for each leaf column
const LEAF_GAP = 6;               // gap between leaf col and trunk

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface TreeBranchProps {
  dayData: DayData;
  isLast: boolean;
  onLeafPress: (moment: MomentItem) => void;
}

export function TreeBranch({ dayData, isLast, onLeafPress }: TreeBranchProps) {
  const { date, isToday, moments } = dayData;
  const visibleMoments = moments.slice(0, MAX_LEAVES);
  const isEmpty = visibleMoments.length === 0;

  // Split into left (odd indices 0,2,4…) and right (even indices 1,3,5…)
  // Row count = ceil(total / 2)
  const rowCount = Math.max(1, Math.ceil(visibleMoments.length / 2));
  const rows: Array<{ left: MomentItem | null; right: MomentItem | null }> = useMemo(() => {
    const result: Array<{ left: MomentItem | null; right: MomentItem | null }> = [];
    for (let i = 0; i < visibleMoments.length; i += 2) {
      result.push({
        left: visibleMoments[i] ?? null,
        right: visibleMoments[i + 1] ?? null,
      });
    }
    return result;
  }, [visibleMoments]);

  const contentHeight = isEmpty
    ? MIN_BRANCH_HEIGHT
    : Math.max(rowCount * LEAF_ROW_HEIGHT, MIN_BRANCH_HEIGHT);

  const dayName = DAY_NAMES[date.getDay()];
  const monthName = MONTH_NAMES[date.getMonth()];
  const dayNum = date.getDate();

  return (
    <View style={[styles.row, { height: contentHeight }]}>

      {/* ── Col 1: Date label ── */}
      <View style={styles.dateCol}>
        {isToday && <Text style={styles.todayLabel}>Today</Text>}
        <Text style={[styles.monthText, isToday && styles.todayAccent]}>{monthName}</Text>
        <Text style={[styles.dayNumText, isToday && styles.todayDayNum]}>{dayNum}</Text>
        <Text style={[styles.dayNameText, isToday && styles.todayAccent]}>{dayName}</Text>
      </View>

      {/* ── Col 2: Left leaves ── */}
      <View style={styles.leftLeavesCol}>
        {isEmpty ? (
          <View style={styles.leafCentered}>
            <GhostLeaf side="left" />
          </View>
        ) : (
          rows.map((row, i) =>
            row.left ? (
              <View key={i} style={styles.leafCentered}>
                <TreeLeaf
                  moment={row.left}
                  side="left"
                  index={i * 2}
                  delay={i * 40}
                  onPress={onLeafPress}
                />
              </View>
            ) : (
              <View key={i} style={styles.leafCentered} />
            )
          )
        )}
      </View>

      {/* ── Col 3: Trunk ── */}
      <View style={styles.trunkCol}>
        {/* Top trunk segment */}
        <View style={styles.trunkSegment} />

        {/* Branch node */}
        {isToday ? (
          <TodayBud />
        ) : (
          <View style={[styles.node, isEmpty && styles.nodeEmpty]} />
        )}

        {/* Bottom trunk segment (connects to next day) */}
        {!isLast ? <View style={styles.trunkSegment} /> : <View style={styles.trunkEnd} />}
      </View>

      {/* ── Col 4: Right leaves ── */}
      <View style={styles.rightLeavesCol}>
        {!isEmpty &&
          rows.map((row, i) =>
            row.right ? (
              <View key={i} style={styles.leafCentered}>
                <TreeLeaf
                  moment={row.right}
                  side="right"
                  index={i * 2 + 1}
                  delay={i * 40 + 20}
                  onPress={onLeafPress}
                />
              </View>
            ) : (
              <View key={i} style={styles.leafCentered} />
            )
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  // Date column
  dateCol: {
    width: DATE_COL_WIDTH,
    paddingTop: 10,
    paddingRight: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  todayLabel: {
    fontSize: 8,
    color: '#566434',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  monthText: {
    fontSize: 10,
    color: '#8c8c8c',
    fontFamily: 'Plus Jakarta Sans',
  },
  todayAccent: { color: '#566434' },
  dayNumText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4f453f',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: 24,
  },
  todayDayNum: { color: '#27170c', fontSize: 22 },
  dayNameText: {
    fontSize: 10,
    color: '#8c8c8c',
    fontFamily: 'Plus Jakarta Sans',
  },

  // Left leaf column — flexible width, leaves align to the RIGHT (closest to trunk)
  leftLeavesCol: {
    flex: 1,
    marginRight: LEAF_GAP,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 18,
  },

  // Trunk column — thin, centered
  trunkCol: {
    width: TRUNK_COL_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  trunkSegment: {
    width: TRUNK_WIDTH,
    flex: 1,
    backgroundColor: TRUNK_COLOR,
  },
  trunkEnd: {
    width: TRUNK_WIDTH,
    height: 12,
    backgroundColor: 'transparent',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: TRUNK_COLOR,
    marginVertical: 3,
  },
  nodeEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(140, 124, 108, 0.5)',
  },

  // Right leaf column — flexible width, leaves align to the LEFT (closest to trunk)
  rightLeavesCol: {
    flex: 1,
    marginLeft: LEAF_GAP,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 18,
  },

  // Shared: each leaf slot within a column
  leafCentered: {
    height: LEAF_ROW_HEIGHT,
    justifyContent: 'center',
  },
});
