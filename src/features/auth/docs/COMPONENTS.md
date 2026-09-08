# Auth Feature Components

Documentation for all visual presentation components within `src/features/auth/components`.

---

## 1. `AuthScreenView`

- **File**: [`src/features/auth/components/AuthScreenView.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/auth/components/AuthScreenView.tsx)
- **Role**: Top-level auth container component rendered by route `src/app/auth.tsx`.

### Visual Structure
- **Background**: Fullscreen `ImageBackground` rendering `@/assets/images/nimo/auth_screen_background.png` with a soft `rgba(251, 249, 244, 0.4)` tint overlay.
- **Keyboard Handling**: Entire view is enclosed in `KeyboardAvoidingView` with `TouchableWithoutFeedback onPress={Keyboard.dismiss}`, adjusting smoothly for the software keyboard on iOS and Android.
- **Branding**:
  - Main logo text: `@/assets/images/nimo/brand_name.png`.
  - Tagline: `@/assets/images/nimo/brand_footnote.png`.
  - Welcome subtitle in Plus Jakarta Sans typography.
- **Action Area**:
  - Dynamic error banner (visible when `errorMessage !== null`).
  - `<GoogleSignInButton />` for OAuth login.
  - Subtle divider row ("or join as guest").
  - `<GuestNameInput />` for immediate inline guest username entry.
  - Legal disclaimer footnote text.

### Hooks & State Linkage
Connects to `useAuth()`:
```ts
const {
  loading,
  errorMessage,
  signInWithGoogle,
  signInAsGuest,
} = useAuth();
```

---

## 2. `GoogleSignInButton`

- **File**: [`src/features/auth/components/GoogleSignInButton.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/auth/components/GoogleSignInButton.tsx)
- **Role**: Reusable primary action button for initiating the Google OAuth flow.

### Props Contract
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onPress` | `() => void` | **Required** | Callback invoked when user taps the button. |
| `loading` | `boolean` | `false` | When true, renders an `ActivityIndicator` and disables taps. |
| `disabled` | `boolean` | `false` | When true, reduces opacity to 0.65 and disables interactions. |
| `style` | `ViewStyle` | `undefined` | Optional container style override. |

---

## 3. `GuestNameInput`

- **File**: [`src/features/auth/components/GuestNameInput.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/auth/components/GuestNameInput.tsx)
- **Role**: Inline input component embedded directly into the auth screen beneath Google Sign-In, allowing the user to enter their name and confirm via an integrated circular button.

### Props Contract
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onSubmit` | `(name: string) => void` | **Required** | Invoked with the validated username string. |
| `disabled` | `boolean` | `false` | When true, disables the input and confirm button. |

### Visual Layout & Circular Confirmation Button
- **Input Container**: A clean white pill card with `#e5dec9` border and `#27170c` text.
- **Leading Icon**: Subtle `<User />` icon indicating identity entry.
- **Circular Confirmation Button**:
  - Positioned directly at the right end of the input field.
  - 38×38dp circle with rounded radius 19dp.
  - Dynamic state: When the input is empty, the button is muted (`#c4b8aa`). As soon as characters are typed, it lights up in rich `#566434` olive with an elevated drop shadow.
  - Houses an `<ArrowRight color="#fff" />` icon.
- **Keyboard Submission**:
  - Pressing the soft keyboard's "Go" / "Done" action (`onSubmitEditing`) triggers submission immediately.
  - Validation requires at least 2 characters and warns via `expo-haptics`.
