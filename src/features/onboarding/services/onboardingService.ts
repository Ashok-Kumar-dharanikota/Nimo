import { storage } from '@/lib/storage';
import { ONBOARDING_STORAGE_KEYS } from '../utils/onboardingConstants';

class OnboardingService {
  /**
   * Checks if user has already completed the onboarding walkthrough.
   */
  public hasSeenOnboarding(): boolean {
    return Boolean(storage.getBoolean(ONBOARDING_STORAGE_KEYS.HAS_SEEN_ONBOARDING));
  }

  /**
   * Flags onboarding walkthrough as completed in persistent storage.
   */
  public completeOnboarding(): void {
    storage.set(ONBOARDING_STORAGE_KEYS.HAS_SEEN_ONBOARDING, true);
  }

  /**
   * Resets onboarding status (useful for debug and demo resets).
   */
  public resetOnboarding(): void {
    storage.remove(ONBOARDING_STORAGE_KEYS.HAS_SEEN_ONBOARDING);
  }
}

export const onboardingService = new OnboardingService();
