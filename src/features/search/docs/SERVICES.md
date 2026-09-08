# Search Feature Services

Documentation for service layer within `src/features/search/services`.

---

## `searchService`

- **File**: [`src/features/search/services/searchService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/search/services/searchService.ts)
- **Role**: Data access layer fetching moments joined with daily task statuses for fast search filtering.

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `fetchAllMoments()` | - | `Promise<SearchMomentItem[]>` | Retrieves all undeleted moments joined with task map |
