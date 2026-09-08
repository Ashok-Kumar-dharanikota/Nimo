import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { storage as globalStorage } from '@/lib/storage';

const storage = createMMKV({ id: 'nimo-profile-store' });

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};

export type ProfileData = {
  name: string;
  email: string;
  avatarUri: string | null;
  theme: 'light' | 'dark' | 'system';
  dailyReminderEnabled: boolean;
  reminderTime: string; // HH:mm
  isGuest?: boolean;
};

interface ProfileState {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  clearProfile: () => void;
  signOut: () => Promise<void>;
}

const DEFAULTS: ProfileData = {
  name: 'User',
  email: '',
  avatarUri: null,
  theme: 'light',
  dailyReminderEnabled: false,
  reminderTime: '20:00',
  isGuest: false,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULTS,
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      clearProfile: () => set({ profile: DEFAULTS }),
      signOut: async () => {
        const { authService } = require('@/features/auth');
        await authService.signOut();
        set({ profile: DEFAULTS });
      },
    }),
    {
      name: 'nimo-profile-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
