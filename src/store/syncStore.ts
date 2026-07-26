import { create } from 'zustand';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  errorMessage: string | null;
  setStatus: (status: SyncStatus, errorMessage?: string | null) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'idle',
  lastSyncedAt: null,
  errorMessage: null,
  setStatus: (status, errorMessage = null) => set((state) => ({
    status,
    errorMessage,
    lastSyncedAt: status === 'success' ? Date.now() : state.lastSyncedAt
  })),
}));
