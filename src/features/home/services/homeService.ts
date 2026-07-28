import { db } from '@/db';
import { journal, moment } from '@/db/schema';
import { ragService } from '@/lib/ragService';
import { supabase } from '@/utils/supabase';
import { and, count, desc, eq, isNull, sql } from 'drizzle-orm';
import { formatDateForSQLite } from '../utils/dateUtils';

export type MomentItem = {
  id: number;
  content: string;
  createdAt: string;
  journalTitle: string | null;
  emotion: string | null;
  title: string | null;
  mediaUri: string | null;
  mediaType: 'photo' | 'video' | null;
  isDraft: boolean;
};

export type DayData = {
  date: Date;
  dateStr: string;
  isToday: boolean;
  moments: MomentItem[];
};


export const getWeeklyStreaks = async () => {
  const allMoments = await db.select({
    createdAt: moment.createdAt
  }).from(moment).where(isNull(moment.deletedAt));

  return allMoments;
};

export const getRecentEntries = async () => {
  const result = await db
    .select({
      journal: journal,
      momentCount: count(moment.id)
    })
    .from(journal)
    .leftJoin(moment, and(eq(journal.id, moment.journalId), isNull(moment.deletedAt)))
    .where(isNull(journal.deletedAt))
    .groupBy(journal.id)
    .orderBy(desc(count(moment.id)))
    .limit(3);

  return result;
};

export const getTodaysFlow = async (targetDate: Date = new Date()): Promise<MomentItem[]> => {
  const targetDateStr = formatDateForSQLite(targetDate);
  const todayStr = formatDateForSQLite(new Date()); 
  const isToday = targetDateStr === todayStr;
  
  const todaysMoments = await db
    .select({
      id: moment.id,
      content: moment.content,
      createdAt: moment.createdAt,
      journalTitle: journal.title,
      emotion: moment.emotion,
      title: moment.title,
      mediaUri: moment.mediaUri,
      mediaType: moment.mediaType,
      isDraft: moment.isDraft,
    })
    .from(moment)
    .leftJoin(journal, eq(moment.journalId, journal.id))
    .where(and(sql`date(${moment.createdAt}, 'localtime') = ${targetDateStr}`, isNull(moment.deletedAt)))
    .orderBy(desc(moment.createdAt));

  const mappedResult = todaysMoments.map((row) => ({
    id: row.id,
    content: row.content,
    createdAt: row.createdAt,
    journalTitle: row.journalTitle ?? null,
    emotion: row.emotion,
    title: row.title ?? null,
    mediaUri: row.mediaUri ?? null,
    mediaType: (row.mediaType as 'photo' | 'video' | null) ?? null,
    isDraft: Boolean(row.isDraft),
  }));

  // Fetch from supabase if not today and empty locally
  if (mappedResult.length === 0 && !isToday) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase.from('moment').select('*').eq('user_id', session.user.id).like('created_at', `${targetDateStr}%`);
      if (data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.local_id || -Math.floor(Math.random() * 1000000), // temp ID
          content: row.content,
          createdAt: row.created_at,
          journalTitle: 'Synced Journal',
          emotion: row.emotion,
          title: row.title,
          mediaUri: row.media_uri,
          mediaType: row.media_type,
          isDraft: row.is_draft,
        }));
      }
    }
  }

  // If there are no moments today, check if it's a brand new user
  if (mappedResult.length === 0 && isToday) {
    const totalMoments = await db.select({ value: count(moment.id) }).from(moment);
    if ((totalMoments[0]?.value ?? 0) === 0) {
      const { data: { session } } = await supabase.auth.getSession();
      const createdAtStr = session?.user?.created_at;
      if (createdAtStr) {
        const createdDate = new Date(createdAtStr);
        const today = new Date();
        // If account was created today
        if (
          createdDate.getFullYear() === today.getFullYear() &&
          createdDate.getMonth() === today.getMonth() &&
          createdDate.getDate() === today.getDate()
        ) {
          mappedResult.push(
            {
              id: -1,
              content: 'Every thought, photo, or reflection you save here grows a leaf in your Memory Garden. Take a breath and reflect anytime.',
              createdAt: new Date().toISOString(),
              journalTitle: 'Quick Thoughts',
              emotion: 'inspired',
              title: '🌱 Welcome to Nimo! Your personal memory garden',
              mediaUri: null,
              mediaType: null,
              isDraft: false,
            },
            {
              id: -2,
              content: 'Your memories stay safe on your device using local SQLite and MMKV storage. You have full control and total privacy.',
              createdAt: new Date().toISOString(),
              journalTitle: 'Quick Thoughts',
              emotion: 'calm',
              title: '🛡️ Private & Protected',
              mediaUri: null,
              mediaType: null,
              isDraft: false,
            },
            {
              id: -3,
              content: 'Tap the floating "+" button at the bottom anytime to add a moment directly to your timeline. You can save as draft or plant it right away!',
              createdAt: new Date().toISOString(),
              journalTitle: 'Quick Thoughts',
              emotion: 'happy',
              title: '✨ How to Capture Moments',
              mediaUri: null,
              mediaType: null,
              isDraft: false,
            }
          );
        }
      }
    }
  }

  return mappedResult;
};

