import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Sparkles,
  ChevronDown,
  X,
  Check,
  Plus,
  HelpCircle,
  RotateCcw,
  HeartHandshake,
  Radio,
  Cpu,
} from 'lucide-react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useReflectionCopilot } from '../hooks/useReflectionCopilot';

interface ReflectionCompanionBarProps {
  content: string;
  emotion?: string | null;
  title?: string;
  onApplyTitle: (title: string) => void;
  onAppendThought: (thought: string) => void;
}

/**
 * Animated breathing pulse dot to indicate Nimo is quietly listening.
 */
function BreathingIndicator({
  isGenerating,
  isAutopilot,
  isNeuralReady,
}: {
  isGenerating: boolean;
  isAutopilot: boolean;
  isNeuralReady: boolean;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(isAutopilot ? 1.45 : 1.3, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1300, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1300, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [scale, opacity, isAutopilot]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isGenerating ? 1 : opacity.value,
  }));

  return (
    <View style={styles.breathingContainer}>
      <Animated.View
        style={[
          styles.breathingHalo,
          animatedStyle,
          {
            backgroundColor: isNeuralReady
              ? 'rgba(86, 100, 52, 0.45)'
              : isGenerating
              ? 'rgba(86, 100, 52, 0.4)'
              : 'rgba(86, 100, 52, 0.2)',
          },
        ]}
      />
      <View
        style={[
          styles.breathingDot,
          isAutopilot && styles.breathingDotAuto,
          isNeuralReady && styles.breathingDotNeural,
        ]}
      />
    </View>
  );
}

