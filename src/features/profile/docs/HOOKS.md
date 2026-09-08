# Profile Feature Hooks

Documentation for hooks within `src/features/profile/hooks`.

---

## `useProfileStore`

- **File**: [`src/features/profile/hooks/useProfileStore.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/profile/hooks/useProfileStore.ts)
- **Role**: Zustand persistent store managing user profile details, themes, and notification preferences.

### State & Actions

```ts
interface ProfileState {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  clearProfile: () => void;
  signOut: () => Promise<void>;
}

type ProfileData = {
  name: string;
  email: string;
  avatarUri: string | null;
  theme: 'light' | 'dark' | 'system';
  dailyReminderEnabled: boolean;
  reminderTime: string; // HH:mm
  isGuest?: boolean;
};
```
