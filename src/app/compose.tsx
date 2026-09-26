import { getRandomPrompt, type JournalPrompt } from '@/constants/prompts';
import { useReflectionCopilot } from '@/features/ai';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { useDraftStore } from '@/store/draftStore';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bot,
  Check,
  CloudRain,
  Coffee,
  Compass,
  Heart,
  HeartHandshake,
  Image as ImageIcon,
  Lightbulb,
  Moon,
  Plus,
  RotateCw,
  Smile,
  Sparkles,
  Sun,
  Trash2,
  X,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOODS = [
  { id: 'calm', label: 'Calm', Icon: Coffee, color: '#4f5c42', bg: '#eae3d6', fill: '#4f5c42' },
  { id: 'inspired', label: 'Grateful', Icon: Sparkles, color: '#b5651d', bg: '#f7ede2', fill: '#b5651d' },
  { id: 'happy', label: 'Joyful', Icon: Smile, color: '#566434', bg: '#eef1e4', fill: '#566434' },
  { id: 'bright', label: 'Radiant', Icon: Sun, color: '#d97706', bg: '#fef3c7', fill: '#d97706' },
  { id: 'loved', label: 'Loved', Icon: Heart, color: '#b83b5e', bg: '#faeaef', fill: '#b83b5e' },
  { id: 'reflective', label: 'Thoughtful', Icon: Moon, color: '#475569', bg: '#e2e8f0', fill: '#475569' },
  { id: 'tender', label: 'Tender', Icon: CloudRain, color: '#64748b', bg: '#edf2f7', fill: '#64748b' },
];

interface PromptInfo {
  text: string;
  badge: string;
  actionLabel: string;
  isTitle: boolean;
}

/**
 * Animated prompt card with typewriter text streaming, fade-in transition,
 * and a breathing glowing circle.
 */
