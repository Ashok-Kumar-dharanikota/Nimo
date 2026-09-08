# Onboarding Feature Hooks

Documentation for hooks within `src/features/onboarding/hooks`.

---

## `useOnboarding`

- **File**: [`src/features/onboarding/hooks/useOnboarding.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/onboarding/hooks/useOnboarding.ts)
- **Role**: Coordinates paging gestures, button animations, permission prompts, and navigation routing.

### Signature

```ts
function useOnboarding(): {
  scrollRef: React.RefObject<ScrollView>;
  currentIndex: number;
  scrollX: SharedValue<number>;
  isLastSlide: boolean;
  isFirstSlide: boolean;
  nextBtnStyle: any;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  goToSlide: (index: number) => void;
  handleNext: () => Promise<void>;
  handleSkip: () => void;
  completeOnboarding: () => void;
  handleContinueWithEmail: () => void;
  handleLogin: () => void;
};
```
