import { Skeleton } from '@/components/ui/skeleton';
import { StorybookTimeline } from '@/features/home/components/StorybookTimeline';
import { TopAppBar } from '@/features/home/components/TopAppBar';
import { WeeklyStreaks } from '@/features/home/components/WeeklyStreaks';
import { DailyReflectionPromptCard } from '@/features/home/components/DailyReflectionPromptCard';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { useTaskData } from '@/features/home/hooks/useTaskData';
import { draftStore, useDraftStore } from '@/store/draftStore';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreenView() {
  const params = useLocalSearchParams<{ create?: string; action?: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    weeklyStreaks,
    todaysFlow,
    isLoading,
    addQuickMoment,
    isAddingMoment,
    refetch,
  } = useHomeData(selectedDate);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { todayTasks } = useTaskData(selectedDate);
  const { isEditing, draftId } = useDraftStore();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (params.create === 'true' || params.action === 'create') {
      draftStore.startDraft();
      // Reset params so we don't keep triggering
      router.setParams({ create: '', action: '' });
    }
  }, [params.create, params.action]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
  };

  const handleSaveCapture = async (
    content: string,
    emotion?: string,
    mediaUri?: string,
    mediaType?: 'photo' | 'video',
    title?: string
  ) => {
    try {
      await addQuickMoment({ content, emotion, title, mediaUri, mediaType });
      setToastMessage('A new reflection has been saved');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error('Failed to save moment:', err);
    }
  };

  const handleOpenCalendar = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setToastMessage('📅 Date picker not available — install @react-native-community/datetimepicker');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRecordTap = () => {
    draftStore.startDraft();
  };

  // ─── Default: Timeline Dashboard ──────────────────
  return (
    <SafeAreaView className="flex-1 bg-[#fbf9f4] relative" edges={['top']}>
      {/* 1. Top App Header with Streaks, Greeting & Profile */}
      <TopAppBar moments={weeklyStreaks} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#566434" />
        }
      >
        {/* 2. Weekly Streaks Row */}
        <View className="px-5">
          <WeeklyStreaks moments={weeklyStreaks} />
        </View>

        {isLoading ? (
          <View className="px-5 mt-4">
            <Skeleton className="w-full h-[180px] rounded-[24px] mb-4 bg-[#f0eee9]" />
            <Skeleton className="w-full h-[150px] rounded-[20px] mb-4 bg-[#f0eee9]" />
            <Skeleton className="w-full h-[150px] rounded-[20px] bg-[#f0eee9]" />
          </View>
        ) : (
          <>
            {/* 3. Daily Reflection Inspiration Hero */}
            <DailyReflectionPromptCard onStartReflection={handleRecordTap} />

            {/* 4. Storybook Timeline Feed */}
            <StorybookTimeline
              moments={todaysFlow}
              onOpenCalendar={handleOpenCalendar}
              onOpenSearch={() => router.push('/(app)/search')}
              onRecordTap={handleRecordTap}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </>
        )}
      </ScrollView>

      {/* Floating Animated Toast Notification */}
      {toastMessage && (
        <Animated.View
          entering={FadeInUp.duration(250)}
          exiting={FadeOutDown.duration(200)}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 z-50 bg-[#27170c] px-5 py-3 rounded-full shadow-lg border border-white/10"
        >
          <Text className="font-jakarta text-[13px] font-semibold text-[#fbf9f4]">
            {toastMessage}
          </Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

export const HomeScreen = HomeScreenView;
