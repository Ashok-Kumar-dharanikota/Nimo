import { db } from '@/db';
import { journal, moment } from '@/db/schema';
import { storage } from '@/lib/storage';
import { and, eq, isNull, like, sql } from 'drizzle-orm';

const DEMO_SYNC_PREFIX = 'demo_screenshot_';
const DEMO_JOURNAL_TITLE = 'Daily Reflections';
const DEMO_CHAT_KEY = 'demo_screenshot_chat_active';

export interface DemoSeedStatus {
  isSeeded: boolean;
  momentCount: number;
}

export const DEMO_CHAT_MESSAGES: Array<{ role: 'user' | 'assistant'; content: string }> = [
  {
    role: 'user',
    content:
      'I noticed I feel much more peaceful on days when I take a morning walk. What patterns do you see in my journal entries this week?',
  },
  {
    role: 'assistant',
    content:
      'Looking through your reflections over the past two weeks, morning walks and quiet coffee consistently trigger your highest "inspired" and "peaceful" states! On days with morning movement, your afternoon notes show 40% higher mental clarity and focus. 🌿',
  },
  {
    role: 'user',
    content:
      'That makes so much sense! How can I maintain this streak when work gets super busy?',
  },
  {
    role: 'assistant',
    content:
      'Start small — even a 5-minute breather on your balcony with a warm drink preserves your grounding ritual. Your 15-day memory garden is proof of how well these small pauses nourish your mind.',
  },
];

export function isDemoChatActive(): boolean {
  return Boolean(storage.getBoolean(DEMO_CHAT_KEY));
}

export function setDemoChatActive(active: boolean): void {
  storage.set(DEMO_CHAT_KEY, active);
}

/**
 * Checks whether Play Store screenshot demo moments are currently present in DB.
 */
export async function getDemoSeedStatus(): Promise<DemoSeedStatus> {
  try {
    const res = await db
      .select({ count: sql<number>`count(*)` })
      .from(moment)
      .where(and(like(moment.syncId, `${DEMO_SYNC_PREFIX}%`), isNull(moment.deletedAt)));
    const count = Number(res[0]?.count || 0);
    return { isSeeded: count > 0, momentCount: count };
  } catch (err) {
    console.error('[Nimo Demo] Error checking demo status:', err);
    return { isSeeded: false, momentCount: 0 };
  }
}

/**
 * Clears all demo moments tagged with DEMO_SYNC_PREFIX from the DB.
 */
export async function clearDemoMomentsForScreenshots(): Promise<void> {
  try {
    console.log('[Nimo Demo] Clearing existing screenshot demo data...');
    setDemoChatActive(false);
    await db.delete(moment).where(like(moment.syncId, `${DEMO_SYNC_PREFIX}%`));
    console.log('[Nimo Demo] Demo screenshot data cleared successfully.');
  } catch (err) {
    console.error('[Nimo Demo] Error clearing screenshot demo data:', err);
    throw err;
  }
}

/**
 * Seeds rich demo moments across the last 14 consecutive days up to today (15 days total).
 * Activates a 15-day streak and fills the timeline with moments (including rich photography),
 * memory garden, weekly streaks, and profile statistics.
 */
