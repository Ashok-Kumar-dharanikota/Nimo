# Journal Feature Architecture Overview

The **Journal Feature** (`src/features/journal`) manages journal notebooks, themed collections, and multi-entry archives.

---

## Directory Structure

```
src/features/journal/
├── components/
│   └── JournalScreenView.tsx    # Primary journals collection route container
├── services/
│   └── journalService.ts        # Service for querying user journals
├── hooks/
│   └── useJournal.ts            # React Query hook for loading journals
├── utils/
│   └── journalConstants.ts      # Active journal keys and default configurations
├── docs/
│   ├── OVERVIEW.md              # Feature architecture & file interconnection (this file)
│   ├── COMPONENTS.md            # UI components, visual states, and prop contracts
│   ├── SERVICES.md              # Service API signatures, return types & side-effects
│   ├── HOOKS.md                 # Hook state transitions, triggers & actions
│   ├── UTILS.md                 # Constants, configuration, and storage keys
│   └── FLOWS.md                 # Interaction sequence diagrams and step-by-step flows
└── index.ts                     # Public API barrel export for external consumers
```
