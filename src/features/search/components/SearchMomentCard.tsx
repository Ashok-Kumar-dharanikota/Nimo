import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkle, CheckCircle, Circle } from 'lucide-react-native';
import { MomentVideoPlayer } from '@/features/home/components/MomentVideoPlayer';
import { formatTime, parseSQLiteDate } from '@/features/home/utils/dateUtils';
import { EMOTION_ICON_MAP, type SearchMomentItem } from '../utils/searchConstants';

interface SearchMomentCardProps {
  item: SearchMomentItem;
}

export function SearchMomentCard({ item }: SearchMomentCardProps) {
  const router = useRouter();

  const emotionConfig = (item.emotion && EMOTION_ICON_MAP[item.emotion]) || {
    Icon: Sparkle,
    color: '#566434',
    bg: '#eef1e4',
    label: 'Moment',
  };
  const EmotionIcon = emotionConfig.Icon;
  const displayTitle = item.title || item.journalTitle;
  const timeStr = formatTime(item.createdAt);
  const dateObj = parseSQLiteDate(item.createdAt);
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/moment/[id]', params: { id: item.id } })}
      className="p-1.5 flex-1"
    >
      <View className="bg-white rounded-[20px] p-3 border border-[#efe9e1] shadow-sm overflow-hidden flex-col justify-between">
        {/* Media component with strict 1:1 Aspect Ratio */}
        {item.mediaUri ? (
          <View className="mb-2.5 rounded-[14px] overflow-hidden w-full aspect-square bg-[#1c1a17]">
            {item.mediaType === 'video' ? (
              <MomentVideoPlayer uri={item.mediaUri} aspectRatio={1} />
            ) : (
              <Image
                source={{ uri: item.mediaUri }}
                className="w-full h-full aspect-square"
                resizeMode="cover"
              />
            )}
          </View>
        ) : null}

        <View>
          <View className="flex-row items-center justify-between mb-1">
            <View
              className="flex-row items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ backgroundColor: emotionConfig.bg }}
            >
              <EmotionIcon size={11} color={emotionConfig.color} />
              <Text
                className="font-jakarta text-[10px] font-semibold"
                style={{ color: emotionConfig.color }}
              >
                {emotionConfig.label}
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              {item.isTaskCompleted !== null && (
                <View>
                  {item.isTaskCompleted ? (
                    <CheckCircle size={12} color="#566434" />
                  ) : (
                    <Circle size={12} color="#b5651d" />
                  )}
                </View>
              )}
              <Text className="font-jakarta text-[10px] font-medium text-[#a89a8b]">
                {dateStr}
              </Text>
            </View>
          </View>

          {displayTitle && (
            <Text className="font-playfair text-[15px] font-bold text-[#27170c] mb-1" numberOfLines={1}>
              {displayTitle}
            </Text>
          )}

          <Text className="font-jakarta text-[12px] text-[#6b5d51] leading-snug" numberOfLines={3}>
            {item.content}
          </Text>
        </View>

        <Text className="font-jakarta text-[9.5px] font-semibold text-[#a89a8b] mt-2 text-right">
          {timeStr}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
