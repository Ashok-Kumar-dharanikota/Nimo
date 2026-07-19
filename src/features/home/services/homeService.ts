import { db } from '@/db';
import { journal, moment } from '@/db/schema';
import { eq, desc, sql, count } from 'drizzle-orm';
import { formatDateForSQLite } from '../utils/dateUtils';

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
      journalTitle: journal.title
    })
    .from(moment)
    .leftJoin(journal, eq(moment.journalId, journal.id))
    .where(sql`date(${moment.createdAt}) = ${todayStr}`)
    .orderBy(desc(moment.createdAt));

  return todaysMoments;
};

export const addQuickMoment = async (content: string) => {
  // Find or create a "Quick Thoughts" journal
  let defaultJournal = await db.select().from(journal).where(eq(journal.title, 'Quick Thoughts')).limit(1);
  
  let journalId: number;
  if (defaultJournal.length === 0) {
    const inserted = await db.insert(journal).values({
      title: 'Quick Thoughts',
    }).returning({ id: journal.id });
    journalId = inserted[0].id;
  } else {
    journalId = defaultJournal[0].id;
  }

  // Insert the moment
  await db.insert(moment).values({
    content,
    journalId,
  });
};
