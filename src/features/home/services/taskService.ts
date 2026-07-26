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

export const getTodayTask = async (): Promise<DailyTaskItem | null> => {
  const todayStr = formatDateForSQLite(new Date());
  const tasks = await db
    .select()
    .from(dailyTask)
    .where(eq(dailyTask.dateStr, todayStr))
    .orderBy(desc(dailyTask.createdAt))
    .limit(1);

  if (tasks.length > 0) {
    return {
      id: tasks[0].id,
      title: tasks[0].title,
      isCompleted: Boolean(tasks[0].isCompleted),
      dateStr: tasks[0].dateStr,
    };
  }
  return null;
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
