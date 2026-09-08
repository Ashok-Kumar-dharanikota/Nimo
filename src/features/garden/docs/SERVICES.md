# Garden Feature Services

Documentation for service layer within `src/features/garden/services`.

---

## `gardenService`

- **File**: [`src/features/garden/services/gardenService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/garden/services/gardenService.ts)
- **Role**: Coordinates theme retrieval and persistence in MMKV.

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `getTheme()` | - | `GardenTheme` | Retrieves the active theme configuration |
| `setTheme(id)` | `GardenThemeId` | `void` | Writes selected theme ID to MMKV |
| `listThemes()` | - | `GardenTheme[]` | Returns all available themes |
| `getGardenDays()` | - | `Promise<DayData[]>` | Fetches daily moment counts for the current year |
