import { draftStore } from '@/store/draftStore';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Bookmark, Calendar, Coffee, Edit3, Heart, Play, Search, Smile, Sparkle, Sparkles, Sun } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatTime } from '../utils/dateUtils';
import { InlineDraftCard } from './InlineDraftCard';
import { MomentVideoPlayer } from './MomentVideoPlayer';
import { DailyTaskCard } from './DailyTaskCard';
import { CalendarTooltip } from '@/components/ui/CalendarTooltip';

interface MomentData {
  id: number;
  content: string;
  createdAt: string;
  journalTitle: string | null;
  emotion?: string | null;
  title?: string | null;
  mediaUri?: string | null;
  mediaType?: 'photo' | 'video' | null;
  isDraft?: boolean;
}

interface StorybookTimelineProps {
  moments: MomentData[];
  onOpenCalendar?: () => void;
  onOpenSearch?: () => void;
  isAddingTask?: boolean;
  onCancelAddTask?: () => void;
  onTaskSet?: () => void;
  onRecordTap?: () => void;
}

const EMOTION_ICON_MAP: Record<string, { Icon: any; color: string; bg: string; label: string }> = {
  happy: { Icon: Smile, color: '#566434', bg: '#eef1e4', label: 'Happy' },
  inspired: { Icon: Sparkles, color: '#b5651d', bg: '#f7ede2', label: 'Inspired' },
  loved: { Icon: Heart, color: '#a3506a', bg: '#f2e7ea', label: 'Loved' },
  bright: { Icon: Sun, color: '#d97706', bg: '#fef3c7', label: 'Bright' },
  calm: { Icon: Coffee, color: '#4f5c42', bg: '#eae3d6', label: 'Calm' },
};

export function StorybookTimeline({
  moments,
  onOpenCalendar,
  onOpenSearch,
  isAddingTask = false,
  onCancelAddTask,
  onTaskSet,
  onRecordTap,
}: StorybookTimelineProps) {
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });



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
          <CalendarTooltip>
            <View className="w-10 h-10 rounded-full bg-[#f0eee9] items-center justify-center border border-[#e4e2dd]">
              <Calendar size={17} color="#4f453f" />
            </View>
          </CalendarTooltip>
        </View>
      </View>

      {/* Threaded Storybook Feed Container */}
      <View className="relative px-6">
        <DailyTaskCard isAddingTask={isAddingTask} onCancelAdd={onCancelAddTask || (() => {})} onTaskSet={onTaskSet || (() => {})} />

        {/* Inline Draft Moment Card */}
        <InlineDraftCard />

        {/* Thread Vertical Connector Line — adjusted for 28px dot */}
        <View className="absolute left-[37px] top-4 bottom-8 w-[2px] bg-[#c7d2ab]" />

        <View className="flex-col gap-6">
          {/* 1. Live User Moments recorded in App */}
          {moments.map((moment, index) => {
            const timeString = formatTime(moment.createdAt);
            const emotionConfig = (moment.emotion && EMOTION_ICON_MAP[moment.emotion]) || {
              Icon: Sparkle,
              color: '#566434',
              bg: '#eef1e4',
              label: 'Moment',
            };

            const EmotionIcon = emotionConfig.Icon;
            const displayTitle = moment.title || moment.journalTitle;
            const isDraftMoment = Boolean(moment.isDraft);

            return (
              <Animated.View
                key={`live-${moment.id}`}
                entering={FadeInDown.delay(index * 80)}
                className="flex-row gap-3"
              >
                {/* Thread Node — Emotion Icon Circle (28×28) */}
                <View className="w-[28px] items-center pt-0.5 flex-none">
                  <View
                    className="w-[28px] h-[28px] rounded-full items-center justify-center border-[2.5px]"
                    style={{
                      backgroundColor: isDraftMoment ? '#eef1e4' : emotionConfig.bg,
                      borderColor: isDraftMoment ? '#566434' : emotionConfig.color + '40',
                    }}
                  >
                    {isDraftMoment ? (
                      <Bookmark size={13} color="#566434" />
                    ) : (
                      <EmotionIcon size={14} color={emotionConfig.color} />
                    )}
                  </View>
                </View>

                {/* Entry Content */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-jakarta text-[11px] font-bold tracking-wider text-[#a89a8b]">
                      {timeString}
                    </Text>
                    {isDraftMoment && (
                      <View className="flex-row items-center gap-1 bg-[#eef1e4] px-2 py-0.5 rounded-md">
                        <Bookmark size={10} color="#566434" />
                        <Text className="font-jakarta text-[10px] font-bold text-[#566434]">
                          DRAFT
                        </Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    activeOpacity={isDraftMoment ? 0.85 : 1}
                    onPress={() => {
                      if (isDraftMoment) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        draftStore.editDraftMoment(moment);
                      }
                    }}
                    className={`bg-white rounded-[22px] p-4 border shadow-sm ${isDraftMoment ? 'border-dashed border-[#56643480] bg-[#fcfbf7]' : 'border-[#efe9e1]'
                      }`}
                  >
                    {/* Media Display if user picked image/video from phone */}
                    {moment.mediaUri ? (
                      <View className="mb-3 rounded-[16px] overflow-hidden w-full aspect-square bg-[#1c1a17] relative">
                        {moment.mediaType === 'video' ? (
                          <MomentVideoPlayer uri={moment.mediaUri} aspectRatio={1} />
                        ) : (
                          <Image source={{ uri: moment.mediaUri }} className="w-full h-full aspect-square" resizeMode="cover" />
                        )}
                      </View>
                    ) : null}

                    {displayTitle && (
                      <Text className="font-playfair text-[17px] font-semibold text-[#27170c] mb-1">
                        {displayTitle}
                      </Text>
                    )}
                    <Text className="font-jakarta text-[13.5px] text-[#6b5d51] leading-relaxed">
                      {moment.content}
                    </Text>

                    <View className="flex-row items-center justify-between mt-3">
                      <View
                        className="flex-row items-center gap-1.5 px-3 py-1 rounded-full"
                        style={{ backgroundColor: emotionConfig.bg }}
                      >
                        <EmotionIcon size={13} color={emotionConfig.color} />
                        <Text
                          className="font-jakarta text-[11px] font-semibold"
                          style={{ color: emotionConfig.color }}
                        >
                          {emotionConfig.label}
                        </Text>
                      </View>

                      {isDraftMoment && (
                        <View className="flex-row items-center gap-1 bg-[#56643415] px-2.5 py-1 rounded-full">
                          <Edit3 size={11} color="#566434" />
                          <Text className="font-jakarta text-[11px] font-bold text-[#566434]">
                            Tap to Update
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            );
          })}

          {moments.length === 0 && (
            <Animated.View entering={FadeInDown.delay(100)} className="py-12 items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-[#f0eee9] items-center justify-center mb-4 border border-[#e4e2dd]">
                <Sparkles size={24} color="#8c7c6c" />
              </View>
              <Text className="font-playfair text-xl font-bold text-[#27170c]">A blank slate</Text>
              <Text className="font-jakarta text-[13.5px] text-[#6b5d51] text-center mt-2 px-6 leading-relaxed">
                Take a moment to pause, breathe, and record how you're feeling right now.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (onRecordTap) onRecordTap();
                  else draftStore.startDraft();
                }}
                className="mt-6 bg-[#566434] px-6 py-3 rounded-full flex-row items-center gap-2"
              >
                <Edit3 size={16} color="white" />
                <Text className="font-jakarta text-[14px] font-semibold text-white">Record a Moment</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
