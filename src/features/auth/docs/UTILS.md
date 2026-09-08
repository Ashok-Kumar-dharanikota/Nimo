# Auth Feature Utilities

Documentation for `src/features/auth/utils/authConstants.ts`.

---

## `authConstants.ts`

Centralizes configuration keys, storage identifiers, and environment helpers used across the auth module.

### Constants

```ts
export const AUTH_STORAGE_KEYS = {
  GOOGLE_ACCESS_TOKEN: 'google_access_token',
  IS_GUEST: 'is_guest',
  HAS_SEEN_ONBOARDING: 'hasSeenOnboarding',
} as const;
```

- `AUTH_STORAGE_KEYS.GOOGLE_ACCESS_TOKEN`: The MMKV string key used to store the OAuth 2.0 access token obtained from Google.
- `AUTH_STORAGE_KEYS.IS_GUEST`: The MMKV boolean key indicating the current active session belongs to a guest user.
- `AUTH_STORAGE_KEYS.HAS_SEEN_ONBOARDING`: The MMKV boolean key recording whether the user has passed onboarding.

---

### Functions

#### `getGoogleWebClientId(): string`
Resolves the OAuth 2.0 Web Client ID:
1. First looks for `process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
2. Falls back to `DEFAULT_GOOGLE_WEB_CLIENT_ID` (`200516238326-7m06gdstgbgu6unpt0m4j34nr9113v0l.apps.googleusercontent.com`).
