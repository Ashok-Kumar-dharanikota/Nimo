/**
 * Storage keys used for authentication state persistence in MMKV.
 */
export const AUTH_STORAGE_KEYS = {
  GOOGLE_ACCESS_TOKEN: 'google_access_token',
  IS_GUEST: 'is_guest',
  HAS_SEEN_ONBOARDING: 'hasSeenOnboarding',
} as const;

/**
 * Fallback Web Client ID for Google OAuth 2.0.
 * In production, configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your environment.
 */
export const DEFAULT_GOOGLE_WEB_CLIENT_ID =
  '200516238326-7m06gdstgbgu6unpt0m4j34nr9113v0l.apps.googleusercontent.com';

/**
 * Retrieves the Google Web Client ID from environment variables or fallback.
 */
export function getGoogleWebClientId(): string {
  return (
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    DEFAULT_GOOGLE_WEB_CLIENT_ID
  );
}
