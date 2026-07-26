import { db } from '@/db';
import { journal, moment } from '@/db/schema';
import { count } from 'drizzle-orm';
import { addQuickMoment } from './homeService';

export async function ensureStarterMomentsIfNewUser() {
  // Starter moments are now dynamically injected into the UI in getTodaysFlow 
  // for new users on their first day. We no longer save them to the DB.
  return Promise.resolve();
}
