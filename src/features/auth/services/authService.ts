import { Platform } from 'react-native';
import {
  GoogleOneTapSignIn,
  isErrorWithCode,
  statusCodes,
} from 'react-native-nitro-google-signin';
import { storage } from '@/lib/storage';
import { clearLocalDatabase } from '@/lib/syncEngine';
import { AUTH_STORAGE_KEYS, getGoogleWebClientId } from '../utils/authConstants';

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

class AuthService {
  private isConfigured = false;

  /**
   * Initializes Google Sign-In SDK with the web client ID.
   * Safe to call multiple times; will only configure once.
   */
  public configure(): void {
    if (this.isConfigured) return;
    try {
      GoogleOneTapSignIn.configure({
        webClientId: getGoogleWebClientId(),
      });
      this.isConfigured = true;
    } catch (err) {
      console.warn('[AuthService] GoogleOneTapSignIn configuration warning:', err);
    }
  }

  /**
   * Executes the Google Sign-In flow (One-Tap first, falling back to Explicit sign-in).
   * Handles edge cases like missing Play Services, silent cancellations, and developer errors.
   */
  public async signInWithGoogle(): Promise<AuthUser | null> {
    this.configure();

    if (Platform.OS === 'android') {
      try {
        await GoogleOneTapSignIn.checkPlayServices();
      } catch (playServicesErr: any) {
        if (
          isErrorWithCode(playServicesErr) &&
          playServicesErr.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
          throw new Error(
            'Google Play Services is not available on this device. Please continue as a Guest below.'
          );
        }
        throw playServicesErr;
      }
    }

    try {
      const response = await GoogleOneTapSignIn.signIn();

      if (response.type === 'success') {
        return this.handleSignInSuccess(response.data);
      }

      if (response.type === 'cancelled') {
        return null;
      }

      if (response.type === 'noSavedCredentialFound') {
        const explicitResponse = await GoogleOneTapSignIn.presentExplicitSignIn();
        if (explicitResponse.type === 'success') {
          return this.handleSignInSuccess(explicitResponse.data);
        }
        if (explicitResponse.type === 'cancelled') {
          return null;
        }
        throw new Error('Google sign-in was cancelled or interrupted.');
      }

      throw new Error('Failed to authenticate with Google.');
    } catch (err: any) {
      if (isErrorWithCode(err)) {
        if (err.code === statusCodes.SIGN_IN_CANCELLED) {
          return null;
        }
        if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          throw new Error(
            'Google Play Services is not available. Please join as a Guest below.'
          );
        }
        if (err.code === statusCodes.DEVELOPER_ERROR) {
          throw new Error(
            'Google Sign-In configuration error (OAuth SHA-1 mismatch). Please join as a Guest below.'
          );
        }
        if (err.code === statusCodes.ONE_TAP_START_FAILED) {
          // If One-Tap fails to present, fallback directly to explicit sign-in
          try {
            const fallbackResponse = await GoogleOneTapSignIn.presentExplicitSignIn();
            if (fallbackResponse.type === 'success') {
              return this.handleSignInSuccess(fallbackResponse.data);
            }
            if (fallbackResponse.type === 'cancelled') {
              return null;
            }
          } catch (explicitErr: any) {
            console.warn('[AuthService] Explicit sign-in fallback also failed:', explicitErr);
          }
        }
      }
      throw err;
    }
  }

  /**
   * Helper to persist credentials and construct the user object from Google payload.
   */
  private async handleSignInSuccess(data: any): Promise<AuthUser> {
    const user = data?.user;
    if (!user) {
      throw new Error('Failed to retrieve user profile information from Google.');
    }

    // Retrieve and persist OAuth tokens
    const tokens = await GoogleOneTapSignIn.getTokens();
    if (tokens.accessToken) {
      storage.set(AUTH_STORAGE_KEYS.GOOGLE_ACCESS_TOKEN, tokens.accessToken);
    }

    // Clear guest marker since user is fully authenticated
    storage.remove(AUTH_STORAGE_KEYS.IS_GUEST);

    const name =
      user.name ||
      (user.email ? user.email.split('@')[0] : 'Explorer');

    return {
      name,
      email: user.email || '',
      avatarUri: user.photo || null,
      isGuest: false,
      accessToken: tokens.accessToken,
    };
  }

  /**
   * Signs in the user as a local guest with their custom username.
   */
  public signInAsGuest(username: string): AuthUser {
    const trimmedName = username.trim();
    if (!trimmedName) {
      throw new Error('Username cannot be empty.');
    }

    // Set guest marker and remove any lingering Google access token
    storage.set(AUTH_STORAGE_KEYS.IS_GUEST, true);
    storage.remove(AUTH_STORAGE_KEYS.GOOGLE_ACCESS_TOKEN);

    return {
      name: trimmedName,
      email: '',
      avatarUri: null,
      isGuest: true,
    };
  }

  /**
   * Signs out the user, removes session tokens, and cleans the local database.
   * Note: Local data is cleared to ensure privacy between different users on the same device.
   */
  public async signOut(): Promise<void> {
    try {
      await GoogleOneTapSignIn.signOut();
    } catch (e) {
      console.warn('[AuthService] GoogleOneTapSignIn sign-out warning:', e);
    }

    // Remove authentication markers from persistent storage
    storage.remove(AUTH_STORAGE_KEYS.GOOGLE_ACCESS_TOKEN);
    storage.remove(AUTH_STORAGE_KEYS.IS_GUEST);

    // Wipe local database records to prevent data contamination across different user accounts
    await clearLocalDatabase();
  }

  /**
   * Queries local storage to inspect the current session status.
   */
  public getSession(): SessionStatus {
    const token = storage.getString(AUTH_STORAGE_KEYS.GOOGLE_ACCESS_TOKEN) ?? null;
    const isGuest = storage.getBoolean(AUTH_STORAGE_KEYS.IS_GUEST) ?? false;
    const isSignedIn = Boolean(token || isGuest);

    return {
      isSignedIn,
      isGuest,
      accessToken: token,
    };
  }
}

export const authService = new AuthService();
