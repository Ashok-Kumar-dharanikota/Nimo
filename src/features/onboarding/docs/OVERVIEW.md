# Onboarding Feature Architecture Overview

The **Onboarding Feature** (`src/features/onboarding`) provides the welcoming walkthrough slides, brand introduction, notifications permission prompt, and initial identity entry points.

---

## Directory Structure

```
src/features/onboarding/
├── components/
│   ├── OnboardingScreenView.tsx # Main screen pager container with header & navigation footer
│   ├── WelcomeSlide.tsx         # Slide 0 hero presentation with mascot & typography
│   ├── FeatureSlide.tsx         # Slides 1-4 animated feature showcase slides
│   ├── SlideIndicators.tsx      # Animated spring pill dot indicators
│   └── OnboardingGetStarted.tsx # Slide 5 conversion slide with auth actions
├── services/
│   └── onboardingService.ts     # Persistence layer for onboarding completion state
├── hooks/
│   └── useOnboarding.ts         # Coordinates pager scroll, active indices & navigation actions
├── utils/
│   └── onboardingConstants.ts   # Dimensions, slide copy, media references & storage keys
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
        AppOnboarding["src/app/onboarding.tsx"]
        AppGatekeeper["src/app/index.tsx"]
    end

    subgraph FeatureOnboarding ["src/features/onboarding"]
        Barrel["index.ts"]

        subgraph Components ["components/"]
            OnboardingView["OnboardingScreenView.tsx"]
            Welcome["WelcomeSlide.tsx"]
            Feature["FeatureSlide.tsx"]
            Indicators["SlideIndicators.tsx"]
            GetStarted["OnboardingGetStarted.tsx"]
        end

        subgraph Hooks ["hooks/"]
            UseOnboarding["useOnboarding.ts"]
        end

        subgraph Services ["services/"]
            OnboardingSvc["onboardingService.ts"]
        end

        subgraph Utils ["utils/"]
            OnboardingConst["onboardingConstants.ts"]
        end
    end

    subgraph ExternalDeps ["Native & Storage"]
        MMKVStorage["react-native-mmkv (storage)"]
        Notifications["useNotificationScheduler"]
        ExpoRouter["expo-router"]
    end

    AppOnboarding --> OnboardingView
    AppGatekeeper --> OnboardingSvc

    OnboardingView --> Welcome
    OnboardingView --> Feature
    OnboardingView --> Indicators
    OnboardingView --> GetStarted
    OnboardingView --> UseOnboarding

    UseOnboarding --> OnboardingSvc
    UseOnboarding --> Notifications
    UseOnboarding --> ExpoRouter
    UseOnboarding --> OnboardingConst

    OnboardingSvc --> MMKVStorage
```
