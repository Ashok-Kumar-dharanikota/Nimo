# Home Feature Services

Documentation for SQLite database access services within `src/features/home/services`.

---

## 1. `homeService`

- **File**: [`src/features/home/services/homeService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/services/homeService.ts)
- **Role**: Data access layer for timeline moments and garden summaries.

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `getTodaysFlow(targetDate)` | `Date` | `Promise<MomentItem[]>` | Fetches all moments created on `targetDate` |
| `getWeeklyStreaks()` | - | `Promise<MomentItem[]>` | Fetches moments created in the last 7 days |
| `getGardenSummary()` | - | `Promise<{ leavesCount: number, lastRecordDate: string \| null }>` | Executes sub-millisecond SQLite count for garden banner |
| `addMoment(entry)` | `NewMoment` | `Promise<MomentItem>` | Inserts a new moment and links journal if applicable |

---

## 2. `taskService`

- **File**: [`src/features/home/services/taskService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/services/taskService.ts)
- **Role**: Data access layer for daily mindful tasks.

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `getDailyTasks(date)` | `Date` | `Promise<DailyTaskItem[]>` | Retrieves daily tasks for the specified day |
| `toggleTaskCompletion(id, isCompleted)` | `number, boolean` | `Promise<void>` | Toggles completion state of a task |
