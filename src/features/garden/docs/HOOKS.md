# Garden Feature Hooks

Documentation for hooks within `src/features/garden/hooks`.

---

## `useGarden`

- **File**: [`src/features/garden/hooks/useGarden.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/garden/hooks/useGarden.ts)
- **Role**: Coordinates theme selection modals and memory tree state.

### Signature

```ts
function useGarden(): {
  memoryTree: DayData[];
  isLoading: boolean;
  themeModalVisible: boolean;
  setThemeModalVisible: (visible: boolean) => void;
  selectedTheme: GardenThemeId;
  currentTheme: GardenTheme;
  handleThemeSelect: (themeId: GardenThemeId) => void;
  themes: GardenTheme[];
};
```
