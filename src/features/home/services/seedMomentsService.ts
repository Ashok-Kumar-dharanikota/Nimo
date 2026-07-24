import { db } from '@/db';
import { journal, moment } from '@/db/schema';
import { count } from 'drizzle-orm';
import { addQuickMoment } from './homeService';

export async function ensureStarterMomentsIfNewUser() {
  try {
    const totalCount = await db.select({ value: count(moment.id) }).from(moment);
    const momentCount = totalCount[0]?.value ?? 0;

    if (momentCount === 0) {
      console.log('[Nimo] Pre-populating starter educational moments for new user...');

      // Moment 1: Welcome & Memory Garden
      await addQuickMoment(
        'Every thought, photo, or reflection you save here grows a leaf in your Memory Garden. Take a breath and reflect anytime.',
        'inspired',
        '🌱 Welcome to Nimo! Your personal memory garden'
      );

      // Moment 2: Privacy
      await addQuickMoment(
        'Your memories stay safe on your device using local SQLite and MMKV storage. You have full control and total privacy.',
        'calm',
        '🛡️ Private & Protected'
      );

      // Moment 3: How to capture
      await addQuickMoment(
        'Tap the floating "+" button at the bottom anytime to add a moment directly to your timeline. You can save as draft or plant it right away!',
        'happy',
        '✨ How to Capture Moments'
      );
    }
  } catch (err) {
    console.warn('[Nimo] Error checking or seeding starter moments:', err);
  }
}
