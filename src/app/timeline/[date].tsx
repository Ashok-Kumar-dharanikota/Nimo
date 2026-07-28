import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { formatTime } from '@/features/home/utils/dateUtils';
import { getTheme } from '@/features/home/utils/gardenUtils';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function TimelineScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  
  // date is YYYY-MM-DD
  const targetDate = useMemo(() => {
    if (!date) return new Date();
    // Parse the date safely
    const [y, m, d] = date.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }, [date]);

  const { todaysFlow, isLoading } = useHomeData(targetDate);
  const theme = getTheme('sprout'); // Use default theme or pass from context

  const displayDate = targetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.bgColor }} edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-[#efe9e1]">
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View className="flex-1 ml-4">
          <Text className="font-playfair text-[20px] font-bold text-[#27170c]">
            Timeline
          </Text>
          <Text className="font-jakarta text-[12px] text-[#8c7c6c]">
            {displayDate}
          </Text>
        </View>
      </View>

      {/* Timeline List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {todaysFlow.length === 0 && !isLoading ? (
          <View className="items-center justify-center pt-20">
            <Feather name="wind" size={48} color="#d4c9bc" />
            <Text className="font-jakarta text-[14px] text-[#8c7c6c] mt-4">
              No moments recorded on this day.
            </Text>
          </View>
        ) : (
          todaysFlow.map((moment, index) => {
            const timeString = formatTime(moment.createdAt);
            
            return (
              <Animated.View 
                key={moment.id} 
                entering={FadeInUp.delay(index * 100).duration(400)}
                className="flex-row mb-8"
              >
                {/* Timeline Line & Dot */}
                <View className="items-center mr-4">
                  <View className="w-3 h-3 rounded-full bg-[#566434] mb-2" />
                  {index !== todaysFlow.length - 1 && (
                    <View className="w-[2px] flex-1 bg-[#efe9e1]" />
                  )}
                </View>

                {/* Content Card */}
                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-[#efe9e1]">
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="bg-[#eef1e4] px-2.5 py-1 rounded-full flex-row items-center gap-1.5">
                      <View className="w-1.5 h-1.5 rounded-full bg-[#566434]" />
                      <Text className="font-jakarta text-[10px] font-semibold text-[#566434] uppercase tracking-wider">
                        {moment.emotion || 'Memory'}
                      </Text>
                    </View>
                    <Text className="font-jakarta text-[11px] font-medium text-[#8c7c6c]">
                      {timeString}
                    </Text>
                  </View>
                  
                  <Text className="font-playfair text-[18px] font-bold text-[#27170c] mb-2 leading-tight">
                    {moment.title || moment.journalTitle || 'Recorded Moment'}
                  </Text>
                  
                  <Text className="font-jakarta text-[14px] text-[#6b5d51] leading-relaxed">
                    {moment.content}
                  </Text>

                  {/* Media */}
                  {moment.mediaUri && (
                    <View className="mt-4 rounded-xl overflow-hidden h-[200px] w-full bg-[#f4f2ee] relative">
                      <Image 
                        source={{ uri: moment.mediaUri }} 
                        className="w-full h-full" 
                        resizeMode="cover" 
                      />
                      {moment.mediaType === 'video' && (
                        <View className="absolute inset-0 items-center justify-center bg-black/20">
                          <Feather name="play-circle" size={40} color="white" />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
