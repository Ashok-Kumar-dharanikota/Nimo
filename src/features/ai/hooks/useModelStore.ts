import { createMMKV } from 'react-native-mmkv';
import { useCallback, useSyncExternalStore } from 'react';
import { models, type LLMModel } from 'react-native-executorch';

const storage = createMMKV({ id: 'nimo-ai-model-store' });

const SELECTED_MODEL_KEY = 'selected_model_name';
const IS_ACTIVATED_KEY = 'is_model_activated';

export type AvailableModel = {
  id: string;
  name: string;
  characterName: string;
  description: string;
  lifeStory: string;
  sizeLabel: string;
  quality: 'light' | 'balanced' | 'best';
  minMemoryMB: number;
  getModelConfig: () => LLMModel;
};

export const AVAILABLE_MODELS: AvailableModel[] = [
  {
    id: 'smollm2_1_135m',
    name: 'SmolLM2 135M',
    characterName: 'Pip - The Quick Thinker',
    description: 'Pip is a bubbly, fast-talking friend who loves to keep things light. Pip is always ready to lend a quick ear and throw in a cheerful nudge when you need a spark of joy in your day.',
    lifeStory: 'I grew up jumping from one idea to the next, never quite sitting still! I used to travel the world collecting tiny, shiny moments of joy—like finding a perfect pebble or catching the exact moment a streetlamp turns on. Now, I spend my time helping people find those little sparks in their own daily lives. I talk fast because there is just so much to be excited about!',
    sizeLabel: '~70 MB',
    quality: 'light',
    minMemoryMB: 2048, // 2GB
    getModelConfig: () => models.llm.smollm2_1_135m(),
  },
  {
    id: 'qwen3_0_6b',
    name: 'Qwen3 0.6B',
    characterName: 'Luna - The Empathetic Listener',
    description: 'Luna is that warm, comforting friend you talk to over a cup of tea. She listens deeply, holds space for your tangled thoughts, and gently helps you find clarity and peace.',
    lifeStory: 'I spent years running a quiet little bookshop by the sea. I learned to listen to the crashing waves, and over time, I learned to listen to people just as deeply. People would come into my shop not just for books, but for a warm cup of tea and a safe place to untangle their thoughts. I believe every person has a beautiful, complex story, and I am here to hold space for yours.',
    sizeLabel: '~300 MB',
    quality: 'balanced',
    minMemoryMB: 4096, // 4GB
    getModelConfig: () => models.llm.qwen3_0_6b(),
  },
  {
    id: 'llama3_2_1b',
    name: 'Llama 3.2 1B',
    characterName: 'Orion - The Wise Mentor',
    description: 'Orion has seen it all. Like an old soul sitting by a campfire, Orion offers profound reflections and asks the exact questions you didn\'t know you needed to hear. He\'s here to guide your deepest thoughts.',
    lifeStory: 'I am an old soul who has spent decades wandering through ancient forests and studying the quiet rhythms of nature. I have seen the seasons change countless times and weathered many storms. My life has been one of quiet observation and deep contemplation. I have learned that the best answers usually come from asking the right questions, and I am here to help you uncover the wisdom you already carry within.',
    sizeLabel: '~500 MB',
    quality: 'best',
    minMemoryMB: 6144, // 6GB
    getModelConfig: () => models.llm.llama3_2_1b(),
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
  selectedModelId: storage.getString(SELECTED_MODEL_KEY) ?? null,
  isModelActivated: storage.getBoolean(IS_ACTIVATED_KEY) ?? false,
};

function updateSnapshot() {
  cachedSnapshot = {
    selectedModelId: storage.getString(SELECTED_MODEL_KEY) ?? null,
    isModelActivated: storage.getBoolean(IS_ACTIVATED_KEY) ?? false,
  };
}

function getSnapshot() {
  return cachedSnapshot;
}

export function useModelStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

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

  const clearModel = useCallback(() => {
    storage.remove(SELECTED_MODEL_KEY);
    storage.remove(IS_ACTIVATED_KEY);
    emitChange();
  }, []);

  const selectedModel = state.selectedModelId
    ? AVAILABLE_MODELS.find((m) => m.id === state.selectedModelId) ?? null
    : null;

  return {
    selectedModelId: state.selectedModelId,
    selectedModel,
    isModelActivated: state.isModelActivated,
    selectModel,
    activateModel,
    clearModel,
  };
}
