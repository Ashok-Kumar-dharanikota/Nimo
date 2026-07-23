import { NimoAIChat } from '@/features/ai/components/NimoAIChat';
import { CaptureSheetModal } from '@/features/home/components/CaptureSheetModal';
import { StorybookTimeline } from '@/features/home/components/StorybookTimeline';
import { TopAppBar } from '@/features/home/components/TopAppBar';
import { WeeklyStreaks } from '@/features/home/components/WeeklyStreaks';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { ProfileScreen } from '@/features/profile/components/ProfileScreen';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export type BottomTab = 'timeline' | 'garden' | 'nimo-ai' | 'profile';

export default function Home() {
  const {
    weeklyStreaks,
    todaysFlow,
    memoryTree,
    isLoading,
    addQuickMoment,
    isAddingMoment,
    refetch,
  } = useHomeData();

  const [activeTab, setActiveTab] = useState<BottomTab>('timeline');
  const [captureOpen, setCaptureOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
  };

  const handleTabSelect = (tab: BottomTab) => {
    setActiveTab(tab);
    if (tab === 'garden') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/garden');
    }
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
      setToastMessage('A new moment has been planted');
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

  const handleEnterGarden = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/garden');
  };

  // Compute total moments / leaves grown
  const leavesCount = memoryTree.reduce((acc, day) => acc + (day.moments?.length || 0), 0);

  // ─── Nimo AI Tab ──────────────────────────────────
  if (activeTab === 'nimo-ai') {
    return (
      <SafeAreaView className="flex-1 bg-[#fbf9f4] relative" edges={['top']}>
        <NimoAIChat />

        <CaptureSheetModal
          visible={captureOpen}
          onClose={() => setCaptureOpen(false)}
          onSave={handleSaveCapture}
          isSaving={isAddingMoment}
        />
      </SafeAreaView>
    );
  }

  // ─── Profile Tab ──────────────────────────────────
  if (activeTab === 'profile') {
    return (
      <SafeAreaView className="flex-1 bg-[#fbf9f4] relative" edges={['top']}>
        <ProfileScreen />

        <CaptureSheetModal
          visible={captureOpen}
          onClose={() => setCaptureOpen(false)}
          onSave={handleSaveCapture}
          isSaving={isAddingMoment}
        />
      </SafeAreaView>
    );
  }

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

        {/* 3. Memory Garden Feature Banner */}
        <View className="px-5 mb-4">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleEnterGarden}
            className="bg-[#566434] rounded-[28px] p-5 shadow-md border border-white/10 overflow-hidden relative"
          >
            <View className="absolute -right-12 -top-12 w-36 h-36 bg-white/5 rounded-full" />
            <View className="flex-row items-center justify-between z-10">
              <View className="flex-1 pr-4">
                <Text className="font-jakarta text-[11px] font-bold text-white/60 tracking-wider uppercase mb-1">
                  Memory Garden
                </Text>
                <Text className="font-playfair text-xl font-bold text-white leading-tight mb-1.5">
                  Your Garden is Thriving
                </Text>
                <Text className="font-jakarta text-[12.5px] text-white/80 leading-snug mb-3">
                  {leavesCount === 0
                    ? 'Plant your first reflection to grow a leaf of memory.'
                    : `You have nurtured ${leavesCount} leaf${leavesCount === 1 ? '' : 'ves'}. Walk among your memories.`}
                </Text>
                <View className="flex-row items-center gap-2 bg-white/15 self-start px-3.5 py-1.5 rounded-full border border-white/10">
                  <Text className="font-jakarta text-[11.5px] font-bold text-white">
                    Explore Garden
                  </Text>
                  <ArrowRight size={13} color="white" />
                </View>
              </View>
              <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center border border-white/10 p-2 overflow-hidden">
                <Image
                  source={require('../../../assets/images/nimo/sprout.png')}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. Storybook Timeline Feed (Direction 1a) */}
        <StorybookTimeline
          moments={todaysFlow}
          onOpenCalendar={handleOpenCalendar}
          onOpenSearch={() => router.push('/(app)/search')}
        />
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

      {/* Capture Sheet Modal */}
      <CaptureSheetModal
        visible={captureOpen}
        onClose={() => setCaptureOpen(false)}
        onSave={handleSaveCapture}
        isSaving={isAddingMoment}
      />
    </SafeAreaView>
  );
}
