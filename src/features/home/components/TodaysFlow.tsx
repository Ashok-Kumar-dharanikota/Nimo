import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { formatTime } from '../utils/dateUtils';

interface MomentData {
  id: number;
  content: string;
  createdAt: string;
  journalTitle: string | null;
}

interface TodaysFlowProps {
  moments: MomentData[];
}

export const TodaysFlow = ({ moments }: TodaysFlowProps) => {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(300)} className="bg-surfaceContainerLowest rounded-[32px] p-8 mx-6 shadow-sm border border-outlineVariant/20 min-h-[500px]">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="font-jakarta text-2xl font-bold text-primary tracking-tight">Today's Flow</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-primary/5 items-center justify-center border border-primary/10">
          <Feather name="calendar" size={18} color="#27170c" />
        </TouchableOpacity>
      </View>
      
      <View className="relative flex-1">
        {/* Vertical Line */}
        <View className="absolute left-[19px] top-4 bottom-12 w-[2px] bg-surfaceContainerHighest" />
        
        <View className="flex-col gap-10 relative">
          
          {moments.length === 0 ? (
            <View className="py-16 items-center justify-center bg-transparent">
              <View className="w-16 h-16 rounded-full bg-surfaceContainer items-center justify-center mb-4">
                <Feather name="coffee" size={24} color="#A4B47C" />
              </View>
              <Text className="font-jakarta text-lg font-bold text-primary">A blank slate</Text>
              <Text className="font-jakarta text-sm text-onSurfaceVariant/70 text-center mt-2 px-4 leading-relaxed">
                Take a moment to pause, breathe, and record how you're feeling right now.
              </Text>
            </View>
          ) : (
            moments.map((moment, index) => {
              const timeString = formatTime(moment.createdAt);
              const bgColors = ['bg-sage', 'bg-terracotta', 'bg-primary'];
              const iconColorClass = bgColors[index % bgColors.length];

              return (
                <View key={moment.id} className="flex-row items-start">
                  <View className={`w-10 h-10 rounded-full ${iconColorClass} items-center justify-center z-10 border-4 border-surfaceContainerLowest mr-5 shadow-sm shadow-black/5`}>
                    <Feather name="edit-2" size={14} color="white" />
                  </View>
                  <View className="flex-1 pb-2 pt-1">
                    <Text className="font-jakarta text-[11px] font-bold text-onSurfaceVariant/50 mb-1.5 tracking-wider uppercase">
                      {timeString}
                    </Text>
                    {moment.journalTitle && (
                      <View className="flex-row items-center mb-2">
                        <View className="bg-surfaceContainer px-2 py-0.5 rounded-md border border-outlineVariant/30">
                          <Text className="font-jakarta text-[10px] font-bold text-onSurfaceVariant uppercase tracking-widest" numberOfLines={1}>
                            {moment.journalTitle}
                          </Text>
                        </View>
                      </View>
                    )}
                    <Text className="font-jakarta text-[15px] text-onSurface leading-relaxed">
                      {moment.content}
                    </Text>
                  </View>
                </View>
              );
            })
          )}

          {/* Add Moment Button */}
          <TouchableOpacity 
            className="flex-row items-center mt-2 group"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/compose');
            }}
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full border-2 border-dashed border-primary/30 items-center justify-center z-10 bg-surfaceContainerLowest mr-5">
              <Feather name="plus" size={20} color="#27170c" />
            </View>
            <Text className="font-jakarta text-[15px] font-bold text-primary">Record a new moment</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Animated.View>
  );
};
