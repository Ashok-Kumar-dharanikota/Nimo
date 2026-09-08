# Home Feature Utilities

Documentation for helper utilities within `src/features/home/utils`.

---

## 1. `dateUtils.ts`

- **File**: [`src/features/home/utils/dateUtils.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/utils/dateUtils.ts)
- **Functions**:
  - `formatDate(date)`: Formats dates for timeline headers.
  - `formatTime(dateStr)`: Extracts clean HH:mm formatting from SQLite ISO strings.
  - `parseSQLiteDate(dateStr)`: Safely parses SQLite date/timestamp strings across iOS and Android engines.
  - `calculateStreak(moments)`: Computes current active daily streak.
  - `getStreakDays(moments)`: Returns an array of day flags for weekly streak visualization.

---

## 2. `sentiment.ts`

- **File**: [`src/features/home/utils/sentiment.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/utils/sentiment.ts)
- **Functions**:
  - `analyzeSentiment(text)`: Performs client-side keyword sentiment analysis to suggest an initial emotion.
