# Timeline Feature Hooks

Documentation for hooks within `src/features/timeline/hooks`.

---

## `useTimelineData`

- **File**: [`src/features/timeline/hooks/useTimelineData.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/timeline/hooks/useTimelineData.ts)

### Signature

```ts
function useTimelineData(passedDate?: string): {
  targetDate: Date;
  todaysFlow: MomentItem[];
  isLoading: boolean;
  theme: GardenTheme;
  displayDate: string;
};
```
