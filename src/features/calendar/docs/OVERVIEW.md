# Calendar Feature Architecture Overview

The **Calendar Feature** (`src/features/calendar`) manages date-based navigation and monthly reflection calendars.

---

## Directory Structure

```
src/features/calendar/
├── components/
│   └── CalendarScreenView.tsx   # Top-level calendar screen view
├── services/
│   └── calendarService.ts       # Service methods for date-filtered moments
├── hooks/
│   └── useCalendar.ts           # State coordination for selected calendar date
├── utils/
│   └── calendarConstants.ts     # Day labels and storage keys
├── docs/
│   ├── OVERVIEW.md              # Feature architecture & file interconnection (this file)
│   ├── COMPONENTS.md            # UI components, visual states, and prop contracts
│   ├── SERVICES.md              # Service API signatures, return types & side-effects
│   ├── HOOKS.md                 # Hook state transitions, triggers & actions
│   ├── UTILS.md                 # Constants, configuration, and storage keys
│   └── FLOWS.md                 # Interaction sequence diagrams and step-by-step flows
└── index.ts                     # Public API barrel export for external consumers
```
