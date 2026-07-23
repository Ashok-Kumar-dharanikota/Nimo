import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { Search, X, ArrowLeft, Play, Sparkle, Smile, Sparkles, Heart, Sun, Coffee } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { db } from '@/db';
import { moment, journal } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { formatTime, parseSQLiteDate } from '@/features/home/utils/dateUtils';
import { MomentVideoPlayer } from '@/features/home/components/MomentVideoPlayer';

interface SearchMomentItem {
  id: number;
  content: string;
  createdAt: string;
  journalTitle: string | null;
  emotion: string | null;
  title: string | null;
  mediaUri: string | null;
  mediaType: 'photo' | 'video' | null;
}

const EMOTION_ICON_MAP: Record<string, { Icon: any; color: string; bg: string; label: string }> = {
  happy: { Icon: Smile, color: '#566434', bg: '#eef1e4', label: 'Happy' },
  inspired: { Icon: Sparkles, color: '#b5651d', bg: '#f7ede2', label: 'Inspired' },
  loved: { Icon: Heart, color: '#a3506a', bg: '#f2e7ea', label: 'Loved' },
  bright: { Icon: Sun, color: '#d97706', bg: '#fef3c7', label: 'Bright' },
  calm: { Icon: Coffee, color: '#4f5c42', bg: '#eae3d6', label: 'Calm' },
};

async function fetchAllMoments(): Promise<SearchMomentItem[]> {
  const rows = await db
    .select({
      id: moment.id,
      content: moment.content,
      createdAt: moment.createdAt,
      journalTitle: journal.title,
      emotion: moment.emotion,
      title: moment.title,
      mediaUri: moment.mediaUri,
      mediaType: moment.mediaType,
    })
    .from(moment)
    .leftJoin(journal, eq(moment.journalId, journal.id))
    .orderBy(desc(moment.createdAt));

  return rows.map((r) => ({
    id: r.id,
    content: r.content,
    createdAt: r.createdAt,
    journalTitle: r.journalTitle ?? null,
    emotion: r.emotion,
    title: r.title ?? null,
    mediaUri: r.mediaUri ?? null,
    mediaType: (r.mediaType as 'photo' | 'video' | null) ?? null,
  }));
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: moments = [], isLoading, refetch } = useQuery({
    queryKey: ['allMomentsSearch'],
    queryFn: fetchAllMoments,
  });

  const filteredMoments = useMemo(() => {
    if (!searchQuery.trim()) return moments;
    const q = searchQuery.toLowerCase().trim();
    return moments.filter(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.journalTitle && m.journalTitle.toLowerCase().includes(q)) ||
        (m.emotion && m.emotion.toLowerCase().includes(q))
    );
  }, [moments, searchQuery]);

  const renderMomentCard = ({ item }: { item: SearchMomentItem }) => {
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
      <View className="p-1.5 flex-1">
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
              <Text className="font-jakarta text-[10px] font-medium text-[#a89a8b]">
                {dateStr}
              </Text>
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
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf9f4]">
      <StatusBar style="dark" />
      {/* Search Header */}
      <View className="px-5 pt-3 pb-3 border-b border-[#efe9e1]">
        <View className="flex-row items-center gap-2 mb-3">
          {router.canGoBack() && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              className="w-9 h-9 rounded-full bg-[#f0eee9] items-center justify-center border border-[#e4e2dd]"
            >
              <ArrowLeft size={16} color="#4f453f" />
            </TouchableOpacity>
          )}
          <Text className="font-playfair text-[24px] font-bold text-[#27170c] flex-1">
            Search Moments
          </Text>
        </View>

        {/* Textbox search field input */}
        <View className="flex-row items-center bg-white rounded-[20px] border border-[#ece5db] px-3.5 py-2.5 shadow-sm">
          <Search size={18} color="#8c7c6c" className="mr-2" />
          <TextInput
            className="flex-1 font-jakarta text-[14px] text-[#27170c] p-0"
            placeholder="Search entries, titles, emotions…"
            placeholderTextColor="#b3a598"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSearchQuery('')}
              className="p-1"
            >
              <X size={16} color="#8c7c6c" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2-Column Masonry List with FlashList */}
      <View className="flex-1 px-3 pt-2">
        <FlashList
          data={filteredMoments}
          renderItem={renderMomentCard}
          keyExtractor={(item) => `search-moment-${item.id}`}
          numColumns={2}
          masonry={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-16 px-6">
              <View className="w-16 h-16 rounded-full bg-[#f0eee9] items-center justify-center mb-3">
                <Search size={28} color="#a89a8b" />
              </View>
              <Text className="font-playfair text-[18px] font-bold text-[#27170c] text-center mb-1">
                {searchQuery ? 'No matching moments found' : 'No moments saved yet'}
              </Text>
              <Text className="font-jakarta text-[13px] text-[#8c7c6c] text-center">
                {searchQuery
                  ? `Try searching for different keywords or emotions.`
                  : 'Start capturing your daily reflections to see them here.'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
