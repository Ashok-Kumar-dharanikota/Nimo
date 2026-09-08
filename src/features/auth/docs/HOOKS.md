# Auth Feature Hooks

Documentation for `src/features/auth/hooks/useAuth.ts`.

---

## `useAuth`

`useAuth` is the primary React hook for managing authentication state and actions within UI components.

### Signature

```ts
function useAuth(): {
  loading: boolean;
  errorMessage: string | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
};
```

---

## State Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `loading` | `boolean` | Indicates whether a Google Sign-In, Guest Sign-In, or Sign-Out operation is actively in-flight. |
| `errorMessage` | `string \| null` | Stores the latest error message for presentation in the error banner. |

---

## Action Handlers

### 1. `signInWithGoogle()`
- Sets `loading = true` and `errorMessage = null`.
- Awaits `authService.signInWithGoogle()`.
- If an `AuthUser` is returned:
  - Dispatches `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`.
  - Updates `useProfileStore` with user's `name`, `email`, and `avatarUri`.
  - Navigates to `/(app)` via `router.replace('/(app)')`.
- If cancelled:
  - Quietly ends without showing an error banner.
- On error:
  - Captures exception message, sets `errorMessage`.
  - Dispatches `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)`.

### 2. `signInAsGuest(username: string)`
- Sets `loading = true`.
- Calls `authService.signInAsGuest(username)`.
- Updates `useProfileStore` with guest `name` and `isGuest: true`.
- Dispatches success haptics.
- Navigates to `/(app)`.

### 3. `signOut()`
- Sets `loading = true`.
- Calls `authService.signOut()`.
- Resets `useProfileStore` to default guest values (`{ name: 'Guest', isGuest: true, email: '', avatarUri: null }`).
- Dispatches success haptics.
- Navigates to `/auth` via `router.replace('/auth')`.

### 4. `clearError()`
- Resets `errorMessage` to `null`.
