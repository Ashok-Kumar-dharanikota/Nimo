# Home Feature Components

Documentation for visual presentation components within `src/features/home/components`.

---

## 1. `HomeScreenView`

- **File**: [`src/features/home/components/HomeScreenView.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/components/HomeScreenView.tsx)
- **Role**: Top-level dashboard screen container rendered by route `src/app/(app)/index.tsx`.
- **Key Responsibilities**:
  - Composes `TopAppBar`, `WeeklyStreaks`, Memory Garden banner, and `StorybookTimeline`.
  - Coordinates pull-to-refresh and screen focus re-fetching.
  - Renders floating animated toast notifications.

---

## 2. `TopAppBar`

- **File**: [`src/features/home/components/TopAppBar.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/components/TopAppBar.tsx)
- **Role**: Top navigation bar displaying user greeting, active streak counter badge, and profile avatar.
- **Props**:
  | Prop | Type | Description |
  | :--- | :--- | :--- |
  | `moments` | `MomentItem[]` | Moments used to calculate streak count |

---

## 3. `WeeklyStreaks`

- **File**: [`src/features/home/components/WeeklyStreaks.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/components/WeeklyStreaks.tsx)
- **Role**: Horizontal 7-day pill row showing daily journaling activity with check indicators.
- **Props**:
  | Prop | Type | Description |
  | :--- | :--- | :--- |
  | `moments` | `MomentItem[]` | Moments matching the past 7 days |

---

## 4. `StorybookTimeline`

- **File**: [`src/features/home/components/StorybookTimeline.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/components/StorybookTimeline.tsx)
- **Role**: Chronological feed displaying entries for the selected day, daily reflection prompt, and empty states.

---

## 5. `InlineDraftCard`

- **File**: [`src/features/home/components/InlineDraftCard.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/components/InlineDraftCard.tsx)
- **Role**: Inline creation card allowing user to write reflections, pick emotions, attach media, or record voice memos.

---

## 6. `DailyTaskCard`

- **File**: [`src/features/home/components/DailyTaskCard.tsx`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/home/components/DailyTaskCard.tsx)
- **Role**: Mindful daily micro-task card with interactive toggle checkbox and completion haptics.
