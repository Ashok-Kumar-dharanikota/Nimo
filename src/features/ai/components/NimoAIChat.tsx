import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import {
  Cpu,
  Download,
  Sparkles,
  Zap,
  Star,
  Send,
  Bot,
  ArrowLeft,
  CheckCircle2,
  Loader,
  AlertCircle,
  X,
  Shield,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useLLM, models } from 'react-native-executorch';
import { useModelStore, AVAILABLE_MODELS, type AvailableModel } from '../hooks/useModelStore';
import { ragService } from '@/lib/ragService';
import { setupExecutorch } from '@/lib/executorch';
import { storage } from '@/lib/storage';
import { useSubscription } from '@/components/SubscriptionProvider';
import { useRouter } from 'expo-router';
import * as Device from 'expo-device';
import { useProfileStore } from '@/features/profile/hooks/useProfileStore';
import { useTaskData } from '@/features/home/hooks/useTaskData';

// ─── Quality badge config ────────────────────────────────────────
const QUALITY_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  light: { label: 'Lightweight', color: '#566434', bg: '#eef1e4' },
  balanced: { label: 'Balanced', color: '#b5651d', bg: '#f7ede2' },
  best: { label: 'Best Quality', color: '#a3506a', bg: '#f2e7ea' },
};

// ─── Typing dots animation ───────────────────────────────────────
function TypingIndicator() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, 150);
    setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, 300);
  }, []);

  const style1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
  const style2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
  const style3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

  return (
    <View className="flex-row items-center gap-1 px-3 py-2">
      <Animated.View style={style1} className="w-2 h-2 rounded-full bg-[#a89a8b]" />
      <Animated.View style={style2} className="w-2 h-2 rounded-full bg-[#a89a8b]" />
      <Animated.View style={style3} className="w-2 h-2 rounded-full bg-[#a89a8b]" />
    </View>
  );
}

// ─── Download progress ring ──────────────────────────────────────
function DownloadProgress({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <Animated.View entering={FadeIn.duration(200)} className="items-center py-8">
      {/* Circular progress indicator */}
      <View className="w-28 h-28 rounded-full border-[6px] border-[#efe9e1] items-center justify-center mb-4"
        style={{
          borderColor: pct > 0 ? '#566434' : '#efe9e1',
          borderTopColor: '#efe9e1',
        }}
      >
        <View className="w-[100px] h-[100px] rounded-full bg-[#eef1e4] items-center justify-center">
          <Text className="font-jakarta text-[28px] font-bold text-[#566434]">
            {pct}%
          </Text>
        </View>
      </View>
      <Text className="font-jakarta text-[14px] font-semibold text-[#27170c]">
        Downloading model…
      </Text>
      <Text className="font-jakarta text-[12px] text-[#a89a8b] mt-1">
        This may take a few minutes on first use
      </Text>
    </Animated.View>
  );
}

// ─── Loading / Initializing state ────────────────────────────────
function LoadingState() {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View entering={FadeIn.duration(200)} className="items-center py-10">
      <Animated.View style={animatedStyle}>
        <View className="w-16 h-16 rounded-full bg-[#eef1e4] items-center justify-center mb-4">
          <Cpu size={28} color="#566434" />
        </View>
      </Animated.View>
      <Text className="font-jakarta text-[15px] font-semibold text-[#27170c]">
        Initializing model…
      </Text>
      <Text className="font-jakarta text-[12px] text-[#a89a8b] mt-1">
        Loading into memory
      </Text>
    </Animated.View>
  );
}

// ─── Error state ─────────────────────────────────────────────────
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Animated.View entering={FadeIn.duration(200)} className="items-center py-10 px-6">
      <View className="w-16 h-16 rounded-full bg-[#fde8e8] items-center justify-center mb-4">
        <AlertCircle size={28} color="#dc2626" />
      </View>
      <Text className="font-jakarta text-[15px] font-semibold text-[#27170c] text-center mb-1">
        Something went wrong
      </Text>
      <Text className="font-jakarta text-[12px] text-[#8c7c6c] text-center mb-4">
        {error}
      </Text>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onRetry}
        className="px-6 py-3 rounded-full bg-[#27170c]"
      >
        <Text className="font-jakarta text-[13px] font-bold text-[#fbf9f4]">Try Again</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Model Card ──────────────────────────────────────────────────
