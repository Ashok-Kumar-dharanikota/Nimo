import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({
  id: 'supabase-auth-storage',
});

export const mmkvSupabaseStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    storage.set(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    storage.remove(key);
  },
};
