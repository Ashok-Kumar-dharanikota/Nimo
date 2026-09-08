# Garden Feature Utilities

Documentation for constants and configuration within `src/features/garden/utils`.

---

## `gardenThemes.ts`

- **File**: [`src/features/garden/utils/gardenThemes.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/garden/utils/gardenThemes.ts)

### Exported Types & Constants

| Name | Type | Description |
| :--- | :--- | :--- |
| `GARDEN_THEMES` | `GardenTheme[]` | The 5 curated visual themes (Sprout, Earth, Spring, Sunset, Meadow) |
| `getGrowthStage(count)` | `function` | Maps daily moment counts to stages (`empty`, `seed`, `sprout`, `sapling`, `bloom`, `tree`) |
| `getPlantVisual(emotion)` | `function` | Maps emotions to specific plant petal colors, stem colors, and flower types |
| `getSavedTheme()` | `function` | Returns active theme from MMKV |
| `saveTheme(id)` | `function` | Persists theme choice to MMKV |
