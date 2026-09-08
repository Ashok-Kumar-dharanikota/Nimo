import { db } from '@/db';
import { journal, moment, dailyTask } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { parseSQLiteDate } from '@/features/home/utils/dateUtils';
import type { MomentDetailData } from '../utils/momentConstants';

class MomentService {
  /**
   * Retrieves single moment details joined with journal notebook title.
   */
  public async getMomentById(id: number): Promise<MomentDetailData | null> {
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
      .where(eq(moment.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      journalTitle: r.journalTitle ?? null,
      emotion: r.emotion,
      title: r.title ?? null,
      mediaUri: r.mediaUri ?? null,
      mediaType: (r.mediaType as 'photo' | 'video' | null) ?? null,
    };
  }

  /**
   * Retrieves daily task completion status for a given SQLite ISO timestamp.
   */
  public async getTaskStatusForDate(createdAt: string): Promise<boolean | null> {
    const dateObj = parseSQLiteDate(createdAt);
    const sqlDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    const tasks = await db
      .select()
      .from(dailyTask)
      .where(eq(dailyTask.dateStr, sqlDateStr))
      .limit(1);

    if (tasks.length > 0) {
      return Boolean(tasks[0].isCompleted);
    }
    return null;
  }
}

export const momentService = new MomentService();
