import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { TopAppBar } from '@/features/home/components/TopAppBar';
import { WeeklyStreaks } from '@/features/home/components/WeeklyStreaks';
import { RecentEntries } from '@/features/home/components/RecentEntries';
import { TodaysFlow } from '@/features/home/components/TodaysFlow';
import { EmptyHomeState } from '@/features/home/components/EmptyHomeState';

export default function Home() {
  const { weeklyStreaks, recentEntries, todaysFlow, isLoading, addQuickMoment, isAddingMoment } = useHomeData();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <TopAppBar />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#A4B47C" />
        </View>
      </SafeAreaView>
    );
  }

  const isFirstTime = recentEntries.length === 0 && todaysFlow.length === 0;

  if (isFirstTime) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <EmptyHomeState onAddMoment={addQuickMoment} isAdding={isAddingMoment} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <TopAppBar />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <WeeklyStreaks moments={weeklyStreaks} />
        
        <RecentEntries entries={recentEntries} />

        <TodaysFlow moments={todaysFlow} />
        
        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}
