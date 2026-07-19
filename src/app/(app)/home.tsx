import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { TopAppBar } from '@/features/home/components/TopAppBar';
import { WeeklyStreaks } from '@/features/home/components/WeeklyStreaks';

import { TodaysFlow } from '@/features/home/components/TodaysFlow';
import { MemoryTree } from '@/features/home/components/tree/MemoryTree';
import { analyzeSentiment } from '@/features/home/utils/sentiment';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function Home() {
  const {
    weeklyStreaks,
    recentEntries,
    todaysFlow,
    memoryTree,
    isLoading,
    addQuickMoment,
    isAddingMoment,
    refetch,
  } = useHomeData();

  const [viewMode, setViewMode] = useState<'dashboard' | 'tree'>('dashboard');
  const [quickMomentText, setQuickMomentText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
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

  const handleSaveQuickMoment = () => {
    const trimmed = quickMomentText.trim();
    if (!trimmed || isAddingMoment) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Use selected emotion or fallback to AI sentiment analysis
    const emotionToSave = selectedEmotion || analyzeSentiment(trimmed);
    
    addQuickMoment({ content: trimmed, emotion: emotionToSave });
    setQuickMomentText('');
    setSelectedEmotion(null);
  };

  const handleEnterGarden = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setViewMode('tree');
  };

  const handleBackToDashboard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode('dashboard');
  };

  // Compute total moments / leaves grown
  const leavesCount = memoryTree.reduce((acc, day) => acc + (day.moments?.length || 0), 0);

  if (viewMode === 'tree') {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <MemoryTree
          days={memoryTree}
          isLoading={isLoading}
          onBack={handleBackToDashboard}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Dynamic Top App Bar */}
      <TopAppBar moments={weeklyStreaks} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#A4B47C" />
        }
      >
        {/* Weekly Streaks Tracker */}
        <View className="px-5">
          <WeeklyStreaks moments={weeklyStreaks} />
        </View>

        {/* Memory Garden Feature Card */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleEnterGarden}
            className="bg-secondary rounded-[32px] p-6 shadow-md border border-white/10 overflow-hidden relative"
          >
            {/* Soft decorative blur circles to make it feel premium */}
            <View className="absolute -right-12 -top-12 w-36 h-36 bg-white/5 rounded-full" />
            <View className="absolute -left-12 -bottom-12 w-36 h-36 bg-white/5 rounded-full" />

            <View className="flex-row items-center justify-between z-10">
              <View className="flex-1 pr-4">
                <Text className="font-jakarta text-[11px] font-bold text-white/60 tracking-wider uppercase mb-1">
                  Memory Garden
                </Text>
                <Text className="font-jakarta text-2xl font-bold text-white leading-tight mb-2">
                  Your Tree is Thriving
                </Text>
                <Text className="font-jakarta text-[13px] text-white/80 leading-normal mb-4">
                  {leavesCount === 0
                    ? "A seed is waiting to sprout. Plant your first reflection to grow a leaf of memory."
                    : `You have nurtured ${leavesCount} leaf${leavesCount === 1 ? '' : 'ves'} in the last fortnight. Walk among your memories.`}
                </Text>
                
                <View className="flex-row items-center gap-2 bg-white/15 self-start px-4.5 py-2.5 rounded-full border border-white/10 active:bg-white/25">
                  <Text className="font-jakarta text-xs font-bold text-white">
                    Explore Tree
                  </Text>
                  <Feather name="arrow-right" size={14} color="white" />
                </View>
              </View>

              <View className="w-18 h-18 bg-white/10 rounded-2xl items-center justify-center border border-white/10">
                <Text className="text-4xl">🌳</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Reflection Assistant */}
        <View className="px-5 mb-6">
          <View className="bg-surfaceContainerLowest rounded-[32px] p-6 shadow-sm border border-outlineVariant/15 relative">
            <View className="flex-row items-center gap-2.5 mb-4">
              <View className="w-8 h-8 rounded-full bg-secondary/10 items-center justify-center">
                <Text className="text-sm">🌿</Text>
              </View>
              <Text className="font-jakarta text-base font-bold text-primary">
                Quick Reflection
              </Text>
            </View>

            <TextInput
              className="w-full bg-surfaceContainerLow/50 rounded-[20px] px-4 py-3.5 font-jakarta text-[14px] text-primary min-h-[88px] border border-outlineVariant/10 focus:border-secondary"
              placeholder="What is keeping you grounded in this moment?"
              placeholderTextColor="#8c7c6c"
              multiline
              textAlignVertical="top"
              value={quickMomentText}
              onChangeText={setQuickMomentText}
            />

            <View className="flex-row justify-between items-center mt-3.5">
              <View className="flex-row items-center gap-2">
                {['🌱', '🌻', '🪷', '🍄'].map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    activeOpacity={0.7}
                    onPress={() => setSelectedEmotion(emoji === selectedEmotion ? null : emoji)}
                    className={`w-9 h-9 items-center justify-center rounded-full border ${
                      selectedEmotion === emoji 
                        ? 'border-primary bg-primary/10' 
                        : 'border-outlineVariant/20 bg-surfaceContainerLowest'
                    }`}
                  >
                    <Text className="text-base">{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleSaveQuickMoment}
                disabled={!quickMomentText.trim() || isAddingMoment}
                activeOpacity={0.8}
                className={`bg-primary px-5 py-2.5 rounded-full flex-row items-center gap-1.5 shadow-sm ${
                  !quickMomentText.trim() || isAddingMoment ? 'opacity-50' : 'opacity-100'
                }`}
              >
                {isAddingMoment ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Text className="font-jakarta text-xs font-bold text-white">
                      Grow Leaf
                    </Text>
                    <Feather name="plus" size={13} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>



        {/* Today's Flow Timeline */}
        <TodaysFlow moments={todaysFlow} />
      </ScrollView>
    </SafeAreaView>
  );
}

