import { clearLocalDatabase } from '@/lib/syncEngine';
import { useProfileStore } from '@/features/profile/hooks/useProfileStore';

class SettingsService {
  /**
   * Permanently clears all local database records and resets user profile.
   */
  public async clearAllData(): Promise<void> {
    try {
      await clearLocalDatabase();
    } catch (err) {
      console.warn('[SettingsService] clearLocalDatabase warning:', err);
    }
    useProfileStore.getState().clearProfile();
  }
}

export const settingsService = new SettingsService();
