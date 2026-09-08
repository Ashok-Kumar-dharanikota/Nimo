# Auth Feature Interaction Flows

Detailed interaction flows, invocation sequences, and state transitions for all authentication scenarios.

---

## 1. Google Sign-In Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant View as AuthScreenView
    participant Button as GoogleSignInButton
    participant Hook as useAuth
    participant Service as authService
    participant Nitro as GoogleOneTapSignIn (Native)
    participant Storage as MMKV (storage)
    participant Profile as useProfileStore
    participant Router as expo-router

    User->>Button: Taps "Continue with Google"
    Button->>Hook: signInWithGoogle()
    Hook->>Hook: setLoading(true)
    Hook->>Service: signInWithGoogle()
    Service->>Nitro: checkPlayServices() (Android)
    Service->>Nitro: signIn() (One-Tap prompt)
    
    alt One-Tap Succeeded
        Nitro-->>Service: { type: 'success', data: { user } }
    else No Credential Found
        Nitro-->>Service: { type: 'noSavedCredentialFound' }
        Service->>Nitro: presentExplicitSignIn()
        Nitro-->>Service: { type: 'success', data: { user } }
    end

    Service->>Nitro: getTokens()
    Nitro-->>Service: { accessToken }
    Service->>Storage: set('google_access_token', token)
    Service->>Storage: remove('is_guest')
    Service-->>Hook: AuthUser { name, email, avatarUri, isGuest: false }
    
    Hook->>Profile: updateProfile({ name, email, avatarUri, isGuest: false })
    Hook->>Router: replace('/(app)')
    Hook->>Hook: setLoading(false)
```

### Steps:
1. User taps `<GoogleSignInButton />`.
2. `useAuth` sets `loading = true`.
3. `authService` verifies Google Play Services on Android.
4. `authService` presents the Google One-Tap bottom sheet.
5. If no credential exists on the device, it seamlessly falls back to `presentExplicitSignIn()`.
6. Upon successful selection, OAuth tokens are retrieved from `GoogleOneTapSignIn.getTokens()`.
7. `google_access_token` is saved in MMKV and `is_guest` is removed.
8. `useProfileStore` is updated with Google name, email, and photo URI.
9. Success haptic feedback is triggered and the router transitions to `/(app)`.

---

## 2. Inline Guest User Flow with Circular Confirm Button

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant View as AuthScreenView
    participant Input as GuestNameInput
    participant Hook as useAuth
    participant Service as authService
    participant Storage as MMKV (storage)
    participant Profile as useProfileStore
    participant Router as expo-router

    User->>Input: Enters name directly in UI (e.g. "Alex")
    Input->>Input: Circular confirmation button lights up
    User->>Input: Taps circular button (or presses Enter/Done on keyboard)
    Input->>Input: Validates input (length >= 2)
    Input->>Hook: signInAsGuest("Alex")
    
    Hook->>Hook: setLoading(true)
    Hook->>Service: signInAsGuest("Alex")
    Service->>Storage: set('is_guest', true)
    Service->>Storage: remove('google_access_token')
    Service-->>Hook: AuthUser { name: "Alex", isGuest: true }
    
    Hook->>Profile: updateProfile({ name: "Alex", isGuest: true })
    Hook->>Hook: setLoading(false)
    Hook->>Router: replace('/(app)')
```

### Steps:
1. User sees the guest username input field located directly below Google Sign-In.
2. User types their name into `GuestNameInput`.
3. As soon as characters are entered, the integrated circular confirm button lights up with active `#566434` styling.
4. User taps the circular button or presses the soft keyboard's "Go" action.
5. Name is validated (non-empty, minimum 2 characters).
6. `authService.signInAsGuest()` flags `is_guest = true` and clears any old Google access tokens in MMKV.
7. The profile store receives the guest user's chosen name.
8. Router transitions to `/(app)`.

---

## 3. App Launch Gatekeeper Flow (`src/app/index.tsx`)

```mermaid
sequenceDiagram
    autonumber
    participant App as src/app/index.tsx
    participant Service as authService
    participant Storage as MMKV (storage)
    participant Profile as useProfileStore
    participant Router as expo-router

    App->>Service: getSession()
    Service->>Storage: getString('google_access_token')
    Service->>Storage: getBoolean('is_guest')
    Service-->>App: { isSignedIn, isGuest, accessToken }

    alt isSignedIn === true
        App->>Router: <Redirect href="/(app)" />
    else No Active Session
        App->>Router: <Redirect href="/auth" />
    end
```

---

## 4. User Sign-Out Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant ProfileUI as ProfileScreen.tsx
    participant Hook as useAuth
    participant Service as authService
    participant Nitro as GoogleOneTapSignIn (Native)
    participant Storage as MMKV (storage)
    participant DB as clearLocalDatabase() (SQLite)
    participant Profile as useProfileStore
    participant Router as expo-router

    User->>ProfileUI: Taps "Sign Out" & confirms modal
    ProfileUI->>Hook: signOut()
    Hook->>Service: signOut()
    
    Service->>Nitro: signOut() (Invalidates Google session)
    Service->>Storage: remove('google_access_token')
    Service->>Storage: remove('is_guest')
    Service->>DB: delete from moment, journal
    
    Service-->>Hook: Completed
    Hook->>Profile: updateProfile({ name: 'Guest', isGuest: true, email: '', avatarUri: null })
    Hook->>Router: replace('/auth')
```