export const getTodayMomentsCount = async (): Promise<number> => {
  const todayStr = formatDateForSQLite(new Date());
  const res = await db
    .select({ count: count() })
    .from(moment)
    .where(and(sql`date(${moment.createdAt}, 'localtime') = ${todayStr}`, isNull(moment.deletedAt)));
  return res[0]?.count || 0;
};

export const addQuickMoment = async (
  content: string,
  emotion: string | null = null,
  title: string | null = null,
  mediaUri: string | null = null,
  mediaType: string | null = null,
  isDraft: boolean = false,
  id?: number | null,
  skipRag: boolean = false,
): Promise<number> => {
  try {
    console.log('[Nimo] addQuickMoment called with:', { id, content, emotion, title, mediaUri, mediaType, isDraft, skipRag });
    
    if (id) {
      // Update existing moment draft
      await db
        .update(moment)
        .set({
          content,
          emotion,
          title,
          mediaUri,
          mediaType,
          isDraft,
          updatedAt: sql`(CURRENT_TIMESTAMP)`,
        })
        .where(eq(moment.id, id));

      if (!isDraft && !skipRag) {
        ragService.indexMoment(id, content, emotion, title).catch((err) => {
          console.warn('[Nimo] Background RAG indexing error:', err);
        });
      }
      return id;
    }

    // Find or create a "Quick Thoughts" journal
    let defaultJournal = await db.select().from(journal).where(and(eq(journal.title, 'Quick Thoughts'), isNull(journal.deletedAt))).limit(1);
    
    let journalId: number;
    if (defaultJournal.length === 0) {
      console.log('[Nimo] Creating Quick Thoughts journal...');
      const inserted = await db.insert(journal).values({
        title: 'Quick Thoughts',
      }).returning({ id: journal.id });
      journalId = inserted[0].id;
    } else {
      journalId = defaultJournal[0].id;
    }

    const insertedMoment = await db.insert(moment).values({
      content,
      journalId,
      emotion,
      title,
      mediaUri,
      mediaType,
      isDraft,
    }).returning({ id: moment.id });

    const momentId = insertedMoment[0]?.id;
    console.log('[Nimo] Moment saved successfully, journalId:', journalId, 'momentId:', momentId, 'isDraft:', isDraft);

    if (momentId && !isDraft && !skipRag) {
      ragService.indexMoment(momentId, content, emotion, title).catch((err) => {
        console.warn('[Nimo] Background RAG indexing error:', err);
      });
    }

    return momentId;
  } catch (err) {
    console.error('[Nimo] addQuickMoment failed:', err);
    throw err;
  }
};

export const deleteMoment = async (id: number) => {
  try {
    // Soft delete to support syncing deletions
    await db.update(moment).set({ deletedAt: sql`(CURRENT_TIMESTAMP)`, updatedAt: sql`(CURRENT_TIMESTAMP)` }).where(eq(moment.id, id));
  } catch (err) {
    console.error('[Nimo] deleteMoment failed:', err);
  }
};

export const getMomentsForCurrentYear = async (): Promise<DayData[]> => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1); // Jan 1st
  const endDate = new Date(currentYear, 11, 31); // Dec 31st
  endDate.setHours(23, 59, 59, 999);

  const startDateStr = formatDateForSQLite(startDate);
  const endDateStr = formatDateForSQLite(endDate);

  const rows = await db
    .select({
      id: moment.id,
      content: moment.content,
      createdAt: moment.createdAt,
      journalTitle: journal.title,
      emotion: moment.emotion,
      title: moment.title,
      mediaUri: moment.mediaUri,
      mediaType: moment.mediaType,
      isDraft: moment.isDraft,
    })
    .from(moment)
    .leftJoin(journal, eq(moment.journalId, journal.id))
    .where(
      and(
        sql`date(${moment.createdAt}, 'localtime') >= ${startDateStr}`,
        sql`date(${moment.createdAt}, 'localtime') <= ${endDateStr}`,
        isNull(moment.deletedAt)
      )
    )
    .orderBy(desc(moment.createdAt));

  const momentsByDate = new Map<string, MomentItem[]>();
  for (const row of rows) {
    const utcDate = new Date(row.createdAt.replace(' ', 'T') + 'Z');
    const dateKey = formatDateForSQLite(utcDate);
    if (!momentsByDate.has(dateKey)) momentsByDate.set(dateKey, []);
    momentsByDate.get(dateKey)!.push({
      id: row.id,
      content: row.content,
      createdAt: row.createdAt,
      journalTitle: row.journalTitle ?? null,
      emotion: row.emotion,
      title: row.title ?? null,
      mediaUri: row.mediaUri ?? null,
      mediaType: (row.mediaType as 'photo' | 'video' | null) ?? null,
      isDraft: Boolean(row.isDraft),
    });
  }

  const todayStr = formatDateForSQLite(new Date());

  const result: DayData[] = [];
  const isLeapYear = new Date(currentYear, 1, 29).getMonth() === 1;
  const daysInYear = isLeapYear ? 366 : 365;
  
  for (let i = 0; i < daysInYear; i++) {
    const date = new Date(currentYear, 0, 1);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    const dateStr = formatDateForSQLite(date);
    result.push({
      date,
      dateStr,
      isToday: dateStr === todayStr,
      moments: momentsByDate.get(dateStr) ?? [],
    });
  }

  return result;
};




