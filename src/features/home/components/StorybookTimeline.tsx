import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { formatTime } from '../utils/dateUtils';

interface MomentData {
  id: number;
  content: string;
  createdAt: string;
  journalTitle: string | null;
  emotion?: string | null;
}

interface StorybookTimelineProps {
  moments: MomentData[];
  onOpenCalendar?: () => void;
  onOpenSearch?: () => void;
}

export function StorybookTimeline({
  moments,
  onOpenCalendar,
  onOpenSearch,
}: StorybookTimelineProps) {
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Prototype default seed moments to show the exact storybook design cards from HTML 1a if user has no DB entries yet
  const sampleTimelineEntries = [
    {
      id: 'seed-1',
      time: '7:45 AM',
      type: 'media',
      title: 'Morning walk at the lake',
      desc: 'Peaceful start to the day 🌿',
      tag: 'Nature',
      dotBg: '#566434',
      dotBorder: '#eef1e4',
      tagBg: '#eef1e4',
      tagColor: '#566434',
      duration: '0:21',
      gradient: ['#aecad6', '#8fae86', '#6f8f63'],
    },
    {
      id: 'seed-2',
      time: '12:30 PM',
      type: 'compact',
      title: 'Coffee & ideas',
      desc: 'Great thoughts over a hot cappuccino.',
      tag: 'Personal',
      dotBg: '#E67E22',
      dotBorder: '#f7e6d6',
      tagBg: '#f7ede2',
      tagColor: '#b5651d',
      titleColor: '#8a5a3c',
      thumbGradient: ['#8a5a3c', '#c9a077'],
    },
    {
      id: 'seed-3',
      time: '3:15 PM',
      type: 'compact',
      title: 'Evening with friends',
      desc: 'Laughter, stories and the perfect sunset.',
      tag: 'Friends',
      dotBg: '#b25f7a',
      dotBorder: '#f2dfe4',
      tagBg: '#f5e2e8',
      tagColor: '#a3506a',
      titleColor: '#b25f7a',
      thumbGradient: ['#e8a15a', '#b25f7a'],
    },
    {
      id: 'seed-4',
      time: '9:40 PM',
      type: 'note',
      title: 'Grateful for today ✨',
      desc: "It's the little moments that matter the most.",
      tag: 'Note',
      dotBg: '#a89a8b',
      dotBorder: '#efe9e1',
      tagBg: '#eae3d6',
      tagColor: '#8c7c6c',
    },
  ];

  return (
    <Animated.View entering={FadeInDown.duration(400)} className="flex-1 pb-24">
      {/* Date & Action Header */}
      <View className="flex-row items-start justify-between px-6 pt-2 pb-5">
        <View>
          <Text className="font-playfair text-[32px] font-bold text-[#27170c] leading-none">
            Today
          </Text>
          <Text className="font-jakarta text-[12.5px] font-medium text-[#8c7c6c] mt-1.5">
            {todayDateStr}
          </Text>
        </View>

        <View className="flex-row gap-2.5">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onOpenCalendar?.();
            }}
            className="w-10 h-10 rounded-full bg-[#f0eee9] items-center justify-center border border-[#e4e2dd]"
          >
            <Feather name="calendar" size={17} color="#4f453f" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onOpenSearch?.();
            }}
            className="w-10 h-10 rounded-full bg-[#f0eee9] items-center justify-center border border-[#e4e2dd]"
          >
            <Feather name="search" size={17} color="#4f453f" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Threaded Storybook Feed Container */}
      <View className="relative px-6">
        {/* Thread Vertical Connector Line */}
        <View className="absolute left-[37px] top-4 bottom-8 w-[2px] bg-[#c7d2ab]" />

        <View className="flex-col gap-6">
          {/* 1. Live User Moments recorded in App */}
          {moments.map((moment, index) => {
            const timeString = formatTime(moment.createdAt);
            const emotionEmoji = moment.emotion || '🌱';

            return (
              <Animated.View
                key={`live-${moment.id}`}
                entering={FadeInDown.delay(index * 80)}
                className="flex-row gap-4"
              >
                {/* Thread Node Dot */}
                <View className="w-[28px] items-center pt-1 flex-none">
                  <View className="w-[13px] h-[13px] rounded-full bg-[#566434] border-[3px] border-[#eef1e4]" />
                </View>

                {/* Entry Content */}
                <View className="flex-1">
                  <Text className="font-jakarta text-[11px] font-bold tracking-wider text-[#a89a8b] mb-2">
                    {timeString}
                  </Text>

                  <View className="bg-white rounded-[22px] p-4 border border-[#efe9e1] shadow-sm">
                    {moment.journalTitle && (
                      <Text className="font-playfair text-[17px] font-semibold text-[#27170c] mb-1">
                        {moment.journalTitle}
                      </Text>
                    )}
                    <Text className="font-jakarta text-[13.5px] text-[#6b5d51] leading-relaxed">
                      {moment.content}
                    </Text>

                    <View className="flex-row items-center gap-1.5 mt-3 self-start bg-[#eef1e4] px-3 py-1 rounded-full">
                      <Text className="text-xs">{emotionEmoji}</Text>
                      <Text className="font-jakarta text-[11px] font-semibold text-[#566434]">
                        Recorded Moment
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            );
          })}

          {/* 2. Storybook Prototype Seed Entries (from HTML 1a design doc) */}
          {sampleTimelineEntries.map((entry) => {
            if (entry.type === 'media') {
              return (
                <View key={entry.id} className="flex-row gap-4">
                  <View className="w-[28px] items-center pt-1 flex-none">
                    <View
                      className="w-[13px] h-[13px] rounded-full"
                      style={{ backgroundColor: entry.dotBg, borderColor: entry.dotBorder, borderWidth: 3 }}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="font-jakarta text-[11px] font-bold tracking-wider text-[#a89a8b] mb-2">
                      {entry.time}
                    </Text>

                    <View className="bg-white rounded-[24px] overflow-hidden border border-[#efe9e1] shadow-sm">
                      {/* Media Header Banner */}
                      <View className="h-[150px] bg-[#8fae86] relative justify-between p-3">
                        <View className="w-8.5 h-8.5 rounded-full bg-black/25 items-center justify-center self-start">
                          <Feather name="play" size={14} color="#ffffff" style={{ marginLeft: 2 }} />
                        </View>
                        <View className="self-end bg-black/30 px-2 py-0.5 rounded-full">
                          <Text className="font-jakarta text-[11px] font-semibold text-white">
                            {entry.duration}
                          </Text>
                        </View>
                      </View>

                      {/* Content */}
                      <View className="p-4">
                        <Text className="font-playfair text-[18px] font-semibold text-[#27170c]">
                          {entry.title}
                        </Text>
                        <Text className="font-jakarta text-[13px] text-[#6b5d51] mt-1 leading-relaxed">
                          {entry.desc}
                        </Text>

                        <View
                          className="flex-row items-center gap-1.5 mt-3 self-start px-3 py-1 rounded-full"
                          style={{ backgroundColor: entry.tagBg }}
                        >
                          <View className="w-1.5 h-1.5 rounded-full bg-[#7a8a5e]" />
                          <Text
                            className="font-jakarta text-[11px] font-semibold"
                            style={{ color: entry.tagColor }}
                          >
                            {entry.tag}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }

            if (entry.type === 'compact') {
              return (
                <View key={entry.id} className="flex-row gap-4">
                  <View className="w-[28px] items-center pt-1 flex-none">
                    <View
                      className="w-[13px] h-[13px] rounded-full"
                      style={{ backgroundColor: entry.dotBg, borderColor: entry.dotBorder, borderWidth: 3 }}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="font-jakarta text-[11px] font-bold tracking-wider text-[#a89a8b] mb-2">
                      {entry.time}
                    </Text>

                    <View className="flex-row gap-3 bg-white rounded-[22px] p-3 border border-[#efe9e1] shadow-sm items-center">
                      <View className="w-[78px] h-[78px] rounded-[16px] bg-[#c9a077]" />
                      <View className="flex-1">
                        <Text
                          className="font-playfair text-[16px] font-semibold"
                          style={{ color: entry.titleColor }}
                        >
                          {entry.title}
                        </Text>
                        <Text className="font-jakarta text-[12.5px] text-[#6b5d51] mt-1 leading-snug">
                          {entry.desc}
                        </Text>

                        <View
                          className="flex-row items-center gap-1.5 mt-2 self-start px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: entry.tagBg }}
                        >
                          <View
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: entry.dotBg }}
                          />
                          <Text
                            className="font-jakarta text-[10.5px] font-semibold"
                            style={{ color: entry.tagColor }}
                          >
                            {entry.tag}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }

            // Note Card
            return (
              <View key={entry.id} className="flex-row gap-4">
                <View className="w-[28px] items-center pt-1 flex-none">
                  <View
                    className="w-[13px] h-[13px] rounded-full"
                    style={{ backgroundColor: entry.dotBg, borderColor: entry.dotBorder, borderWidth: 3 }}
                  />
                </View>

                <View className="flex-1">
                  <Text className="font-jakarta text-[11px] font-bold tracking-wider text-[#a89a8b] mb-2">
                    {entry.time}
                  </Text>

                  <View className="bg-[#f4efe6] rounded-[22px] p-4 border border-[#e8e0d4]">
                    <Text className="font-playfair text-[17px] font-semibold text-[#27170c]">
                      {entry.title}
                    </Text>
                    <Text className="font-jakarta text-[13px] text-[#6b5d51] mt-1 leading-relaxed">
                      {entry.desc}
                    </Text>

                    <View className="flex-row items-center gap-1.5 mt-2.5 self-start bg-[#eae3d6] px-2.5 py-0.5 rounded-full">
                      <Text className="font-jakarta text-[10.5px] font-semibold text-[#8c7c6c]">
                        {entry.tag}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}