export function ReflectionCompanionBar({
  content,
  emotion,
  title,
  onApplyTitle,
  onAppendThought,
}: ReflectionCompanionBarProps) {
  const {
    isAutopilot,
    toggleAutopilot,
    isGenerating,
    isNeuralReady,
    isModelInstalled,
    isModelActivated,
    downloadProgress,
    activeAction,
    whisper,
    hasMinContent,
    isListening,
    modelName,
    reflectBack,
    deepenQuestion,
    suggestTitle,
    reframeThought,
    clearWhisper,
    activateModel,
  } = useReflectionCopilot({ content, emotion, title });

  const handleApplyTitle = (suggested: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onApplyTitle(suggested);
    clearWhisper();
  };

  const handleAppendWhisper = (text: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAppendThought(text);
    clearWhisper();
  };

  const dismissKeyboard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
  };

  const isDownloading = downloadProgress > 0 && downloadProgress < 1;

  return (
    <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
      <Animated.View layout={LinearTransition.springify()} style={styles.container}>
        {/* Whisper Card if active */}
        {whisper && (
          <Animated.View
            entering={FadeInDown.duration(250)}
            exiting={FadeOutDown.duration(200)}
            style={styles.whisperCard}
          >
            <View style={styles.whisperHeader}>
              <View style={styles.whisperBadge}>
                {whisper.isNeural ? (
                  <Cpu size={11} color="#566434" />
                ) : (
                  <Sparkles size={11} color="#566434" />
                )}
                <Text style={styles.whisperBadgeText}>
                  {whisper.isNeural
                    ? '✨ Nimo (On-Device Neural AI)'
                    : whisper.isAuto
                    ? '🌿 Nimo (Auto-Listen)'
                    : whisper.type === 'title'
                    ? 'Suggested Title'
                    : whisper.type === 'deepen'
                    ? 'Gentle Question'
                    : whisper.type === 'reframe'
                    ? 'Mindful Reframe'
                    : 'Nimo Reflects'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={clearWhisper}
                activeOpacity={0.7}
                style={styles.whisperCloseBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={14} color="#7a6c60" />
              </TouchableOpacity>
            </View>

            <Text style={styles.whisperText}>{whisper.text}</Text>

            {/* Action buttons inside whisper */}
            <View style={styles.whisperFooter}>
              {whisper.type === 'title' ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleApplyTitle(whisper.text)}
                  style={styles.whisperActionBtn}
                >
                  <Check size={13} color="#ffffff" />
                  <Text style={styles.whisperActionText}>Apply as Title</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleAppendWhisper(whisper.text)}
                  style={styles.whisperActionBtn}
                >
                  <Plus size={13} color="#ffffff" />
                  <Text style={styles.whisperActionText}>Add to Reflection</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}

        {/* Toolbar Header Row */}
        <View style={styles.toolbarHeader}>
          <View style={styles.companionStatus}>
            <BreathingIndicator
              isGenerating={isGenerating}
              isAutopilot={isAutopilot}
              isNeuralReady={isNeuralReady}
            />
            <Text style={styles.companionStatusText}>
              {isGenerating
                ? `${modelName} is reflecting…`
                : isDownloading
                ? `Downloading AI (${Math.round(downloadProgress * 100)}%)`
                : isNeuralReady
                ? `${modelName} (On-Device Neural AI)`
                : isAutopilot
                ? `${modelName} Auto-Listen`
                : isListening
                ? `${modelName} is listening`
                : 'Share a thought'}
            </Text>
          </View>

          {/* Mode Toggle and Keyboard Dismiss */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              onPress={toggleAutopilot}
              activeOpacity={0.8}
              style={[
                styles.modeToggleBtn,
                isAutopilot ? styles.modeToggleBtnAuto : styles.modeToggleBtnManual,
              ]}
            >
              {isAutopilot ? (
                <Radio size={11} color="#566434" />
              ) : (
                <Sparkles size={11} color="#8c7c6c" />
              )}
              <Text
                style={[
                  styles.modeToggleText,
                  isAutopilot ? styles.modeToggleTextAuto : styles.modeToggleTextManual,
                ]}
              >
                {isAutopilot ? 'Auto' : 'Manual'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={dismissKeyboard}
              activeOpacity={0.7}
              style={styles.dismissKeyboardBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ChevronDown size={17} color="#5e5246" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Body: Clean minimalist whisper hint when Autopilot is on; Full action pills when Manual is on */}
        {isAutopilot ? (
          <View style={styles.autopilotHintRow}>
            <Text style={styles.autopilotHintText}>
              {isGenerating
                ? 'Feeding what you wrote to AI…'
                : isDownloading
                ? `Downloading on-device neural model (${Math.round(downloadProgress * 100)}%)`
                : hasMinContent
                ? isNeuralReady
                  ? 'Neural AI listening • pause 2–3s for live reflection'
                  : 'Pause 2–3s while writing for automatic reflections'
                : 'Write freely • Nimo will listen and reflect as you pause'}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {/* Optional 1-tap activation if not yet activated */}
              {!isModelActivated && !isModelInstalled && (
                <TouchableOpacity
                  onPress={activateModel}
                  activeOpacity={0.75}
                  style={styles.activateAiBtn}
                >
                  <Cpu size={10} color="#566434" />
                  <Text style={styles.activateAiBtnText}>Enable Neural AI</Text>
                </TouchableOpacity>
              )}

              {/* Quick title shortcut in autopilot mode */}
              {hasMinContent && !isGenerating && (
                <TouchableOpacity
                  onPress={suggestTitle}
                  activeOpacity={0.75}
                  style={styles.miniTitleBtn}
                >
                  <Sparkles size={10} color="#566434" />
                  <Text style={styles.miniTitleBtnText}>Title</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          /* Manual Mode: Horizontal Action Pills */
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsScroll}
            keyboardShouldPersistTaps="always"
          >
            {/* Reflect Back */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => reflectBack(false)}
              disabled={!hasMinContent || isGenerating}
              style={[
                styles.actionPill,
                (!hasMinContent || isGenerating) && styles.actionPillDisabled,
                activeAction === 'reflect' && styles.actionPillActive,
              ]}
            >
              {isGenerating && activeAction === 'reflect' ? (
                <ActivityIndicator size="small" color="#566434" />
              ) : (
                <HeartHandshake size={13} color={hasMinContent ? '#566434' : '#a89a8b'} />
              )}
              <Text
                style={[
                  styles.actionPillText,
                  (!hasMinContent || isGenerating) && styles.actionPillTextDisabled,
                ]}
              >
                Reflect back
              </Text>
            </TouchableOpacity>

            {/* Deepen Question */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => deepenQuestion(false)}
              disabled={!hasMinContent || isGenerating}
              style={[
                styles.actionPill,
                (!hasMinContent || isGenerating) && styles.actionPillDisabled,
                activeAction === 'deepen' && styles.actionPillActive,
              ]}
            >
              {isGenerating && activeAction === 'deepen' ? (
                <ActivityIndicator size="small" color="#566434" />
              ) : (
                <HelpCircle size={13} color={hasMinContent ? '#566434' : '#a89a8b'} />
              )}
              <Text
                style={[
                  styles.actionPillText,
                  (!hasMinContent || isGenerating) && styles.actionPillTextDisabled,
                ]}
              >
                Deepen
              </Text>
            </TouchableOpacity>

            {/* Suggest Title */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={suggestTitle}
              disabled={!hasMinContent || isGenerating}
              style={[
                styles.actionPill,
                (!hasMinContent || isGenerating) && styles.actionPillDisabled,
                activeAction === 'title' && styles.actionPillActive,
              ]}
            >
              {isGenerating && activeAction === 'title' ? (
                <ActivityIndicator size="small" color="#566434" />
              ) : (
                <Sparkles size={13} color={hasMinContent ? '#566434' : '#a89a8b'} />
              )}
              <Text
                style={[
                  styles.actionPillText,
                  (!hasMinContent || isGenerating) && styles.actionPillTextDisabled,
                ]}
              >
                Suggest title
              </Text>
            </TouchableOpacity>

            {/* Reframe */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={reframeThought}
              disabled={!hasMinContent || isGenerating}
              style={[
                styles.actionPill,
                (!hasMinContent || isGenerating) && styles.actionPillDisabled,
                activeAction === 'reframe' && styles.actionPillActive,
              ]}
            >
              {isGenerating && activeAction === 'reframe' ? (
                <ActivityIndicator size="small" color="#566434" />
              ) : (
                <RotateCcw size={13} color={hasMinContent ? '#566434' : '#a89a8b'} />
              )}
              <Text
                style={[
                  styles.actionPillText,
                  (!hasMinContent || isGenerating) && styles.actionPillTextDisabled,
                ]}
              >
                Reframe
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Animated.View>
    </KeyboardStickyView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbf9f4',
    borderTopWidth: 1,
    borderTopColor: '#ede6dc',
    paddingHorizontal: 14,
    paddingTop: 7,
    paddingBottom: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 4,
  },
  whisperCard: {
    backgroundColor: '#f5f0e6',
    borderWidth: 1,
    borderColor: '#e5dcce',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  whisperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  whisperBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#eef1e4',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  whisperBadgeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '700',
    color: '#566434',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  whisperCloseBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e9e1d5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whisperText: {
    fontFamily: 'Playfair Display',
    fontSize: 14,
    color: '#27170c',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  whisperFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  whisperActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#566434',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  whisperActionText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  toolbarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  companionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  breathingContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  breathingHalo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  breathingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8c7c6c',
  },
  breathingDotAuto: {
    backgroundColor: '#566434',
  },
  breathingDotNeural: {
    backgroundColor: '#3b702e',
  },
  companionStatusText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '600',
    color: '#7a6c60',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  modeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
  },
  modeToggleBtnAuto: {
    backgroundColor: '#eef1e4',
    borderColor: '#d5dfbe',
  },
  modeToggleBtnManual: {
    backgroundColor: '#f1ebe0',
    borderColor: '#e5ded2',
  },
  modeToggleText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10.5,
    fontWeight: '700',
  },
  modeToggleTextAuto: {
    color: '#566434',
  },
  modeToggleTextManual: {
    color: '#8c7c6c',
  },
  dismissKeyboardBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#efe9df',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autopilotHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
  autopilotHintText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#8c7c6c',
    flex: 1,
    fontStyle: 'italic',
  },
  activateAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f1efe6',
    borderWidth: 1,
    borderColor: '#dfd7c8',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activateAiBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '700',
    color: '#566434',
  },
  miniTitleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#eef1e4',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 6,
  },
  miniTitleBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '700',
    color: '#566434',
  },
  actionsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
    paddingRight: 8,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f1ebe0',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5ded2',
  },
  actionPillActive: {
    backgroundColor: '#eef1e4',
    borderColor: '#566434',
  },
  actionPillDisabled: {
    opacity: 0.5,
  },
  actionPillText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11.5,
    fontWeight: '600',
    color: '#473d34',
  },
  actionPillTextDisabled: {
    color: '#9c8e80',
  },
});
