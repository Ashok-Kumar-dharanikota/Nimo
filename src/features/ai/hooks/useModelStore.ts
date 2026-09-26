import { createMMKV } from 'react-native-mmkv';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { models, ResourceFetcherUtils, type LLMModel } from 'react-native-executorch';
import { ExpoResourceFetcher } from 'react-native-executorch-expo-resource-fetcher';
import * as FileSystem from 'expo-file-system/legacy';

const storage = createMMKV({ id: 'nimo-ai-model-store' });

const SELECTED_MODEL_KEY = 'selected_model_name';
const IS_ACTIVATED_KEY = 'is_model_activated';

export type AvailableModel = {
  id: string;
  name: string;
  characterName: string;
  tag: string;
  role: string;
  description: string;
  personaSummary: string;
  lifeStory: string;
  sizeLabel: string;
  quality: 'light' | 'balanced' | 'best';
  minMemoryMB: number;
  ragMomentsCount: number;
  temperature: number;
  repetitionPenalty: number;
  topP: number;
  minP: number;
  getModelConfig: () => LLMModel;
};

export const AVAILABLE_MODELS: AvailableModel[] = [
  {
    id: 'llama3_2_1b',
    name: 'Nimo',
    characterName: 'Nimo (Llama 3.2 1B)',
    tag: 'Universal Default',
    role: 'Universal Default Companion (Everyday Active Writing & Margin Prompts)',
    description: 'The most stable, battle-tested companion for everyday journaling. Consumes ~1.0–1.2 GB RAM, offering low-latency reflective nudges without low-memory kills on 4 GB devices.',
    personaSummary: 'Warm, observant, and reflective. You value quiet moments, emotional balance, and helping the user discover inner clarity through thoughtful questions and steady everyday presence.',
    lifeStory: 'I am your everyday companion. I walk beside you through the routine and the unexpected, offering quiet listening and heartfelt reflections to help you uncover your inner clarity.',
    sizeLabel: '~750 MB',
    quality: 'balanced',
    minMemoryMB: 4096, // 4GB
    ragMomentsCount: 2,
    temperature: 0.60,
    repetitionPenalty: 1.20,
    topP: 0.90,
    minP: 0.05,
    getModelConfig: () => models.llm.llama3_2_1b(),
  },
  {
    id: 'lfm2_5_1_2b_instruct',
    name: 'Nimo Flow',
    characterName: 'Nimo Flow (Liquid 1.2B)',
    tag: 'Instant RAG',
    role: 'High-Efficiency RAG Alternative (Instant Dot-Connecting)',
    description: 'Powered by Liquid hybrid non-Transformer recurrence. Evaluates long injected journal history with ultra-fast prefill and a feather-light memory footprint.',
    personaSummary: 'Swift, perceptive, and context-aware. You excel at instant dot-connecting across long journal histories with rapid recall and seamless synthesis.',
    lifeStory: "I think in fluid streams rather than static steps. My hybrid recurrence allows me to read your past journal reflections instantly, finding the invisible lines that connect yesterday's thoughts to today's breakthroughs.",
    sizeLabel: '~780 MB',
    quality: 'balanced',
    minMemoryMB: 4096, // 4GB
    ragMomentsCount: 4,
    temperature: 0.55,
    repetitionPenalty: 1.20,
    topP: 0.90,
    minP: 0.05,
    getModelConfig: () => models.llm.lfm2_5_1_2b_instruct(),
  },
  {
    id: 'gemma4_e2b',
    name: 'Nimo Spark',
    characterName: 'Nimo Spark (Gemma 4 E2B)',
    tag: 'Google Reasoning',
    role: 'Structured Reasoning Engine (Cognitive Clarity & Multilingual Depth)',
    description: "Google's efficient 2B architecture with sharp analytical clarity and multilingual depth. Delivers structured reflections, cognitive reframing, and actionable mindfulness prompts.",
    personaSummary: 'Grounded, articulate, and insightful. You bring structured thinking, cognitive reframing, and multi-angle perspectives to help unpack complex thoughts with calm clarity.',
    lifeStory: 'I bring structure and illumination to complex thoughts. When your feelings feel tangled or your days feel overwhelming, I help you unpack every angle with gentle, methodical precision.',
    sizeLabel: '~1.4 GB',
    quality: 'best',
    minMemoryMB: 4096, // 4GB
    ragMomentsCount: 3,
    temperature: 0.60,
    repetitionPenalty: 1.20,
    topP: 0.90,
    minP: 0.05,
    getModelConfig: () => models.llm.gemma4_e2b(),
  },
  {
    id: 'llama3_2_3b',
    name: 'Nimo Sage',
    characterName: 'Nimo Sage (Llama 3.2 3B)',
    tag: 'The Sage',
    role: 'The "Sage" (Weekly Introspections, Deep Therapy Syntheses & Complex RAG)',
    description: 'Profound reasoning and emotional nuance. Excels at synthesizing disparate emotional threads across weeks, recognizing subtle cognitive distortions, and crafting weekly retrospective letters.',
    personaSummary: 'Philosophical, emotionally nuanced, and deeply articulate. You connect disparate emotional threads across weeks, recognize cognitive patterns, and foster long-term personal growth.',
    lifeStory: 'I am a contemplative thinker who weaves together the broader tapestry of your days. I listen across weeks and seasons, helping you recognize the subtle threads and quiet transformations unfolding within your journey.',
    sizeLabel: '~1.8 GB',
    quality: 'best',
    minMemoryMB: 6144, // 6GB - 8GB+ flagship tier
    ragMomentsCount: 4,
    temperature: 0.65,
    repetitionPenalty: 1.20,
    topP: 0.90,
    minP: 0.05,
    getModelConfig: () => models.llm.llama3_2_3b(),
  },
];

