import { db } from '@/db';
import { journal, moment, dailyTask } from '@/db/schema';
import { desc, eq, isNull } from 'drizzle-orm';
import { parseSQLiteDate } from '@/features/home/utils/dateUtils';
import type { SearchMomentItem } from '../utils/searchConstants';

class SearchService {
  /**
   * Fetches all active moments with attached daily task statuses for search queries.
   */
  public async fetchAllMoments(): Promise<SearchMomentItem[]> {
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
      })
      .from(moment)
      .leftJoin(journal, eq(moment.journalId, journal.id))
      .where(isNull(moment.deletedAt))
      .orderBy(desc(moment.createdAt));

    // Fetch all tasks to map them by date
    const allTasks = await db.select().from(dailyTask);
    const taskMap = new Map<string, boolean>();
    allTasks.forEach((t) => {
      taskMap.set(t.dateStr, Boolean(t.isCompleted));
    });

    return rows.map((r) => {
      const dateObj = parseSQLiteDate(r.createdAt);
      const sqlDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

      return {
        id: r.id,
        content: r.content,
        createdAt: r.createdAt,
        journalTitle: r.journalTitle ?? null,
        emotion: r.emotion,
        title: r.title ?? null,
        mediaUri: r.mediaUri ?? null,
        mediaType: (r.mediaType as 'photo' | 'video' | null) ?? null,
        isTaskCompleted: taskMap.has(sqlDateStr) ? (taskMap.get(sqlDateStr) ?? false) : null,
      };
    });
  }
}

export const searchService = new SearchService();