export async function seedDemoMomentsForScreenshots(): Promise<number> {
  try {
    // 1. Clear any previously seeded demo data to ensure a clean state
    await clearDemoMomentsForScreenshots();
    setDemoChatActive(true);

    // 2. Find or create the demo journal
    let demoJournal = await db
      .select()
      .from(journal)
      .where(and(eq(journal.title, DEMO_JOURNAL_TITLE), isNull(journal.deletedAt)))
      .limit(1);

    let journalId: number;
    if (demoJournal.length === 0) {
      const inserted = await db
        .insert(journal)
        .values({ title: DEMO_JOURNAL_TITLE, syncId: 'demo_journal_1' })
        .returning({ id: journal.id });
      journalId = inserted[0].id;
    } else {
      journalId = demoJournal[0].id;
    }

    // 3. Define demo moments for 15 consecutive days (day 0 = today, day 1 = yesterday, ... day 14)
    const demoItems: Array<{
      dayOffset: number;
      time: string;
      title: string;
      content: string;
      emotion: string;
      mediaUri?: string | null;
      mediaType?: 'photo' | null;
    }> = [
      // Day 0 (Today)
      {
        dayOffset: 0,
        time: '08:30:00',
        title: '✨ Morning Coffee & Golden Hour Reflection',
        content:
          'Watching the morning light filter through the leaves with my favorite roast in hand. Feeling deeply at peace and ready for a calm, intentional day.',
        emotion: 'peaceful',
        mediaUri: 'https://images.unsplash.com/photo-1507138086030-616c3b6db768?w=800',
        mediaType: 'photo',
      },
      {
        dayOffset: 0,
        time: '13:15:00',
        title: '🌿 Midday Stroll in the Park',
        content:
          'Took a 20-minute breather away from screens. Smelled fresh pine, listened to birds near the fountain. Complete mental reset.',
        emotion: 'inspired',
        mediaUri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
        mediaType: 'photo',
      },
      {
        dayOffset: 0,
        time: '18:45:00',
        title: '📖 Finished Chapter 4 & Chamomile Tea',
        content:
          'Unwound with warm chamomile tea and immersed in my favorite book. A quiet, satisfying pause after a productive afternoon.',
        emotion: 'calm',
      },

      // Day 1 (Yesterday)
      {
        dayOffset: 1,
        time: '10:15:00',
        title: '💡 Breakthrough on the New Interface',
        content:
          'Finally connected all the design pieces for the project layout! Everything feels super clean and intuitive. Celebrating small wins.',
        emotion: 'excited',
      },
      {
        dayOffset: 1,
        time: '15:30:00',
        title: '☕ Warm Cinnamon Latte & Catching Up',
        content:
          'Reconnected after 3 months over warm cinnamon lattes. Spoke about life goals, travel plans, and mindful living.',
        emotion: 'happy',
      },

      // Day 2 (2 days ago)
      {
        dayOffset: 2,
        time: '21:20:00',
        title: '🌙 Evening Stargazing & Crisp Breeze',
        content:
          'The night sky was completely clear. Stood outside for ten minutes just listening to the crickets and watching stars.',
        emotion: 'peaceful',
      },
      {
        dayOffset: 2,
        time: '07:45:00',
        title: '🧘 15-Minute Breathwork & Mindful Reset',
        content:
          'Focused entirely on deep inhalations and grounding. Felt all tension melt away from my shoulders.',
        emotion: 'calm',
      },

      // Day 3 (3 days ago)
      {
        dayOffset: 3,
        time: '11:00:00',
        title: '🎨 Creative Sketchbook Session',
        content:
          'Drew inspiration from natural botanical forms. Experimented with soft pastel green and warm terracotta tones.',
        emotion: 'inspired',
        mediaUri: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
        mediaType: 'photo',
      },

      // Day 4 (4 days ago)
      {
        dayOffset: 4,
        time: '18:40:00',
        title: '🏃 Sunset Run along the Riverside',
        content:
          'Pushed through 5 kilometers right as the horizon turned deep orange and purple. Endorphins flowing!',
        emotion: 'excited',
        mediaUri: 'https://images.unsplash.com/photo-1476514525535-ce74f458149e?w=800',
        mediaType: 'photo',
      },

      // Day 5 (5 days ago)
      {
        dayOffset: 5,
        time: '14:00:00',
        title: '🍞 Baked Fresh Sourdough Bread',
        content:
          'The aroma of fresh sourdough filled the kitchen. Golden crust and perfect texture. Simple home pleasures.',
        emotion: 'happy',
        mediaUri: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
        mediaType: 'photo',
      },

      // Day 6 (6 days ago)
      {
        dayOffset: 6,
        time: '16:20:00',
        title: '📚 Rain Falling Outside my Window',
        content:
          'Listened to gentle raindrops tapping on the glass while organizing my weekly intentions. So comforting.',
        emotion: 'grateful',
      },

      // Day 7 (7 days ago)
      {
        dayOffset: 7,
        time: '09:50:00',
        title: '🌱 Planted New Herbs in Balcony Garden',
        content:
          'Potting fresh basil, mint, and rosemary. Working with soil always grounds me back to center.',
        emotion: 'focused',
      },

      // Day 8 (8 days ago)
      {
        dayOffset: 8,
        time: '20:10:00',
        title: '🎵 Listening to Vintage Jazz Vinyls',
        content:
          'Dug out old jazz records. The warm acoustic sound created the perfect cozy evening atmosphere.',
        emotion: 'peaceful',
      },

      // Day 9 (9 days ago)
      {
        dayOffset: 9,
        time: '06:30:00',
        title: '🌅 Sunrise Journaling Session',
        content:
          'Wrote down three things I am grateful for today. Setting positive vibrations early in the morning.',
        emotion: 'grateful',
      },

      // Day 10 (10 days ago)
      {
        dayOffset: 10,
        time: '11:30:00',
        title: '🍏 Farmers Market Haul',
        content:
          'Picked up organic berries, honey, and fresh lavender. Talking to local growers is always inspiring.',
        emotion: 'happy',
      },

      // Day 11 (11 days ago)
      {
        dayOffset: 11,
        time: '21:50:00',
        title: '🍵 Evening Tea & Quiet Meditation',
        content:
          'Twenty minutes of silence before sleep. Gratitude for a peaceful, fulfilling day.',
        emotion: 'calm',
      },

      // Day 12 (12 days ago)
      {
        dayOffset: 12,
        time: '15:00:00',
        title: '🚴 Afternoon Bike Trail Ride',
        content:
          'Explored the forest trail loop on my bike. Sunbeams piercing through tall pine trees.',
        emotion: 'excited',
      },

      // Day 13 (13 days ago)
      {
        dayOffset: 13,
        time: '19:30:00',
        title: '🕯️ Ambient Candlelight & Planning Ahead',
        content:
          'Lit a cedarwood candle and outlined key priorities for the upcoming week with clarity.',
        emotion: 'focused',
      },

      // Day 14 (14 days ago)
      {
        dayOffset: 14,
        time: '12:00:00',
        title: '🌊 Ocean Waves & Sea Breeze',
        content:
          'Spent time by the shore. The rhythm of waves crashing against the sand is nature’s best medicine.',
        emotion: 'peaceful',
        mediaUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        mediaType: 'photo',
      },
    ];

    // 4. Batch insert into SQLite DB with mathematically accurate UTC dates
    let count = 0;
    for (const item of demoItems) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - item.dayOffset);

      const [hours, minutes, seconds] = item.time.split(':').map(Number);
      targetDate.setHours(hours, minutes, seconds, 0);

      // Extract UTC components so SQLite date(createdAt, 'localtime') evaluates precisely to local targetDate
      const yyyy = targetDate.getUTCFullYear();
      const mm = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(targetDate.getUTCDate()).padStart(2, '0');
      const hh = String(targetDate.getUTCHours()).padStart(2, '0');
      const min = String(targetDate.getUTCMinutes()).padStart(2, '0');
      const ss = String(targetDate.getUTCSeconds()).padStart(2, '0');
      const createdAtStr = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

      await db.insert(moment).values({
        syncId: `${DEMO_SYNC_PREFIX}${item.dayOffset}_${count}`,
        journalId,
        title: item.title,
        content: item.content,
        emotion: item.emotion,
        mediaUri: item.mediaUri ?? null,
        mediaType: item.mediaType ?? null,
        isDraft: false,
        createdAt: createdAtStr,
        updatedAt: createdAtStr,
      });

      count++;
    }

    console.log(`[Nimo Demo] Successfully seeded ${count} demo moments for Play Store screenshots!`);
    return count;
  } catch (err) {
    console.error('[Nimo Demo] Failed to seed demo moments:', err);
    throw err;
  }
}
