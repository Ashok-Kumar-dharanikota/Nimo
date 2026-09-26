import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import { useLLM } from 'react-native-executorch';
import { useModelStore } from './useModelStore';
import { useProfileStore } from '@/features/profile/hooks/useProfileStore';

export type CopilotActionType = 'reflect' | 'deepen' | 'title' | 'reframe';

export interface CopilotWhisper {
  type: CopilotActionType;
  text: string;
  isAuto?: boolean;
  isNeural?: boolean;
  createdAt: number;
}

interface UseReflectionCopilotProps {
  content: string;
  emotion?: string | null;
  title?: string;
}

const storage = createMMKV({ id: 'nimo-copilot-settings' });
const AUTOPILOT_STORAGE_KEY = 'autopilot_mode_enabled';

/**
 * Intelligent reflection companion hook powered by on-device ExecuTorch LLM models.
 * Feeds user's actual written text into the neural model with graceful fallback heuristics.
 */
export function useReflectionCopilot({
  content,
  emotion,
  title,
}: UseReflectionCopilotProps) {
  const {
    selectedModel,
    isModelActivated,
    installedModelIds,
    activateModel,
  } = useModelStore();

  const { profile } = useProfileStore();

  const [isAutopilot, setIsAutopilotState] = useState<boolean>(() => {
    return storage.getBoolean(AUTOPILOT_STORAGE_KEY) ?? true;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAction, setActiveAction] = useState<CopilotActionType | null>(null);
  const [whisper, setWhisper] = useState<CopilotWhisper | null>(null);

  const trimmedContent = content.trim();
  const hasMinContent = trimmedContent.length >= 10;
  const isListening = trimmedContent.length > 0;
  const userName = profile.name ? profile.name.split(' ')[0] : 'friend';

  // Check if model should be loaded
  const isModelInstalled = installedModelIds.includes(selectedModel.id);
  const shouldLoadModel = Platform.OS !== 'web' && (isModelActivated || isModelInstalled);

  const modelConfig = useMemo(() => selectedModel.getModelConfig(), [selectedModel]);

  // Hook into the actual on-device ExecuTorch Large Language Model
  const llm = useLLM({
    model: modelConfig,
    preventLoad: !shouldLoadModel,
  });

  // Configure sampling hyperparameters on the neural model once ready
  useEffect(() => {
    if (llm.isReady) {
      llm.configure({
        generationConfig: {
          temperature: selectedModel.temperature ?? 0.6,
          repetitionPenalty: selectedModel.repetitionPenalty ?? 1.15,
          topP: selectedModel.topP ?? 0.9,
          minP: selectedModel.minP ?? 0.05,
        },
      });
    }
  }, [llm, selectedModel]);

  // Tracking for autopilot debouncing
  const lastProcessedLength = useRef(0);
  const lastProcessedContent = useRef('');

  const toggleAutopilot = useCallback(() => {
    setIsAutopilotState((prev) => {
      const next = !prev;
      storage.set(AUTOPILOT_STORAGE_KEY, next);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return next;
    });
  }, []);

  const clearWhisper = useCallback(() => {
    setWhisper(null);
    setActiveAction(null);
  }, []);

  /**
   * Helper to run on-device neural generation, with graceful heuristic fallback.
   */
  const generateWithFallback = useCallback(
    async (
      type: CopilotActionType,
      systemPrompt: string,
      userPrompt: string,
      heuristicFallback: () => string,
      isAuto = false
    ) => {
      if (!hasMinContent) return;
      setIsGenerating(true);
      setActiveAction(type);
      if (!isAuto) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      let generatedText = '';
      let isNeural = false;

      // 1. Try real on-device neural model first
      if (llm.isReady && Platform.OS !== 'web') {
        try {
          console.log(`[ReflectionCopilot] Feeding typed text into ${selectedModel.name} (${type})...`);
          const raw = await llm.generate([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ]);

          let cleaned = raw.trim().replace(/^["']|["']$/g, '');
          const stopMatch = cleaned.match(/\n(?:User|Human|Reflection|Nimo|Title):/i);
          if (stopMatch && stopMatch.index !== undefined) {
            cleaned = cleaned.substring(0, stopMatch.index).trim();
          }
          if (cleaned.length > 5) {
            generatedText = cleaned;
            isNeural = true;
            console.log(`[ReflectionCopilot] Neural AI generated: "${cleaned}"`);
          }
        } catch (err) {
          console.warn('[ReflectionCopilot] On-device LLM generation error, using fallback:', err);
        }
      }

      // 2. If model not ready or generation empty, use mindful heuristic fallback
      if (!generatedText) {
        await new Promise((res) => setTimeout(res, isAuto ? 350 : 500));
        generatedText = heuristicFallback();
      }

      setWhisper({
        type,
        text: generatedText,
        isAuto,
        isNeural,
        createdAt: Date.now(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsGenerating(false);
    },
    [hasMinContent, llm, selectedModel.name]
  );

  /**
   * Generates a warm, empathetic reflection on what the user actually typed.
   */
  const reflectBack = useCallback(
    async (isAuto = false) => {
      const systemPrompt = `You are Nimo for ${userName}. Write 1 warm sentence validating what they wrote. Do not give advice. Stop immediately.`;
      const userPrompt = `My reflection:\n"${trimmedContent}"`;

      const heuristicFallback = () => {
        const lower = trimmedContent.toLowerCase();
        if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('burnout')) {
          return `I hear how much energy you gave away today, ${userName}. Rest is not a reward you have to earn—it is a need your body is asking for.`;
        } else if (lower.includes('grateful') || lower.includes('happy') || lower.includes('joy')) {
          return `It is wonderful how your heart paused to notice this warmth. Savoring small joys like this is how quiet resilience is built.`;
        } else if (lower.includes('overwhelmed') || lower.includes('stress') || lower.includes('anxious')) {
          return `There is a lot moving through your space right now. Take one slow breath—you don't have to carry the whole mountain all at once.`;
        }
        return `I am listening closely, ${userName}. Putting these honest words onto the page is a quiet act of honoring your experience.`;
      };

      await generateWithFallback('reflect', systemPrompt, userPrompt, heuristicFallback, isAuto);
    },
    [generateWithFallback, trimmedContent, userName]
  );

  /**
   * Generates an introspective Socratic question to help deepen the reflection.
   */
  const deepenQuestion = useCallback(
    async (isAuto = false) => {
      const systemPrompt = `You are Nimo for ${userName}. Ask ONE short introspective question about their feelings. Stop immediately.`;
      const userPrompt = `My reflection:\n"${trimmedContent}"`;

      const heuristicFallback = () => {
        const lower = trimmedContent.toLowerCase();
        if (lower.includes('work') || lower.includes('deadline') || lower.includes('meeting')) {
          return 'What boundary or moment of grace could protect your peace the next time this comes up?';
        } else if (lower.includes('felt') || lower.includes('feeling')) {
          return 'If that emotion had a voice right now, what does it feel most in need of?';
        }
        return 'What is one small thing about this moment you want your future self to remember?';
      };

      await generateWithFallback('deepen', systemPrompt, userPrompt, heuristicFallback, isAuto);
    },
    [generateWithFallback, trimmedContent, userName]
  );

  /**
   * Generates an evocative 3-5 word title based on the written reflection.
   */
  const suggestTitle = useCallback(async () => {
    const systemPrompt = `Propose an evocative 3 to 5 word title for this journal entry. Output ONLY the title text. Stop immediately.`;
    const userPrompt = `Reflection:\n"${trimmedContent}"`;

    const heuristicFallback = () => {
      const words = trimmedContent
        .split(/\s+/)
        .filter((w) => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'were'].includes(w.toLowerCase()));
      if (words.length >= 2) {
        const sample = words.slice(0, 2).map((w) => w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z]/g, ''));
        return `Reflections on ${sample.join(' & ')}`;
      }
      return 'A Moment of Quiet Clarity';
    };

    await generateWithFallback('title', systemPrompt, userPrompt, heuristicFallback, false);
  }, [generateWithFallback, trimmedContent]);

  /**
   * Offers a compassionate cognitive reframe for stressful or self-critical thoughts.
   */
  const reframeThought = useCallback(async () => {
    const systemPrompt = `You are Nimo for ${userName}. Offer a 1-sentence compassionate reframe. Stop immediately.`;
    const userPrompt = `My reflection:\n"${trimmedContent}"`;

    const heuristicFallback = () => {
      const reframes = [
        'What if this challenge isn\'t an obstacle in your path, but the very place where your deeper strength is forming?',
        'You don\'t have to be finished or flawless today. Progress often looks like simply staying tender with yourself.',
        'This feeling is a visitor, not your permanent home. It is allowed to pass through without defining who you are.',
      ];
      return reframes[Math.floor(Math.random() * reframes.length)];
    };

    await generateWithFallback('reframe', systemPrompt, userPrompt, heuristicFallback, false);
  }, [generateWithFallback, trimmedContent, userName]);

  /**
   * Autopilot handler: automatically listens when the user pauses for 2-3 seconds.
   */
  const autoListen = useCallback(async () => {
    if (!hasMinContent) return;
    const lower = trimmedContent.toLowerCase();

    if (
      lower.includes('?') ||
      lower.includes('why') ||
      lower.includes('wonder') ||
      lower.includes('confused') ||
      lower.includes('unsure') ||
      lower.includes('should i')
    ) {
      await deepenQuestion(true);
    } else {
      await reflectBack(true);
    }
  }, [hasMinContent, trimmedContent, deepenQuestion, reflectBack]);

  // Debounced auto-listening effect (triggers 2.5s after typing pauses)
  useEffect(() => {
    if (!isAutopilot) return;
    if (trimmedContent.length < 15) return;

    // Only fire if the content changed noticeably (+10 chars)
    const lenDiff = Math.abs(trimmedContent.length - lastProcessedLength.current);
    if (lenDiff < 10 && lastProcessedContent.current === trimmedContent) {
      return;
    }

    const timer = setTimeout(() => {
      lastProcessedLength.current = trimmedContent.length;
      lastProcessedContent.current = trimmedContent;
      autoListen();
    }, 2500);

    return () => clearTimeout(timer);
  }, [trimmedContent, isAutopilot, autoListen]);

  const handleActivateModel = useCallback(() => {
    activateModel(selectedModel.id);
  }, [activateModel, selectedModel.id]);

  return {
    isAutopilot,
    toggleAutopilot,
    isGenerating,
    isNeuralReady: llm.isReady,
    isModelInstalled,
    isModelActivated,
    downloadProgress: llm.downloadProgress,
    activeAction,
    whisper,
    hasMinContent,
    isListening,
    modelName: selectedModel.name,
    reflectBack,
    deepenQuestion,
    suggestTitle,
    reframeThought,
    clearWhisper,
    activateModel: handleActivateModel,
  };
}
