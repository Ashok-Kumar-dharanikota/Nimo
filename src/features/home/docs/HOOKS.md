# Home Feature Hooks

Documentation for hooks within `src/features/home/hooks`.

---

## 1. `useHomeData`

- **File**: [`src/features/home/hooks/useHomeData.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/hooks/useHomeData.ts)
- **Role**: Coordinates React Query fetching for moments, weekly streaks, and garden status.

### Signature

```ts
function useHomeData(selectedDate?: Date): {
  weeklyStreaks: MomentItem[];
  todaysFlow: MomentItem[];
  gardenSummary: { leavesCount: number; lastRecordDate: string | null };
  isLoading: boolean;
  addQuickMoment: (params: AddMomentParams) => Promise<void>;
  isAddingMoment: boolean;
  refetch: () => Promise<void>;
};
```

---

## 2. `useTaskData`

- **File**: [`src/features/home/hooks/useTaskData.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/hooks/useTaskData.ts)
- **Role**: Manages daily tasks state and completion mutations.

### Signature

```ts
function useTaskData(date?: Date): {
  todayTasks: DailyTaskItem[];
  isLoading: boolean;
  toggleTask: (id: number, currentCompleted: boolean) => Promise<void>;
};
```
