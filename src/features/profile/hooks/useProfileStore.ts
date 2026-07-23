import { createMMKV } from 'react-native-mmkv';
import { useSyncExternalStore, useCallback } from 'react';

const storage = createMMKV({ id: 'nimo-profile-store' });

export type ProfileData = {
  name: string;
  email: string;
  avatarUri: string | null;
  theme: 'light' | 'dark' | 'system';
  dailyReminderEnabled: boolean;
  reminderTime: string; // HH:mm
};

const KEYS = {
  name: 'profile_name',
  email: 'profile_email',
  avatarUri: 'profile_avatar_uri',
  theme: 'profile_theme',
  dailyReminderEnabled: 'profile_daily_reminder',
  reminderTime: 'profile_reminder_time',
} as const;

const DEFAULTS: ProfileData = {
  name: 'Sarah',
  email: '',
  avatarUri: null,
  theme: 'light',
  dailyReminderEnabled: false,
  reminderTime: '20:00',
};

let listeners: Array<() => void> = [];
function emitChange() {
  updateSnapshot();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function readFromStorage(): ProfileData {
  return {
    name: storage.getString(KEYS.name) ?? DEFAULTS.name,
    email: storage.getString(KEYS.email) ?? DEFAULTS.email,
    avatarUri: storage.getString(KEYS.avatarUri) ?? DEFAULTS.avatarUri,
    theme: (storage.getString(KEYS.theme) as ProfileData['theme']) ?? DEFAULTS.theme,
    dailyReminderEnabled: storage.getBoolean(KEYS.dailyReminderEnabled) ?? DEFAULTS.dailyReminderEnabled,
    reminderTime: storage.getString(KEYS.reminderTime) ?? DEFAULTS.reminderTime,
  };
}

let cachedSnapshot: ProfileData = readFromStorage();

function updateSnapshot() {
  cachedSnapshot = readFromStorage();
}

function getSnapshot(): ProfileData {
  return cachedSnapshot;
}

export function useProfileStore() {
  const profile = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    if (updates.name !== undefined) storage.set(KEYS.name, updates.name);
    if (updates.email !== undefined) storage.set(KEYS.email, updates.email);
    if (updates.avatarUri !== undefined) {
      if (updates.avatarUri === null) {
        storage.delete(KEYS.avatarUri);
      } else {
        storage.set(KEYS.avatarUri, updates.avatarUri);
      }
    }
    if (updates.theme !== undefined) storage.set(KEYS.theme, updates.theme);
    if (updates.dailyReminderEnabled !== undefined) storage.set(KEYS.dailyReminderEnabled, updates.dailyReminderEnabled);
    if (updates.reminderTime !== undefined) storage.set(KEYS.reminderTime, updates.reminderTime);
    emitChange();
  }, []);

  const clearProfile = useCallback(() => {
    Object.values(KEYS).forEach((key) => storage.delete(key));
    emitChange();
  }, []);

  return {
    profile,
    updateProfile,
    clearProfile,
  };
}
