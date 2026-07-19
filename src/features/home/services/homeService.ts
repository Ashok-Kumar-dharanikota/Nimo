import { db } from '@/db';
import { journal, moment } from '@/db/schema';
import { eq, desc, sql, count, gte } from 'drizzle-orm';
import { formatDateForSQLite } from '../utils/dateUtils';

export type MomentItem = {
  id: number;
  content: string;
  createdAt: string;
  journalTitle: string | null;
  emotion: string | null;
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
  }).from(moment);

  return allMoments;
};

export const getRecentEntries = async () => {
  const result = await db
    .select({
      journal: journal,
      momentCount: count(moment.id)
    })
    .from(journal)
    .leftJoin(moment, eq(journal.id, moment.journalId))
    .groupBy(journal.id)
    .orderBy(desc(count(moment.id)))
    .limit(3);

  return result;
};

export const getTodaysFlow = async () => {
  const todayStr = formatDateForSQLite(new Date()); 
  
  const todaysMoments = await db
    .select({
      id: moment.id,
      content: moment.content,
      createdAt: moment.createdAt,
      journalTitle: journal.title,
      emotion: moment.emotion
    })
    .from(moment)
    .leftJoin(journal, eq(moment.journalId, journal.id))
    .where(sql`date(${moment.createdAt}, 'localtime') = ${todayStr}`)
    .orderBy(desc(moment.createdAt));

  return todaysMoments;
};

export const addQuickMoment = async (content: string, emotion: string | null = null) => {
  try {
    console.log('[Nimo] addQuickMoment called with:', content, emotion);
    // Find or create a "Quick Thoughts" journal
    let defaultJournal = await db.select().from(journal).where(eq(journal.title, 'Quick Thoughts')).limit(1);
    
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

    await db.insert(moment).values({
      content,
      journalId,
      emotion,
    });
    console.log('[Nimo] Moment saved successfully, journalId:', journalId);
  } catch (err) {
    console.error('[Nimo] addQuickMoment failed:', err);
    throw err;
  }
};

export const getMomentsForCurrentYear = async (): Promise<DayData[]> => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1); // Jan 1st
  const endDate = new Date(currentYear, 11, 31); // Dec 31st
  endDate.setHours(23, 59, 59, 999);

  const startDateStr = formatDateForSQLite(startDate);
  const endDateStr = formatDateForSQLite(endDate);

  // Single query: all moments in the date range with journal title
  const rows = await db
    .select({
      id: moment.id,
      content: moment.content,
      createdAt: moment.createdAt,
      journalTitle: journal.title,
      emotion: moment.emotion,
    })
    .from(moment)
    .leftJoin(journal, eq(moment.journalId, journal.id))
    .where(
      sql`date(${moment.createdAt}, 'localtime') >= ${startDateStr} AND date(${moment.createdAt}, 'localtime') <= ${endDateStr}`
    )
    .orderBy(desc(moment.createdAt));

  // Build a map: 'YYYY-MM-DD' -> MomentItem[]
  const momentsByDate = new Map<string, MomentItem[]>();
  for (const row of rows) {
    // Ensure we parse the DB UTC timestamp and format it in local timezone
    const utcDate = new Date(row.createdAt.replace(' ', 'T') + 'Z');
    const dateKey = formatDateForSQLite(utcDate);
    if (!momentsByDate.has(dateKey)) momentsByDate.set(dateKey, []);
    momentsByDate.get(dateKey)!.push({
      id: row.id,
      content: row.content,
      createdAt: row.createdAt,
      journalTitle: row.journalTitle ?? null,
      emotion: row.emotion,
    });
  }

  const todayStr = formatDateForSQLite(new Date());

  // Build all days of the current year (Jan 1st first, Dec 31st last)
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

