import { useProfileStore, type ProfileData } from '../hooks/useProfileStore';
import { DEFAULT_GUEST_PROFILE } from '../utils/profileConstants';

class ProfileService {
  /**
   * Retrieves the current in-memory / persisted profile state.
   */
  public getProfile(): ProfileData {
    return useProfileStore.getState().profile;
  }

  /**
   * Updates partial profile attributes (name, email, avatar, etc.).
   */
  public updateProfile(updates: Partial<ProfileData>): void {
    useProfileStore.getState().updateProfile(updates);
  }

  /**
   * Resets profile back to guest session defaults.
   */
  public resetToGuest(): void {
    useProfileStore.getState().updateProfile(DEFAULT_GUEST_PROFILE);
  }

  /**
   * Clears the profile store to fresh defaults.
   */
  public clearProfile(): void {
    useProfileStore.getState().clearProfile();
  }
}

export const profileService = new ProfileService();
