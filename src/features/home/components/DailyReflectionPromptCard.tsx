import { JOURNAL_PROMPTS, getRandomPrompt, type JournalPrompt } from '@/constants/prompts';
import { draftStore } from '@/store/draftStore';
import * as Haptics from 'expo-haptics';
import { Coffee, Edit3, Heart, RotateCw, Smile, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface DailyReflectionPromptCardProps {
  onStartReflection?: () => void;
}

const QUICK_MOODS = [
  { id: 'calm', label: 'Calm', Icon: Coffee, color: '#4f5c42', bg: '#eae3d6' },
  { id: 'inspired', label: 'Grateful', Icon: Sparkles, color: '#b5651d', bg: '#f7ede2' },
  { id: 'happy', label: 'Joyful', Icon: Smile, color: '#566434', bg: '#eef1e4' },
  { id: 'loved', label: 'Tender', Icon: Heart, color: '#a3506a', bg: '#f2e7ea' },
];

export function DailyReflectionPromptCard({ onStartReflection }: DailyReflectionPromptCardProps) {
  const [currentPrompt, setCurrentPrompt] = useState<JournalPrompt>(JOURNAL_PROMPTS[0]);
  const [isRotating, setIsRotating] = useState(false);

  const handleShuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRotating(true);
    const next = getRandomPrompt(currentPrompt.id);
    setCurrentPrompt(next);
    setTimeout(() => setIsRotating(false), 300);
  };

  const handleStartWithPrompt = (emotion?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    draftStore.startDraft({
      title: currentPrompt.prompt,
      emotion: emotion || undefined,
    });
    if (onStartReflection) {
      onStartReflection();
    }
  };

  return (
    <View className="px-5 mb-4">
      <View className="bg-[#f4efe6] rounded-[26px] p-5 border border-[#e8dfd3] shadow-sm relative overflow-hidden">
        {/* Soft decorative background accents */}
        <View className="absolute -right-8 -top-8 w-28 h-28 bg-[#566434]/5 rounded-full pointer-events-none" />
        <View className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#b5651d]/5 rounded-full pointer-events-none" />

        {/* Card Header: Tag & Shuffle */}
        <View className="flex-row items-center justify-between mb-3 z-10">
          <View className="flex-row items-center gap-1.5 bg-[#eef1e4] px-3 py-1 rounded-full border border-[#dce5c8]">
            <Sparkles size={12} color="#566434" />
            <Text className="font-jakarta text-[11px] font-bold text-[#566434] tracking-wider uppercase">
              {currentPrompt.tag}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShuffle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="w-8 h-8 rounded-full bg-white/80 items-center justify-center border border-[#e2d8cb] shadow-xs"
          >
            <RotateCw size={13} color="#6b5d51" />
          </TouchableOpacity>
        </View>

        {/* Prompt Question */}
        <View className="mb-4 z-10">
          <Text className="font-jakarta text-[16.5px] font-medium text-[#2d231e] leading-[25px]">
            {currentPrompt.prompt}
          </Text>
        </View>

        {/* Footer Actions: Quick Emotion check-in & Action button */}
        <View className="flex-row items-center justify-between pt-2 border-t border-[#e8dfd3]/80 z-10">
          {/* Quick mood chips */}
          <View className="flex-row items-center gap-1.5">
            {QUICK_MOODS.map((mood) => {
              const MoodIcon = mood.Icon;
              return (
                <TouchableOpacity
                  key={mood.id}
                  activeOpacity={0.75}
                  onPress={() => handleStartWithPrompt(mood.id)}
                  accessibilityLabel={mood.label}
                  style={{ backgroundColor: mood.bg }}
                  className="w-7 h-7 rounded-full items-center justify-center border border-black/5"
                >
                  <MoodIcon
                    size={16}
                    color={mood.id === 'happy' ? mood.bg : mood.color}
                    fill={mood.color}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Start Reflecting CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleStartWithPrompt()}
            className="bg-[#566434] px-4 py-2 rounded-full flex-row items-center gap-1.5 shadow-sm"
          >
            <Edit3 size={13} color="#ffffff" />
            <Text className="font-jakarta text-[12.5px] font-bold text-white">
              Write Entry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
