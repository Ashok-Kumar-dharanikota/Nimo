import type { ProfileData } from '../hooks/useProfileStore';

export const PROFILE_STORAGE_KEYS = {
  STORE_ID: 'nimo-profile-store',
  STORAGE_NAME: 'nimo-profile-storage',
} as const;

export const DEFAULT_PROFILE_DATA: ProfileData = {
  name: 'User',
  email: '',
  avatarUri: null,
  theme: 'light',
  dailyReminderEnabled: false,
  reminderTime: '20:00',
  isGuest: false,
};

export const DEFAULT_GUEST_PROFILE: ProfileData = {
  ...DEFAULT_PROFILE_DATA,
  name: 'Guest',
  isGuest: true,
};
