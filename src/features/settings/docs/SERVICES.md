# Settings Feature Services

Documentation for service layer within `src/features/settings/services`.

---

## `settingsService`

- **File**: [`src/features/settings/services/settingsService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/settings/services/settingsService.ts)
- **Role**: Non-UI methods for wiping local SQLite databases and resetting profile storage.

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `clearAllData()` | - | `Promise<void>` | Permanently drops local tables and resets Zustand state |
