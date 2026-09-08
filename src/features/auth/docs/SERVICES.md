# Auth Feature Services

Documentation for `src/features/auth/services/authService.ts`.

---

## `authService` (Singleton)

The `authService` encapsulates low-level native module calls (`react-native-nitro-google-signin`), MMKV storage persistence, and local database lifecycle operations.

### Type Definitions

```ts
export interface AuthUser {
  name: string;
  email: string;
  avatarUri: string | null;
  isGuest: boolean;
  accessToken?: string;
}

export interface SessionStatus {
  isSignedIn: boolean;
  isGuest: boolean;
  accessToken: string | null;
}
```

---

## Method Specifications

### 1. `configure(): void`
- **Purpose**: Initializes the `GoogleOneTapSignIn` native SDK with the OAuth 2.0 Web Client ID.
- **Invocation**: Automatically called before `signInWithGoogle()`. Idempotent (only configures once).
- **Client ID Resolution**: Reads `process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` or falls back to `DEFAULT_GOOGLE_WEB_CLIENT_ID` in `authConstants.ts`.

---

### 2. `signInWithGoogle(): Promise<AuthUser | null>`
- **Purpose**: Runs the full Google Sign-In pipeline.
- **Flow**:
  1. Checks Google Play Services availability on Android (`checkPlayServices()`).
  2. Invokes `GoogleOneTapSignIn.signIn()` (One-Tap prompt).
  3. If user cancels, returns `null`.
  4. If `noSavedCredentialFound` is returned, falls back to `presentExplicitSignIn()` (Google Account picker).
  5. Upon success:
     - Extracts user details (`name`, `email`, `photo`).
     - Calls `GoogleOneTapSignIn.getTokens()` to retrieve `accessToken`.
     - Persists `google_access_token` in MMKV.
     - Removes `is_guest` marker from MMKV.
     - Returns populated `AuthUser`.
- **Throws**: `Error` if authentication fails or user profile cannot be resolved.

---

### 3. `signInAsGuest(username: string): AuthUser`
- **Purpose**: Creates an offline local guest session.
- **Parameters**: `username: string` (The user's chosen display name).
- **Side-Effects**:
  - Validates `username.trim()` is not empty.
  - Sets `is_guest = true` in MMKV.
  - Removes any lingering `google_access_token` from MMKV.
- **Returns**:
  ```ts
  {
    name: username.trim(),
    email: '',
    avatarUri: null,
    isGuest: true
  }
  ```

---

### 4. `signOut(): Promise<void>`
- **Purpose**: Terminates the current session, wipes tokens, and cleans the local database.
- **Side-Effects**:
  1. Calls `GoogleOneTapSignIn.signOut()` to invalidate native Google credentials.
  2. Removes `google_access_token` and `is_guest` from MMKV.
  3. Calls `clearLocalDatabase()` from `@/lib/syncEngine` (deletes records from `moment` and `journal` tables).
  > [!NOTE]
  > **Data Privacy Decision**: The local database is cleared upon sign-out to prevent data leakage between different users logging into the app on the same physical device.

---

### 5. `getSession(): SessionStatus`
- **Purpose**: Synchronously inspects MMKV to determine current authentication state during app bootstrap.
- **Returns**:
  ```ts
  {
    isSignedIn: boolean, // true if either access token or guest flag exists
    isGuest: boolean,    // true if is_guest === true
    accessToken: string | null // string token or null
  }
  ```
- **Consumer**: Used by `src/app/index.tsx` to route incoming users to `/(app)` or `/auth`.
