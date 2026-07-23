import { createMMKV } from 'react-native-mmkv';
import { useCallback, useSyncExternalStore } from 'react';
import { models, type LLMModel } from 'react-native-executorch';

const storage = createMMKV({ id: 'nimo-ai-model-store' });

const SELECTED_MODEL_KEY = 'selected_model_name';
const IS_ACTIVATED_KEY = 'is_model_activated';

export type AvailableModel = {
  id: string;
  name: string;
  description: string;
  sizeLabel: string;
  quality: 'light' | 'balanced' | 'best';
  getModelConfig: () => LLMModel;
};

export const AVAILABLE_MODELS: AvailableModel[] = [
  {
    id: 'smollm2_1_135m',
    name: 'SmolLM2 135M',
    description: 'Ultra-lightweight model. Great for quick replies and basic journaling assistance.',
    sizeLabel: '~70 MB',
    quality: 'light',
    getModelConfig: () => models.llm.smollm2_1_135m(),
  },
  {
    id: 'qwen3_0_6b',
    name: 'Qwen3 0.6B',
    description: 'Balanced model with good reasoning. Ideal for thoughtful reflections and prompts.',
    sizeLabel: '~300 MB',
    quality: 'balanced',
    getModelConfig: () => models.llm.qwen3_0_6b(),
  },
  {
    id: 'llama3_2_1b',
    name: 'Llama 3.2 1B',
    description: 'Highest quality on-device model. Best understanding for deep journaling insights.',
    sizeLabel: '~500 MB',
    quality: 'best',
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
