# Profile Feature Services

Documentation for service layer within `src/features/profile/services`.

---

## `profileService`

- **File**: [`src/features/profile/services/profileService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/profile/services/profileService.ts)
- **Role**: Non-React business logic and convenience methods for profile state manipulation.

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `getProfile()` | - | `ProfileData` | Returns current profile snapshot from store |
| `updateProfile(updates)` | `Partial<ProfileData>` | `void` | Updates specific profile attributes in MMKV |
| `resetToGuest()` | - | `void` | Resets active profile to guest defaults |
| `clearProfile()` | - | `void` | Completely resets profile state |