function TypewriterPromptCard({
  promptInfo,
  onUsePrompt,
}: {
  promptInfo: PromptInfo;
  onUsePrompt: (text: string, isTitle: boolean) => void;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriting effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index <= promptInfo.text.length) {
        setDisplayedText(promptInfo.text.slice(0, index));
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [promptInfo.text]);

  // Glowing animated circle (breathing scale & opacity)
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.6);

  useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1300, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.75, { duration: 1300, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [glowScale, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View
      key={promptInfo.text}
      entering={FadeInDown.duration(320)}
      exiting={FadeOutUp.duration(180)}
      style={styles.promptCard}
    >
      <View style={styles.promptCardHeader}>
        <View style={styles.glowingDotWrapper}>
          <Animated.View style={[styles.glowingHalo, glowStyle]} />
          <View style={styles.glowingDot} />
        </View>
        <Text style={styles.promptCardBadge}>{promptInfo.badge}</Text>
      </View>

      <Text style={styles.promptCardText}>
        &ldquo;{displayedText}&rdquo;
        {isTyping && <Text style={styles.typewriterCursor}>|</Text>}
      </Text>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => onUsePrompt(promptInfo.text, promptInfo.isTitle)}
        style={styles.usePromptBtn}
      >
        <Sparkles size={11} color="#566434" />
        <Text style={styles.usePromptBtnText}>{promptInfo.actionLabel}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ComposeScreen() {
  const router = useRouter();
  const {
    draftId,
    title: storedTitle,
    content: storedContent,
    emotion: storedEmotion,
    mediaUri: storedMediaUri,
    mediaType: storedMediaType,
    updateDraft,
    clearDraft,
  } = useDraftStore();

  const { addQuickMoment, isAddingMoment } = useHomeData();

  const [title, setTitle] = useState(storedTitle);
  const [content, setContent] = useState(storedContent);
  const [selectedMood, setSelectedMood] = useState<string | null>(storedEmotion);
  const [mediaUri, setMediaUri] = useState<string | null>(storedMediaUri);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(storedMediaType);
  const [prevDraftId, setPrevDraftId] = useState(draftId);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);

  // Prompt displayed in the Mindful Spark typewriter card
  const [promptInfo, setPromptInfo] = useState<PromptInfo>(() => {
    const initial = getRandomPrompt();
    return {
      text: initial.prompt,
      badge: 'Mindful Spark',
      actionLabel: 'Reflect on this',
      isTitle: false,
    };
  });

  if (draftId !== prevDraftId) {
    setPrevDraftId(draftId);
    setTitle(storedTitle);
    setContent(storedContent);
    setSelectedMood(storedEmotion);
    setMediaUri(storedMediaUri);
    setMediaType(storedMediaType);
  }

  // Reflection AI copilot hook
  const {
    isAutopilot,
    toggleAutopilot,
    isGenerating,
    isNeuralReady,
    whisper,
    hasMinContent,
    reflectBack,
    deepenQuestion,
    suggestTitle,
    reframeThought,
    clearWhisper,
  } = useReflectionCopilot({
    content,
    emotion: selectedMood,
    title,
  });

  // When AI generates a reflection or title, display it inside the Mindful Spark card instead of description
  useEffect(() => {
    if (whisper && whisper.text) {
      setPromptInfo({
        text: whisper.text,
        badge:
          whisper.type === 'title'
            ? 'Suggested Title'
            : whisper.type === 'deepen'
            ? 'Gentle Question'
            : whisper.type === 'reframe'
            ? 'Mindful Reframe'
            : whisper.isNeural
            ? '✨ Neural Spark'
            : 'Mindful Spark',
        actionLabel: whisper.type === 'title' ? 'Apply as Title' : 'Reflect on this',
        isTitle: whisper.type === 'title',
      });
      clearWhisper();
    }
  }, [whisper, clearWhisper]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    updateDraft({ title: val });
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    updateDraft({ content: val });
  };

  const handleSelectMood = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = selectedMood === id ? null : id;
    setSelectedMood(next);
    updateDraft({ emotion: next });
  };

  const pickMedia = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;
        const type: 'photo' | 'video' = asset.type === 'video' ? 'video' : 'photo';
        setMediaUri(uri);
        setMediaType(type);
        updateDraft({ mediaUri: uri, mediaType: type });
      }
    } catch (e) {
      console.error('Failed to pick media:', e);
    }
  };

  const removeMedia = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMediaUri(null);
    setMediaType(null);
    updateDraft({ mediaUri: null, mediaType: null });
  };

  const handleShufflePrompt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = getRandomPrompt();
    setPromptInfo({
      text: next.prompt,
      badge: 'Mindful Spark',
      actionLabel: 'Reflect on this',
      isTitle: false,
    });
  };

  const handleUsePrompt = (promptText: string, isTitle: boolean) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (isTitle || !title.trim()) {
      setTitle(promptText);
      updateDraft({ title: promptText });
    } else {
      const separator = content.trim() ? '\n\n' : '';
      const formatted = promptText.trim().startsWith('*') ? promptText.trim() : `*${promptText.trim()}*`;
      const next = `${content.trim()}${separator}${formatted}\n\n`;
      setContent(next);
      updateDraft({ content: next });
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSave = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent && !mediaUri && !title.trim()) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await addQuickMoment({
        id: draftId,
        content: trimmedContent || (mediaType === 'video' ? 'Recorded a video' : 'Captured a photo'),
        emotion: selectedMood || undefined,
        title: title.trim() || undefined,
        mediaUri: mediaUri || undefined,
        mediaType: mediaType || undefined,
        isDraft: false,
      });
      clearDraft();
      router.back();
    } catch (err) {
      console.error('Failed to save reflection:', err);
    }
  };

  const canSave = (content.trim().length > 0 || mediaUri !== null || title.trim().length > 0) && !isAddingMoment;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View style={styles.header}>
        {/* Left: Close */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleClose}
          style={styles.closeBtn}
          accessibilityLabel="Close"
        >
          <X size={20} color="#4f453f" />
        </TouchableOpacity>

        {/* Center: Title & Subtitle with Date */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>New Reflection</Text>
          <Text style={styles.headerSubtitle}>{todayStr}</Text>
        </View>

        {/* Right: AI Bot Button & Save Button */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsAiMenuOpen((prev) => !prev);
            }}
            style={[
              styles.botBtn,
              isAiMenuOpen && styles.botBtnActive,
              isGenerating && styles.botBtnGenerating,
            ]}
            accessibilityLabel="Nimo AI Companion"
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#566434" />
            ) : (
              <View style={styles.botIconWrapper}>
                <Bot size={19} color={isAiMenuOpen ? '#566434' : '#4f453f'} />
                {isNeuralReady && <View style={styles.botNeuralDot} />}
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={!canSave}
            style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
            accessibilityLabel="Save reflection"
          >
            {isAddingMoment ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <View style={styles.saveBtnContent}>
                <Check size={16} color="#ffffff" />
                <Text style={styles.saveBtnText}>Save</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Action Row: Media Icon + Filled Mood Icons + Word Count */}
      <View style={styles.topToolbar}>
        {/* Media Button: Clean icon only */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={pickMedia}
          style={[styles.mediaIconBtn, mediaUri ? styles.mediaIconBtnActive : null]}
          accessibilityLabel={mediaUri ? 'Change attached photo or video' : 'Add photo or video'}
        >
          <ImageIcon size={18} color={mediaUri ? '#3e4925' : '#566434'} />
          {mediaUri && <View style={styles.mediaDotBadge} />}
        </TouchableOpacity>

        <View style={styles.toolbarDivider} />

        {/* Mood Icons (without labels, filled with color) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodsScroll}
          style={styles.moodsScrollView}
        >
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            const MoodIcon = mood.Icon;
            return (
              <TouchableOpacity
                key={mood.id}
                activeOpacity={0.75}
                onPress={() => handleSelectMood(mood.id)}
                style={[
                  styles.moodBtn,
                  { backgroundColor: isSelected ? mood.color : mood.bg },
                  isSelected && styles.moodBtnSelected,
                ]}
                accessibilityLabel={mood.label}
              >
                <MoodIcon
                  size={17}
                  color={isSelected ? '#ffffff' : mood.color}
                  fill={isSelected ? '#ffffff' : mood.fill}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.toolbarDivider} />

        {/* Word Count Badge at Top */}
        <View style={styles.wordCountBadge}>
          <Text style={styles.wordCountText}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </Text>
        </View>
      </View>

      {/* Scrollable Distraction-Free Editor */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        bottomOffset={Platform.OS === 'ios' ? 70 : 45}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Mindful Prompt - Inspire Me Button */}
        <View style={styles.inspireRow}>
          <TouchableOpacity
            onPress={handleShufflePrompt}
            activeOpacity={0.75}
            style={styles.promptShuffleBtn}
          >
            <Sparkles size={12} color="#566434" />
            <Text style={styles.promptShuffleText}>Inspire me</Text>
            <RotateCw size={11} color="#6b5d51" />
          </TouchableOpacity>
        </View>

        {/* Animated AI Prompt Card with Typewriter & Glowing Circle */}
        <TypewriterPromptCard
          promptInfo={promptInfo}
          onUsePrompt={handleUsePrompt}
        />

        {/* Title Input with text wrapping */}
        <TextInput
          style={styles.titleInput}
          placeholder="Title of this moment…"
          placeholderTextColor="#b0a597"
          value={title}
          onChangeText={handleTitleChange}
          multiline={true}
          blurOnSubmit={false}
          textAlignVertical="top"
        />

        {/* Media Preview if attached */}
        {mediaUri && (
          <View style={styles.mediaContainer}>
            <Image source={{ uri: mediaUri }} style={styles.mediaImage} resizeMode="cover" />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={removeMedia}
              style={styles.removeMediaBtn}
            >
              <Trash2 size={15} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Description TextInput with text wrapping */}
        <TextInput
          value={content}
          onChangeText={handleContentChange}
          placeholder="Let your thoughts unfold here… What happened? What did you notice? How did your heart feel?"
          placeholderTextColor="#b3a598"
          multiline={true}
          scrollEnabled={false}
          textAlignVertical="top"
          style={styles.contentInput}
          autoFocus={!title}
        />
      </KeyboardAwareScrollView>

      {/* AI Mindful Companion Floating Popover Menu */}
      {isAiMenuOpen && (
        <Pressable
          style={styles.aiMenuBackdrop}
          onPress={() => setIsAiMenuOpen(false)}
        >
          <Animated.View
            entering={FadeInDown.duration(200)}
            exiting={FadeOutUp.duration(150)}
            style={styles.aiMenuCard}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.aiMenuHeader}>
                <View style={styles.aiMenuTitleRow}>
                  <View style={styles.aiMenuBadge}>
                    <Sparkles size={12} color="#566434" />
                    <Text style={styles.aiMenuBadgeText}>Nimo AI</Text>
                  </View>
                  <Text style={styles.aiMenuTitle}>Mindful Companion</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsAiMenuOpen(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.aiMenuCloseBtn}
                >
                  <X size={16} color="#8c7c6c" />
                </TouchableOpacity>
              </View>

              <Text style={styles.aiMenuSubtitle}>
                Private on-device intelligence to deepen your journaling experience.
              </Text>

              {!hasMinContent ? (
                <View style={styles.aiMenuEmptyState}>
                  <Text style={styles.aiMenuEmptyText}>
                    ✍️ Write a sentence or two first to invite Nimo&apos;s reflections.
                  </Text>
                </View>
              ) : (
                <View style={styles.aiActionsGrid}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    disabled={isGenerating}
                    onPress={() => {
                      setIsAiMenuOpen(false);
                      suggestTitle();
                    }}
                    style={styles.aiActionCard}
                  >
                    <View style={[styles.aiActionIconWrap, { backgroundColor: '#fef3c7' }]}>
                      <Lightbulb size={16} color="#d97706" />
                    </View>
                    <View style={styles.aiActionTextCol}>
                      <Text style={styles.aiActionTitle}>Suggest Title</Text>
                      <Text style={styles.aiActionDesc}>Craft a poetic title for this moment</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    disabled={isGenerating}
                    onPress={() => {
                      setIsAiMenuOpen(false);
                      reflectBack();
                    }}
                    style={styles.aiActionCard}
                  >
                    <View style={[styles.aiActionIconWrap, { backgroundColor: '#eef1e4' }]}>
                      <Sparkles size={16} color="#566434" />
                    </View>
                    <View style={styles.aiActionTextCol}>
                      <Text style={styles.aiActionTitle}>Reflect Back</Text>
                      <Text style={styles.aiActionDesc}>Gentle mirror of your feelings</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    disabled={isGenerating}
                    onPress={() => {
                      setIsAiMenuOpen(false);
                      deepenQuestion();
                    }}
                    style={styles.aiActionCard}
                  >
                    <View style={[styles.aiActionIconWrap, { backgroundColor: '#e0f2fe' }]}>
                      <Compass size={16} color="#0284c7" />
                    </View>
                    <View style={styles.aiActionTextCol}>
                      <Text style={styles.aiActionTitle}>Deepen</Text>
                      <Text style={styles.aiActionDesc}>A thoughtful question to ponder</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    disabled={isGenerating}
                    onPress={() => {
                      setIsAiMenuOpen(false);
                      reframeThought();
                    }}
                    style={styles.aiActionCard}
                  >
                    <View style={[styles.aiActionIconWrap, { backgroundColor: '#faeaef' }]}>
                      <HeartHandshake size={16} color="#b83b5e" />
                    </View>
                    <View style={styles.aiActionTextCol}>
                      <Text style={styles.aiActionTitle}>Mindful Reframe</Text>
                      <Text style={styles.aiActionDesc}>Compassionate perspective shift</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* Autopilot toggle footer */}
              <View style={styles.aiMenuFooter}>
                <View style={styles.aiAutoCol}>
                  <Text style={styles.aiAutoTitle}>Auto-Listen</Text>
                  <Text style={styles.aiAutoDesc}>Quietly generate insights as you write</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={toggleAutopilot}
                  style={[
                    styles.autoToggleBtn,
                    isAutopilot && styles.autoToggleBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.autoToggleText,
                      isAutopilot && styles.autoToggleTextActive,
                    ]}
                  >
                    {isAutopilot ? 'Active' : 'Off'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#efe9e1',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f0eee9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 17,
    fontWeight: '700',
    color: '#27170c',
  },
  headerSubtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#8c7c6c',
    marginTop: 2,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f0eee9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botBtnActive: {
    backgroundColor: '#eef1e4',
    borderWidth: 1.5,
    borderColor: '#566434',
  },
  botBtnGenerating: {
    backgroundColor: '#f5f7ee',
  },
  botIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botNeuralDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#566434',
  },
  saveBtn: {
    backgroundColor: '#566434',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  saveBtnDisabled: {
    backgroundColor: '#c7ceb8',
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  saveBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },

  /* Top Toolbar: Media Icon + Moods + Word Count */
  topToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fbf9f4',
    borderBottomWidth: 1,
    borderBottomColor: '#efe9e1',
  },
  mediaIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0eee9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mediaIconBtnActive: {
    backgroundColor: '#e3ebda',
    borderWidth: 1.5,
    borderColor: '#566434',
  },
  mediaDotBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#566434',
  },
  toolbarDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e6dfd4',
    marginHorizontal: 10,
  },
  moodsScrollView: {
    flex: 1,
  },
  moodsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 6,
  },
  moodBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  moodBtnSelected: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  wordCountBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#f2eee6',
    borderWidth: 1,
    borderColor: '#e8dfd3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordCountText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '600',
    color: '#7a6c60',
  },

  /* Scrollable Editor */
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
  },
  inspireRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  promptShuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#f4efe6',
    borderWidth: 1,
    borderColor: '#e8dfd3',
  },
  promptShuffleText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '600',
    color: '#566434',
  },

  /* Animated Prompt Card with Glowing Circle & Typewriter */
  promptCard: {
    backgroundColor: '#f9f6f0',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8ded0',
    marginBottom: 18,
    shadowColor: '#566434',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  promptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  glowingDotWrapper: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowingHalo: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(86, 100, 52, 0.35)',
  },
  glowingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#566434',
  },
  promptCardBadge: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
    color: '#566434',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptCardText: {
    fontFamily: 'Playfair Display',
    fontSize: 15,
    color: '#27170c',
    fontStyle: 'italic',
    lineHeight: 23,
    marginBottom: 12,
  },
  typewriterCursor: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    color: '#566434',
    fontWeight: '700',
  },
  usePromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#eef1e4',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 12,
  },
  usePromptBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11.5,
    fontWeight: '600',
    color: '#566434',
  },

  titleInput: {
    fontFamily: 'Playfair Display',
    fontSize: 24,
    fontWeight: '700',
    color: '#27170c',
    marginBottom: 12,
    paddingVertical: 4,
    lineHeight: 32,
    width: '100%',
  },
  mediaContainer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1c1a17',
    marginBottom: 18,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentInput: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    lineHeight: 26,
    color: '#27170c',
    minHeight: 240,
    paddingVertical: 6,
    width: '100%',
  },

  /* AI Menu Floating Popover */
  aiMenuBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(28, 26, 23, 0.35)',
    zIndex: 99,
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 95 : 65,
    paddingHorizontal: 16,
  },
  aiMenuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e8dfd3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  aiMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  aiMenuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiMenuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eef1e4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  aiMenuBadgeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '700',
    color: '#566434',
    textTransform: 'uppercase',
  },
  aiMenuTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 17,
    fontWeight: '700',
    color: '#27170c',
  },
  aiMenuCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f2eee6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiMenuSubtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: '#8c7c6c',
    marginBottom: 14,
  },
  aiMenuEmptyState: {
    backgroundColor: '#f9f6f0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#efe9e1',
  },
  aiMenuEmptyText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12.5,
    color: '#7a6c60',
    lineHeight: 18,
    textAlign: 'center',
  },
  aiActionsGrid: {
    gap: 8,
    marginBottom: 16,
  },
  aiActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#faf7f2',
    borderWidth: 1,
    borderColor: '#eee7dc',
  },
  aiActionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiActionTextCol: {
    flex: 1,
  },
  aiActionTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: '#27170c',
  },
  aiActionDesc: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#8c7c6c',
    marginTop: 1,
  },
  aiMenuFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0eae1',
  },
  aiAutoCol: {
    flex: 1,
  },
  aiAutoTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12.5,
    fontWeight: '700',
    color: '#27170c',
  },
  aiAutoDesc: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10.5,
    color: '#8c7c6c',
  },
  autoToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#f0eee9',
  },
  autoToggleBtnActive: {
    backgroundColor: '#eef1e4',
    borderWidth: 1,
    borderColor: '#566434',
  },
  autoToggleText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8c7c6c',
  },
  autoToggleTextActive: {
    color: '#566434',
  },
});