function ModelCard({ model, isSelected, onSelect }: {
  model: AvailableModel;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const badge = QUALITY_BADGE[model.quality];
  const deviceMemoryMB = Device.totalMemory ? Device.totalMemory / (1024 * 1024) : 0;
  const isSupported = deviceMemoryMB === 0 || deviceMemoryMB >= model.minMemoryMB;

  return (
    <TouchableOpacity
      activeOpacity={isSupported ? 0.85 : 1}
      onPress={() => {
        if (!isSupported) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelect();
      }}
      style={{ opacity: isSupported ? 1 : 0.6 }}
      className={`rounded-[24px] p-5 border-2 mb-3 ${
        isSelected
          ? 'border-[#566434] bg-[#eef1e4]/60'
          : 'border-[#efe9e1] bg-white'
      }`}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 pr-4">
          <Text className="font-playfair text-[18px] font-bold text-[#27170c]">
            {model.characterName}
          </Text>
          {!isSupported && (
            <View className="flex-row items-center gap-1 mt-1">
              <AlertCircle size={12} color="#dc2626" />
              <Text className="font-jakarta text-[11px] font-semibold text-[#dc2626]">
                Requires {Math.round(model.minMemoryMB / 1024)}GB RAM (Device has {Math.round(deviceMemoryMB / 1024)}GB)
              </Text>
            </View>
          )}
          {isSupported && (
            <View className="flex-row items-center gap-2 mt-1">
              <View
                className="flex-row items-center gap-1 px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: badge.bg }}
              >
                <Text
                  className="font-jakarta text-[10px] font-bold"
                  style={{ color: badge.color }}
                >
                  {badge.label}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          isSelected ? 'border-[#566434] bg-[#566434]' : 'border-[#d2c4bc]'
        }`}>
          {isSelected && <Feather name="check" size={14} color="#fff" />}
        </View>
      </View>

      <Text className="font-jakarta text-[13px] text-[#6b5d51] leading-relaxed">
        {model.description}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Model Download Catalog ──────────────────────────────────────
function ModelDownloadCatalog({ onStartDownload }: { onStartDownload: (modelId: string) => void }) {
  const { selectedModelId, selectModel } = useModelStore();

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <Animated.View entering={FadeInDown.duration(400)} className="items-center pt-8 pb-6">
        <View className="w-20 h-20 rounded-[28px] bg-[#566434] items-center justify-center mb-4 shadow-lg"
          style={{
            shadowColor: '#566434',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          }}
        >
          <Bot size={36} color="#ffffff" />
        </View>

        <Text className="font-playfair text-[28px] font-bold text-[#27170c] text-center leading-tight">
          Nimo Companions
        </Text>
        <Text className="font-jakarta text-[14px] text-[#8c7c6c] text-center mt-2 leading-relaxed px-4">
          Your personal, empathetic journaling friend.{'\n'}
          Choose a companion to get started.
        </Text>
      </Animated.View>

      {/* Feature Pills */}
      <Animated.View entering={FadeInDown.delay(100)} className="flex-row justify-center gap-2 mb-6">
        {[
          { icon: Star, label: 'Empathetic' },
          { icon: Shield, label: 'Private' },
          { icon: Sparkles, label: 'Always There' },
        ].map(({ icon: Icon, label }) => (
          <View key={label} className="flex-row items-center gap-1.5 bg-[#f0eee9] px-3 py-1.5 rounded-full border border-[#e4e2dd]">
            <Icon size={12} color="#566434" />
            <Text className="font-jakarta text-[11px] font-semibold text-[#566434]">{label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Model Cards */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <Text className="font-jakarta text-[12px] font-bold tracking-wider text-[#a89a8b] uppercase mb-3 px-1">
          Choose Your Companion
        </Text>

        {AVAILABLE_MODELS.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            isSelected={selectedModelId === model.id}
            onSelect={() => selectModel(model.id)}
          />
        ))}
      </Animated.View>

      {/* Selected Model CTA */}
      {selectedModelId && (
        <Animated.View entering={FadeInUp.duration(300)} className="mt-4">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onStartDownload(selectedModelId);
            }}
            className="w-full py-4 rounded-[22px] bg-[#27170c] items-center justify-center flex-row gap-2 shadow-md"
          >
            <Download size={18} color="#fbf9f4" />
            <Text className="font-jakarta text-[15px] font-bold text-[#fbf9f4]">
              Invite to your journal
            </Text>
          </TouchableOpacity>

          <Text className="font-jakarta text-[11px] text-[#a89a8b] text-center mt-2">
            Your companion will live securely and privately on your device.
          </Text>
        </Animated.View>
      )}

      {/* Info Note */}
      <Animated.View entering={FadeInDown.delay(400)} className="mt-6 bg-[#f7ede2] rounded-[20px] p-4 border border-[#f0e0cc]">
        <Text className="font-jakarta text-[12px] font-semibold text-[#b5651d] mb-1">
          💡 Complete Privacy
        </Text>
        <Text className="font-jakarta text-[12px] text-[#8a6d4a] leading-relaxed">
          Nimo Companions are completely local. Your journal entries and conversations never leave your phone — complete privacy guaranteed.
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

// ─── Chat message bubble ─────────────────────────────────────────
function MessageBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const isUser = role === 'user';
  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      className={`max-w-[85%] mb-3 ${isUser ? 'self-end' : 'self-start'}`}
    >
      {!isUser && (
        <View className="flex-row items-center gap-1.5 mb-1">
          <View className="w-5 h-5 rounded-full bg-[#566434] items-center justify-center">
            <Bot size={11} color="#ffffff" />
          </View>
          <Text className="font-jakarta text-[10px] font-semibold text-[#a89a8b]">Nimo</Text>
        </View>
      )}
      <View
        className={`px-4 py-3 ${
          isUser
            ? 'bg-[#27170c] rounded-[20px] rounded-br-[6px]'
            : 'bg-white border border-[#efe9e1] rounded-[20px] rounded-bl-[6px]'
        }`}
      >
        <Text
          className={`font-jakarta text-[14px] leading-relaxed ${
            isUser ? 'text-[#fbf9f4]' : 'text-[#27170c]'
          }`}
        >
          {content}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Chat Interface ──────────────────────────────────────────────
function ChatInterface({
  selectedModel,
  onBack,
}: {
  selectedModel: AvailableModel;
  onBack: () => void;
}) {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const { isPremium } = useSubscription();
  const { profile } = useProfileStore();
  const { todayTask } = useTaskData();

  const modelConfig = selectedModel.getModelConfig();

  const llm = useLLM({
    model: modelConfig,
  });

  // Track daily AI message usage
  const [dailyAiUsage, setDailyAiUsage] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = storage.getString('ai_usage_date');
    if (savedDate !== today) {
      storage.set('ai_usage_date', today);
      storage.set('ai_usage_count', 0);
      return 0;
    }
    return storage.getNumber('ai_usage_count') || 0;
  });

  const incrementAiUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = storage.getString('ai_usage_date');
    let count = dailyAiUsage;
    if (savedDate !== today) {
      storage.set('ai_usage_date', today);
      count = 0;
    }
    count += 1;
    storage.set('ai_usage_count', count);
    setDailyAiUsage(count);
  };

  const hasReachedLimit = false; // !isPremium && dailyAiUsage >= 3;

  // Configure system prompt once ready
  useEffect(() => {
    if (llm.isReady) {
      const userName = profile.name ? profile.name.split(' ')[0] : 'friend';
      llm.configure({
        chatConfig: {
          systemPrompt: `You are ${selectedModel.characterName.split(' - ')[0]}, a warm and thoughtful journaling companion. 
The user you are speaking to is named ${userName}. 
Here is your life story: ${selectedModel.lifeStory}
If the user asks about you, feel free to share pieces of your life story in a conversational manner.
Always be empathetic, concise, and encouraging. Keep responses under 3 paragraphs.`,
        },
      });
    }
  }, [llm.isReady, profile.name, selectedModel]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [llm.messageHistory, llm.response, llm.isGenerating]);

  const sendMessage = useCallback(async (forcedText?: string) => {
    const text = (forcedText || inputText).trim();
    if (!text || llm.isGenerating || !llm.isReady) return;

    if (hasReachedLimit) {
      router.push('/paywall');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText('');
    setHasUserSentMessage(true);
    incrementAiUsage();

    try {
      // Perform semantic query against RAG vector store
      const relevantDocs = await ragService.queryRelevantMoments(text, 4);

      let finalPrompt = text;
      if (relevantDocs.length > 0) {
        const memoriesText = relevantDocs
          .map((doc, idx) => {
            const meta = doc.metadata || {};
            const emotionStr = meta.emotion ? ` (Emotion: ${meta.emotion})` : '';
            const titleStr = meta.title ? ` [Title: ${meta.title}]` : '';
            return `${idx + 1}. "${doc.document}"${titleStr}${emotionStr}`;
          })
          .join('\n');

        finalPrompt = `[Context from user's journal memories]:\n${memoriesText}\n\nUser Question: ${text}`;
      }

      await llm.sendMessage(finalPrompt);
    } catch (e) {
      console.warn('LLM sendMessage error:', e);
    }
  }, [inputText, llm, hasReachedLimit]);

  // Compute status
  const status: 'downloading' | 'loading' | 'ready' | 'error' = llm.error
    ? 'error'
    : llm.isReady
    ? 'ready'
    : llm.downloadProgress > 0 && llm.downloadProgress < 1
    ? 'downloading'
    : 'loading';

  // ── Error state ──
  if (llm.error) {
    return (
      <View className="flex-1">
        <ChatHeader modelName={selectedModel.characterName} onBack={onBack} status="error" />
        <View className="flex-1 justify-center">
          <ErrorState
            error={llm.error.message ?? 'Unknown error occurred'}
            onRetry={onBack}
          />
        </View>
      </View>
    );
  }

  // ── Chat UI (renders immediately; shows status inline while initializing) ──
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ChatHeader
        modelName={selectedModel.characterName}
        onBack={onBack}
        status={status}
        progress={llm.downloadProgress}
      />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 16, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Inline Initialization / Loading Banner */}
        {!llm.isReady && (
          <Animated.View entering={FadeIn.duration(300)} className="mb-4 bg-[#eef1e4] rounded-[18px] p-3.5 border border-[#d8e0be] flex-row items-center gap-3">
            <ActivityIndicator size="small" color="#566434" />
            <View className="flex-1">
              <Text className="font-jakarta text-[13px] font-semibold text-[#3d4822]">
                {status === 'downloading'
                  ? `Downloading companion (${Math.round(llm.downloadProgress * 100)}%)…`
                  : `Welcoming ${selectedModel.characterName}…`}
              </Text>
              <Text className="font-jakarta text-[11px] text-[#63723c] mt-0.5">
                Getting ready to chat with you
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Empty state */}
        {!hasUserSentMessage && llm.messageHistory.length === 0 && (
          <Animated.View entering={FadeIn.duration(400)} className="items-center pt-8">
            <View className="w-16 h-16 rounded-full bg-[#eef1e4] items-center justify-center mb-4">
              <Sparkles size={28} color="#566434" />
            </View>
            <Text className="font-playfair text-[22px] font-bold text-[#27170c] text-center">
              What's on your mind?
            </Text>
            <Text className="font-jakarta text-[13px] text-[#8c7c6c] text-center mt-2 leading-relaxed px-6">
              Ask Nimo to reflect on your journal, suggest prompts, or just chat about your day.
            </Text>

            {/* Suggestion Chips */}
            <View className="flex-row flex-wrap justify-center gap-2 mt-6">
              {[
                'What patterns do you see?',
                'Write me a gratitude prompt',
                'Summarize my week',
                'How can I feel better today?',
              ].map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  activeOpacity={0.7}
                  disabled={!llm.isReady || hasReachedLimit}
                  onPress={() => sendMessage(suggestion)}
                  className={`bg-white border border-[#efe9e1] rounded-full px-4 py-2.5 ${
                    !llm.isReady || hasReachedLimit ? 'opacity-50' : ''
                  }`}
                >
                  <Text className="font-jakarta text-[12px] text-[#6b5d51]">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Message bubbles */}
        {llm.messageHistory
          .filter((m) => m.role !== 'system')
          .map((msg, idx) => {
            let displayContent = msg.content;
            if (msg.role === 'user' && displayContent.includes('\n\nUser Question: ')) {
              displayContent = displayContent.split('\n\nUser Question: ').pop() || displayContent;
            }
            return (
              <MessageBubble
                key={idx}
                role={msg.role as 'user' | 'assistant'}
                content={displayContent}
              />
            );
          })}

        {/* Streaming response */}
        {llm.isGenerating && llm.response && (
          <Animated.View entering={FadeIn.duration(150)} className="self-start max-w-[85%] mb-3">
            <View className="flex-row items-center gap-1.5 mb-1">
              <View className="w-5 h-5 rounded-full bg-[#566434] items-center justify-center">
                <Bot size={11} color="#ffffff" />
              </View>
              <Text className="font-jakarta text-[10px] font-semibold text-[#a89a8b]">Nimo</Text>
            </View>
            <View className="bg-white border border-[#efe9e1] rounded-[20px] rounded-bl-[6px] px-4 py-3">
              <Text className="font-jakarta text-[14px] leading-relaxed text-[#27170c]">
                {llm.response}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Typing indicator */}
        {llm.isGenerating && !llm.response && (
          <View className="self-start mb-3">
            <View className="flex-row items-center gap-1.5 mb-1">
              <View className="w-5 h-5 rounded-full bg-[#566434] items-center justify-center">
                <Bot size={11} color="#ffffff" />
              </View>
              <Text className="font-jakarta text-[10px] font-semibold text-[#a89a8b]">Nimo</Text>
            </View>
            <View className="bg-white border border-[#efe9e1] rounded-[20px] rounded-bl-[6px] px-2 py-1">
              <TypingIndicator />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View className="px-4 pb-24 pt-2 border-t border-[#efe9e1] bg-[#fbf9f4]">
        {hasReachedLimit ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/paywall')}
            className="flex-row items-center justify-center bg-[#566434] rounded-[22px] py-4 shadow-md"
          >
            <Sparkles size={16} color="#ffffff" style={{ marginRight: 8 }} />
            <Text className="font-jakarta text-[15px] font-bold text-[#ffffff]">
              Upgrade to continue chatting
            </Text>
          </TouchableOpacity>
        ) : !todayTask ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(app)/home')}
            className="flex-row items-center justify-center bg-[#b5651d] rounded-[22px] py-4 shadow-md"
          >
            <Sparkles size={16} color="#ffffff" style={{ marginRight: 8 }} />
            <Text className="font-jakarta text-[15px] font-bold text-[#ffffff]">
              Set a daily task to unlock chat
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-end gap-2 bg-white rounded-[22px] border border-[#ece5db] px-4 py-2">
            <TextInput
              className="flex-1 font-jakarta text-[14px] text-[#27170c] max-h-[100px] py-1.5"
              placeholder={
                !llm.isReady
                  ? `Preparing ${selectedModel.characterName}...`
                  : llm.isGenerating
                  ? 'Thinking...'
                  : 'Message your companion...'
              }
              placeholderTextColor="#b3a598"
              value={inputText}
              onChangeText={setInputText}
              multiline
              editable={llm.isReady && !llm.isGenerating}
              onSubmitEditing={() => sendMessage()}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => sendMessage()}
              disabled={!inputText.trim() || !llm.isReady || llm.isGenerating}
              className={`w-9 h-9 rounded-full items-center justify-center ${
                inputText.trim() && llm.isReady && !llm.isGenerating ? 'bg-[#566434]' : 'bg-[#e4e2dd]'
              }`}
            >
              <Send size={16} color={inputText.trim() && llm.isReady && !llm.isGenerating ? '#ffffff' : '#a89a8b'} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Chat Header ─────────────────────────────────────────────────
function ChatHeader({
  modelName,
  onBack,
  status,
  progress = 0,
}: {
  modelName: string;
  onBack: () => void;
  status: 'downloading' | 'loading' | 'ready' | 'error';
  progress?: number;
}) {
  const statusConfig = {
    downloading: { label: `Downloading (${Math.round(progress * 100)}%)…`, color: '#b5651d' },
    loading: { label: 'Loading into memory…', color: '#b5651d' },
    ready: { label: 'On-device · Ready', color: '#566434' },
    error: { label: 'Error', color: '#dc2626' },
  };

  const { label, color } = statusConfig[status];

  return (
    <View className="px-5 pt-4 pb-3 border-b border-[#efe9e1] flex-row items-center">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onBack();
        }}
        className="w-9 h-9 rounded-full bg-[#f0eee9] items-center justify-center border border-[#e4e2dd] mr-3"
      >
        <ArrowLeft size={16} color="#4f453f" />
      </TouchableOpacity>
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-10 h-10 rounded-full bg-[#566434] items-center justify-center">
          <Bot size={20} color="#ffffff" />
        </View>
        <View>
          <Text className="font-playfair text-[20px] font-bold text-[#27170c]">{modelName}</Text>
          <View className="flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <Text className="font-jakarta text-[11px]" style={{ color }}>
              {modelName} · {label}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Main Export ──────────────────────────────────────────────────
export function NimoAIChat() {
  const { selectedModelId, selectedModel, isModelActivated, activateModel, clearModel } = useModelStore();

  // Show catalog if no model selected OR model not activated yet
  if (!selectedModelId || !selectedModel || !isModelActivated) {
    return (
      <ModelDownloadCatalog
        onStartDownload={(modelId) => {
          setupExecutorch();
          activateModel(modelId);
        }}
      />
    );
  }

  // Show chat interface (handles download → loading → chat internally)
  return (
    <ChatInterface
      selectedModel={selectedModel}
      onBack={() => {
        clearModel();
      }}
    />
  );
}
