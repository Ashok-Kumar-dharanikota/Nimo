import { createMMKV } from 'react-native-mmkv';
import { useState, useEffect } from 'react';

const storage = createMMKV({ id: 'nimo-draft-store' });

export interface DraftState {
  isEditing: boolean;
  title: string;
  content: string;
  emotion: string | null;
  mediaUri: string | null;
  mediaType: 'photo' | 'video' | null;
  isDraftSaved: boolean; // true if user explicitly tapped "Save as Draft"
  updatedAt: string | null;
}

const DRAFT_KEYS = {
  isEditing: 'draft_isEditing',
  title: 'draft_title',
  content: 'draft_content',
  emotion: 'draft_emotion',
  mediaUri: 'draft_mediaUri',
  mediaType: 'draft_mediaType',
  isDraftSaved: 'draft_isDraftSaved',
  updatedAt: 'draft_updatedAt',
};

function getSavedDraftState(): DraftState {
  return {
    isEditing: storage.getBoolean(DRAFT_KEYS.isEditing) ?? false,
    title: storage.getString(DRAFT_KEYS.title) ?? '',
    content: storage.getString(DRAFT_KEYS.content) ?? '',
    emotion: storage.getString(DRAFT_KEYS.emotion) ?? null,
    mediaUri: storage.getString(DRAFT_KEYS.mediaUri) ?? null,
    mediaType: (storage.getString(DRAFT_KEYS.mediaType) as 'photo' | 'video' | null) ?? null,
    isDraftSaved: storage.getBoolean(DRAFT_KEYS.isDraftSaved) ?? false,
    updatedAt: storage.getString(DRAFT_KEYS.updatedAt) ?? null,
  };
}

let draftStateListeners: Array<() => void> = [];

function notifyListeners() {
  draftStateListeners.forEach((listener) => listener());
}

export const draftStore = {
  getDraftState(): DraftState {
    return getSavedDraftState();
  },

  startDraft() {
    storage.set(DRAFT_KEYS.isEditing, true);
    notifyListeners();
  },

  updateDraft(updates: Partial<DraftState>) {
    if (updates.title !== undefined) storage.set(DRAFT_KEYS.title, updates.title);
    if (updates.content !== undefined) storage.set(DRAFT_KEYS.content, updates.content);
    if (updates.emotion !== undefined) {
      if (updates.emotion) storage.set(DRAFT_KEYS.emotion, updates.emotion);
      else storage.remove(DRAFT_KEYS.emotion);
    }
    if (updates.mediaUri !== undefined) {
      if (updates.mediaUri) storage.set(DRAFT_KEYS.mediaUri, updates.mediaUri);
      else storage.remove(DRAFT_KEYS.mediaUri);
    }
    if (updates.mediaType !== undefined) {
      if (updates.mediaType) storage.set(DRAFT_KEYS.mediaType, updates.mediaType);
      else storage.remove(DRAFT_KEYS.mediaType);
    }
    if (updates.isEditing !== undefined) storage.set(DRAFT_KEYS.isEditing, updates.isEditing);
    if (updates.isDraftSaved !== undefined) storage.set(DRAFT_KEYS.isDraftSaved, updates.isDraftSaved);
    storage.set(DRAFT_KEYS.updatedAt, new Date().toISOString());

    notifyListeners();
  },

  saveAsDraft() {
    storage.set(DRAFT_KEYS.isEditing, false);
    storage.set(DRAFT_KEYS.isDraftSaved, true);
    storage.set(DRAFT_KEYS.updatedAt, new Date().toISOString());
    notifyListeners();
  },

  clearDraft() {
    Object.values(DRAFT_KEYS).forEach((key) => storage.remove(key));
    notifyListeners();
  },

  subscribe(listener: () => void) {
    draftStateListeners.push(listener);
    return () => {
      draftStateListeners = draftStateListeners.filter((l) => l !== listener);
    };
  },
};

export function useDraftStore() {
  const [state, setState] = useState<DraftState>(draftStore.getDraftState());

  useEffect(() => {
    const unsubscribe = draftStore.subscribe(() => {
      setState(draftStore.getDraftState());
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    startDraft: draftStore.startDraft,
    updateDraft: draftStore.updateDraft,
    saveAsDraft: draftStore.saveAsDraft,
    clearDraft: draftStore.clearDraft,
  };
}
