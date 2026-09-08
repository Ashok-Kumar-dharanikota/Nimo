# Profile Feature Components

Documentation for visual presentation components within `src/features/profile/components`.

---

## 1. `ProfileScreenView`

- **File**: [`src/features/profile/components/ProfileScreenView.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/profile/components/ProfileScreenView.tsx)
- **Role**: Main profile screen container rendered by route `src/app/(app)/profile.tsx`.
- **Layout & Structure**:
  - **Header**: Circular avatar with user initials, inline editable username text input with haptics, and linked Google email or guest status banner.
  - **Stats Summary Row**:
    - Memories Count (`BookOpen`, olive card)
    - Day Streak (`Flame`, amber card)
    - Days Active (`Calendar`, rose card)
  - **Navigation Menu Sections**:
    - **Account**: Edit Name, Email / Link Account, Sign Out modal trigger.
    - **More**: Settings, Privacy Policy, Terms of Service.
  - **App Version Footnote**: Dynamically loaded from `expo-constants`.

---

## 2. `ProfileMenuItem`

- **File**: [`src/features/profile/components/ProfileScreenView.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/profile/components/ProfileScreenView.tsx)
- **Role**: Reusable menu row component with leading icon, label, optional value preview, and chevron accessory.
- **Props**:
  | Prop | Type | Description |
  | :--- | :--- | :--- |
  | `icon` | `LucideIcon` | Lucide icon component to render in leading bubble |
  | `label` | `string` | Primary row label |
  | `value` | `string \| undefined` | Optional trailing value preview text |
  | `onPress` | `(() => void) \| undefined` | Tap callback with light haptic feedback |
