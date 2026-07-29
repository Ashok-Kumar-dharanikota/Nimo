import { db } from '@/db';
import { journal, moment } from '@/db/schema';
import { useSyncStore } from '@/store/syncStore';
import { useDialogStore } from '@/store/dialogStore';

// Stub out sync for now since we are moving to Google Drive
export const syncDatabase = async () => {
  const setStatus = useSyncStore.getState().setStatus;
  setStatus('syncing');
  setTimeout(() => setStatus('success'), 1000);
};

export const clearLocalDatabase = async () => {
  try {
    await db.delete(moment);
    await db.delete(journal);
  } catch (e) {
    console.error('[Nimo] Clear local database error:', e);
  }
};

// Stub out pull since it's used across the app
export const pullRemoteChanges = async (userId: string) => {
  console.log('pullRemoteChanges stub called for', userId);
};
