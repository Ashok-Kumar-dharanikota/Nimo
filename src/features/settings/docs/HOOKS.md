# Settings Feature Hooks

Documentation for hooks within `src/features/settings/hooks`.

---

## `useSettings`

- **File**: [`src/features/settings/hooks/useSettings.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/settings/hooks/useSettings.ts)
- **Role**: Coordinates theme toggling, notifications scheduling, confirmation modal states, and data clearing.

### Signature

```ts
function useSettings(): {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  cycleTheme: () => void;
  deleteModalVisible: boolean;
  setDeleteModalVisible: (visible: boolean) => void;
  infoModal: { visible: boolean; title: string; message: string };
  showInfo: (title: string, message: string) => void;
  closeInfo: () => void;
  handleSignOut: () => Promise<void>;
  confirmDeleteData: () => Promise<void>;
};
```
