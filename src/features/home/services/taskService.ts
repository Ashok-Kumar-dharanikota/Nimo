import { db } from '@/db';
import { dailyTask } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { formatDateForSQLite } from '../utils/dateUtils';
import { addQuickMoment } from './homeService';

export type DailyTaskItem = {
  id: number;
  title: string;
  isCompleted: boolean;
  dateStr: string;
};

export const getTodayTasks = async (targetDate: Date = new Date()): Promise<DailyTaskItem[]> => {
  const targetDateStr = formatDateForSQLite(targetDate);
  const tasks = await db
    .select()
    .from(dailyTask)
    .where(eq(dailyTask.dateStr, targetDateStr))
    .orderBy(desc(dailyTask.createdAt));

  return tasks.map(t => ({
    id: t.id,
    title: t.title,
    isCompleted: Boolean(t.isCompleted),
    dateStr: t.dateStr,
  }));
};

export const setTodayTask = async (title: string): Promise<number> => {
  const todayStr = formatDateForSQLite(new Date());
  const inserted = await db.insert(dailyTask).values({
    title,
    dateStr: todayStr,
    isCompleted: false,
  }).returning({ id: dailyTask.id });

  return inserted[0].id;
};

export const completeTask = async (id: number, title: string): Promise<void> => {
  await db.update(dailyTask)
    .set({ isCompleted: true, updatedAt: sql`(CURRENT_TIMESTAMP)` })
    .where(eq(dailyTask.id, id));

  // Add as a moment
  await addQuickMoment(
    `Completed task: ${title}`,
    'inspired', // Default emotion
    title,
    null,
    null,
    false,
    null,
    true // skipRag initially
  );
};
