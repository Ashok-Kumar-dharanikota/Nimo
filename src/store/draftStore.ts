import { useEffect, useState } from 'react';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'nimo-draft-store' });

export interface DraftState {
  isEditing: boolean;
  draftId: number | null;
  title: string;
  content: string;
  emotion: string | null;
  mediaUri: string | null;
  mediaType: 'photo' | 'video' | null;
  isDraftSaved: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

const DRAFT_KEYS = {
  isEditing: 'draft_isEditing',
  draftId: 'draft_id',
  title: 'draft_title',
  content: 'draft_content',
  emotion: 'draft_emotion',
  mediaUri: 'draft_mediaUri',
  mediaType: 'draft_mediaType',
  isDraftSaved: 'draft_isDraftSaved',
  createdAt: 'draft_createdAt',
  updatedAt: 'draft_updatedAt',
};

function getSavedDraftState(): DraftState {
  const draftIdNumber = storage.getNumber(DRAFT_KEYS.draftId);
  return {
    isEditing: storage.getBoolean(DRAFT_KEYS.isEditing) ?? false,
    draftId: draftIdNumber !== undefined ? draftIdNumber : null,
    title: storage.getString(DRAFT_KEYS.title) ?? '',
    content: storage.getString(DRAFT_KEYS.content) ?? '',
    emotion: storage.getString(DRAFT_KEYS.emotion) ?? null,
    mediaUri: storage.getString(DRAFT_KEYS.mediaUri) ?? null,
    mediaType: (storage.getString(DRAFT_KEYS.mediaType) as 'photo' | 'video' | null) ?? null,
    isDraftSaved: storage.getBoolean(DRAFT_KEYS.isDraftSaved) ?? false,
    createdAt: storage.getString(DRAFT_KEYS.createdAt) ?? null,
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

  editDraftMoment(moment: {
    id: number;
    title?: string | null;
    content: string;
    emotion?: string | null;
    mediaUri?: string | null;
    mediaType?: 'photo' | 'video' | null;
    createdAt?: string | null;
  }) {
    storage.set(DRAFT_KEYS.isEditing, true);
    storage.set(DRAFT_KEYS.draftId, moment.id);
    storage.set(DRAFT_KEYS.title, moment.title || '');
    storage.set(DRAFT_KEYS.content, moment.content || '');
    if (moment.emotion) storage.set(DRAFT_KEYS.emotion, moment.emotion);
    else storage.remove(DRAFT_KEYS.emotion);
    if (moment.mediaUri) storage.set(DRAFT_KEYS.mediaUri, moment.mediaUri);
    else storage.remove(DRAFT_KEYS.mediaUri);
    if (moment.mediaType) storage.set(DRAFT_KEYS.mediaType, moment.mediaType);
    else storage.remove(DRAFT_KEYS.mediaType);
    if (moment.createdAt) storage.set(DRAFT_KEYS.createdAt, moment.createdAt);
    else storage.remove(DRAFT_KEYS.createdAt);
    storage.set(DRAFT_KEYS.isDraftSaved, false);

    notifyListeners();
  },

  updateDraft(updates: Partial<DraftState>) {
    if (updates.draftId !== undefined) {
      if (updates.draftId !== null) storage.set(DRAFT_KEYS.draftId, updates.draftId);
      else storage.remove(DRAFT_KEYS.draftId);
    }
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
    editDraftMoment: draftStore.editDraftMoment,
    updateDraft: draftStore.updateDraft,
    saveAsDraft: draftStore.saveAsDraft,
    clearDraft: draftStore.clearDraft,
  };
}
