import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import { getRecentEntries } from '@/features/home/services/homeService';
import { RecentEntries } from '@/features/home/components/RecentEntries';

export default function Journal() {
  const { data: recentEntries = [], isLoading } = useQuery({
    queryKey: ['recentEntries'],
    queryFn: getRecentEntries,
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center w-full px-5 py-4 border-b border-surfaceVariant bg-surface/80">
        <Text className="font-jakarta text-2xl font-bold text-primary">My Journals</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-surfaceContainer">
          <MaterialIcons name="search" size={24} color="#4f453f" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Recent Entries (moved from home) */}
        {isLoading ? (
          <View className="py-10 items-center">
            <ActivityIndicator size="small" color="#A4B47C" />
          </View>
        ) : (
          <View className="pt-6">
            <RecentEntries entries={recentEntries} />
          </View>
        )}

        {/* Bento Grid Label */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)} className="px-6 mt-4 mb-4 flex-row justify-between items-center">
          <Text className="font-jakarta text-xl font-bold text-primary">All Journals</Text>
          <TouchableOpacity className="flex-row items-center gap-1">
            <MaterialIcons name="add" size={18} color="#566434" />
            <Text className="font-jakarta text-sm font-semibold text-secondary">New</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bento Grid */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="px-5">
          {/* Full width card */}
          <TouchableOpacity className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-md bg-primary">
            <View className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary" />
            <View className="absolute bottom-0 left-0 w-full p-6 pb-8 flex-col justify-end">
              <View className="flex-row items-center gap-2 mb-3">
                <View className="flex-row items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <MaterialIcons name="calendar-today" size={12} color="#A4B47C" />
                  <Text className="font-jakarta text-xs text-white font-medium">Oct 23</Text>
                </View>
                <View className="flex-row items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <MaterialIcons name="spa" size={12} color="white" />
                  <Text className="font-jakarta text-xs text-white font-medium">4 moments</Text>
                </View>
              </View>
              <Text className="font-jakarta text-3xl font-bold text-white mb-2">A surprisingly quiet morning</Text>
              <Text className="font-jakarta text-base text-white/80" numberOfLines={2}>
                Woke up before the sun. The house was completely silent…
              </Text>
            </View>
          </TouchableOpacity>

          {/* Half-width cards row */}
          <View className="flex-row justify-between mb-4 gap-3">
            <TouchableOpacity className="flex-1 aspect-square rounded-3xl overflow-hidden shadow-sm bg-sage/20 p-5 flex-col justify-between">
              <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center">
                <MaterialIcons name="format-quote" size={20} color="white" />
              </View>
              <Text className="font-jakarta text-sm text-primary italic" numberOfLines={4}>
                "Growth is not about pushing harder, but about finding the right environment."
              </Text>
              <Text className="font-jakarta text-xs text-onSurfaceVariant/60">Oct 18</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 aspect-square rounded-3xl overflow-hidden shadow-sm bg-surfaceContainer p-5 flex-col justify-between">
              <View className="w-10 h-10 rounded-full bg-tertiaryContainer/30 items-center justify-center">
                <MaterialIcons name="edit-note" size={20} color="#4f453f" />
              </View>
              <Text className="font-jakarta text-base font-semibold text-primary" numberOfLines={3}>
                Finding focus in the garden
              </Text>
              <Text className="font-jakarta text-xs text-onSurfaceVariant/60">Oct 22</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}
