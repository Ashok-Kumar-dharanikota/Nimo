import { supabase } from '../utils/supabase';
import { db } from '@/db';
import { journal, moment } from '@/db/schema';
import { eq, gt, or, isNull, isNotNull, sql } from 'drizzle-orm';
import uuid from 'react-native-uuid';
import { useSyncStore } from '@/store/syncStore';
import { useDialogStore } from '@/store/dialogStore';

// Run full two-way sync
export const syncDatabase = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    useDialogStore.getState().showDialog({
      title: 'Sync Error',
      message: 'No active session found.',
      buttons: [{ text: 'OK' }]
    });
    return;
  }
  
  const setStatus = useSyncStore.getState().setStatus;
  setStatus('syncing');

  try {
    // 1. Push local changes to Supabase
    const { pushJournals, pushMoments, pushErrors } = await pushLocalChanges(session.user.id);

    // 2. Pull remote changes from Supabase
    await pullRemoteChanges(session.user.id);
    
    setStatus('success');
    
    if (pushErrors.length > 0) {
      useDialogStore.getState().showDialog({
        title: 'Sync Completed with Errors',
        message: `Pushed ${pushJournals} journals, ${pushMoments} moments. Errors: ${JSON.stringify(pushErrors)}`,
        buttons: [{ text: 'OK' }]
      });
    } else {
      useDialogStore.getState().showDialog({
        title: 'Sync Success',
        message: `Pushed ${pushJournals} journals and ${pushMoments} moments.`,
        buttons: [{ text: 'OK' }]
      });
    }
    
  } catch (error: any) {
    console.error('[Nimo] Sync error:', error);
    setStatus('error', error.message);
    useDialogStore.getState().showDialog({
      title: 'Sync Exception',
      message: error.message,
      buttons: [{ text: 'OK' }]
    });
  }
};

export const clearLocalDatabase = async () => {
  try {
    await db.delete(moment);
    await db.delete(journal);
  } catch (e) {
    console.error('[Nimo] Clear local database error:', e);
  }
};

// Push local unsynced or updated changes to Supabase
const pushLocalChanges = async (userId: string) => {
  let pushJournals = 0;
  let pushMoments = 0;
  const pushErrors: any[] = [];

  // Push Journals
  const localJournals = await db.select().from(journal);
  for (const j of localJournals) {
    let syncId = j.syncId;
    if (!syncId) {
      syncId = uuid.v4();
      await db.update(journal).set({ syncId }).where(eq(journal.id, j.id));
    }
    
    // Upsert to Supabase with retry for JWT future error (PGRST303)
    let error: any = null;
    let retries = 3;
    while (retries > 0) {
      const res = await supabase.from('journal').upsert({
        sync_id: syncId,
        user_id: userId,
        local_id: j.id,
        title: j.title,
        created_at: j.createdAt,
        updated_at: j.updatedAt,
        deleted_at: j.deletedAt,
      }, { onConflict: 'sync_id' });
      
      error = res.error;
      if (error?.code === 'PGRST303') {
        console.warn(`[Nimo] JWT future error, retrying in 2s... (${retries} left)`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        retries--;
      } else {
        break;
      }
    }

    if (error) {
      console.error('[Nimo] Error pushing journal:', error);
      pushErrors.push(error);
    } else {
      pushJournals++;
    }
  }

  // Push Moments
  const localMoments = await db.select().from(moment);
  for (const m of localMoments) {
    let syncId = m.syncId;
    if (!syncId) {
      syncId = uuid.v4();
      await db.update(moment).set({ syncId }).where(eq(moment.id, m.id));
    }

    // Resolve parent journal sync ID
    const parentJournal = await db.select().from(journal).where(eq(journal.id, m.journalId)).limit(1);
    if (!parentJournal.length || !parentJournal[0].syncId) {
      pushErrors.push({ message: 'Parent journal not synced yet for moment ' + m.id });
      continue;
    }

    // Upsert to Supabase with retry
    let error: any = null;
    let retries = 3;
    while (retries > 0) {
      const res = await supabase.from('moment').upsert({
        sync_id: syncId,
        user_id: userId,
        local_id: m.id,
        journal_sync_id: parentJournal[0].syncId,
        content: m.content,
        emotion: m.emotion,
        title: m.title,
        media_uri: m.mediaUri,
        media_type: m.mediaType,
        is_draft: m.isDraft,
        created_at: m.createdAt,
        updated_at: m.updatedAt,
        deleted_at: m.deletedAt,
      }, { onConflict: 'sync_id' });
      
      error = res.error;
      if (error?.code === 'PGRST303') {
        console.warn(`[Nimo] JWT future error, retrying in 2s... (${retries} left)`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        retries--;
      } else {
        break;
      }
    }

    if (error) {
      console.error('[Nimo] Error pushing moment:', error);
      pushErrors.push(error);
    } else {
      pushMoments++;
    }
  }

  return { pushJournals, pushMoments, pushErrors };
};

// Pull remote changes from Supabase to local SQLite
export const pullRemoteChanges = async (userId: string) => {
  // Get remote journals
  const { data: remoteJournals, error: journalError } = await supabase
    .from('journal')
    .select('*')
    .eq('user_id', userId);

  if (journalError) {
    console.error('[Nimo] Error pulling journals:', journalError);
    return;
  }

  for (const rj of remoteJournals || []) {
    const localMatches = await db.select().from(journal).where(eq(journal.syncId, rj.sync_id));
    
    if (localMatches.length > 0) {
      // Update if remote is newer
      if (new Date(rj.updated_at) > new Date(localMatches[0].updatedAt)) {
        await db.update(journal).set({
          title: rj.title,
          updatedAt: rj.updated_at,
          deletedAt: rj.deleted_at,
        }).where(eq(journal.syncId, rj.sync_id));
      }
    } else {
      // Insert new
      await db.insert(journal).values({
        syncId: rj.sync_id,
        title: rj.title,
        createdAt: rj.created_at,
        updatedAt: rj.updated_at,
        deletedAt: rj.deleted_at,
      });
    }
  }

  // Get remote moments
  const { data: remoteMoments, error: momentError } = await supabase
    .from('moment')
    .select('*')
    .eq('user_id', userId);

  if (momentError) {
    console.error('[Nimo] Error pulling moments:', momentError);
    return;
  }

  for (const rm of remoteMoments || []) {
    const localMatches = await db.select().from(moment).where(eq(moment.syncId, rm.sync_id));
    
    if (localMatches.length > 0) {
      // Update if remote is newer
      if (new Date(rm.updated_at) > new Date(localMatches[0].updatedAt)) {
        await db.update(moment).set({
          content: rm.content,
          emotion: rm.emotion,
          title: rm.title,
          mediaUri: rm.media_uri,
          mediaType: rm.media_type,
          isDraft: rm.is_draft,
          updatedAt: rm.updated_at,
          deletedAt: rm.deleted_at,
        }).where(eq(moment.syncId, rm.sync_id));
      }
    } else {
      // Insert new. Need to find local journal ID
      const parentJournal = await db.select().from(journal).where(eq(journal.syncId, rm.journal_sync_id)).limit(1);
      if (parentJournal.length > 0) {
        await db.insert(moment).values({
          syncId: rm.sync_id,
          journalId: parentJournal[0].id,
          content: rm.content,
          emotion: rm.emotion,
          title: rm.title,
          mediaUri: rm.media_uri,
          mediaType: rm.media_type,
          isDraft: rm.is_draft,
          createdAt: rm.created_at,
          updatedAt: rm.updated_at,
          deletedAt: rm.deleted_at,
        });
      }
    }
  }
};
