import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { X, ArrowRight, Film } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { MomentItem } from '../../services/homeService';
import { formatTime } from '../../utils/dateUtils';

interface FloatingMomentTooltipProps {
  moment: MomentItem | null;
  onClose: () => void;
  onViewFull?: (moment: MomentItem) => void;
}

export function FloatingMomentTooltip({
  moment,
  onClose,
  onViewFull,
}: FloatingMomentTooltipProps) {
  if (!moment) return null;

  const timeString = formatTime(moment.createdAt);
  const dateObj = new Date(moment.createdAt.replace(' ', 'T') + 'Z');
  const dateFormatted = isNaN(dateObj.getTime())
    ? timeString
    : `${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${timeString}`;

  // Gather media URIs (up to 3 max)
  const mediaList: Array<{ uri: string; type: 'photo' | 'video' }> = [];
  if (moment.mediaUri) {
    mediaList.push({
      uri: moment.mediaUri,
      type: moment.mediaType || 'photo',
    });
  }

  const handleCTA = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onViewFull) onViewFull(moment);
    onClose();
  };

  return (
    <View className="absolute inset-0 z-50 justify-end pointer-events-box-none">
      {/* Backdrop overlay (tap anywhere to dismiss) */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClose();
        }}
        className="absolute inset-0 bg-[#1c1a17]/30"
      />

      {/* Floating Tooltip Card */}
      <Animated.View
        entering={SlideInDown.duration(280)}
        exiting={SlideOutDown.duration(220)}
        className="mx-4 mb-24 bg-[#fbf9f4] rounded-[28px] p-5 border border-[#efe9e1] shadow-2xl z-50"
        style={{
          shadowColor: '#281e14',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
          elevation: 12,
        }}
      >
        {/* Top Header: Tag Badge + Close (X) */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-1.5 bg-[#eef1e4] px-3 py-1 rounded-full self-start">
            <View className="w-1.5 h-1.5 rounded-full bg-[#566434]" />
            <Text className="font-jakarta text-[11px] font-semibold text-[#566434]">
              {moment.emotion || 'Memory Sprout'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-[#1c1a17]/10 items-center justify-center"
          >
            <X size={15} color="#27170c" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text className="font-playfair text-[20px] font-bold text-[#27170c] leading-snug">
          {moment.journalTitle || 'Recorded Moment'}
        </Text>

        {/* Date & Time */}
        <Text className="font-jakarta text-[11.5px] font-medium text-[#8c7c6c] mt-1 mb-2">
          {dateFormatted}
        </Text>

        {/* Text Content snippet */}
        <Text
          className="font-jakarta text-[13.5px] text-[#6b5d51] leading-relaxed mb-3"
          numberOfLines={2}
        >
          {moment.content}
        </Text>

        {/* Media Preview Thumbnails (Max 3) */}
        {mediaList.length > 0 ? (
          <View className="flex-row gap-2 mb-4">
            {mediaList.slice(0, 3).map((item, idx) => (
              <View
                key={`media-${idx}`}
                className="w-[64px] h-[64px] rounded-[16px] overflow-hidden bg-[#1c1a17] relative justify-center items-center"
              >
                <Image source={{ uri: item.uri }} className="w-full h-full" resizeMode="cover" />
                {item.type === 'video' ? (
                  <View className="absolute inset-0 bg-black/30 items-center justify-center">
                    <Film size={18} color="#ffffff" />
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* CTA Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCTA}
          className="w-full py-3.5 px-4 bg-[#566434] rounded-[20px] flex-row items-center justify-center gap-2 shadow-sm"
        >
          <Text className="font-jakarta text-[14px] font-bold text-[#fbf9f4]">
            View full memory
          </Text>
          <ArrowRight size={16} color="#fbf9f4" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
