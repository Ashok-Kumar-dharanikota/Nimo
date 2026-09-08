# Profile Feature Architecture Overview

The **Profile Feature** (`src/features/profile`) manages user identity, account settings, activity statistics (active streak, memory count, days active), and authentication hand-offs.

---

## Directory Structure

```
src/features/profile/
├── components/
│   └── ProfileScreenView.tsx    # Primary profile dashboard & account navigation screen
├── services/
│   └── profileService.ts        # Singleton service for profile retrieval and mutations
├── hooks/
│   └── useProfileStore.ts       # Zustand store with MMKV persistence for user profile
├── utils/
│   └── profileConstants.ts      # MMKV storage keys and default guest values
├── docs/
│   ├── OVERVIEW.md              # Feature architecture & file interconnection (this file)
│   ├── COMPONENTS.md            # UI components, visual states, and prop contracts
│   ├── SERVICES.md              # Service API signatures, return types & side-effects
│   ├── HOOKS.md                 # Hook state transitions, triggers & actions
│   ├── UTILS.md                 # Constants, configuration, and storage keys
│   └── FLOWS.md                 # Interaction sequence diagrams and step-by-step flows
└── index.ts                     # Public API barrel export for external consumers
```

---

## How Files Link Together

```mermaid
graph TD
    subgraph RouteLayer ["Route Layer"]
        AppProfile["src/app/(app)/profile.tsx"]
        AppGatekeeper["src/app/index.tsx"]
        SettingsScreen["SettingsScreenView.tsx"]
    end

    subgraph FeatureProfile ["src/features/profile"]
        Barrel["index.ts"]

        subgraph Components ["components/"]
            ProfileView["ProfileScreenView.tsx"]
            MenuItem["ProfileMenuItem"]
        end

        subgraph Hooks ["hooks/"]
            ProfileStore["useProfileStore.ts"]
        end

        subgraph Services ["services/"]
            ProfileSvc["profileService.ts"]
        end

        subgraph Utils ["utils/"]
            ProfileConst["profileConstants.ts"]
        end
    end

    subgraph ExternalDeps ["External State & Features"]
        HomeFeature["useHomeData (Streak & Garden)"]
        AuthFeature["authService.signOut()"]
        MMKVStorage["react-native-mmkv"]
        ExpoRouter["expo-router"]
    end

    AppProfile --> ProfileView
    AppGatekeeper --> ProfileStore
    SettingsScreen --> ProfileStore

    ProfileView --> MenuItem
    ProfileView --> ProfileStore
    ProfileView --> HomeFeature
    ProfileView --> AuthFeature
    ProfileView --> ExpoRouter

    ProfileSvc --> ProfileStore
    ProfileSvc --> ProfileConst
    ProfileStore --> MMKVStorage
```
