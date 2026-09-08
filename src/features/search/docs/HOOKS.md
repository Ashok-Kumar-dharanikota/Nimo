# Search Feature Hooks

Documentation for hooks within `src/features/search/hooks`.

---

## `useSearchMoments`

- **File**: [`src/features/search/hooks/useSearchMoments.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/search/hooks/useSearchMoments.ts)
- **Role**: Coordinates React Query fetching and in-memory multi-attribute filtering (text, title, journal title, emotion).

### Signature

```ts
function useSearchMoments(): {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  moments: SearchMomentItem[];
  filteredMoments: SearchMomentItem[];
  isLoading: boolean;
  refetch: () => Promise<any>;
};
```
