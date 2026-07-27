import { NimoAIChat } from '@/features/ai/components/NimoAIChat';
import { StorybookTimeline } from '@/features/home/components/StorybookTimeline';
import { TopAppBar } from '@/features/home/components/TopAppBar';
import { WeeklyStreaks } from '@/features/home/components/WeeklyStreaks';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { ensureStarterMomentsIfNewUser } from '@/features/home/services/seedMomentsService';
import { ProfileScreen } from '@/features/profile/components/ProfileScreen';
import { draftStore, useDraftStore } from '@/store/draftStore';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskData } from '@/features/home/hooks/useTaskData';
import { Skeleton } from '@/components/ui/skeleton';

export type BottomTab = 'timeline' | 'garden' | 'nimo-ai' | 'profile';

export default function Home() {
  const params = useLocalSearchParams<{ create?: string; action?: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    weeklyStreaks,
    todaysFlow,
    memoryTree,
    isLoading,
    addQuickMoment,
    isAddingMoment,
    refetch,
  } = useHomeData(selectedDate);

  const [activeTab, setActiveTab] = useState<BottomTab>('timeline');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { todayTasks } = useTaskData(selectedDate);
  const { isEditing, draftId } = useDraftStore();

  useEffect(() => {
    ensureStarterMomentsIfNewUser().then(() => {
      refetch();
    });
  }, []);

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

  const handleRecordTap = () => {
    draftStore.startDraft();
  };

  // Compute total moments / leaves grown
  const leavesCount = memoryTree.reduce((acc, day) => acc + (day.moments?.length || 0), 0);

  let gardenTitle = 'Your Garden is Thriving';
  let gardenSubtitle = '';
  if (leavesCount === 0) {
    gardenTitle = 'Start Your Garden';
    gardenSubtitle = 'Plant your first reflection to grow a leaf of memory.';
  } else {
    const pastDays = memoryTree.filter(d => new Date(d.date) <= new Date() && d.moments.length > 0);
    const lastRecordDate = pastDays.length > 0 ? new Date(pastDays[pastDays.length - 1].date) : null;
    
    if (lastRecordDate) {
      const diffTime = Math.abs(new Date().getTime() - lastRecordDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 2 && diffDays <= 7) {
         gardenTitle = 'Your Garden Misses You';
         gardenSubtitle = `It's been ${diffDays} days since you last planted a memory. Come back and grow your garden!`;
      } else if (diffDays > 7) {
         gardenTitle = 'Your Garden is Waiting';
         gardenSubtitle = `Your garden has been quiet. Plant a new memory to bring it back to life!`;
      } else {
         gardenSubtitle = `You have nurtured ${leavesCount} leaf${leavesCount === 1 ? '' : 'ves'}. Walk among your memories.`;
      }
    } else {
         gardenSubtitle = `You have nurtured ${leavesCount} leaf${leavesCount === 1 ? '' : 'ves'}. Walk among your memories.`;
    }
  }

  // ─── Nimo AI Tab ──────────────────────────────────
  if (activeTab === 'nimo-ai') {
    return (
      <SafeAreaView className="flex-1 bg-[#fbf9f4] relative" edges={['top']}>
        <NimoAIChat />
      </SafeAreaView>
    );
  }

  // ─── Profile Tab ──────────────────────────────────
  if (activeTab === 'profile') {
    return (
      <SafeAreaView className="flex-1 bg-[#fbf9f4] relative" edges={['top']}>
        <ProfileScreen />
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

        {isLoading ? (
          <View className="px-5 mt-4">
            <Skeleton className="w-full h-[200px] rounded-[24px] mb-4 bg-[#f0eee9]" />
            <Skeleton className="w-full h-[150px] rounded-[20px] mb-4 bg-[#f0eee9]" />
            <Skeleton className="w-full h-[150px] rounded-[20px] bg-[#f0eee9]" />
          </View>
        ) : (
          <>
            {/* 3. Memory Garden Feature Banner */}
            <View className="px-5 mb-4">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleEnterGarden}
                className="bg-[#566434] rounded-[28px] p-5 shadow-md border border-white/10 overflow-hidden relative"
              >
                <View className="absolute -right-12 -top-12 w-36 h-36 bg-white/5 rounded-full" />
                <View className="flex-row items-center justify-between z-10">
                  <View className="flex-1 pr-24">
                    <Text className="font-jakarta text-[11px] font-bold text-white/60 tracking-wider uppercase mb-1">
                      Memory Garden
                    </Text>
                    <Text className="font-playfair text-xl font-bold text-white leading-tight mb-1.5">
                      {gardenTitle}
                    </Text>
                    <Text className="font-jakarta text-[12.5px] text-white/80 leading-snug mb-3">
                      {gardenSubtitle}
                    </Text>
                    <View className="flex-row items-center gap-2 bg-white/15 self-start px-3.5 py-1.5 rounded-full border border-white/10">
                      <Text className="font-jakarta text-[11.5px] font-bold text-white">
                        Explore Garden
                      </Text>
                      <ArrowRight size={13} color="white" />
                    </View>
                  </View>
                </View>
                <View className="absolute -right-14 -bottom-8 w-60 h-60 opacity-80 z-0 pointer-events-none">
                  <Image
                    source={require('../../../assets/images/nimo/sprout.png')}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* 4. Storybook Timeline Feed (Direction 1a) */}
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
