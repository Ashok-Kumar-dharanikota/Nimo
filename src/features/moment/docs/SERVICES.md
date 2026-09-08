# Moment Feature Services

Documentation for service layer within `src/features/moment/services`.

---

## `momentService`

- **File**: [`src/features/moment/services/momentService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/moment/services/momentService.ts)

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `getMomentById(id)` | `number` | `Promise<MomentDetailData \| null>` | Queries single moment joined with its journal |
| `getTaskStatusForDate(createdAt)` | `string` | `Promise<boolean \| null>` | Looks up whether daily task was finished on the moment's date |