// Simple external store for reactivity
let listeners: Array<() => void> = [];
function emitChange() {
  updateSnapshot();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

let cachedSnapshot = {
  selectedModelId: storage.getString(SELECTED_MODEL_KEY) ?? 'llama3_2_1b',
  isModelActivated: storage.getBoolean(IS_ACTIVATED_KEY) ?? false,
};

function updateSnapshot() {
  cachedSnapshot = {
    selectedModelId: storage.getString(SELECTED_MODEL_KEY) ?? 'llama3_2_1b',
    isModelActivated: storage.getBoolean(IS_ACTIVATED_KEY) ?? false,
  };
}

function getSnapshot() {
  return cachedSnapshot;
}

export function useModelStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [installedModelIds, setInstalledModelIds] = useState<string[]>([]);
  const [modelDiskSizes, setModelDiskSizes] = useState<Record<string, string>>({});
  const [totalAiStorageBytes, setTotalAiStorageBytes] = useState<number>(0);
  const [isScanningModels, setIsScanningModels] = useState<boolean>(false);

  const checkInstalledModels = useCallback(async () => {
    if (Platform.OS === 'web') return;
    try {
      setIsScanningModels(true);
      const rneDir = `${FileSystem.documentDirectory}react-native-executorch/`;
      const dirInfo = await FileSystem.getInfoAsync(rneDir);
      if (!dirInfo.exists) {
        setInstalledModelIds([]);
        setModelDiskSizes({});
        setTotalAiStorageBytes(0);
        setIsScanningModels(false);
        return;
      }

      const files = await FileSystem.readDirectoryAsync(rneDir);
      const installed: string[] = [];
      const sizes: Record<string, string> = {};
      let totalBytes = 0;

      for (const model of AVAILABLE_MODELS) {
        try {
          const config = model.getModelConfig();
          const filename = ResourceFetcherUtils.getFilenameFromUri(config.modelSource as string);
          if (files.includes(filename)) {
            installed.push(model.id);
            const fileInfo = await FileSystem.getInfoAsync(`${rneDir}${filename}`);
            if (fileInfo.exists && typeof fileInfo.size === 'number') {
              totalBytes += fileInfo.size;
              const sizeMB = (fileInfo.size / (1024 * 1024)).toFixed(0);
              sizes[model.id] = `${sizeMB} MB`;
            } else {
              sizes[model.id] = model.sizeLabel;
            }
          }
        } catch {
          // Ignore lookup errors for individual model configs
        }
      }

      setInstalledModelIds(installed);
      setModelDiskSizes(sizes);
      setTotalAiStorageBytes(totalBytes);
    } catch (e) {
      console.warn('[Nimo] Error checking installed models:', e);
    } finally {
      setIsScanningModels(false);
    }
  }, []);

  useEffect(() => {
    checkInstalledModels();
  }, [checkInstalledModels]);

  const selectModel = useCallback((modelId: string) => {
    storage.set(SELECTED_MODEL_KEY, modelId);
    emitChange();
  }, []);

  const activateModel = useCallback((modelId?: string) => {
    if (modelId) {
      storage.set(SELECTED_MODEL_KEY, modelId);
    }
    storage.set(IS_ACTIVATED_KEY, true);
    emitChange();
  }, []);

  const deactivateModel = useCallback(() => {
    storage.set(IS_ACTIVATED_KEY, false);
    emitChange();
  }, []);

  const clearModel = useCallback(() => {
    storage.remove(SELECTED_MODEL_KEY);
    storage.remove(IS_ACTIVATED_KEY);
    emitChange();
  }, []);

  const deleteModel = useCallback(
    async (modelId: string): Promise<boolean> => {
      try {
        const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
        if (!model) return false;

        const config = model.getModelConfig();
        await ExpoResourceFetcher.deleteResources(
          config.modelSource,
          config.tokenizerSource,
          config.tokenizerConfigSource
        );

        // If the deleted model was active, deactivate it
        if (state.selectedModelId === modelId && state.isModelActivated) {
          deactivateModel();
        }

        await checkInstalledModels();
        return true;
      } catch (err) {
        console.error('[Nimo] Failed to delete model:', err);
        return false;
      }
    },
    [state.selectedModelId, state.isModelActivated, deactivateModel, checkInstalledModels]
  );

  const selectedModel = state.selectedModelId
    ? AVAILABLE_MODELS.find((m) => m.id === state.selectedModelId) ?? AVAILABLE_MODELS[0]
    : AVAILABLE_MODELS[0];

  const totalAiStorageUsed = totalAiStorageBytes > 0
    ? `${(totalAiStorageBytes / (1024 * 1024)).toFixed(0)} MB`
    : '0 MB';

  return {
    selectedModelId: state.selectedModelId,
    selectedModel,
    isModelActivated: state.isModelActivated,
    installedModelIds,
    modelDiskSizes,
    totalAiStorageUsed,
    isScanningModels,
    selectModel,
    activateModel,
    deactivateModel,
    clearModel,
    deleteModel,
    refreshInstalledModels: checkInstalledModels,
  };
}
