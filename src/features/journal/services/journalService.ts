import { db } from '@/db';
import { journal } from '@/db/schema';
import { desc, isNull } from 'drizzle-orm';

class JournalService {
  /**
   * Retrieves all active journals.
   */
  public async listJournals() {
    return db.select().from(journal).where(isNull(journal.deletedAt)).orderBy(desc(journal.createdAt));
  }
}

export const journalService = new JournalService();
