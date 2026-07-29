import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { X, Book } from 'lucide-react-native';
import type { MomentItem } from '../../services/homeService';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.52;
const DISMISS_THRESHOLD = 80;

interface MomentSheetProps {
  moment: MomentItem | null;
  onClose: () => void;
}

export function MomentSheet({ moment, onClose }: MomentSheetProps) {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Open / close sheet when moment changes
  useEffect(() => {
    if (moment) {
      translateY.value = withSpring(0, { damping: 22, stiffness: 260 });
      backdropOpacity.value = withTiming(1, { duration: 250 });
    } else {
      translateY.value = withTiming(SHEET_HEIGHT, { duration: 280 });
      backdropOpacity.value = withTiming(0, { duration: 250 });
    }
  }, [moment, translateY, backdropOpacity]);

  const dismiss = useCallback(() => {
    translateY.value = withTiming(SHEET_HEIGHT, { duration: 280 });
    backdropOpacity.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
  }, [translateY, backdropOpacity, onClose]);

  // Swipe-down gesture to dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 22, stiffness: 260 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!moment) return null;

  // Format timestamp
  const date = new Date(moment.createdAt);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={dismiss} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <GestureDetector gesture={panGesture}>
          <View>
            {/* Handle bar */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.leafBadge}>
                <Text style={styles.leafEmoji}>🌿</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.dateText}>{dateStr}</Text>
                <Text style={styles.timeText}>{timeStr}</Text>
              </View>
              <TouchableOpacity onPress={dismiss} style={styles.closeBtn}>
                <X size={20} color="#4f453f" />
              </TouchableOpacity>
            </View>
          </View>
        </GestureDetector>

        {/* Content */}
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.content}>{moment.content}</Text>

          {moment.journalTitle && (
            <View style={styles.journalTag}>
              <Book size={12} color="#566434" />
              <Text style={styles.journalText}>{moment.journalTitle}</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#fbf9f4',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d2c4bc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e2dd',
    gap: 12,
  },
  leafBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#566434',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafEmoji: {
    fontSize: 18,
  },
  headerText: {
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#27170c',
    fontFamily: 'Plus Jakarta Sans',
  },
  timeText: {
    fontSize: 11,
    color: '#4f453f',
    fontFamily: 'Plus Jakarta Sans',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e4e2dd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
  },
  content: {
    fontSize: 17,
    color: '#27170c',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: 26,
  },
  journalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
    alignSelf: 'flex-start',
    backgroundColor: '#566434' + '18',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  journalText: {
    fontSize: 12,
    color: '#566434',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
  },
});
