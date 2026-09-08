# Onboarding Feature Services

Documentation for service layer within `src/features/onboarding/services`.

---

## `onboardingService`

- **File**: [`src/features/onboarding/services/onboardingService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/onboarding/services/onboardingService.ts)
- **Role**: Non-React helper methods managing persistent onboarding completion state in MMKV.

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `hasSeenOnboarding()` | - | `boolean` | Checks if user has already passed onboarding |
| `completeOnboarding()` | - | `void` | Writes `hasSeenOnboarding = true` in storage |
| `resetOnboarding()` | - | `void` | Removes completion flag for testing |
