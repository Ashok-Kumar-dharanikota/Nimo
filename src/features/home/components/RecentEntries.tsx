import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { formatSQLiteDate } from '../utils/dateUtils';

interface JournalWithCount {
  journal: {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
  };
  momentCount: number;
}

interface RecentEntriesProps {
  entries: JournalWithCount[];
}

export const RecentEntries = ({ entries }: RecentEntriesProps) => {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(200)} className="mb-12">
      <View className="flex-row justify-between items-end mb-6 px-6">
        <Text className="font-jakarta text-2xl font-bold text-primary tracking-tight">Recent Entries</Text>
        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(app)/journal');
          }}
        >
          <Text className="font-jakarta text-sm font-semibold text-sage">View All</Text>
          <Feather name="arrow-right" size={14} color="#A4B47C" />
        </TouchableOpacity>
      </View>
      
      {entries.length === 0 ? (
        <View className="w-auto mx-6 py-10 items-center justify-center bg-surfaceContainer/50 rounded-[32px] border border-outlineVariant/20 border-dashed">
          <View className="w-16 h-16 rounded-full bg-sage/10 items-center justify-center mb-4">
            <Feather name="book-open" size={24} color="#A4B47C" />
          </View>
          <Text className="font-jakarta text-lg font-bold text-primary">No entries yet</Text>
          <Text className="font-jakarta text-sm text-onSurfaceVariant/70 text-center px-10 mt-2 leading-relaxed">
            Start journaling to see your most active entries here.
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 pr-2 py-2">
          {entries.map((item, index) => {
            const journalDate = formatSQLiteDate(item.journal.createdAt);
            const formattedDate = journalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <TouchableOpacity
                key={item.journal.id}
                activeOpacity={0.9}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(app)/journal');
                }}
                className="w-[300px] h-[360px] rounded-[32px] overflow-hidden mr-4 shadow-sm bg-primary relative"
              >
                <Image 
                  source={{ uri: `https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?q=80&w=600&auto=format&fit=crop&sig=${item.journal.id}` }}
                  className="w-full h-full absolute"
                />
                <View className="absolute inset-0 bg-black/40" />
                <View className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                <View className="absolute top-6 right-6 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <Text className="font-jakarta text-[11px] font-bold text-white tracking-widest uppercase">
                    {formattedDate}
                  </Text>
                </View>

                <View className="absolute bottom-0 left-0 w-full p-6 pb-8 flex-col justify-end">
                  <View className="flex-row items-center gap-1.5 mb-2.5">
                    <View className="bg-sage/20 px-2 py-1 rounded-md border border-sage/30">
                      <Text className="font-jakarta text-[10px] font-bold text-sage uppercase tracking-wider">
                        {item.momentCount} {item.momentCount === 1 ? 'MOMENT' : 'MOMENTS'}
                      </Text>
                    </View>
                  </View>
                  <Text className="font-jakarta text-3xl font-bold text-white mb-2 leading-tight">
                    {item.journal.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </Animated.View>
  );
};
